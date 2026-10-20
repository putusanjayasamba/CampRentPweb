"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  CreditCard,
  Users,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  INITIAL_BOOKINGS,
  INITIAL_STOCK_ITEMS,
  INITIAL_USERS,
  BookingItem,
} from "@/data/adminData";

export default function AdminOverviewPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);

  const totalPendapatan = bookings
    .filter((b) => b.pembayaran === "Lunas")
    .reduce((acc, curr) => acc + curr.total, 0);

  const pendingBookings = bookings.filter((b) => b.status === "Pending");
  const lowStock = INITIAL_STOCK_ITEMS.filter((s) => s.status !== "Tersedia");

  const handleApprove = (kode: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.kode === kode ? { ...b, status: "Approved" } : b))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-bold">Selamat Datang Kembali, Admin!</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Berikut ringkasan performa operasional dan status inventaris CampRent hari ini.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/stok"
            className="px-4 py-2 bg-white text-[#1b4332] text-xs font-semibold rounded-xl hover:bg-emerald-50 transition-colors shadow-xs"
          >
            Kelola Stok Alat
          </Link>
          <Link
            href="/admin/booking"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Daftar Booking
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Total Omset Lunas</span>
            <p className="text-xl font-bold text-gray-900 mt-1">
              Rp {totalPendapatan.toLocaleString("id-ID")}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +18.4% minggu ini
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Total Booking</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{bookings.length} Pesanan</p>
            <span className="text-[10px] text-orange-600 font-semibold flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> {pendingBookings.length} menunggu persetujuan
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Total Item Inventaris</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{INITIAL_STOCK_ITEMS.length} Varian</p>
            <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" /> {lowStock.length} unit stok menipis/habis
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Pengguna Terdaftar</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{INITIAL_USERS.length} Akun</p>
            <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Semua status aktif
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Pesanan Booking Terbaru</h3>
              <p className="text-[11px] text-gray-400">Daftar transaksi penyewaan terkini dari pelanggan</p>
            </div>
            <Link
              href="/admin/booking"
              className="text-xs text-[#1b4332] font-semibold hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Kode</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Alat</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.kode} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-bold text-gray-900">{b.kode}</td>
                    <td className="py-3 px-4">{b.customer}</td>
                    <td className="py-3 px-4 text-gray-600">{b.alat}</td>
                    <td className="py-3 px-4 font-semibold">Rp {b.total.toLocaleString("id-ID")}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : b.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {b.status === "Pending" ? (
                        <button
                          type="button"
                          onClick={() => handleApprove(b.kode)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          Setujui
                        </button>
                      ) : (
                        <span className="text-gray-400 text-[10px]">Terkonfirmasi</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert Sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Peringatan Stok
            </h3>
            <Link
              href="/admin/stok"
              className="text-xs text-[#1b4332] font-semibold hover:underline"
            >
              Restock
            </Link>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            Item di bawah ini memiliki persediaan rendah dan perlu segera diisi ulang sebelum pesanan berikutnya.
          </p>

          <div className="space-y-3">
            {lowStock.map((item) => (
              <div
                key={item.idDoc}
                className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-gray-800 text-xs">{item.name}</h4>
                  <span className="text-[10px] text-gray-400">{item.category}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === "Habis"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    Sisa: {item.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/admin/stok"
              className="w-full py-2 bg-[#1b4332] hover:bg-[#143225] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Buka Manajemen Stok</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
