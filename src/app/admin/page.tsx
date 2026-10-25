"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { INITIAL_BOOKINGS, BookingItem } from "@/data/adminData";

function getPaymentBadge(status: BookingItem["pembayaran"]) {
  switch (status) {
    case "Lunas":      return "bg-[#e6f4ea] text-[#1e7e34]";
    case "Belum bayar": return "bg-[#fff3eb] text-[#d97706]";
    default:           return "bg-gray-100 text-gray-600";
  }
}

function getStatusBadge(status: BookingItem["status"]) {
  switch (status) {
    case "Pending":   return "bg-[#fff3eb] text-[#c2410c]";
    case "Approved":  return "bg-[#e0f2fe] text-[#0369a1]";
    case "Picked Up": return "bg-[#d1fae5] text-[#047857]";
    case "Completed": return "bg-[#f1f5f9] text-[#64748b]";
    case "Cancelled": return "bg-red-50 text-red-600";
    default:          return "bg-gray-100 text-gray-600";
  }
}

const CHART_DATA = [
  { day: "Sen", height: "h-24", color: "bg-[#286043]" },
  { day: "Sel", height: "h-36", color: "bg-[#286043]" },
  { day: "Rab", height: "h-28", color: "bg-[#286043]" },
  { day: "Kam", height: "h-44", color: "bg-[#286043]" },
  { day: "Jum", height: "h-50", color: "bg-[#286043]" },
  { day: "Sab", height: "h-56", color: "bg-[#e07a2c]" },
  { day: "Min", height: "h-32", color: "bg-[#286043]" },
];

const POPULAR_ITEMS = [
  { name: "Tenda Dome 4 Orang", count: "42×" },
  { name: "Sleeping Bag Mummy", count: "37×" },
  { name: "Carrier 60L",        count: "25×" },
  { name: "Lampu Tenda LED",    count: "19×" },
];

const KPI_CARDS = [
  { label: "Total Booking",        value: "128",       accent: "border-l-[#286043]", border: "border-gray-200" },
  { label: "Alat Sedang Dipinjam", value: "17",        accent: "border-l-[#e07a2c]", border: "border-[#e07a2c]" },
  { label: "Total Stok Alat",      value: "214",       accent: "border-l-[#286043]", border: "border-gray-200" },
  { label: "Total Pendapatan",     value: "Rp 24,6 jt", accent: "border-l-[#e07a2c]", border: "border-[#e07a2c]" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [recentBookings, setRecentBookings] = useState<BookingItem[]>(
    INITIAL_BOOKINGS.slice(0, 3)
  );

  const handleApprove = (kode: string) => {
    setRecentBookings((prev) =>
      prev.map((b) =>
        b.kode === kode ? { ...b, status: "Approved", pembayaran: "Lunas" } : b
      )
    );
  };

  const handleReject = (kode: string) => {
    if (confirm(`Apakah Anda yakin ingin menolak booking ${kode}?`)) {
      setRecentBookings((prev) =>
        prev.map((b) => (b.kode === kode ? { ...b, status: "Cancelled" } : b))
      );
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto">

      {/* ── KPI CARDS: 2 kolom mobile, 4 kolom desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {KPI_CARDS.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-xl p-4 sm:p-5 lg:p-6 border ${card.border} border-l-4 ${card.accent} shadow-xs`}
          >
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium leading-snug">
              {card.label}
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mt-2 sm:mt-3">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── CHART + ALAT TERPOPULER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Pendapatan 7 Hari
            </h3>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
              Rp 4,2 jt minggu ini
            </span>
          </div>
          <div className="flex items-end justify-between gap-1.5 sm:gap-4 h-44 sm:h-56 pt-4 px-1 sm:px-4">
            {CHART_DATA.map((item) => (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center max-w-[64px] h-full justify-end"
              >
                <div
                  className={`w-full ${item.height} ${item.color} rounded-md transition-all duration-300 hover:opacity-90`}
                />
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium mt-2 sm:mt-3">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alat Terpopuler */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-xs flex flex-col">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-4 sm:mb-6">
            Alat Terpopuler
          </h3>
          <div className="space-y-3 sm:space-y-5 flex-1 flex flex-col justify-around">
            {POPULAR_ITEMS.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-700 font-medium">{item.name}</span>
                <span className="font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOOKING TERBARU ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Booking Terbaru
          </h3>
          <Link
            href="/admin/booking"
            className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            Lihat semua
          </Link>
        </div>

        {/* ── MOBILE: Card List (hidden on md+) ── */}
        <div className="md:hidden space-y-3">
          {recentBookings.map((b) => (
            <div
              key={b.kode}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-bold text-gray-900 text-sm">{b.kode}</span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(b.status)}`}
                >
                  {b.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="px-4 py-3 space-y-1.5">
                <p className="text-xs font-semibold text-gray-800">
                  {b.alat} &middot; {b.customer}
                </p>
                <p className="text-[11px] text-gray-500">
                  {b.periode} &middot; Rp {b.total.toLocaleString("id-ID")} &middot;{" "}
                  <span className={`font-semibold ${b.pembayaran === "Lunas" ? "text-[#1e7e34]" : "text-[#d97706]"}`}>
                    {b.pembayaran}
                  </span>
                </p>
              </div>

              {/* Card Actions */}
              <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
                {b.status === "Pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(b.kode)}
                      className="flex-1 py-2 bg-[#23583c] hover:bg-[#1a442e] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Setujui
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(b.kode)}
                      className="flex-1 py-2 bg-[#b83828] hover:bg-[#a53022] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Tolak
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push("/admin/booking")}
                    className="flex-1 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Detail
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── DESKTOP: Table (hidden on mobile) ── */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#eff1f3] text-gray-400 font-medium">
                <tr>
                  {["Kode","Customer","Alat","Periode","Total","Pembayaran","Status","Aksi"].map((h) => (
                    <th key={h} scope="col" className="py-4 px-6 font-medium text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {recentBookings.map((b) => (
                  <tr key={b.kode} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">{b.kode}</td>
                    <td className="py-4 px-6 text-gray-800 whitespace-nowrap">{b.customer}</td>
                    <td className="py-4 px-6 text-gray-800">{b.alat}</td>
                    <td className="py-4 px-6 text-gray-600 whitespace-nowrap">{b.periode}</td>
                    <td className="py-4 px-6 text-gray-800 whitespace-nowrap">
                      Rp {b.total.toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(b.pembayaran)}`}>
                        {b.pembayaran}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {b.status === "Pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(b.kode)}
                            className="px-3.5 py-1.5 bg-[#23583c] hover:bg-[#1a442e] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(b.kode)}
                            className="px-3.5 py-1.5 bg-[#b83828] hover:bg-[#a53022] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => router.push("/admin/booking")}
                          className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
