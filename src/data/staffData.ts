export type StaffView = "pengambilan" | "antrean" | "riwayat";
export type BookingStatus = "Approved" | "Picked Up" | "Completed";
export type AntreanFilter = "semua" | "pengambilan" | "pengembalian";
export type KondisiFilter = "semua" | "Baik" | "Rusak Ringan" | "Rusak Berat" | "Hilang";

export interface BookingOps {
  kode: string;
  customer: string;
  alat: string;
  jadwal: string;
  status: BookingStatus;
  estimasiNilai: number;
  totalSewa: number;
}

export interface AntreanItem {
  kode: string;
  customer: string;
  alat: string;
  jenis: "Pengambilan" | "Pengembalian";
  jam: string;
  terlambat?: boolean;
}

export interface RiwayatItem {
  kode: string;
  alat: string;
  customer: string;
  kondisi: "Baik" | "Rusak Ringan" | "Rusak Berat" | "Hilang";
  denda: number;
  diperiksa: string;
  tanggal: string;
}

export const INITIAL_STAFF_BOOKINGS: BookingOps[] = [
  {
    kode: "BK-0121",
    customer: "Kadek Ayu",
    alat: "Sleeping Bag x2",
    jadwal: "Ambil 20 Sep",
    status: "Approved",
    estimasiNilai: 0,
    totalSewa: 50000,
  },
  {
    kode: "BK-0117",
    customer: "Rian Pratama",
    alat: "Carrier 60L",
    jadwal: "Kembali 17 Sep",
    status: "Picked Up",
    estimasiNilai: 650000,
    totalSewa: 105000,
  },
  {
    kode: "BK-0112",
    customer: "Wayan Dita",
    alat: "Tenda Dome 2P",
    jadwal: "Kembali 15 Sep",
    status: "Picked Up",
    estimasiNilai: 450000,
    totalSewa: 75000,
  },
  {
    kode: "BK-0102",
    customer: "Bagus Arya",
    alat: "Set Nesting",
    jadwal: "Selesai 04 Sep",
    status: "Completed",
    estimasiNilai: 0,
    totalSewa: 36000,
  },
];

export const INITIAL_STAFF_ANTREAN: AntreanItem[] = [
  { kode: "BK-0130", customer: "Dewa Putra", alat: "Tenda Dome 2 Orang", jenis: "Pengambilan", jam: "09:00" },
  { kode: "BK-0121", customer: "Kadek Ayu", alat: "Sleeping Bag Mummy x2", jenis: "Pengambilan", jam: "10:30" },
  { kode: "BK-0117", customer: "Wayan Dita", alat: "Carrier 60L", jenis: "Pengembalian", jam: "14:00" },
  { kode: "BK-0132", customer: "Made Agus", alat: "Tenda Dome 4 Orang", jenis: "Pengambilan", jam: "15:00" },
  { kode: "BK-0119", customer: "Nyoman Sari", alat: "Kompor Portable", jenis: "Pengembalian", jam: "16:00", terlambat: true },
];

export const INITIAL_STAFF_RIWAYAT: RiwayatItem[] = [
  { kode: "BK-0102", alat: "Set Nesting Masak", customer: "Bagus Arya", kondisi: "Baik", denda: 0, diperiksa: "Putu Sanjaya", tanggal: "04 Sep, 15:20" },
  { kode: "BK-0095", alat: "Tenda Dome 2 Orang", customer: "Dewi Lestari", kondisi: "Rusak Ringan", denda: 110000, diperiksa: "Putu Sanjaya", tanggal: "28 Agu, 11:05" },
  { kode: "BK-0088", alat: "Carrier 60L", customer: "Made Yasa", kondisi: "Hilang", denda: 650000, diperiksa: "Putu Sanjaya", tanggal: "20 Agu, 09:40" },
  { kode: "BK-0081", alat: "Lampu Tenda LED", customer: "Nyoman Sari", kondisi: "Baik", denda: 0, diperiksa: "Putu Sanjaya", tanggal: "15 Agu, 17:10" },
  { kode: "BK-0076", alat: "Sleeping Bag Mummy", customer: "Rian Pratama", kondisi: "Rusak Berat", denda: 150000, diperiksa: "Putu Sanjaya", tanggal: "09 Agu, 10:15" },
];
