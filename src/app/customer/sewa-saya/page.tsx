"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
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

function SewaSayaContent() {
  const router = useRouter();
  const [bookingList, setBookingList] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  useEffect(() => {
    setBookingList(getStoredBookings());
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fbfbfa] py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-5">
          Sewa Saya – Riwayat Booking
        </h1>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
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
                {bookingList.map((b) => (
                  <tr
                    key={b.code}
                    onClick={() => router.push(`/customer/status-booking?kode=${b.code}`)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">
                      {b.code}
                    </td>
                    <td className="py-4 px-6 text-gray-800">
                      {b.items}
                    </td>
                    <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                      {b.period}
                    </td>
                    <td className="py-4 px-6 text-gray-800 whitespace-nowrap">
                      Rp {b.total.toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
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
