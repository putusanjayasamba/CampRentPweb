"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tent,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  ArrowLeft,
  FileText,
  BadgeCheck,
  RefreshCw,
} from "lucide-react";
import { EQUIPMENT_LIST, Equipment } from "@/data/equipment";

type Role = "customer" | "admin" | "staff";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as Role) || "customer";

  const [activeRole, setActiveRole] = useState<Role>(initialRole);
  const [userName, setUserName] = useState("Gede Santana");
  const [userEmail, setUserEmail] = useState("customer@camprent.id");

  // Read session or URL param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("camprent_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.email) setUserEmail(parsed.email);
          if (parsed.role) setActiveRole(parsed.role as Role);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleRoleChange = (newRole: Role) => {
    if (newRole === "customer") {
      router.push("/customer");
      return;
    }
    setActiveRole(newRole);
    if (newRole === "admin") {
      setUserName("Admin Utama CampRent");
      setUserEmail("admin@camprent.id");
    } else {
      setUserName("Staff Operasional & Gudang");
      setUserEmail("staff@camprent.id");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("camprent_user");
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2d5b45] flex items-center justify-center text-white">
                <Tent className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900">
                Camp<span className="text-[#f97316]">Rent</span>
              </span>
            </Link>

            <span className="hidden sm:inline-block text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-semibold">
              Portal Dashboard
            </span>
          </div>

          {/* Role switcher preview for evaluator/testing */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleRoleChange("customer")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRole === "customer"
                    ? "bg-[#2d5b45] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRole === "admin"
                    ? "bg-[#2d5b45] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("staff")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRole === "staff"
                    ? "bg-[#2d5b45] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Staff
              </button>
            </div>

            {/* User profile & Logout */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#2d5b45] font-bold text-xs flex items-center justify-center border border-emerald-300">
                {userName.charAt(0)}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Keluar"
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#234d38] to-[#2d5b45] rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-orange-300 border border-white/15 mb-3">
                <Shield className="w-3.5 h-3.5" /> Akses: {activeRole.toUpperCase()}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Halo, {userName}!
              </h1>
              <p className="text-emerald-100/80 text-xs sm:text-sm mt-1">
                {activeRole === "customer"
                  ? "Kelola pesanan camping Anda, cek masa berlaku sewa, dan konfirmasi pengembalian."
                  : activeRole === "admin"
                  ? "Pusat kontrol inventaris alat, verifikasi booking, dan laporan operasional CampRent."
                  : "Modul verifikasi fisik peralatan, check-in, check-out, dan pencatatan kondisi alat."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/20 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Lihat Katalog
              </Link>
            </div>
          </div>
        </div>

        {/* CUSTOMER VIEW */}
        {activeRole === "customer" && (
          <div className="space-y-8">
            {/* Active Bookings Card */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#2d5b45]" />
                  Penyewaan Aktif Saya
                </h2>
                <Link
                  href="/#katalog"
                  className="text-xs font-semibold text-[#2d5b45] hover:underline flex items-center gap-1"
                >
                  + Sewa Alat Tambahan
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-mono text-gray-400 block mb-1">
                        Kode: CR-8921
                      </span>
                      <h3 className="font-bold text-base text-gray-900">
                        Tenda Dome Eiger 4P + 2 Sleeping Bag
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#2d5b45] border border-emerald-200">
                      Sedang Disewa
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 mb-6 border-y border-gray-100 py-3">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-3.5 h-3.5" /> Tanggal Ambil
                      </span>
                      <span className="font-semibold text-gray-800">18 Okt 2026, 14:00 WITA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Clock className="w-3.5 h-3.5" /> Batas Pengembalian
                      </span>
                      <span className="font-semibold text-orange-600">20 Okt 2026, 18:00 WITA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deposit Jaminan</span>
                      <span className="font-semibold text-emerald-700">Rp 50.000 (Siap Kembali)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => alert("Bukti sewa digital telah diunduh.")}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> Cetak Bukti Sewa
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Permintaan perpanjangan masa sewa telah diteruskan ke Admin.")}
                      className="px-4 py-2 border border-[#2d5b45] text-[#2d5b45] hover:bg-[#2d5b45] hover:text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Perpanjang
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-[11px] font-mono text-gray-400 block mb-1">
                          Kode: CR-7430
                        </span>
                        <h3 className="font-bold text-base text-gray-900">
                          Kompor Kovar Windproof + Cooking Set DS-308
                        </h3>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Menunggu Pengambilan
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                      Barang sudah disiapkan oleh staff di basecamp Kampus Renon Primakara. Tunjukkan kode booking saat mengambil.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Total Biaya: <strong>Rp 70.000</strong></span>
                    <button
                      type="button"
                      onClick={() => alert("Panduan pengambilan telah dikirimkan ke WhatsApp Anda.")}
                      className="px-4 py-2 bg-[#2d5b45] text-white rounded-xl text-xs font-semibold hover:bg-[#234d38] transition-colors"
                    >
                      Panduan Ambil
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Completed history */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-gray-400" />
                Riwayat Sewa Sebelumnya
              </h2>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      SELESAI & DEPOSIT KEMBALI
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 mt-1">
                      Paket Duo Adventure (Gunung Batur Trip)
                    </h4>
                    <p className="text-xs text-gray-400">10 Okt 2026 - 12 Okt 2026 (2 Hari)</p>
                  </div>
                  <span className="font-bold text-sm text-gray-900">Rp 110.000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {activeRole === "admin" && (
          <div className="space-y-8">
            {/* Stat Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Total Pendapatan</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-gray-900">Rp 4.850.000</div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  +18% dari bulan lalu
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Penyewaan Aktif</span>
                  <Package className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">24 Transaksi</div>
                <span className="text-[11px] text-gray-500 mt-1 block">
                  8 unit jatuh tempo hari ini
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Total Alat Gudang</span>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-gray-900">128 Unit</div>
                <span className="text-[11px] text-gray-500 mt-1 block">94 unit sedang tersedia</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Pelanggan Aktif</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-gray-900">312 User</div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  Mahasiswa & Umum
                </span>
              </div>
            </div>

            {/* Inventory table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-gray-900">Manajemen Inventaris Alat</h3>
                  <p className="text-xs text-gray-500">Daftar stok peralatan camping di basecamp</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Form tambah unit baru siap diisi.")}
                  className="px-3.5 py-2 bg-[#2d5b45] hover:bg-[#234d38] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Alat
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold uppercase">
                    <tr>
                      <th className="px-5 py-3">Nama Alat</th>
                      <th className="px-5 py-3">Kategori</th>
                      <th className="px-5 py-3">Tarif / Hari</th>
                      <th className="px-5 py-3">Stok Tersedia</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {EQUIPMENT_LIST.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3 font-semibold text-gray-900">{item.name}</td>
                        <td className="px-5 py-3 text-gray-600">{item.categoryLabel}</td>
                        <td className="px-5 py-3 font-semibold text-[#2d5b45]">
                          Rp {item.pricePerDay.toLocaleString("id-ID")}
                        </td>
                        <td className="px-5 py-3">{item.stock} Unit</td>
                        <td className="px-5 py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Ready
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STAFF VIEW */}
        {activeRole === "staff" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-base text-gray-900">Check-in Pengembalian & Inspeksi Fisik</h3>
                  <p className="text-xs text-gray-500">Pemeriksaan kondisi unit dan pengembalian dana jaminan deposit</p>
                </div>
                <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  3 Menunggu Inspeksi
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900">Booking #CR-8821</span>
                      <span className="text-xs text-gray-500">&middot; Made Wijaya</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Unit: Tenda Dome 4P + Flysheet Waterproof (Kondisi: Bersih, pasak lengkap)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert("Kondisi alat diverifikasi: LULUS INSPEKSI. Deposit Rp 50.000 dikembalikan.")}
                      className="px-4 py-2 bg-[#2d5b45] hover:bg-[#234d38] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Terima & Kembalikan Deposit
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Pencatatan denda/kerusakan dibuka.")}
                      className="px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Klaim Denda
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900">Booking #CR-8829</span>
                      <span className="text-xs text-gray-500">&middot; Kadek Ayu</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Unit: Carrier Osprey Volt 60L (Kondisi: Sedang dicek rain cover)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert("Kondisi alat diverifikasi: LULUS INSPEKSI. Deposit Rp 50.000 dikembalikan.")}
                      className="px-4 py-2 bg-[#2d5b45] hover:bg-[#234d38] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Terima & Kembalikan Deposit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
