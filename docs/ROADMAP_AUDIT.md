# Roadmap Audit

The gateway is intentionally separate from the Android repository. This avoids putting backend secrets in the mobile application and allows model routing to change without releasing a new APK.

Current implementation is a production-oriented baseline, not a claim of production verification. Cloudflare deployment, Google OAuth configuration, Gemini quota, and real-device end-to-end behavior must be verified in the user's accounts/environment before product acceptance.
