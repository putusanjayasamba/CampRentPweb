# CampRent - Platform Rental Alat Camping

Sistem persewaan perlengkapan camping dan outdoor modern berbasis **Next.js 16 (App Router)**, **TypeScript**, dan **Tailwind CSS**.

Dikembangkan untuk kebutuhan praktikum & proyek Pemrograman Web (PWeb) - **Universitas Primakara**.

---

## 🚀 Fitur Utama

1. **Halaman Autentikasi Modern (`/login`)**:
   - Replikasi & peningkatan desain dari `login.blade.php`.
   - Tab navigasi interaktif **Masuk** dan **Daftar**.
   - Pilihan hak akses (**Customer**, **Admin**, **Staff**).
   - Tombol Demo Quick-Fill untuk pengujian cepat tiap role.
   - Show/Hide Password, validasi form, dan feedback alert.

2. **Katalog & Beranda Interaktif (`/`)**:
   - Header navigasi dengan logo CampRent & identitas Universitas Primakara.
   - Filter kategori peralatan (Tenda & Shelter, Tidur & Matras, Masak & Makan, Carrier & Tas, Penerangan).
   - Pencarian real-time dan badge ketersediaan stok.
   - Modal booking / simulasi kalkulasi tarif sewa per hari + deposit jaminan.
   - Paket camping hemat (Solo Camper, Duo Adventure, Regu/Group).
   - Panduan alur sewa & informasi basecamp di Renon, Denpasar.

3. **Dashboard Multi-Role (`/dashboard`)**:
   - **Customer**: Pantau status sewa aktif, batas waktu pengembalian, dan riwayat pesanan.
   - **Admin**: Statistik pendapatan, total transaksi aktif, dan tabel inventaris stok gudang.
   - **Staff**: Modul inspeksi fisik pengembalian barang dan rilis dana jaminan deposit.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Typography**: Google Font Inter

---

## 💻 Cara Menjalankan Proyek

1. **Install dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan server pengembangan (Dev Server)**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

3. **Build untuk produksi**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📂 Struktur Direktori

```text
Camprent/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout dengan Inter font & metadata SEO
│   │   ├── globals.css        # Tailwind CSS & custom design tokens
│   │   ├── page.tsx           # Halaman utama & katalog alat camping
│   │   ├── login/
│   │   │   └── page.tsx       # Halaman login & daftar multi-role
│   │   └── dashboard/
│   │       └── page.tsx       # Dashboard interaktif untuk Customer, Admin & Staff
│   └── data/
│       └── equipment.ts       # Dataset inventaris alat & paket sewa
├── public/                    # Aset publik
├── package.json               # Dependensi Next.js & React
├── tsconfig.json              # Konfigurasi TypeScript
└── next.config.ts             # Konfigurasi Next.js
```

---

&copy; 2026 CampRent &middot; Universitas Primakara
