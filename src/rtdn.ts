import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Env } from './types';
import { HttpError } from './errors';
import { refreshByPurchaseToken } from './subscription';

const googleKeys=createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export async function handleRtdn(request:Request,env:Env):Promise<Response>{
  const auth=request.headers.get('Authorization');
  if(!auth?.startsWith('Bearer ')||!env.RTDN_AUDIENCE) throw new HttpError(401,'RTDN authentication required.','RTDN_AUTH_REQUIRED');
  await jwtVerify(auth.slice(7),googleKeys,{issuer:['https://accounts.google.com','accounts.google.com'],audience:env.RTDN_AUDIENCE});
  const envelope=await request.json() as {message?:{messageId?:string;data?:string}};
  const messageId=envelope.message?.messageId; if(!messageId) throw new HttpError(400,'Missing Pub/Sub messageId.','RTDN_INVALID');
  const idem=`rtdn:${messageId}`; if(await env.IDEMPOTENCY_KV.get(idem)) return new Response(null,{status:204});
  const encoded=envelope.message?.data; if(!encoded) throw new HttpError(400,'Missing RTDN data.','RTDN_INVALID');
  const payload=JSON.parse(atob(encoded)) as {subscriptionNotification?:{purchaseToken?:string}};
  const purchaseToken=payload.subscriptionNotification?.purchaseToken;
  if(purchaseToken) await refreshByPurchaseToken(env,purchaseToken);
  await env.IDEMPOTENCY_KV.put(idem,'1',{expirationTtl:60*60*24*90});
  return new Response(null,{status:204});
}
