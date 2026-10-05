# Recovery Gateway 503 — 0.1.1

Pada audit live, Worker masih menjalankan 0.1.0 dengan model lama dan nama secret GOOGLE_SERVER_CLIENT_ID. yang memiliki titik di akhir. Respons kegagalan lama tidak menyimpan status upstream, sehingga penyebab pasti setiap HTTP503 historis tidak dapat direkonstruksi.

Recovery 0.1.1 sudah diterapkan: model primary gemini-3.5-flash-lite, fallback gemini-3.1-flash-lite lalu gemini-2.5-flash-lite; thinking sesuai keluarga model; konfigurasi kosong dan upstream quota dapat dibedakan; monitoring menyimpan status serta kegagalan berurutan. Binding Google dikoreksi memakai inherit tanpa membuka nilai secret. KV dan limit yang ada tetap dipakai.

Permintaan Gemini nyata berhasil HTTP200 dalam 622 ms. Bundle final diperiksa identik dengan hasil dry-run; endpoint sementara untuk pengujian provider sudah dihapus. Bukti: [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

## Jika gangguan muncul kembali

- HTTP401: periksa Google ID token, expiry dan audience APK vs GOOGLE_SERVER_CLIENT_ID.
- Provider HTTP400/403: periksa parameter, key dan izin akun/model.
- Provider HTTP404: periksa nama model serta ketersediaan pada project.
- HTTP429 UPSTREAM_QUOTA_EXCEEDED: kuota provider habis; tunggu reset atau gunakan model yang tersedia. Jangan mengaktifkan billing secara otomatis.
- HTTP503/504: periksa monitoring model, cooldown dan timeout. Pertanyaan keuangan lokal di aplikasi tetap memakai jalur lokal.

Untuk deploy berikutnya, gunakan konfigurasi Cloudflare yang berisi ID KV asli. wrangler.toml repo adalah template; jangan deploy placeholder. Jalankan npm ci, typecheck, lint, npm test dan dry-run terlebih dahulu. Pertahankan secret, autentikasi dan workflow asli. Pengujian login Google positif dari HP tetap merupakan gate penerimaan aplikasi.
