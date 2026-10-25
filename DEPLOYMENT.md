# Deployment statis frontend, API dan bot

## Pembagian hosting

| Komponen | Bentuk | Penempatan |
| --- | --- | --- |
| Frontend | HTML/CSS/JS di out | Netlify atau Vercel static |
| Backend Express | Stateless HTTP API dengan Supabase | Proyek Vercel terpisah |
| Database | State order, pembayaran, revision dan audit | Supabase |
| Bot Baileys | Worker persisten dengan sesi/antrean lokal | Komputer/VPS/host worker dengan disk persisten |

API tidak perlu berjalan pada mesin yang sama dengan frontend atau bot.
Ketiganya menggunakan proyek Supabase yang sama untuk data bisnis.

## Build frontend sekarang: localhost

Sesuai konfigurasi lokal, NEXT_PUBLIC_API_URL=/api pada .env.local memakai rewrite saat
npm run dev. Pada build statis, nilai kosong atau /api diubah menjadi:
http://localhost:5000/api.

Dari frontend:

~~~powershell
npm.cmd run build
~~~

Hasil siap unggah ada di out, termasuk index.html dan ogi/index.html.
Folder .next adalah hasil internal build, bukan folder yang diunggah untuk mode statis.

Preview lokal:

~~~powershell
npm.cmd start
# atau npm.cmd run preview
~~~

Preview hanya melayani file pada http://127.0.0.1:3000. Backend tetap dijalankan terpisah
pada port 5000. Preview tidak menyediakan proxy /api; bundle statis memakai alamat API absolut.
Halaman admin tersedia di /ogi/.

Localhost mengacu pada perangkat yang membuka website. Build localhost tidak dapat
menghubungi komputer Anda dari HP/perangkat pengunjung melalui internet. Sebelum dipakai
online, ganti URL backend publik dan build ulang.

## Mengganti alamat backend nanti

Pada .env.local atau environment hosting:

~~~dotenv
NEXT_PUBLIC_API_URL=https://nama-backend.vercel.app/api
~~~

Jika hanya domain backend diisi, konfigurasi menambahkan /api pada root domain.
Jangan menambahkan token, username/password URL, query, atau fragment ke variabel ini.
NEXT_PUBLIC_ terbaca publik dalam JavaScript; tidak boleh berisi rahasia.

Setiap perubahan URL memerlukan build dan unggah ulang out. Mengubah environment setelah
out dibuat tidak mengubah URL yang telah tertanam pada bundle browser.

## Netlify

### Unggah folder jadi

1. Build di komputer.
2. Unggah/drag-and-drop folder out melalui Netlify manual deploy.
3. Pastikan yang diunggah isi folder build, bukan source atau .next.
4. Periksa / dan /ogi/.

### Dari Git

- Root/base directory: frontend jika repository masih mencakup folder induk;
  gunakan root repository jika repo khusus frontend.
- Build command: npm run build.
- Publish directory: out.
- Node: 22, mengikuti netlify.toml.
- Isi NEXT_PUBLIC_API_URL pada environment Netlify sebelum build online.

netlify.toml sudah disertakan. Tidak perlu catch-all rewrite ke index.html:
setiap route memiliki file HTML sendiri.

## Vercel frontend

Gunakan proyek terpisah dari backend. vercel.json frontend sudah mengatur:

- Framework: Other (framework null), agar hasil dilayani sebagai static.
- Install: npm ci.
- Build: npm run build.
- Output: out.
- Trailing slash aktif untuk route folder seperti /ogi/.

Jika impor dari Git, pilih root folder frontend atau root repo frontend yang bersangkutan.
Set NEXT_PUBLIC_API_URL sebelum build. Vercel akan membangun source dan menyajikan out.

Untuk folder yang sudah dibangun, Vercel juga dapat menerima static directory melalui CLI,
misalnya dari frontend:

~~~powershell
npx vercel out
~~~

Perintah tersebut melakukan deployment; jalankan sendiri setelah memastikan URL API di build
sudah benar. Konfigurasi output .vercel/output adalah mekanisme lain dan bukan out Next.js ini.

## Backend di Vercel

Backend yang ada sudah mengekspor Express app melalui src/server.js dan memiliki vercel.json.
app.listen tidak dipanggil saat VERCEL aktif. Impor repository backend sebagai proyek terpisah,
dengan root backend jika diperlukan. Gunakan preset Other sesuai konfigurasi backend yang ada.

Isi environment Vercel:
- SUPABASE_URL
- SUPABASE_KEY service_role/secret
- ADMIN_USERNAME
- ADMIN_PASSWORD
- JWT_SECRET

PORT hanya diperlukan untuk server lokal. Variabel webhook Meta hanya diperlukan jika integrasi
Cloud API tersebut dipakai. API Vercel tidak perlu kunci sesi Baileys.

Terapkan seluruh migrasi database melalui SQL Editor Supabase terlebih dahulu.
Periksa https://nama-backend.vercel.app/api/health setelah deploy.
Kemudian gunakan https://nama-backend.vercel.app/api pada frontend dan build ulang.

API bersifat stateless untuk data bisnis: session admin adalah token bertanda tangan,
sementara order, waiting, revision, audit dan pembayaran berada di Supabase.
Client Supabase dalam memori hanya koneksi/helper, bukan penyimpanan utama.
Fallback JSON development ditolak ketika VERCEL aktif agar tidak mengandalkan disk sementara.

vercelignore backend mengecualikan environment, data lokal, worker bot dan fixture test.
Konfigurasi ini disiapkan dan diuji secara lokal; tidak melakukan deployment otomatis.

## Bot WhatsApp

Bot membutuhkan koneksi yang terus hidup, antrean retry, sesi terenkripsi dan disk persisten.
Worker ini tidak dijalankan di Vercel Functions/hosting frontend statis.

Pilihan operasional:
- Komputer sendiri yang tetap hidup dan terhubung internet.
- VPS atau layanan worker/container dengan disk persisten dan satu replika untuk state yang sama.

Di host bot, siapkan backend beserta dependency worker dan environment Supabase/grup/kunci sesi:

~~~powershell
npm.cmd ci
npm.cmd --prefix whatsapp-bot ci
npm.cmd run bot:code
npm.cmd run bot:wa
~~~

Tidak perlu menjalankan HTTP API lokal pada host bot jika API sudah di Vercel: worker memakai
modul database langsung. Tidak perlu tunnel atau port publik untuk bot.
Jangan mengunggah .state atau menaruhnya pada filesystem yang hilang setiap redeploy.
Gunakan kunci sesi yang tetap dan backup privat.

Jika komputer bot mati, pencatatan WA otomatis berhenti. Website/API dan input manual admin
tetap dapat dipakai selama hosting dan Supabase tersedia.

## Referensi

- [Next.js static export](https://nextjs.org/docs/app/guides/static-exports)
- [Netlify manual deploy](https://docs.netlify.com/deploy/create-deploys/)
- [Express di Vercel](https://vercel.com/docs/frameworks/backend/express)
- [Batas Vercel Functions](https://vercel.com/docs/functions/limitations)
