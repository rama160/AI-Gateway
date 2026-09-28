# Architecture

## Request flow

1. Android obtains a Google ID token.
2. Android sends `Authorization: Bearer <ID_TOKEN>` to `/v1/ai/chat`.
3. Gateway verifies issuer, audience, signature, and subject using Google's public keys.
4. Gateway applies per-user rate limit and free-tier daily quota.
5. Gateway validates the request.
6. Model Router chooses the first healthy configured model.
7. Transient errors are retried with bounded backoff.
8. Repeated model failures place that model into a temporary cooldown.
9. The router tries the next configured model.
10. Successful responses are returned to Android.

## Security boundaries

Gemini API credentials exist only on the gateway. Android never receives the Gemini key.

The gateway treats Google token identity as authoritative; it does not trust a user ID supplied in the JSON body.

## Current storage

Cloudflare KV is used for lightweight rate, quota, and model-health state. This is intentionally not the long-term subscription database.

## Future storage

When subscription/payment is enabled, add a durable user/subscription store and server-side entitlement verification. Do not enable paid entitlements from an Android-only flag.
