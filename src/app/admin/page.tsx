"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INITIAL_BOOKINGS, BookingItem } from "@/data/adminData";

function getPaymentBadge(status: BookingItem["pembayaran"]) {
  switch (status) {
    case "Lunas":
      return "bg-[#e6f4ea] text-[#1e7e34]";
    case "Belum bayar":
      return "bg-[#fff3eb] text-[#d97706]";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getStatusBadge(status: BookingItem["status"]) {
  switch (status) {
    case "Pending":
      return "bg-[#fff3eb] text-[#c2410c]";
    case "Approved":
      return "bg-[#e0f2fe] text-[#0369a1]";
    case "Picked Up":
      return "bg-[#d1fae5] text-[#047857]";
    case "Completed":
      return "bg-[#f1f5f9] text-[#64748b]";
    case "Cancelled":
      return "bg-red-50 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

const CHART_DATA = [
  { day: "Sen", height: "h-24", color: "bg-[#286043]" },
  { day: "Sel", height: "h-36", color: "bg-[#286043]" },
  { day: "Rab", height: "h-28", color: "bg-[#286043]" },
  { day: "Kam", height: "h-44", color: "bg-[#286043]" },
  { day: "Jum", height: "h-50", color: "bg-[#286043]" },
  { day: "Sab", height: "h-56", color: "bg-[#e07a2c]" }, // Peak highlighted day in orange!
  { day: "Min", height: "h-38", color: "bg-[#286043]" },
];

const POPULAR_ITEMS = [
  { name: "Tenda Dome 4 Orang", count: "42×" },
  { name: "Sleeping Bag Mummy", count: "37×" },
  { name: "Carrier 60L", count: "25×" },
  { name: "Lampu Tenda LED", count: "19×" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [recentBookings, setRecentBookings] = useState<BookingItem[]>(
    INITIAL_BOOKINGS.slice(0, 3)
  );

  const handleApprove = (kode: string) => {
    setRecentBookings((prev) =>
      prev.map((b) =>
        b.kode === kode
          ? {
              ...b,
              status: "Approved",
              pembayaran: "Lunas",
            }
          : b
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Booking (Green border accent) */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 border-l-4 border-l-[#286043] shadow-xs">
          <p className="text-xs text-gray-500 font-medium">Total Booking</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">128</p>
        </div>

        {/* Card 2: Alat Sedang Dipinjam (Orange border accent) */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#e07a2c] border-l-4 border-l-[#e07a2c] shadow-xs">
          <p className="text-xs text-gray-500 font-medium">Alat Sedang Dipinjam</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">17</p>
        </div>

        {/* Card 3: Total Stok Alat (Green border accent) */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 border-l-4 border-l-[#286043] shadow-xs">
          <p className="text-xs text-gray-500 font-medium">Total Stok Alat</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">214</p>
        </div>

        {/* Card 4: Total Pendapatan (Orange border accent) */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#e07a2c] border-l-4 border-l-[#e07a2c] shadow-xs">
          <p className="text-xs text-gray-500 font-medium">Total Pendapatan</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
            Rp 24,6 jt
          </p>
        </div>
      </div>

      {/* Middle Section: Chart & Alat Terpopuler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Pendapatan 7 Hari Terakhir */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Pendapatan 7 Hari Terakhir
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              Rp 4,2 jt minggu ini
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="flex items-end justify-between gap-3 sm:gap-6 h-56 pt-6 px-2 sm:px-4">
            {CHART_DATA.map((item) => (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center max-w-[64px] h-full justify-end"
              >
                <div
                  className={`w-full ${item.height} ${item.color} rounded-md transition-all duration-300 hover:opacity-90`}
                />
                <span className="text-xs text-gray-400 font-medium mt-3">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Alat Terpopuler */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-6">
            Alat Terpopuler
          </h3>

          <div className="space-y-5 flex-1 flex flex-col justify-around">
            {POPULAR_ITEMS.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700 font-medium">{item.name}</span>
                <span className="font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Booking Terbaru Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Booking Terbaru
          </h3>
          <Link
            href="/admin/booking"
            className="px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            Lihat semua
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#eff1f3] text-gray-400 font-medium">
                <tr>
                  <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                    Kode
                  </th>
                  <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                    Customer
                  </th>
                  <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                    Alat
                  </th>
                  <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                    Periode
                  </th>
                  <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                    Total
                  </th>
                  <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                    Pembayaran
                  </th>
                  <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                    Status
                  </th>
                  <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {recentBookings.map((b) => (
                  <tr key={b.kode} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">
                      {b.kode}
                    </td>
                    <td className="py-4 px-6 text-gray-800 whitespace-nowrap">
                      {b.customer}
                    </td>
                    <td className="py-4 px-6 text-gray-800">
                      {b.alat}
                    </td>
                    <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
                      {b.periode}
                    </td>
                    <td className="py-4 px-6 text-gray-800 whitespace-nowrap">
                      Rp {b.total.toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(
                          b.pembayaran
                        )}`}
                      >
                        {b.pembayaran}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          b.status
                        )}`}
                      >
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
