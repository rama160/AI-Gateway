import type { Env } from './types';
import { authenticate } from './auth';
import { errorResponse, HttpError } from './errors';
import { models, numberEnv } from './config';
import { enforceRateLimit } from './rate_limit';
import { enforceFreeQuota, recordUsage } from './quota';
import { monitoringSnapshot } from './monitoring';
import { parseChatRequest } from './validation';
import { routeChat } from './router';

function requestId(): string { return crypto.randomUUID(); }

function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

async function handle(request: Request, env: Env): Promise<Response> {
  const id = requestId();
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });

  if (url.pathname === '/health' && request.method === 'GET') {
    return json({ ok: true, service: 'finchat-ai-gateway', version: '0.1.0', timestamp: new Date().toISOString() });
  }

  if (url.pathname === '/v1/monitoring' && request.method === 'GET') {
    const token = request.headers.get('X-Admin-Token');
    if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) throw new HttpError(401, 'Admin authentication required.', 'ADMIN_REQUIRED');
    return json({ ok: true, models: await monitoringSnapshot(env, models(env)), timestamp: new Date().toISOString() });
  }

  // Access is keyed to a verified Google subject, never a client build flag.
  // Admin changes require the existing ADMIN_TOKEN; no tester email is trusted.
  if (url.pathname === '/v1/testing-access' && request.method === 'POST') {
    if (!env.ADMIN_TOKEN || request.headers.get('X-Admin-Token') !== env.ADMIN_TOKEN) {
      throw new HttpError(401, 'Admin authentication required.', 'ADMIN_REQUIRED');
    }
    const body = await request.json() as { subject?: unknown; enabled?: unknown };
    if (typeof body.subject !== 'string' || !/^[0-9]{5,32}$/.test(body.subject) ||
        typeof body.enabled !== 'boolean') {
      throw new HttpError(400, 'Valid Google subject and enabled flag required.', 'INVALID_INPUT');
    }
    const key = `spenva:testing:${body.subject}`;
    if (body.enabled) await env.USAGE_KV.put(key, '1');
    else await env.USAGE_KV.delete(key);
    return json({ ok: true, enabled: body.enabled });
  }

  if (url.pathname.startsWith('/v1/quota/') && request.method === 'POST') {
    const user = await authenticate(request, env);
    const action = url.pathname.slice('/v1/quota/'.length);
    const enabled = await env.USAGE_KV.get(`spenva:testing:${user.subject}`) === '1';
    if (action === 'state') {
      return json({ tier: 'free', entitlement: null,
        testingAccess: { enabled, localInput: enabled } });
    }
    if (action !== 'reserve' && action !== 'settle') {
      throw new HttpError(404, 'Route not found.', 'NOT_FOUND');
    }
    const body = await request.json() as { resource?: unknown; operationId?: unknown };
    if (typeof body.operationId !== 'string' ||
        !/^[a-zA-Z0-9_-]{8,120}$/.test(body.operationId)) {
      throw new HttpError(400, 'Valid operationId required.', 'INVALID_INPUT');
    }
    // Non-test quotas and purchases are intentionally NOT emulated.
    // A real ledger is required before general production access.
    if (action === 'reserve') {
      throw new HttpError(503, 'Production quota service is not configured.', 'QUOTA_NOT_CONFIGURED');
    }
    return json({ ok: true });
  }

  if (url.pathname === '/v1/ai/chat' && request.method === 'POST') {
    const user = await authenticate(request, env);
    await enforceRateLimit(env, user.subject);
    await enforceFreeQuota(env, user.subject);
    const body = await parseChatRequest(request, numberEnv(env.MAX_REQUEST_BYTES, 20000));
    const result = await routeChat(env, body);
    await recordUsage(env, user.subject);
    return json({ requestId: id, model: result.model, text: result.text, latencyMs: result.latencyMs });
  }

  throw new HttpError(404, 'Route not found.', 'NOT_FOUND');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await handle(request, env);
    } catch (error) {
      return errorResponse(error, crypto.randomUUID());
    }
  },
};
