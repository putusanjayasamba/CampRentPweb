"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Package,
} from "lucide-react";
import { INITIAL_BOOKINGS, BookingItem } from "@/data/adminData";

const EXTRA_BOOKINGS: BookingItem[] = [
  { kode: "BK-0098", customer: "Dewi Lestari", alat: "Tenda Dome 2P", periode: "29-31 Agu", total: 90000, pembayaran: "Lunas", status: "Completed" },
  { kode: "BK-0095", customer: "Gede Arta", alat: "Kompor Portable, Matras", periode: "25-27 Agu", total: 65000, pembayaran: "Lunas", status: "Completed" },
  { kode: "BK-0089", customer: "Siti Rahma", alat: "Carrier 60L x2", periode: "18-20 Agu", total: 210000, pembayaran: "Lunas", status: "Completed" },
  { kode: "BK-0082", customer: "Nyoman Yoga", alat: "Lampu LED, Tenda Dome 4P", periode: "10-12 Agu", total: 170000, pembayaran: "Lunas", status: "Completed" },
];

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [rejectingBooking, setRejectingBooking] = useState<BookingItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("camprent_admin_bookings");
      if (saved) {
        try { setBookings(JSON.parse(saved)); } catch { /* ignore */ }
      }
    }
  }, []);

  const saveBookings = (nb: BookingItem[]) => {
    setBookings(nb);
    if (typeof window !== "undefined") {
      localStorage.setItem("camprent_admin_bookings", JSON.stringify(nb));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const statusFilters = ["Semua", "Pending", "Approved", "Picked Up", "Completed"];

  const allFilteredList = useMemo(() => {
    const combined = currentPage === 2 ? EXTRA_BOOKINGS : bookings;
    return selectedStatus === "Semua" ? combined : combined.filter((b) => b.status === selectedStatus);
  }, [bookings, selectedStatus, currentPage]);

  const handleApprove = (kode: string) => {
    const updated = bookings.map((b) => b.kode === kode ? { ...b, status: "Approved" as const } : b);
    saveBookings(updated);
    showToast(`Booking ${kode} berhasil disetujui!`);
  };

  const handleConfirmReject = () => {
    if (!rejectingBooking) return;
    const updated = bookings.map((b) => b.kode === rejectingBooking.kode ? { ...b, status: "Cancelled" as const } : b);
    saveBookings(updated);
    showToast(`Booking ${rejectingBooking.kode} telah ditolak.`);
    setRejectingBooking(null);
  };

  const handleMarkAsPaid = (kode: string) => {
    const updated = bookings.map((b) => b.kode === kode ? { ...b, pembayaran: "Lunas" as const } : b);
    saveBookings(updated);
    if (selectedBooking && selectedBooking.kode === kode) {
      setSelectedBooking({ ...selectedBooking, pembayaran: "Lunas" });
    }
    showToast(`Pembayaran untuk ${kode} telah ditandai Lunas!`);
  };

  const getStatusBadge = (status: BookingItem["status"]) => {
    switch (status) {
      case "Pending": return "bg-[#fff1e8] text-[#c2410c]";
      case "Approved": return "bg-[#e0f2fe] text-[#0369a1]";
      case "Picked Up": return "bg-[#d1fae5] text-[#047857]";
      case "Completed": return "bg-[#f1f5f9] text-[#64748b]";
      case "Cancelled": return "bg-[#fee2e2] text-[#b91c1c]";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentBadge = (p: BookingItem["pembayaran"]) =>
    p === "Lunas" ? "bg-[#e6f4ea] text-[#1b7a37]" : "bg-[#fff1e8] text-[#c2410c]";

  const PaginationBar = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex items-center justify-between gap-3 text-xs text-gray-400 ${compact ? "px-0 pt-2" : "px-6 py-4 border-t border-gray-100"}`}>
      <span>Menampilkan {currentPage === 1 ? "1-4" : "5-8"} dari 128 booking</span>
      <div className="flex items-center gap-1.5">
        <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer" aria-label="Sebelumnya">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        {[1, 2].map((p) => (
          <button key={p} type="button" onClick={() => setCurrentPage(p)} className={`w-7 h-7 flex items-center justify-center rounded-md font-semibold transition-colors cursor-pointer ${currentPage === p ? "bg-[#1b4332] text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{p}</button>
        ))}
        <button type="button" disabled={currentPage === 2} onClick={() => setCurrentPage(2)} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer" aria-label="Selanjutnya">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1b4332] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title + Filter Pills — same row on desktop, stacked on mobile */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight shrink-0">
          <span className="lg:hidden">Booking</span>
          <span className="hidden lg:inline">Booking &amp; Pembayaran</span>
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {statusFilters.map((st) => (
            <button key={st} type="button" onClick={() => setSelectedStatus(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${selectedStatus === st ? "bg-[#1b4332] text-white shadow-xs" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}>
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE / TABLET CARD LIST (< lg) */}
      <div className="space-y-3 lg:hidden">
        {allFilteredList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-xs">
            Tidak ada booking dengan status ini.
          </div>
        ) : (
          allFilteredList.map((b) => (
            <div key={b.kode} className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs space-y-2.5">
              {/* Kode + Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-gray-900 text-sm">{b.kode}</span>
                <span className={`shrink-0 px-3 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(b.status)}`}>
                  {b.status}
                </span>
              </div>
              {/* Alat + Customer */}
              <p className="text-xs text-gray-800 font-medium leading-snug">{b.alat} &middot; {b.customer}</p>
              {/* Periode · Total · Bayar */}
              <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-xs text-gray-500">
                <span>{b.periode}</span>
                <span className="text-gray-300">·</span>
                <span>Rp {b.total.toLocaleString("id-ID")}</span>
                <span className="text-gray-300">·</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getPaymentBadge(b.pembayaran)}`}>{b.pembayaran}</span>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 pt-0.5">
                {b.status === "Pending" ? (
                  <>
                    <button type="button" onClick={() => handleApprove(b.kode)} className="px-4 py-1.5 bg-[#24583b] hover:bg-[#1a442e] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-2xs">Setujui</button>
                    <button type="button" onClick={() => setRejectingBooking(b)} className="px-4 py-1.5 bg-[#b83828] hover:bg-[#a53022] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-2xs">Tolak</button>
                  </>
                ) : (
                  <button type="button" onClick={() => setSelectedBooking(b)} className="px-4 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer shadow-2xs">Detail</button>
                )}
              </div>
            </div>
          ))
        )}
        <div className="bg-white rounded-2xl border border-gray-200/90 px-4 py-3 shadow-2xs">
          <PaginationBar compact />
        </div>
      </div>

      {/* DESKTOP TABLE (>= lg) */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
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
              {allFilteredList.length > 0 ? allFilteredList.map((b) => (
                <tr key={b.kode} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">{b.kode}</td>
                  <td className="py-4 px-4 text-gray-800 whitespace-nowrap">{b.customer}</td>
                  <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{b.alat}</td>
                  <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{b.periode}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium whitespace-nowrap">Rp {b.total.toLocaleString("id-ID")}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(b.pembayaran)}`}>{b.pembayaran}</span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(b.status)}`}>{b.status}</span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {b.status === "Pending" ? (
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleApprove(b.kode)} className="bg-[#24583b] hover:bg-[#1a442e] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer">Setujui</button>
                        <button type="button" onClick={() => setRejectingBooking(b)} className="bg-[#b83828] hover:bg-[#a53022] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer">Tolak</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setSelectedBooking(b)} className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer">Detail</button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-xs">Tidak ada booking dengan status ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationBar />
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70 shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Detail Booking {selectedBooking.kode}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Informasi lengkap pemesanan &amp; pembayaran</p>
              </div>
              <button type="button" onClick={() => setSelectedBooking(null)} className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-gray-400 flex items-center gap-1 font-medium"><User className="w-3.5 h-3.5" /> Pelanggan</span>
                  <p className="font-bold text-gray-900 text-sm">{selectedBooking.customer}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-gray-400 flex items-center gap-1 font-medium"><Calendar className="w-3.5 h-3.5" /> Periode Sewa</span>
                  <p className="font-bold text-gray-900 text-sm">{selectedBooking.periode}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="text-gray-400 flex items-center gap-1 font-medium"><Package className="w-3.5 h-3.5" /> Alat yang Disewa</span>
                <p className="font-semibold text-gray-800">{selectedBooking.alat}</p>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-[#fbfbfa] rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 font-medium block">Total Pembayaran</span>
                  <span className="text-base font-bold text-[#1b4332]">Rp {selectedBooking.total.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(selectedBooking.pembayaran)}`}>{selectedBooking.pembayaran}</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedBooking.status)}`}>Status: {selectedBooking.status}</span>
                </div>
              </div>
              {selectedBooking.pembayaran === "Belum bayar" && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Customer belum menyelesaikan pembayaran.</span>
                  </div>
                  <button type="button" onClick={() => handleMarkAsPaid(selectedBooking.kode)} className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0">Tandai Lunas</button>
                </div>
              )}
            </div>
            <div className="px-5 sm:px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
              <button type="button" onClick={() => setSelectedBooking(null)} className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs cursor-pointer">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-gray-900 text-base">Tolak Booking {rejectingBooking.kode}?</h3>
              <p className="text-xs text-gray-500">Pemesanan oleh <span className="font-semibold text-gray-800">{rejectingBooking.customer}</span> akan dibatalkan. Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={() => setRejectingBooking(null)} className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer">Batal</button>
              <button type="button" onClick={handleConfirmReject} className="flex-1 py-2.5 bg-[#b83828] hover:bg-[#a53022] text-white font-semibold rounded-xl text-xs cursor-pointer">Ya, Tolak Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
