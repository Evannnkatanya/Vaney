<div align="center">

# 🌿 Vaney — Financial Wellness & Smart Budgeting

**Aplikasi Pencatat & Pengelola Keuangan Pribadi Berbasis Alokasi Otomatis (50/30/20)**

[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.1-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase Ready](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

<p align="center">
  Membantu Anda membangun kedisiplinan finansial tanpa repot tracking manual, dengan pembagian pot anggaran cerdas, kontrol jatah harian real-time, smart input OCR & suara, serta privasi aman 100% offline-first.
</p>

</div>

---

## ✨ Fitur Unggulan

### 1. 🎯 Sistem Alokasi Anggaran Otomatis (Pots System 50/30/20)
- **50% Kebutuhan Harian**: Makanan, transportasi, belanja rutin.
- **30% Kebutuhan Bulanan**: Tagihan, sewa, langganan, rekreasi.
- **20% Tabungan & Investasi**: Dana darurat, tabungan masa depan.
- Fleksibilitas kustomisasi persentase pot alokasi sesuai kebutuhan pengguna.

### 2. ☀️ Jatah Harian Real-Time & Kalender Disiplin
- Menghitung jatah pengeluaran per hari dari sisa dana pot harian dibagi sisa hari dalam bulan.
- **Fitur "Rata Ulang Jatah Harian"**: Jika awal bulan boros, saldo jatah harian dapat langsung di-rebalance merata ke sisa hari agar tetap terkontrol.
- **Kalender Warna**: Indikator visual hijau (hemat), kuning (pas), merah (boros).

### 3. ⚡ Smart & Fast Transaction Input (<3 Tap)
- **Input Cepat**: Pilihan chip nominal instan dan pemilihan akun dalam hitungan detik.
- **Scan Struk Belanja (OCR)**: Ekstraksi otomatis merchant, total nominal belanja, dan kategori dari foto struk.
- **Input Suara Bahasa Indonesia**: Integrasi Web Speech API (misal: *"Beli Kopi Starbucks lima puluh ribu"* langsung terinput rapi).

### 4. 💳 Multi-Akun Tanpa Open Banking (Privasi 100% Aman)
- Kelola saldo rekening bank (BCA, Mandiri, BRI, dll.), E-Wallet (GoPay, OVO, ShopeePay), Kas Tunai, dan Kartu Kredit secara manual.
- Bebas risiko kebocoran data kredensial perbankan.

### 5. 🔒 Keamanan PIN 4-Digit & Biometrik
- Proteksi akses aplikasi dengan **PIN 4-Digit** dan verifikasi **Biometrik (Fingerprint / Face ID)**.
- Mekanisme lockout otomatis 30 detik jika terjadi 3x percobaan PIN salah.

### 6. 💾 Backup & Restore Data Mandiri
- Ekspor data lengkap ke format **JSON** dan **CSV (kompatibel Excel)**.
- Impor file JSON untuk memulihkan data transaksi & saldo secara instan.

### 7. ☁️ Supabase Cloud Ready
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
│   │   ├── HomeView.tsx               # Dashboard utama & ringkasan saldo
│   │   ├── JatahView.tsx              # Alokasi pot & fitur rata ulang jatah
│   │   ├── TambahTransaksiView.tsx    # Form input transaksi cepat
│   │   ├── LaporanView.tsx            # Analisis grafik & tren keuangan
│   │   ├── AkunKeuanganView.tsx       # Kelola multi-akun & setting PIN
│   │   ├── PinLockScreen.tsx          # Layar kunci keamanan PIN & Biometrik
│   │   ├── OCRScanModal.tsx           # Modal scan struk belanja OCR
│   │   ├── VoiceInputModal.tsx        # Modal input suara Bahasa Indonesia
│   │   ├── ModalBackupRestore.tsx     # Modal ekspor/impor JSON & CSV
│   │   ├── ModalAddAccount.tsx        # Tambah akun keuangan baru
│   │   ├── ModalAddCategory.tsx       # Tambah kategori transaksi baru
│   │   └── TransactionDetailModal.tsx # Detail & opsi hapus transaksi
│   ├── data/
│   │   └── initialData.ts             # Data inisialisasi awal & kategori
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
