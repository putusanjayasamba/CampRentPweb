"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
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

function StatusBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKode = searchParams.get("kode") || INITIAL_BOOKINGS[0].code;

  const [bookingList, setBookingList] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [selectedCode, setSelectedCode] = useState<string>(initialKode);

  const activeBooking = useMemo(
    () => bookingList.find((b) => b.code === selectedCode) || bookingList[0],
    [bookingList, selectedCode]
  );

  const handleCancelBooking = (code: string) => {
    if (confirm(`Apakah Anda yakin ingin membatalkan booking ${code}?`)) {
      setBookingList((prev) =>
        prev.map((b) => (b.code === code ? { ...b, status: "Cancelled" as const } : b))
      );
      alert(`Booking ${code} telah berhasil dibatalkan.`);
    }
  };

  const handleContactAdmin = () => {
    alert(
      `Menghubungi CS CampRent terkait Booking ${activeBooking.code} via WhatsApp: +62 812-3456-7890`
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/customer/sewa-saya"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Status & Tracking Booking
            </h1>
            <p className="text-xs text-gray-500">
              Pantau progres persetujuan dan pengambilan alat camping secara real-time.
            </p>
          </div>
        </div>

        {/* Quick booking code selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Pilih Booking:</span>
          <select
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            className="text-xs font-bold border border-gray-200 bg-white rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#1e4732] shadow-xs cursor-pointer"
          >
            {bookingList.map((b) => (
              <option key={b.code} value={b.code}>
                {b.code} - {b.items.slice(0, 25)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Status & Stepper */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Status Utama */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  Kode Transaksi
                </span>
                <h2 className="text-xl font-extrabold text-[#1e4732] mt-0.5">
                  {activeBooking.code}
                </h2>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(
                  activeBooking.status
                )}`}
              >
                {activeBooking.status}
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Proses Penyewaan
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {activeBooking.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <span
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step.done
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.done ? "✓" : idx + 1}
                    </span>
                    <div className="flex-1">
                      <p
                        className={`text-xs font-bold ${
                          step.done ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lokasi & Panduan Pengambilan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> Lokasi Pengambilan & Pengembalian
            </h3>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-2">
              <p className="font-bold text-gray-900">Basecamp CampRent Denpasar</p>
              <p className="text-gray-600">
                Jl. Teuku Umar No. 88, Denpasar Barat, Bali (Depan SPBU Pertamina)
              </p>
              <div className="pt-2 text-[11px] text-gray-500 flex items-center gap-4">
                <span>Jam Buka: 08:00 - 21:00 WITA</span>
                <span>Telp: 0812-3456-7890</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Harap membawa <strong>KTP / Kartu Identitas Asli</strong> saat pengambilan alat sebagai jaminan sewa dan verifikasi fisik.
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Rincian Pesanan */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Rincian Booking
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Alat yang disewa</span>
                <span className="font-bold text-gray-800 text-sm">{activeBooking.items}</span>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <span className="text-gray-400 block text-[10px]">Jadwal Sewa</span>
                <span className="font-semibold text-gray-800">{activeBooking.period}</span>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="text-gray-500">Total Pembayaran</span>
                <span className="font-black text-base text-[#1e4732]">
                  Rp {activeBooking.total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleContactAdmin}
                className="w-full py-2.5 bg-[#1e4732] hover:bg-[#163525] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Hubungi CS / Bantuan
              </button>

              {activeBooking.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => handleCancelBooking(activeBooking.code)}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Batalkan Booking Ini
                </button>
              )}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 text-xs text-emerald-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1e4732]">
              <ShieldCheck className="w-4 h-4" /> Jaminan Kualitas CampRent
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Semua alat telah melewati tahap pembersihan, disinfeksi, dan inspeksi fisik ketat oleh petugas staff operasional kami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerStatusBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat status booking...</div>}>
      <StatusBookingContent />
    </Suspense>
  );
}
