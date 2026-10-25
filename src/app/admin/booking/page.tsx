"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  User,
  CreditCard,
  Package,
} from "lucide-react";
import { INITIAL_BOOKINGS, BookingItem } from "@/data/adminData";

// Extended dummy bookings for pagination demonstration
const EXTRA_BOOKINGS: BookingItem[] = [
  {
    kode: "BK-0098",
    customer: "Dewi Lestari",
    alat: "Tenda Dome 2P",
    periode: "29–31 Agu",
    total: 90000,
    pembayaran: "Lunas",
    status: "Completed",
  },
  {
    kode: "BK-0095",
    customer: "Gede Arta",
    alat: "Kompor Portable, Matras",
    periode: "25–27 Agu",
    total: 65000,
    pembayaran: "Lunas",
    status: "Completed",
  },
  {
    kode: "BK-0089",
    customer: "Siti Rahma",
    alat: "Carrier 60L ×2",
    periode: "18–20 Agu",
    total: 210000,
    pembayaran: "Lunas",
    status: "Completed",
  },
  {
    kode: "BK-0082",
    customer: "Nyoman Yoga",
    alat: "Lampu LED, Tenda Dome 4P",
    periode: "10–12 Agu",
    total: 170000,
    pembayaran: "Lunas",
    status: "Completed",
  },
];

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [rejectingBooking, setRejectingBooking] = useState<BookingItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("camprent_admin_bookings");
      if (saved) {
        try {
          setBookings(JSON.parse(saved));
        } catch {
          // ignore error
        }
      }
    }
  }, []);

  const saveBookings = (newBookings: BookingItem[]) => {
    setBookings(newBookings);
    if (typeof window !== "undefined") {
      localStorage.setItem("camprent_admin_bookings", JSON.stringify(newBookings));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const statusFilters = ["Semua", "Pending", "Approved", "Picked Up", "Completed"];

  // Filter bookings based on active status filter
  const allFilteredList = useMemo(() => {
    const combined = currentPage === 2 ? EXTRA_BOOKINGS : bookings;
    if (selectedStatus === "Semua") {
      return combined;
    }
    return combined.filter((b) => b.status === selectedStatus);
  }, [bookings, selectedStatus, currentPage]);

  const handleApprove = (kode: string) => {
    const updated = bookings.map((b) =>
      b.kode === kode ? { ...b, status: "Approved" as const } : b
    );
    saveBookings(updated);
    showToast(`Booking ${kode} berhasil disetujui!`);
  };

  const handleConfirmReject = () => {
    if (!rejectingBooking) return;
    const updated = bookings.map((b) =>
      b.kode === rejectingBooking.kode
        ? { ...b, status: "Cancelled" as const }
        : b
    );
    saveBookings(updated);
    showToast(`Booking ${rejectingBooking.kode} telah ditolak.`);
    setRejectingBooking(null);
  };

  const handleMarkAsPaid = (kode: string) => {
    const updated = bookings.map((b) =>
      b.kode === kode ? { ...b, pembayaran: "Lunas" as const } : b
    );
    saveBookings(updated);
    if (selectedBooking && selectedBooking.kode === kode) {
      setSelectedBooking({ ...selectedBooking, pembayaran: "Lunas" });
    }
    showToast(`Pembayaran untuk ${kode} telah ditandai Lunas!`);
  };

  // Helper for status badge styling matching mockup
  const getStatusBadge = (status: BookingItem["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-[#fff1e8] text-[#c2410c]";
      case "Approved":
        return "bg-[#e0f2fe] text-[#0369a1]";
      case "Picked Up":
        return "bg-[#d1fae5] text-[#047857]";
      case "Completed":
        return "bg-[#f1f5f9] text-[#64748b]";
      case "Cancelled":
        return "bg-[#fee2e2] text-[#b91c1c]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper for payment badge styling matching mockup
  const getPaymentBadge = (pembayaran: BookingItem["pembayaran"]) => {
    if (pembayaran === "Lunas") {
      return "bg-[#e6f4ea] text-[#1b7a37]";
    }
    return "bg-[#fff1e8] text-[#c2410c]";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1b4332] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Filter Pills Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Booking & Pembayaran
        </h2>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {statusFilters.map((st) => {
            const isActive = selectedStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#1b4332] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f8fafc] text-gray-500 font-medium text-xs border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-6 font-medium">Kode</th>
                <th className="py-3.5 px-4 font-medium">Customer</th>
                <th className="py-3.5 px-4 font-medium">Alat</th>
                <th className="py-3.5 px-4 font-medium">Periode</th>
                <th className="py-3.5 px-4 font-medium">Total</th>
                <th className="py-3.5 px-4 font-medium">Pembayaran</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allFilteredList.length > 0 ? (
                allFilteredList.map((b) => (
                  <tr key={b.kode} className="hover:bg-gray-50/50 transition-colors">
                    {/* Kode */}
                    <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">
                      {b.kode}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4 text-gray-800 whitespace-nowrap">
                      {b.customer}
                    </td>

                    {/* Alat */}
                    <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                      {b.alat}
                    </td>

                    {/* Periode */}
                    <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                      {b.periode}
                    </td>

                    {/* Total */}
                    <td className="py-4 px-4 text-gray-900 font-medium whitespace-nowrap">
                      Rp {b.total.toLocaleString("id-ID")}
                    </td>

                    {/* Pembayaran */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(
                          b.pembayaran
                        )}`}
                      >
                        {b.pembayaran}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {b.status === "Pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(b.kode)}
                            className="bg-[#24583b] hover:bg-[#1a442e] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectingBooking(b)}
                            className="bg-[#b83828] hover:bg-[#a53022] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(b)}
                          className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-xs">
                    Tidak ada booking dengan status &ldquo;{selectedStatus}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
          <span>
            Menampilkan {currentPage === 1 ? "1–4" : "5–8"} dari 128 booking
          </span>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 flex items-center justify-center rounded-md font-semibold transition-colors cursor-pointer ${
                currentPage === 1
                  ? "bg-[#1b4332] text-white"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              1
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 flex items-center justify-center rounded-md font-semibold transition-colors cursor-pointer ${
                currentPage === 2
                  ? "bg-[#1b4332] text-white"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              2
            </button>

            <button
              type="button"
              disabled={currentPage === 2}
              onClick={() => setCurrentPage(2)}
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Halaman selanjutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Detail Booking {selectedBooking.kode}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Informasi lengkap pemesanan &amp; pembayaran
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-gray-400 flex items-center gap-1 font-medium">
                    <User className="w-3.5 h-3.5" /> Pelanggan
                  </span>
                  <p className="font-bold text-gray-900 text-sm">
                    {selectedBooking.customer}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-gray-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> Periode Sewa
                  </span>
                  <p className="font-bold text-gray-900 text-sm">
                    {selectedBooking.periode}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="text-gray-400 flex items-center gap-1 font-medium">
                  <Package className="w-3.5 h-3.5" /> Alat yang Disewa
                </span>
                <p className="font-semibold text-gray-800">
                  {selectedBooking.alat}
                </p>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#fbfbfa] rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 font-medium block">
                    Total Pembayaran
                  </span>
                  <span className="text-base font-bold text-[#1b4332]">
                    Rp {selectedBooking.total.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(
                      selectedBooking.pembayaran
                    )}`}
                  >
                    {selectedBooking.pembayaran}
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                      selectedBooking.status
                    )}`}
                  >
                    Status: {selectedBooking.status}
                  </span>
                </div>
              </div>

              {selectedBooking.pembayaran === "Belum bayar" && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Customer belum menyelesaikan pembayaran.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMarkAsPaid(selectedBooking.kode)}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Tandai Lunas
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reject Modal */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-gray-900 text-base">
                Tolak Booking {rejectingBooking.kode}?
              </h3>
              <p className="text-xs text-gray-500">
                Pemesanan oleh{" "}
                <span className="font-semibold text-gray-800">
                  {rejectingBooking.customer}
                </span>{" "}
                akan dibatalkan. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingBooking(null)}
                className="flex-1 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2 bg-[#b83828] hover:bg-[#a53022] text-white font-semibold rounded-lg text-xs cursor-pointer"
              >
                Ya, Tolak Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
