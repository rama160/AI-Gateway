# Spenva Google Play Subscription Backend

Production-readiness backend contract. No Play credential belongs in the APK.

## Routes
- POST /v1/subscription/verify — authenticated Google user; body: {"purchaseToken":"..."}
- GET /v1/subscription/status — authenticated Google user
- POST /v1/google-play/rtdn — authenticated Google Pub/Sub push endpoint

Google Play Developer API `purchases.subscriptionsv2.get` is the authoritative state. RTDN is only a trigger to re-query Google Play.

## Required Worker secrets
- GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL
- GOOGLE_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY

## Required vars
- ANDROID_PACKAGE_NAME
- RTDN_AUDIENCE

## Required KV
- ENTITLEMENT_KV
- IDEMPOTENCY_KV

## Product mapping
- spenva_plus -> PLUS
- spenva_pro -> PRO
- spenva_max -> MAX

## Access semantics
ACTIVE, IN_GRACE_PERIOD and CANCELED-before-expiry keep paid entitlement. ON_HOLD, PAUSED, EXPIRED and revoked/unknown do not.

## Console work still required
Enable Google Play Developer API, grant the service account appropriate Play Console API access, configure RTDN topic + authenticated push subscription to /v1/google-play/rtdn, create products/base plans, and set Worker secrets/KV bindings.
