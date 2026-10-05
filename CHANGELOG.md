# Changelog

## 0.1.1 — 5 Oktober 2026

- Memperbarui model primary/fallback; menghapus fallback Gemini 2.0.
- Menyesuaikan thinking model dan mengecualikan thought dari jawaban.
- Memperjelas konfigurasi provider kosong dan HTTP429 upstream.
- Menghormati cooldown yang dikonfigurasi dan mereset kegagalan berurutan setelah sukses.
- Menambahkan tes Gemini, routing dan monitoring: 17 tes/5 suite lulus di snapshot CI.
- Menyertakan lockfile yang diuji melalui npm ci; pin Wrangler 4.147.0 dan Workers Types 5.20261005.1.
- Menulis ulang README, AI start here dan panduan Windows untuk paket Gateway terpisah.
- Mempertahankan autentikasi, kuota, rate limit, kontrak API dan workflow asli.
- Source recovery tersedia di GitHub; deployment Cloudflare 100% memakai bundle teruji dan KV asli.
- Memperbaiki nama binding Google dengan inherit secret; nilai secret tidak dibuka atau diganti.
- Gemini primary nyata berhasil HTTP200/622 ms; pemeriksaan final health/auth/cleanup dan kedua CI lulus.
- Menghapus endpoint pemeriksaan sementara setelah tes; dokumentasi live diselaraskan. Bukti dan batas pengujian berada di docs/IMPLEMENTATION_STATUS.md.

## Riwayat sebelumnya

Lihat commit upstream rama160/AI-Gateway b7769af739b1550667c5a75e524d3d62e8f8a324 untuk baseline 0.1.0 dan perbaikan awal CI.
