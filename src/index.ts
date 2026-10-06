import type { Env } from './types';
import { authenticate } from './auth';
import { errorResponse, HttpError } from './errors';
import { models, numberEnv } from './config';
import { enforceRateLimit } from './rate_limit';
import { enforceFreeQuota, recordUsage } from './quota';
import { monitoringSnapshot } from './monitoring';
import { parseChatRequest } from './validation';
import { routeChat } from './router';
import { currentEntitlement, verifyAndStore } from './subscription';
import { handleRtdn } from './rtdn';

function requestId(): string { return crypto.randomUUID(); }
function json(data: unknown, status = 200, headers: Record<string,string> = {}): Response {
  return Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
}

async function handle(request:Request,env:Env):Promise<Response>{
  const id=requestId(); const url=new URL(request.url);
  if(request.method==='OPTIONS') return new Response(null,{status:204});
  if(url.pathname==='/health'&&request.method==='GET') return json({ok:true,service:'spenva-gateway',version:'0.2.0',timestamp:new Date().toISOString()});
  if(url.pathname==='/v1/google-play/rtdn'&&request.method==='POST') return handleRtdn(request,env);
  if(url.pathname==='/v1/monitoring'&&request.method==='GET'){
    const token=request.headers.get('X-Admin-Token');
    if(!env.ADMIN_TOKEN||token!==env.ADMIN_TOKEN) throw new HttpError(401,'Admin authentication required.','ADMIN_REQUIRED');
    return json({ok:true,models:await monitoringSnapshot(env,models(env)),timestamp:new Date().toISOString()});
  }
  if(url.pathname==='/v1/subscription/status'&&request.method==='GET'){
    const user=await authenticate(request,env); return json(await currentEntitlement(env,user));
  }
  if(url.pathname==='/v1/subscription/verify'&&request.method==='POST'){
    const user=await authenticate(request,env); const body=await request.json() as {purchaseToken?:string};
    if(!body.purchaseToken) throw new HttpError(400,'purchaseToken is required.','PURCHASE_TOKEN_REQUIRED');
    return json(await verifyAndStore(env,user,body.purchaseToken));
  }
  if(url.pathname==='/v1/ai/chat'&&request.method==='POST'){
    const user=await authenticate(request,env); await enforceRateLimit(env,user.subject); await enforceFreeQuota(env,user.subject);
    const body=await parseChatRequest(request,numberEnv(env.MAX_REQUEST_BYTES,20000)); const result=await routeChat(env,body);
    await recordUsage(env,user.subject); return json({requestId:id,model:result.model,text:result.text,latencyMs:result.latencyMs});
  }
  throw new HttpError(404,'Route not found.','NOT_FOUND');
}
export default { async fetch(request:Request,env:Env):Promise<Response>{try{return await handle(request,env)}catch(error){return errorResponse(error,crypto.randomUUID())}} };
