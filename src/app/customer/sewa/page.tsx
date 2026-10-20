"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import CustomerNavbar from "@/components/CustomerNavbar";
import { INITIAL_BOOKINGS, BookingRecord } from "@/data/customerData";

function getStatusBadge(status: BookingRecord["status"]) {
  switch (status) {
    case "Pending":
      return "bg-[#ffedd5] text-[#c2410c] border border-orange-200";
    case "Approved":
      return "bg-[#e0f2fe] text-[#0369a1] border border-sky-200";
    case "Picked Up":
      return "bg-[#ccfbf1] text-[#0f766e] border border-teal-200";
    case "Completed":
      return "bg-[#f1f5f9] text-[#64748b] border border-slate-200";
    case "Cancelled":
      return "bg-red-100 text-red-700 border border-red-200";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-200";
  }
}

function SewaPage() {
  const router = useRouter();
  const [bookingList] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [filterTab, setFilterTab] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const active = bookingList.filter(
    (b) => b.status === "Pending" || b.status === "Approved" || b.status === "Picked Up"
  );
  const history = bookingList.filter(
    (b) => b.status === "Completed" || b.status === "Cancelled"
  );

  const displayedBookings = bookingList.filter((b) => {
    if (filterTab === "active") {
      if (b.status === "Completed" || b.status === "Cancelled") return false;
    } else if (filterTab === "completed") {
      if (b.status !== "Completed" && b.status !== "Cancelled") return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.code.toLowerCase().includes(q) ||
        b.items.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <CustomerNavbar
        activePage="sewa"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. HEADER BANNER */}
      <section className="bg-[#24523b] text-white px-6 py-10 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/customer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Katalog
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sewa Saya</h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Kelola dan pantau seluruh riwayat transaksi booking alat camping Anda.
              </p>
            </div>
            <Link
              href="/customer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Sewa Alat Baru
            </Link>
          </div>

          {/* Quick Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <span className="text-[11px] text-gray-300 block">Total Booking</span>
              <span className="text-2xl font-bold text-white mt-1 block">
                {bookingList.length}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <span className="text-[11px] text-orange-200 block">Sedang Aktif</span>
              <span className="text-2xl font-bold text-[#f97316] mt-1 block">
                {active.length}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <span className="text-[11px] text-emerald-200 block">Selesai</span>
              <span className="text-2xl font-bold text-emerald-300 mt-1 block">
                {history.filter((b) => b.status === "Completed").length}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <span className="text-[11px] text-red-200 block">Dibatalkan</span>
              <span className="text-2xl font-bold text-red-300 mt-1 block">
                {history.filter((b) => b.status === "Cancelled").length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN TABLE & LIST */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-6">
        {/* Table Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === "all"
                  ? "bg-[#24523b] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Semua ({bookingList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("active")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === "active"
                  ? "bg-[#24523b] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Aktif ({active.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("completed")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === "completed"
                  ? "bg-[#24523b] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Selesai ({history.length})
            </button>
          </div>

          <span className="text-xs text-gray-500">
            Klik baris untuk membuka pelacakan real-time di halaman <strong>Status Booking</strong>
          </span>
        </div>

        {/* Tabel Riwayat Booking (Mockup B) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9fa] text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Kode</th>
                  <th className="px-6 py-4">Alat</th>
                  <th className="px-6 py-4">Periode</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedBookings.map((row) => (
                  <tr
                    key={row.code}
                    onClick={() => router.push(`/customer/status?kode=${row.code}`)}
                    className="hover:bg-[#f0f7f3]/60 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#24523b] group-hover:scale-125 transition-transform" />
                        {row.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      <div>
                        <span className="font-semibold text-gray-900">{row.items}</span>
                        <div className="text-[11px] text-gray-400 mt-0.5">{row.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap font-medium">
                      {row.period}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-bold whitespace-nowrap">
                      Rp {row.total.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${getStatusBadge(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#24523b] group-hover:text-[#f97316] transition-colors">
                        Status <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}

                {displayedBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Tidak ada data booking yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick footer navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-xs text-gray-500">
            Punya kendala dengan booking Anda? Hubungi bantuan via WhatsApp ke Admin CampRent Primakara.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/customer"
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Lihat Katalog
            </Link>
            <Link
              href="/customer/status"
              className="px-4 py-2 bg-[#24523b] hover:bg-[#1a3d2c] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              Cek Status Booking
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SewaSayaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat Sewa Saya...</div>}>
      <SewaPage />
    </Suspense>
  );
}
