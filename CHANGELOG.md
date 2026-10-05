## GitHub recovery branch — 5 Oktober 2026

Akses tulis repo rama160/AI-Gateway berhasil setelah otorisasi diperbarui. Perubahan dikirim ke branch codex/gateway-503-recovery; CI langsung pada repo Gateway sedang diverifikasi. Catatan penolakan HTTP403 di bawah adalah riwayat sebelum otorisasi diperbarui. Tidak ada deployment Cloudflare dalam sesi ini. Runtime dan lockfile berasal dari snapshot yang telah lulus 17 tes; hasil CI repo ini akan dicatat setelah selesai.

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
- Belum deploy; akses tulis repo AI-Gateway ditolak HTTP403.

## Riwayat sebelumnya

Lihat commit upstream rama160/AI-Gateway b7769af739b1550667c5a75e524d3d62e8f8a324 untuk baseline 0.1.0 dan perbaikan awal CI.
