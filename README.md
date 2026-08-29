<div align="center">

# 🌿 Vaney — Financial Wellness & Smart Budgeting

**Aplikasi Pencatat & Pengelola Keuangan Pribadi Berbasis Alokasi Otomatis (50/30/20)**

[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.1-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase Ready](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

<p align="center">
  Membantu Anda membangun kedisiplinan finansial tanpa repot tracking manual, dengan pembagian pot anggaran cerdas (50/30/20), kontrol jatah harian dinamis real-time, fitur setoran tabungan, smart input OCR struk & suara, serta privasi aman 100% offline-first.
</p>

</div>

---

## ✨ Fitur Unggulan

### 1. 🎯 Sistem Pot Anggaran Otomatis (50/30/20) & Tab Navigasi Jatah
Halaman **Jatah Bulanan** terstruktur rapi ke dalam 4 tab navigasi utama:
- 📊 **Ringkasan**: Overview jatah harian, progress bar per pot, dan smart banner status jatah aman.
  - **Pot Kebutuhan Harian (50%) & Bulanan (30%)**: Sifat *budget spending* (terpakai $X\%$, berkurang saat ada pengeluaran).
  - **Pot Tabungan & Investasi (20%)**: Sifat *target yang diisi* (terkumpul $X\%$, bertambah saat ada setoran nabung).
- 🎚️ **Atur Persentase**: Slider interaktif 50/30/20, input total anggaran bulanan, dan preset chip nominal.
- 🏷️ **Kategori**: *Single source of truth* daftar kategori pos anggaran dan pemetaan pot tujuan.
- 📈 **Analisis**: Visualisasi grafik batang perbandingan Alokasi Anggaran vs Realisasi Pengeluaran riil 3 bulan terakhir.

### 2. ☀️ Logika Jatah Harian Dinamis & Fitur "Rata Ulang"
- **Hari Aktual Kalender**: Menggunakan jumlah hari riil dalam bulan berjalan (28, 29, 30, atau 31 hari).
- **Perhitungan Real-Time**:
  $$\text{Batas Aman Jatah Harian} = \frac{\text{Sisa Saldo Pot Harian}}{\text{Sisa Hari (termasuk hari ini sampai akhir bulan)}}$$
- **Dasar Perhitungan Transparan**: UI menampilkan rumus secara jelas:  
  *Contoh:* `Rp 80.645 / hari (dari sisa Rp 2.500.000 ÷ 31 hari tersisa)`
- **Tombol Rata Ulang**: Menyeimbangkan kembali jatah harian secara instan jika terjadi pengeluaran tak terduga.

### 3. 🐷 Fitur Transaksi Nabung ("Setoran Tabungan")
- **Toggle Jenis Transaksi**: Pilihan mudah antara **Pengeluaran** (memotong saldo & jatah pot) atau **Setoran Tabungan** (memindahkan dana rekening ke dalam Pot Tabungan).
- **Progress Tabungan Riil**: Progress bar pot tabungan merepresentasikan $\frac{\text{Total Setoran}}{\text{Target Alokasi}} \times 100\%$ (dimulai dari 0% di awal bulan).
- **Badge Riwayat Khusus**: Transaksi setoran tabungan ditandai dengan badge "Setoran", ikon celengan, dan nuansa warna khusus.

### 4. 🏠 Beranda (Home) Bersih & Berfokus Riwayat
- **Hero Card Total Saldo**: Menampilkan total uang di semua rekening/e-wallet dengan pill shortcut akun (BCA, GoPay, Cash).
- **Riwayat Transaksi Lengkap**:
  - **Pengelompokan Tanggal (*Date Grouping*)**: Rapi dipisah per hari (*Hari Ini, Kemarin, dsb.*).
  - **Pencarian Cepat**: Cari merchant, nominal, catatan, atau kategori secara instan.
  - **Filter Cepat**: Filter pills (*Semua, Pengeluaran, Setoran Tabungan, Pemasukan*).

### 5. ⚡ Smart & Fast Transaction Input (<3 Tap)
- **Scan Struk Belanja (OCR)**: Ekstraksi otomatis nama toko, tanggal, total nominal belanja, dan kategori dari foto kamera / galeri struk.
- **Input Suara Bahasa Indonesia**: Integrasi Web Speech API (misal: *"Beli Nasi Padang dua puluh lima ribu"* langsung terisi otomatis).
- **Input Numpad Cepat**: Keypad kalkulator instan dengan tombol `000` dan `backspace`.

### 6. 💳 Multi-Akun & Fitur Ubah Saldo Cepat
- Kelola saldo rekening bank (BCA, Mandiri, BRI, dll.), E-Wallet (GoPay, OVO, Dana), Kas Tunai, dan Kartu Kredit.
- **Fitur Ubah Saldo**: Memperbarui saldo nominal akun secara langsung dari profil tanpa perlu transaksi penyesuaian manual.
- **Privasi 100% Aman**: Tidak memerlukan open banking atau koneksi kredensial rekening sensitif.

### 7. 🔒 Keamanan PIN 4-Digit & Biometrik
- Proteksi akses aplikasi dengan **PIN 4-Digit** dan verifikasi **Biometrik (Fingerprint / Face ID)**.
- Mekanisme lockout otomatis 30 detik jika terjadi 3x percobaan PIN salah.

### 8. 💾 Backup & Restore Data Mandiri
- Ekspor data lengkap ke format **JSON** dan **CSV (kompatibel Microsoft Excel & Google Sheets)**.
- Impor file JSON untuk memulihkan data transaksi & saldo secara instan.

### 9. ☁️ Supabase Cloud Ready
- Dilengkapi file migrasi SQL lengkap ([`001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)) mencakup 6 tabel terstruktur, Custom Enum, Trigger `updated_at`, dan Row Level Security (RLS).

---

## 🛠️ Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Frontend Framework** | **React 19 + TypeScript** | Komponen modern, performa tinggi, type-safe |
| **Build Tool** | **Vite 6** | Bundler ultra cepat & Hot Module Replacement |
| **Styling & Theme** | **Tailwind CSS v4 + Vanilla CSS** | Desain bento grid minimalis & glassmorphism |
| **Icons** | **Lucide React & Material Symbols** | Set ikon modern dan konsisten |
| **Storage & Security** | **LocalStorage / Web Crypto API** | Penyimpanan offline-first terenkripsi |
| **Database Cloud** | **Supabase PostgreSQL** | Skema tabel lengkap dengan RLS policy |

---

## 📁 Struktur Direktori

```plaintext
Vaney/
├── src/
│   ├── components/
│   │   ├── TopAppBar.tsx              # Bar navigasi atas & notifikasi
│   │   ├── BottomNavBar.tsx           # Navigasi bawah (Mobile)
│   │   ├── DesktopSidebar.tsx         # Navigasi samping (Desktop)
│   │   ├── HomeView.tsx               # Dashboard utama & riwayat transaksi lengkap
│   │   ├── JatahView.tsx              # 4 Tab: Ringkasan, Atur Persentase, Kategori, Analisis
│   │   ├── TambahTransaksiView.tsx    # Form input cepat (Pengeluaran & Setoran Tabungan)
│   │   ├── LaporanView.tsx            # Analisis distribusi pengeluaran per kategori
│   │   ├── AkunKeuanganView.tsx       # Kelola multi-akun, ubah saldo, & setting PIN
│   │   ├── PinLockScreen.tsx          # Layar kunci keamanan PIN & Biometrik
│   │   ├── OCRScanModal.tsx           # Modal scan struk belanja OCR
│   │   ├── VoiceInputModal.tsx        # Modal input suara Bahasa Indonesia
│   │   ├── ModalBackupRestore.tsx     # Modal ekspor/impor JSON & CSV
│   │   ├── ModalAddAccount.tsx        # Tambah akun keuangan baru
│   │   ├── ModalAddCategory.tsx       # Tambah kategori transaksi baru
│   │   └── TransactionDetailModal.tsx # Detail & opsi hapus transaksi
│   ├── data/
│   │   └── initialData.ts             # Data inisialisasi awal & kategori transaksi
│   ├── types.ts                       # Definisi TypeScript interface
│   ├── App.tsx                        # Root component & state controller
│   └── main.tsx                       # Entry point aplikasi
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql     # Skema database Supabase PostgreSQL
├── prd.md                             # Dokumen PRD Lengkap (Roadmap & ERD)
├── package.json
└── vite.config.ts
```

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Clone Repository
```bash
git clone https://github.com/Evannnkatanya/Vaney.git
cd Vaney
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```
Buka browser Anda di `http://localhost:3000`.

### 4. Build untuk Produksi
```bash
npm run build
```

---

## 🗄️ Setup Database Supabase (Opsional)

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka menu **SQL Editor**.
3. Salin seluruh isi file [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).
4. Klik **Run** ▶️ untuk membuat semua tabel, enum, dan kebijakan RLS secara otomatis.

---

## 📄 Lisensi

Distributed under the MIT License.

---

<div align="center">
  Dibuat dengan ❤️ untuk kedisiplinan keuangan pribadi yang lebih baik.
</div>
