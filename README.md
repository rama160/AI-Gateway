# FinChat AI Gateway

Backend gateway for FinChat AI. The gateway keeps Gemini credentials off the Android APK and provides Google ID-token authentication, per-user rate limiting, free-tier quota, model fallback, retries, model health tracking, and monitoring.

## Architecture

`FinChat Android -> HTTPS -> FinChat AI Gateway -> Gemini`

The Android application should never contain `GEMINI_API_KEY`.

## Current implementation

- `GET /health`
- `POST /v1/ai/chat`
- `GET /v1/monitoring` protected by `X-Admin-Token`
- Google ID-token verification using the Web/Server Client ID
- Per-user minute rate limit using Cloudflare KV
- Free daily request quota using Cloudflare KV
- Primary + two fallback models
- Retry/backoff for transient model errors
- Model cooldown after repeated failures
- Basic model health metrics
- Request validation and response-size protection
- GitHub Actions CI
- Windows BAT scripts for upload/update

## Local setup

1. Install Node.js 22+.
2. Run `npm install`.
3. Copy `.dev.vars.example` to `.dev.vars` and fill secrets.
4. Run `npm run check`.
5. Run `npm run dev`.

For Cloudflare deployment, create the three KV namespaces and replace their IDs in `wrangler.toml`. Set production secrets with `wrangler secret put`.

## Production secrets

- `GOOGLE_SERVER_CLIENT_ID`
- `GEMINI_API_KEY`
- `ADMIN_TOKEN`

Do not commit `.dev.vars`.

## GitHub

The repository includes `.github/workflows/ci.yml`. Every push/PR runs typecheck, lint, and tests.

See `docs/SETUP.md`, `docs/ARCHITECTURE.md`, and `docs/ROADMAP.md` for the staged rollout.


## GitHub Sync

Gunakan satu file `GITHUB.bat`. Script akan otomatis mendeteksi apakah folder ini sudah merupakan Git repository. Jika belum, script menjalankan mode upload awal; jika sudah, script menjalankan mode update, pull --rebase, commit perubahan, dan push. Jika terjadi konflik Git, script berhenti agar konflik diselesaikan manual.
