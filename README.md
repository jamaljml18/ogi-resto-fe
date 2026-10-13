# Ogi Resto Frontend

Frontend Next.js dengan pola Model?View?Presenter.

- Model: API client, sesi admin, katalog, pesanan, laporan kasbon, dan tanggal bisnis.
- Presenter: koordinasi aplikasi, checkout, jadwal pesanan, dan status pelunasan kasbon bulanan.
- View: komposisi halaman bersama, komponen pelanggan, serta tab/form admin terpisah.

## Menjalankan

Gunakan npm run dev dari frontend; backend berjalan di port 5000.
NEXT_PUBLIC_API_URL opsional; default /api memakai rewrite Next.js.
Untuk hosting terpisah, isi URL backend dengan akhiran /api.

## Pelunasan kasbon

Jalankan backend/migrations/001_kasbon_payments.sql melalui Supabase SQL Editor.
SUPABASE_KEY backend harus menggunakan service_role untuk tabel pembayaran.
Jangan gunakan service_role pada environment frontend.

Buka /ogi, login, lalu tab Kasbon. Pilih bulan/tahun tagihan, kemudian aktifkan
Sudah Bayar setelah bukti pembayaran manual diverifikasi di WhatsApp.
Pembayaran pada bulan berikutnya tetap dicatat untuk periode tagihan yang dipilih.
Default false; toggle bisa dimatikan kembali untuk koreksi.
Cash tidak masuk jumlah kasbon. QRIS tetap berupa gambar statis.

Status baru ditampilkan setelah respons penyimpanan berhasil. Error cloud tidak
dialihkan menjadi pembayaran lokal. Tanpa konfigurasi Supabase, mode development
memakai koleksi kasbon_payments pada store JSON.

Identitas sementara memakai nama, perusahaan, dan divisi yang dinormalisasi.
Perubahan identitas tersebut memerlukan rekonsiliasi; aplikasi belum memiliki ID pegawai.

## Pemeriksaan

npm run lint
npm run build
npm test

Token admin kini ditandatangani. Sesi format lama perlu login ulang.
