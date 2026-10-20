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

function StatusPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKode = searchParams.get("kode") || INITIAL_BOOKINGS[0].code;

  const [searchQuery, setSearchQuery] = useState("");
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
      alert(`Booking ${code} telah dibatalkan.`);
    }
  };

  const handleContactAdmin = () => {
    alert("Menghubungi Admin CampRent melalui WhatsApp: +62 812-3456-7890 (Universitas Primakara).");
  };

  const statusOrder: BookingRecord["status"][] = ["Pending", "Approved", "Picked Up", "Completed"];
  const currentStep = statusOrder.indexOf(activeBooking.status);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <CustomerNavbar
        activePage="status"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. HEADER BANNER */}
      <section className="bg-[#24523b] text-white px-6 py-10 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/customer/sewa"
            className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Sewa Saya
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Status Booking</h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Pantau proses verifikasi, pengambilan, dan pengembalian unit camping secara real-time.
              </p>
            </div>
            <Link
              href="/customer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors"
            >
              Katalog Alat
            </Link>
          </div>
        </div>
      </section>

      {/* 3. MAIN STATUS TRACKER */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 1. Kolom Kiri: Daftar Booking */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Daftar Booking
                </h2>
                <span className="text-[11px] text-gray-400">{bookingList.length} total</span>
              </div>

              {bookingList.map((item) => {
                const isActive = item.code === activeBooking.code;

                return (
                  <div
                    key={item.code}
                    onClick={() => {
                      setSelectedCode(item.code);
                      router.replace(`/customer/status?kode=${item.code}`);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#eef7f0] border-[#387e45] shadow-xs"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-gray-900">{item.code}</span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-snug line-clamp-1 font-medium">
                      {item.shortItems || item.items}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/80 text-[11px] text-gray-400">
                      <span>{item.period}</span>
                      <span className="font-semibold text-gray-700">
                        Rp {item.total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. Kolom Kanan: Detail Pelacakan Status & Stepper */}
            <div className="lg:col-span-8 space-y-6">
              {/* Header Kode & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {activeBooking.code}
                    </h3>
                    <span className="text-xs text-gray-400">· Reservasi Aktif</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                    {activeBooking.items}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-full inline-block ${getStatusBadge(
                      activeBooking.status
                    )}`}
                  >
                    {activeBooking.status}
                  </span>
                </div>
              </div>

              {/* Horizontal Stepper (Pending -> Approved -> Picked Up -> Completed) */}
              <div className="py-2">
                <div className="relative flex items-center justify-between w-full">
                  {/* Background connecting line */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 z-0" />

                  {/* Step 1: Pending */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        activeBooking.status === "Pending"
                          ? "bg-[#f97316] text-white shadow-sm ring-4 ring-orange-100"
                          : currentStep > 0
                          ? "bg-[#276738] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > 0 ? "✓" : "1"}
                    </div>
                    <span className="text-xs font-bold text-gray-900 mt-2">Pending</span>
                    <span className="text-[11px] text-gray-400 mt-0.5">28 Sep, 09:12</span>
                  </div>

                  {/* Step 2: Approved */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        activeBooking.status === "Approved"
                          ? "bg-[#f97316] text-white shadow-sm ring-4 ring-orange-100"
                          : currentStep > 1
                          ? "bg-[#276738] text-white"
                          : currentStep === 1
                          ? "bg-[#276738] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > 1 ? "✓" : "2"}
                    </div>
                    <span className="text-xs font-bold text-gray-900 mt-2">Approved</span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      {currentStep >= 1 ? "Terkonfirmasi" : "Menunggu"}
                    </span>
                  </div>

                  {/* Step 3: Picked Up */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        activeBooking.status === "Picked Up"
                          ? "bg-[#f97316] text-white shadow-sm ring-4 ring-orange-100"
                          : currentStep > 2
                          ? "bg-[#276738] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > 2 ? "✓" : "3"}
                    </div>
                    <span className="text-xs font-bold text-gray-900 mt-2">Picked Up</span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      {currentStep >= 2 ? "Diambil" : "Menunggu"}
                    </span>
                  </div>

                  {/* Step 4: Completed */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        activeBooking.status === "Completed"
                          ? "bg-[#276738] text-white shadow-sm ring-4 ring-emerald-100"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {activeBooking.status === "Completed" ? "✓" : "4"}
                    </div>
                    <span className="text-xs font-bold text-gray-900 mt-2">Completed</span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      {activeBooking.status === "Completed" ? "Selesai" : "Menunggu"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2x2 Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f8f9fa] rounded-2xl p-5 border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-2xs text-[#24523b]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block font-medium">Periode Sewa</span>
                    <span className="font-bold text-gray-900 text-sm mt-0.5 block">
                      {activeBooking.period}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-2xs text-[#24523b]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block font-medium">
                      Lokasi Pengambilan
                    </span>
                    <span className="font-bold text-gray-900 text-sm mt-0.5 block">
                      {activeBooking.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-2xs text-[#24523b]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block font-medium">Total Biaya</span>
                    <span className="font-bold text-[#24523b] text-sm mt-0.5 block">
                      Rp {activeBooking.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-2xs text-[#24523b]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block font-medium">
                      Batas Pengembalian
                    </span>
                    <span className="font-bold text-gray-900 text-sm mt-0.5 block">
                      {activeBooking.endDate}, 18:00 WITA
                    </span>
                  </div>
                </div>
              </div>

              {/* Riwayat Status (Vertical Timeline) */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider text-gray-400">
                  Riwayat status
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {activeBooking.timeline.map((tl, idx) => (
                    <div key={idx} className="relative">
                      {/* Node Dot */}
                      <div
                        className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ${
                          tl.done ? "bg-[#276738] ring-2 ring-emerald-100" : "bg-gray-300"
                        }`}
                      />
                      <p
                        className={`text-xs ${
                          tl.done ? "font-bold text-gray-900" : "font-medium text-gray-600"
                        }`}
                      >
                        {tl.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{tl.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Hubungi Admin & Batalkan Booking */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  id="btn-hubungi-admin"
                  onClick={handleContactAdmin}
                  className="w-full sm:w-1/2 py-2.5 px-4 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Hubungi Admin
                </button>

                {activeBooking.status === "Pending" ? (
                  <button
                    type="button"
                    id="btn-batalkan-booking"
                    onClick={() => handleCancelBooking(activeBooking.code)}
                    className="w-full sm:w-1/2 py-2.5 px-4 bg-[#ba2d2d] hover:bg-[#a32222] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Batalkan Booking
                  </button>
                ) : (
                  <span className="w-full sm:w-1/2 text-center text-xs text-gray-400 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    Booking tidak dapat dibatalkan ({activeBooking.status})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function StatusBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat Status Booking...</div>}>
      <StatusPageContent />
    </Suspense>
  );
}
