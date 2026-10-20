"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Compass,
} from "lucide-react";
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

function SewaSayaContent() {
  const router = useRouter();
  const [bookingList] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [filterTab, setFilterTab] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const active = bookingList.filter(
    (b) => b.status === "Pending" || b.status === "Approved" || b.status === "Picked Up"
  );
  const completed = bookingList.filter(
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Sewa Saya
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pantau dan kelola seluruh transaksi penyewaan alat outdoor Anda.
          </p>
        </div>

        <Link
          href="/customer/katalog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e4732] hover:bg-[#163525] text-white text-xs font-semibold rounded-xl transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Sewa Alat Baru
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1e4732] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">Total Pesanan</span>
            <p className="text-2xl font-black text-gray-900">{bookingList.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">Sewa Berjalan</span>
            <p className="text-2xl font-black text-gray-900">{active.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">Sewa Selesai</span>
            <p className="text-2xl font-black text-gray-900">{completed.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs mb-6">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === "all"
                  ? "bg-[#1e4732] text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Semua ({bookingList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("active")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === "active"
                  ? "bg-[#1e4732] text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Sedang Berjalan ({active.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("completed")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === "completed"
                  ? "bg-[#1e4732] text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Riwayat Selesai ({completed.length})
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder="Cari kode booking / alat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-60 focus:outline-none focus:border-[#1e4732]"
            />
          </div>
        </div>

        {/* Booking Card List */}
        <div className="divide-y divide-gray-100">
          {displayedBookings.length > 0 ? (
            displayedBookings.map((b) => (
              <div
                key={b.code}
                className="p-5 sm:p-6 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#1e4732]">
                      {b.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {b.items}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                    <span>Periode: <strong>{b.period}</strong></span>
                    <span>•</span>
                    <span>Lokasi: {b.location}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-gray-400 block">Total Biaya</span>
                    <span className="text-base font-extrabold text-gray-900">
                      Rp {b.total.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <Link
                    href={`/customer/status-booking?kode=${b.code}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#1e4732] hover:text-[#163525] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Lacak Status</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 text-sm">
              Tidak ada data penyewaan yang sesuai dengan filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerSewaSayaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat sewa saya...</div>}>
      <SewaSayaContent />
    </Suspense>
  );
}
