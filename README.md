## GitHub recovery branch — 5 Oktober 2026

Akses tulis repo rama160/AI-Gateway berhasil setelah otorisasi diperbarui. Perubahan dikirim ke branch codex/gateway-503-recovery; CI langsung pada repo Gateway sedang diverifikasi. Catatan penolakan HTTP403 di bawah adalah riwayat sebelum otorisasi diperbarui. Tidak ada deployment Cloudflare dalam sesi ini. Runtime dan lockfile berasal dari snapshot yang telah lulus 17 tes; hasil CI repo ini akan dicatat setelah selesai.

# FinChat AI Gateway 0.1.1

Backend Cloudflare Workers untuk FinChat: autentikasi Google, akses Gemini melalui secret server, fallback model, rate limit, kuota gratis dan monitoring. Paket source lengkap ini terpisah dari aplikasi Flutter.

Mulai dari **MULAI_DI_SINI.md** untuk langkah Windows PowerShell. Untuk AI/developer berikutnya, baca **Ai start here.md**.

## Isi utama

- src/: Worker, autentikasi, Gemini, routing, kuota, rate limit, monitoring dan validasi.
- tests/: 17 tes yang lulus pada snapshot CI.
- package.json dan package-lock.json: dependensi yang cocok dengan npm ci teruji.
- wrangler.toml: template konfigurasi; isi ID KV dengan konfigurasi lokal yang sudah ada sebelum deploy.
- .github/workflows/: CI/deployment asli dipertahankan; workflow tambahan hanya untuk branch recovery.
- GITHUB.bat: skrip upload/update yang sudah ada, dipertahankan.
- docs/: kontrak, arsitektur, status, roadmap dan panduan pemulihan HTTP503.

## Windows

```powershell
npm.cmd ci --no-audit --no-fund
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npx.cmd wrangler deploy --dry-run
```

Setelah konfigurasi produksi benar dan pemeriksaan berhasil:

```powershell
npx.cmd wrangler deploy
```

Secret yang sudah disimpan di Cloudflare tetap digunakan. Mengganti source tidak memerlukan memasukkan API key lagi. Jangan overwrite wrangler.toml lokal yang berisi ID KV asli dengan template placeholder.

## Hasil pengujian dan status penerapan

GitHub CI: https://github.com/rama160/Finchat/actions/runs/37302216708 — npm ci, typecheck, lint, 17 tes dan dry-run Worker lulus. Source runtime paket ini identik dengan snapshot teruji.

Paket ini belum diterapkan ke rama160/AI-Gateway maupun Worker Cloudflare. Akses tulis repo ditolak HTTP403; HTTP503 pada layanan live masih perlu dibuktikan pulih setelah deploy. Health endpoint saja tidak membuktikan koneksi Gemini berhasil.
