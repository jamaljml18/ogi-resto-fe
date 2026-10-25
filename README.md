# Ogi Resto Frontend

Next.js App Router dan React untuk pelanggan serta portal admin. Next.js dan
eslint-config-next saat ini 16.4.3, dengan lockfile yang diperbarui.

## Menjalankan

Gunakan Node.js 22.13+ dan npm. Salin .env.example ke .env.local:

~~~dotenv
NEXT_PUBLIC_API_URL=/api
~~~

~~~powershell
npm.cmd ci
npm.cmd run dev
~~~

Pelanggan: http://localhost:3000. Admin: http://localhost:3000/ogi.
Rewrite development meneruskan /api ke localhost:5000; backend berjalan terpisah.

Untuk hosting terpisah, NEXT_PUBLIC_API_URL menunjuk backend publik berakhiran /api,
lalu build ulang. Semua NEXT_PUBLIC_ masuk bundle browser; jangan menyimpan service key,
password, atau kunci sesi bot di sana. Dengan tunnel frontend, /api membuat browser HP
memakai origin yang sama; server Next harus tetap dapat menjangkau backend rewrite.

## Struktur dan komunikasi

| Lokasi | Peran |
| --- | --- |
| app/page.js | Halaman pelanggan |
| app/ogi/page.js | Pintu masuk admin |
| app/views | Tampilan, struk, popup |
| app/views/admin | Kelima halaman admin dan editor |
| app/presenters | State dan koordinasi interaksi |
| app/models | HTTP API, preview, format/data |
| app/globals.css | Tema, card, tipografi dan responsivitas |

View -> presenter -> model API -> Express -> Supabase. Browser tidak memegang
Supabase service key atau melakukan mutasi langsung ke database.

## Pelanggan dan pembayaran

Keranjang menampilkan preview. Backend menghitung ulang berdasarkan master menu;
harga/total browser bukan otoritas.

- Cash/Transfer masuk waiting_payments. Selesai pada struk membuka popup pembayaran.
- Kasbon langsung masuk orders dan rekap bulanan.
- Popup berisi total, rekening BCA, dua langkah pembayaran, format /bayar,
  Salin & Buka Grup WhatsApp, dan status menunggu.
- Polling status dilakukan serial; paid menutup popup, deleted menampilkan pembatalan.
  Error jaringan tidak dianggap pembayaran selesai.
- Status memakai POST /orders/payment-status dengan nomor/token dalam body.
- ogi_waiting_payment menyimpan informasi minimum pemulihan pending pada origin yang sama.
  Browser/storage tetap dapat ditutup/dihapus; perubahan origin tunnel memisahkan storage.
- /ogi tidak memulihkan popup pelanggan yang menghalangi admin.

Rekening bersama: models/paymentInfo.js, BCA 0690595664, A/n Ogi Nur Saputra.
BankAccountDetails menyediakan salin rekening. Header mempunyai Buka Grup WhatsApp
dan Lihat No. Rek; grup memakai WHATSAPP_GROUP_URL yang sama dengan popup.
Tautan grup tidak mengisi caption otomatis. Pelanggan menempel format tersalin pada
foto bukti transfer, bukan mengirim teks terpisah.

## Portal admin

| Halaman | Fitur |
| --- | --- |
| Menu & Jadwal | Master menu/harga, kategori, jadwal, tambah/edit/hapus |
| Pesanan & CSV | Statistik, filter, ringkasan, ekspor dan edit menu order |
| Menunggu Pembayaran | Bayar atau batalkan waiting |
| Kasbon Bulanan | Matriks tanggal, filter, lunas, CSV |
| Riwayat Pembayaran | Manual, edit, soft delete, filter dan laporan WA |

PC/tablet memakai tab satu baris; HP memakai pemilih halaman dan satu permukaan gulir.
AdminTableViewport menyediakan geser horizontal, zoom tabel 60-150%, dan reset 100%.
Toolbar tetap berukuran nyaman dan pinch zoom browser tidak dinonaktifkan.

Tipografi admin: judul 700, label 600, teks normal 400. Angka/identitas penting mendapat
penekanan. Border/radius/jarak card disamakan. Form Tambah Riwayat Pembayaran memiliki
header, petunjuk input, tanggal dan footer simpan yang responsif.

## Edit menu pesanan

Tombol Edit membuka satu nomor pesanan. Pada mode ringkasan, daftar Edit pesanan
meminta pemilihan nomor sumber, bukan mengubah gabungan sekaligus.

1. useOrderEditorPresenter memuat snapshot order dan katalog terbaru.
2. Item lama tanpa ID dicocokkan hanya dengan nama unik. Menu hilang/ambigu harus diganti.
3. Admin mengganti menu/jumlah, menambah/menghapus baris.
4. orderEditModel menghitung preview subtotal, total dan selisih.
5. Request berisi revision dan id/qty/expectedPrice; backend/database menentukan harga final.
6. Sukses memuat ulang riwayat, statistik dan rekap kasbon.

Seluruh item edit memakai harga master terbaru. Nomor, identitas, jadwal, lokasi,
metode bayar dan catatan dipertahankan. Selisih total Cash dicocokkan dengan pelanggan;
tidak ada pembayaran/refund otomatis. Kasbon lunas ditolak sampai admin membuka status lunas.

Konflik revision/harga mempertahankan draft dan menampilkan Muat Ulang Pesanan & Harga.
Save ganda diblokir, penutupan saat save dicegah, respons sesi lama diabaikan.
Modal menyediakan label aksesibel dan focus trap.

**Memerlukan backend terbaru dan migrasi 007_order_item_editing.sql.**

## Presenter/model penting

| File | Fungsi |
| --- | --- |
| presenters/useCateringPresenter.js | Katalog, login dan koordinasi hook |
| presenters/useCustomerOrderPresenter.js | Keranjang, checkout, retry, struk |
| presenters/usePendingPaymentPresenter.js | Polling, restore, konfirmasi/batal |
| presenters/useWaitingPaymentsPresenter.js | Waiting dan konfirmasi admin |
| presenters/usePaymentHistoryPresenter.js | CRUD, filter draft/terapan |
| presenters/useKasbonPresenter.js | Rekap, lunas, reload setelah edit order |
| presenters/useOrderEditorPresenter.js | Editor, save guard, konflik, stale response |
| models/orderEditModel.js | Pemetaan menu lama dan preview harga |
| models/apiClient.js | Bearer, request JSON, unduh CSV |

## Filter dan CSV

Pesanan memuat otomatis dengan debounce/abort. Ekspor memakai builder parameter yang sama:
nama, perusahaan, divisi, lokasi, hari, tanggal/periode, mode detail/ringkasan.
Memilih bulan saat tahun Semua memilih tahun berjalan; Semua Tahun mereset bulan ke Semua.

Kasbon memakai bulan, tahun, perusahaan dan divisi terpilih. Zoom tidak memengaruhi data
CSV. Ekspor orders tidak mencakup waiting. Waiting dan riwayat pembayaran belum mempunyai CSV.

## Keamanan dan pengujian

Token admin disimpan di browser dan dikirim lewat Bearer, bukan URL. Logout/401 membersihkan
sesi. Rahasia tetap di backend. Data dirender sebagai teks React; jangan memasukkan HTML
pengguna mentah. Popup pembayaran bukan bukti mutasi bank atau pengunci browser.

~~~powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd audit
~~~

Tes mencakup checkout/retry, filter, polling, respons terlambat, preview harga, save ganda,
konflik dan draft. Uji browser meliputi HP tegak/mendatar, tablet, PC, zoom dan editor.
Lihat [backend](../backend/README.md) untuk validasi transaksi database.

## Build statis dan hosting

npm run build sekarang menghasilkan out (HTML/CSS/JS). Unggah out ke Netlify manual deploy,
atau impor Git ke Netlify/Vercel dengan build npm run build dan output out.
netlify.toml dan vercel.json sudah tersedia; frontend Vercel memakai framework Other.

npm start / npm run preview melayani out secara lokal, bukan next start.
npm run dev tetap memakai Next development dan rewrite /api.
Untuk build statis, /api atau environment kosong menjadi http://localhost:5000/api.
Sebelum dipakai online, set NEXT_PUBLIC_API_URL ke backend publik dan build ulang.

Folder out diabaikan Git. Jangan mengunggah .next, .env.local atau service key.
Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk frontend, API Vercel, dan penempatan bot.

## Pencocokan identitas tanpa membedakan huruf besar-kecil

Nama, perusahaan dan divisi dicocokkan tanpa membedakan kapital, misalnya Hanan/hanan,
PT Contoh/pt contoh dan HR/hr. Penulisan asli tetap ditampilkan. Filter, akumulasi harian,
ringkasan, CSV, kasbon dan pencocokan laporan WA menggunakan aturan tersebut.
Perusahaan/divisi/tanggal yang berbeda tetap dipisahkan. Kunci pelunasan lama tidak diubah,
dan laporan pembayaran terpisah tidak dihapus atau digabung secara fisik.
