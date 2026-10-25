"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Package, Calendar, Wallet } from "lucide-react";
import {
  INITIAL_BOOKINGS,
  BookingRecord,
  getStoredBookings,
} from "@/data/customerData";

function getStatusBadge(status: BookingRecord["status"]) {
  switch (status) {
    case "Pending":
      return "bg-[#fef3e9] text-[#c2410c]";
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

function getStatusDot(status: BookingRecord["status"]) {
  switch (status) {
    case "Pending":
      return "bg-[#c2410c]";
    case "Approved":
      return "bg-[#0369a1]";
    case "Picked Up":
      return "bg-[#047857]";
    case "Completed":
      return "bg-[#64748b]";
    case "Cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

function SewaSayaContent() {
  const router = useRouter();
  const [bookingList, setBookingList] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  useEffect(() => {
    setBookingList(getStoredBookings());
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fbfbfa] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Title */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Sewa Saya
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Riwayat & status booking penyewaan alat camping
          </p>
        </div>

        {/* ── MOBILE: Card List (hidden on md+) ── */}
        <div className="md:hidden space-y-3">
          {bookingList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
              <p className="text-gray-400 text-sm">Belum ada riwayat sewa.</p>
            </div>
          ) : (
            bookingList.map((b) => (
              <button
                key={b.code}
                type="button"
                onClick={() => router.push(`/customer/status-booking?kode=${b.code}`)}
                className="w-full text-left bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-gray-300 transition-all cursor-pointer active:scale-[0.99] overflow-hidden"
              >
                {/* Card top strip: kode + status badge */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusDot(b.status)}`} />
                    <span className="text-xs font-bold text-gray-900 tracking-wide">
                      {b.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(b.status)}`}
                    >
                      {b.status}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>

                {/* Card body: alat, periode, total */}
                <div className="px-4 py-3 space-y-2">
                  {/* Alat */}
                  <div className="flex items-start gap-2.5">
                    <Package className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-800 font-medium leading-snug line-clamp-2">
                      {b.items}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Periode */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-[11px] text-gray-600">{b.period}</span>
                    </div>

                    {/* Total */}
                    <div className="flex items-center gap-2 ml-auto">
                      <Wallet className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-xs font-bold text-[#1b4332]">
                        Rp {b.total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* ── DESKTOP: Table (hidden on mobile) ── */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#eff1f3] text-gray-400 font-medium">
                <tr>
                  <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                    Kode
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {bookingList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                      Belum ada riwayat sewa.
                    </td>
                  </tr>
                ) : (
                  bookingList.map((b) => (
                    <tr
                      key={b.code}
                      onClick={() => router.push(`/customer/status-booking?kode=${b.code}`)}
                      className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">
                        {b.code}
                      </td>
                      <td className="py-4 px-6 text-gray-800">{b.items}</td>
                      <td className="py-4 px-6 text-gray-700 whitespace-nowrap">{b.period}</td>
                      <td className="py-4 px-6 text-gray-800 whitespace-nowrap">
                        Rp {b.total.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(b.status)}`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CustomerSewaSayaPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-gray-500">
          Memuat sewa saya...
        </div>
      }
    >
      <SewaSayaContent />
    </Suspense>
  );
}
