# Setup Guide

## 1. Create the repository

Create a separate GitHub repository, for example `finchat-ai-gateway`. Copy this project into it. Keep the Android FinChat repository separate.

## 2. Install tools

Install Node.js 22+ and authenticate Wrangler with Cloudflare.

## 3. Local variables

Copy `.dev.vars.example` to `.dev.vars` and set:

- Google Web/Server OAuth Client ID used by the Android app.
- Gemini API key.
- Long random admin token.

Never commit `.dev.vars`.

## 4. Cloudflare KV

Create three KV namespaces:

- rate limit
- usage/quota
- model health

Put their namespace IDs into `wrangler.toml`.

## 5. Production secrets

Use Wrangler secrets rather than source code:

`wrangler secret put GOOGLE_SERVER_CLIENT_ID`

`wrangler secret put GEMINI_API_KEY`

`wrangler secret put ADMIN_TOKEN`

## 6. Test

Run:

`npm run check`

The same checks run in GitHub Actions.

## 7. Deploy

After CI is green:

`npm run deploy`

The resulting HTTPS Worker URL becomes the AI Gateway base URL configured by the Android application.
