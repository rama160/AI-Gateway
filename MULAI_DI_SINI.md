## Verified AI-Gateway GitHub CI — 5 Oktober 2026

Akses tulis repo sudah berhasil setelah otorisasi diperbarui. Source Gateway 0.1.1 berada di branch codex/gateway-503-recovery, code commit a288204c7d0ece57494fc67e14aab680cc6726f5. Draft PR: https://github.com/rama160/AI-Gateway/pull/1 .

- Recovery validation https://github.com/rama160/AI-Gateway/actions/runs/37304282683 — success: install, typecheck, lint, 17 tes/5 suite dan Wrangler dry-run (46.59 KiB).
- Workflow CI asli https://github.com/rama160/AI-Gateway/actions/runs/37304318976 — success: install, typecheck, lint dan tes.
- Autentikasi Google, kuota, rate limit, validasi, workflow CI/deploy asli dan binding KV dipertahankan. Main belum di-merge. Tidak ada deployment Cloudflare atau perubahan secret.
- HTTP503 live belum dinyatakan selesai: deployment dan pengujian provider nyata tetap diperlukan. Catatan HTTP403/CI pending di bagian sebelumnya adalah riwayat yang sudah digantikan verifikasi ini. Follow-up ini hanya dokumentasi; runtime teruji tidak berubah.

## GitHub recovery branch — 5 Oktober 2026

Akses tulis repo rama160/AI-Gateway berhasil setelah otorisasi diperbarui. Perubahan dikirim ke branch codex/gateway-503-recovery; CI langsung pada repo Gateway sedang diverifikasi. Catatan penolakan HTTP403 di bawah adalah riwayat sebelum otorisasi diperbarui. Tidak ada deployment Cloudflare dalam sesi ini. Runtime dan lockfile berasal dari snapshot yang telah lulus 17 tes; hasil CI repo ini akan dicatat setelah selesai.

# Mulai di sini — Windows PowerShell

## 1. Simpan konfigurasi yang sudah bekerja

Buat salinan folder AI Gateway lama. Pertahankan folder .git jika memperbarui checkout lama. Simpan wrangler.toml lokal yang berisi ID asli RATE_LIMIT_KV, USAGE_KV dan HEALTH_KV. Secret Gemini dan Google yang berada di Cloudflare tetap tersimpan; tidak perlu mengisinya ulang.

## 2. Ganti source

Ekstrak ZIP. Folder AI-Gateway berisi seluruh source backend. Salin isinya ke folder repo Gateway lama, tetapi **pertahankan wrangler.toml lokal**. Jangan menyalin ke repo aplikasi Flutter.

Di bagian [vars] wrangler.toml lokal, ubah hanya tiga baris model:

```toml
MODEL_PRIMARY = "gemini-3.5-flash-lite"
MODEL_FALLBACK_1 = "gemini-3.1-flash-lite"
MODEL_FALLBACK_2 = "gemini-2.5-flash-lite"
```

Fallback kedua hanya untuk akun yang masih memiliki akses model legacy. Jika tidak tersedia, kosongkan MODEL_FALLBACK_2; dua model pertama tetap digunakan. Pertahankan nama Worker, binding/ID KV, client ID, kuota dan pengaturan lain. Jangan membuat namespace KV baru untuk mengganti namespace lama.

## 3. Jalankan tes

Buka PowerShell di folder yang berisi package.json. Contoh jika nama folder lama memakai spasi:

```powershell
cd "Finchat AI Gateway"
npm.cmd ci --no-audit --no-fund
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npx.cmd wrangler deploy --dry-run
```

Gunakan npm.cmd dan npx.cmd agar tidak terkena pemblokiran npm.ps1 oleh execution policy. Jalankan perintah berikutnya hanya jika sebelumnya berhasil. Gunakan Node.js 22 seperti CI.

## 4. Terapkan ke Worker yang sama

Setelah tes dan dry-run berhasil, jalankan:

```powershell
npx.cmd wrangler deploy
```

Ini memperbarui Worker finchat-ai-gateway yang sama. Jika sesi Wrangler sudah aktif, login ulang tidak diperlukan. Jika Wrangler meminta autentikasi, ikuti instruksinya untuk akun Cloudflare tempat Worker lama berada. Jangan mengaktifkan billing berbayar otomatis.

## 5. Verifikasi

```powershell
Invoke-RestMethod "https://finchat-ai-gateway.finchat-ai-gateway.workers.dev/health"
```

Harapkan version 0.1.1. Berikutnya uji pertanyaan yang membutuhkan AI dari FinChat dalam sesi Google aktif. Endpoint chat menggunakan Google ID token; membukanya langsung tanpa token bukan tes keberhasilan AI.

Jika masih gagal, lihat docs/RECOVERY_503.md. Catat kode/status yang aman; jangan membagikan Google ID token, Gemini API key atau ADMIN_TOKEN.

## 6. Simpan perubahan ke GitHub

Jalankan GITHUB.bat pada folder repo Gateway yang sudah ada; script mendeteksi mode update melalui .git. Skrip asli dipertahankan. Deployment melalui workflow GitHub memerlukan secrets Cloudflare dan konfigurasi produksi yang benar; lockfile yang dibutuhkan npm ci sudah disertakan.

Sesi ini belum menulis repo rama160/AI-Gateway karena akses ditolak HTTP403. Upload manual atau berikan akses tulis repositori kepada integrasi GitHub yang digunakan sebelum meminta penerapan melalui ChatGPT lagi.
