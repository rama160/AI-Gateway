# GitHub Workflow Notes

CI is automatic on push and pull request.

Deployment is manual (`workflow_dispatch`) so production cannot be changed accidentally by a normal push.

Required deployment secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Production Worker secrets such as `GEMINI_API_KEY` should be configured in Cloudflare, not GitHub workflow YAML.
