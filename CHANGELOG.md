# Changelog

## Unreleased — CI dependency install fix
- Fixed an invalid `@cloudflare/workers-types` version that caused npm `ETARGET` during GitHub Actions dependency installation.
- Pinned `@cloudflare/workers-types` to the published `5.20260928.1` release.
- Fixed GitHub Actions failure caused by `setup-node` npm caching requiring a lock file that was not present in the repository.
- CI now installs dependencies with `npm install --no-audit --no-fund` and does not request npm cache metadata.
- No application/runtime source code or architecture was changed.

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
