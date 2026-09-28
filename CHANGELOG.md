# Changelog

## 0.1.0 - Gateway foundation

- Added separate FinChat AI Gateway repository.
- Added `/health` endpoint.
- Added authenticated `/v1/ai/chat` endpoint.
- Added Google ID-token verification.
- Added Gemini provider adapter.
- Added primary/fallback model routing.
- Added transient retry with bounded backoff.
- Added model cooldown and health counters.
- Added per-user rate limiting and free daily quota using Cloudflare KV.
- Added protected monitoring endpoint.
- Added request validation and size protection.
- Added GitHub Actions CI.
- Added Windows upload and update BAT scripts.
- Added setup, architecture, roadmap, phase, contract, status, and audit documentation.

Payment and premium entitlements remain disabled.


## Unreleased
- Unified GitHub synchronization into `GITHUB.bat` with automatic initial-upload/update detection.
