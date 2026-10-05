# AI START HERE — FinChat AI Gateway 0.1.1

Gateway terpisah dari Flutter; API key Gemini hanya berada di secret Cloudflare. Pertahankan kode, kontrak API, autentikasi, kuota dan workflow yang sudah bekerja. Jangan mengaktifkan billing secara otomatis.

Baca README.md, docs/AI_GATEWAY_CONTRACT.md, docs/ARCHITECTURE.md, docs/IMPLEMENTATION_STATUS.md, docs/ROADMAP_AUDIT.md dan docs/RECOVERY_503.md.

## Status saat ini

Gateway 0.1.1 sudah diterapkan pada Worker yang sama. Gemini primary nyata berhasil HTTP200/622 ms; verifikasi final health/auth/cleanup lulus. Binding Google dengan titik di akhir sudah diperbaiki tanpa mengganti nilai secret. Endpoint pemeriksaan sementara sudah dihapus. Bukti, version/deployment ID dan batas verifikasi terdapat di docs/IMPLEMENTATION_STATUS.md.

Branch codex/gateway-503-recovery dan draft PR #1 tersedia di GitHub; main belum di-merge. Runtime commit a288204c7d0ece57494fc67e14aab680cc6726f5. src/auth.ts serta workflow CI/deploy asli tetap sama. Jangan mengganti KV asli dengan placeholder wrangler.toml dari repository.

## Perbaikan 0.1.1

Model: gemini-3.5-flash-lite → gemini-3.1-flash-lite → gemini-2.5-flash-lite. Parameter thinking mengikuti keluarga model dan thought dikeluarkan dari jawaban. Retry terbatas, deduplikasi model, konfigurasi provider kosong, HTTP429 upstream, consecutiveFailures dan cooldown sudah diuji. Lockfile teruji; Wrangler 4.147.0 dan Workers Types 5.20261005.1.

## Verifikasi berikutnya

Server sudah diperiksa. Penerimaan APK dengan Google ID token pengguna, Drive dan kamera/attach pada HP masih memerlukan pengujian perangkat. Jangan menyebut pemeriksaan provider sebagai keberhasilan seluruh alur aplikasi. Jangan menulis token atau key ke repo, APK, screenshot atau log.
