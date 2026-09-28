# Gateway Roadmap

## Stage 0 — Foundation
- [x] Separate repository
- [x] TypeScript Worker
- [x] GitHub Actions
- [x] BAT upload/update scripts
- [x] Project documentation

## Stage 1 — Health
- [x] `GET /health`
- [x] CI checks

## Stage 2 — AI endpoint
- [x] `POST /v1/ai/chat`
- [x] request validation
- [x] Gemini adapter

## Stage 3 — Authentication
- [x] Google ID-token verification
- [x] user subject extraction

## Stage 4 — Protection
- [x] rate limiting
- [x] free daily quota
- [x] request size limits

## Stage 5 — Resilience
- [x] model fallback
- [x] transient retry
- [x] cooldown
- [x] model health counters

## Stage 6 — Monitoring
- [x] protected monitoring endpoint
- [ ] durable analytics dashboard
- [ ] alerting

## Stage 7 — Production integration
- [ ] connect Android to gateway
- [ ] end-to-end authenticated test
- [ ] production secret rotation procedure
- [ ] final device QA

## Stage 8 — Monetization later
- [ ] server-side subscription records
- [ ] payment provider
- [ ] webhook verification
- [ ] entitlement enforcement

Payment remains disabled until the product has completed multi-user testing.
