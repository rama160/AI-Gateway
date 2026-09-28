# AI START HERE — FinChat AI Gateway

## Project role

This repository is the backend AI Gateway for the FinChat Android application. It is intentionally separate from the Android repository.

## Non-negotiable rules

1. Never put `GEMINI_API_KEY` in the Android app or commit it to Git.
2. Never trust a user ID sent by the Android client; identify users from a verified Google ID token.
3. Keep model selection and provider credentials on the gateway.
4. Do not enable paid subscription entitlements until server-side subscription/payment verification exists.
5. Do not delete production data to fix a bug.
6. Do not weaken tests to make CI pass.
7. Do not claim deployment or production verification until it has actually been performed.
8. Keep Android and gateway repositories separate.

## Current architecture

`FinChat Android -> HTTPS -> Gateway -> Model Router -> Gemini`

## Current stages

- Health endpoint: implemented.
- AI chat: implemented.
- Google authentication: implemented.
- Rate limit/quota: implemented with KV.
- Model fallback/retry/cooldown: implemented.
- Monitoring endpoint: implemented.
- Android integration: not yet connected.
- Production deployment: not yet verified.

## Current commands

- `npm install`
- `npm run check`
- `npm run dev`
- `npm run deploy`
- `npm run tail`

## Before production

Create Cloudflare KV namespaces, configure Google OAuth, set production secrets, verify Gemini quota/model availability, run GitHub CI, deploy, test `/health`, then perform authenticated end-to-end testing from the Android app.

## Change protocol

For every meaningful change update:

- `Ai start here.md`
- `README.md`
- `docs/PHASES.md`
- `docs/ROADMAP_AUDIT.md`
- `docs/IMPLEMENTATION_STATUS.md`
- `CHANGELOG.md`
- relevant tests and contracts

When changing a file, provide the full affected file in delivery rather than a partial diff.


### GitHub Sync
Gunakan `GITHUB.bat` untuk upload awal maupun update berikutnya. File ini sengaja disatukan agar pengguna tidak perlu memilih script upload/update secara manual.
