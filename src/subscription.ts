import { SignJWT, importPKCS8 } from 'jose';
import type { Env, AuthenticatedUser } from './types';
import { HttpError } from './errors';

export type Plan = 'FREE'|'PLUS'|'PRO'|'MAX';
export type EntitlementStatus = 'ACTIVE'|'PENDING'|'GRACE_PERIOD'|'ON_HOLD'|'PAUSED'|'CANCELED'|'EXPIRED'|'REVOKED';

export type Entitlement = {
  userSubject: string; plan: Plan; status: EntitlementStatus;
  productId?: string; basePlanId?: string; purchaseTokenHash?: string;
  expiryTime?: string; autoRenew?: boolean; orderId?: string; lastVerifiedAt: string;
};

const PRODUCT_PLAN: Record<string, Plan> = {
  spenva_plus: 'PLUS', spenva_pro: 'PRO', spenva_max: 'MAX',
};

async function accessToken(env: Env): Promise<string> {
  if (!env.GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY) {
    throw new HttpError(503,'Google Play verification is not configured.','PLAY_NOT_CONFIGURED');
  }
  const key = await importPKCS8(env.GOOGLE_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g,'\n'),'RS256');
  const now = Math.floor(Date.now()/1000);
  const assertion = await new SignJWT({scope:'https://www.googleapis.com/auth/androidpublisher'})
    .setProtectedHeader({alg:'RS256',typ:'JWT'}).setIssuer(env.GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL)
    .setSubject(env.GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL).setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt(now).setExpirationTime(now+3600).sign(key);
  const body = new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion});
  const response = await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
  if(!response.ok) throw new HttpError(502,'Unable to authorize Google Play verification.','PLAY_AUTH_FAILED');
  const json = await response.json() as {access_token?:string};
  if(!json.access_token) throw new HttpError(502,'Google Play access token missing.','PLAY_AUTH_FAILED');
  return json.access_token;
}

async function playState(env: Env, purchaseToken: string): Promise<any> {
  const token = await accessToken(env);
  const pkg = encodeURIComponent(env.ANDROID_PACKAGE_NAME || '');
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${pkg}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;
  const response = await fetch(url,{headers:{Authorization:`Bearer ${token}`}});
  if(!response.ok) throw new HttpError(response.status===404?404:502,'Google Play could not verify this subscription.','PLAY_VERIFY_FAILED');
  return response.json();
}

function statusOf(state?:string): EntitlementStatus {
  switch(state){
    case 'SUBSCRIPTION_STATE_ACTIVE': return 'ACTIVE';
    case 'SUBSCRIPTION_STATE_PENDING': return 'PENDING';
    case 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD': return 'GRACE_PERIOD';
    case 'SUBSCRIPTION_STATE_ON_HOLD': return 'ON_HOLD';
    case 'SUBSCRIPTION_STATE_PAUSED': return 'PAUSED';
    case 'SUBSCRIPTION_STATE_CANCELED': return 'CANCELED';
    case 'SUBSCRIPTION_STATE_EXPIRED': return 'EXPIRED';
    default: return 'REVOKED';
  }
}
function grantsAccess(status:EntitlementStatus){return status==='ACTIVE'||status==='GRACE_PERIOD'||status==='CANCELED';}
async function hash(value:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}

export async function verifyAndStore(env:Env,user:AuthenticatedUser,purchaseToken:string):Promise<Entitlement>{
  const p=await playState(env,purchaseToken);
  const item=Array.isArray(p.lineItems)?p.lineItems[0]:undefined;
  const productId=typeof item?.productId==='string'?item.productId:undefined;
  const plan=productId?PRODUCT_PLAN[productId]:undefined;
  if(!plan) throw new HttpError(400,'Unknown Spenva subscription product.','UNKNOWN_PRODUCT');
  const external=p.externalAccountIdentifiers?.obfuscatedExternalAccountId;
  if(external && external!==user.subject) throw new HttpError(403,'Purchase belongs to another account.','PURCHASE_ACCOUNT_MISMATCH');
  const status=statusOf(p.subscriptionState);
  const entitlement:Entitlement={userSubject:user.subject,plan:grantsAccess(status)?plan:'FREE',status,productId,
    basePlanId:item?.offerDetails?.basePlanId,purchaseTokenHash:await hash(purchaseToken),expiryTime:item?.expiryTime,
    autoRenew:item?.autoRenewingPlan?.autoRenewEnabled===true,orderId:p.latestOrderId,lastVerifiedAt:new Date().toISOString()};
  await env.ENTITLEMENT_KV.put(`user:${user.subject}`,JSON.stringify(entitlement));
  await env.ENTITLEMENT_KV.put(`purchase:${entitlement.purchaseTokenHash}`,JSON.stringify({userSubject:user.subject,purchaseToken}));
  return entitlement;
}

export async function currentEntitlement(env:Env,user:AuthenticatedUser):Promise<Entitlement>{
  const raw=await env.ENTITLEMENT_KV.get(`user:${user.subject}`);
  if(!raw) return {userSubject:user.subject,plan:'FREE',status:'EXPIRED',lastVerifiedAt:new Date().toISOString()};
  return JSON.parse(raw) as Entitlement;
}

export async function refreshByPurchaseToken(env:Env,purchaseToken:string):Promise<void>{
  const key=await hash(purchaseToken); const raw=await env.ENTITLEMENT_KV.get(`purchase:${key}`); if(!raw)return;
  const linked=JSON.parse(raw) as {userSubject:string}; await verifyAndStore(env,{subject:linked.userSubject},purchaseToken);
}
