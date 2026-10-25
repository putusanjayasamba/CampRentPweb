"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  INITIAL_BOOKINGS,
  BookingRecord,
  getStoredBookings,
  saveStoredBookings,
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

const STEPS = [
  { id: "Pending", number: 1, label: "Pending" },
  { id: "Approved", number: 2, label: "Approved" },
  { id: "Picked Up", number: 3, label: "Picked Up" },
  { id: "Completed", number: 4, label: "Completed" },
];

function getStatusIndex(status: BookingRecord["status"]) {
  switch (status) {
    case "Pending":   return 0;
    case "Approved":  return 1;
    case "Picked Up": return 2;
    case "Completed": return 3;
    default:          return 0;
  }
}

function getStepTimestamp(booking: BookingRecord, stepIndex: number) {
  const item = booking.timeline[stepIndex];
  if (item && item.done) {
    const match = item.detail.match(/^(\d{1,2}\s+[A-Za-z]{3})(?:\s+\d{4})?(?:,\s*(\d{2}:\d{2}))?/);
    if (match) {
      const datePart = match[1];
      const timePart = match[2];
      return timePart ? `${datePart}, ${timePart}` : datePart;
    }
    return item.detail.split("·")[0].trim();
  }
  return "Menunggu";
}

function StatusBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKode = searchParams.get("kode") || INITIAL_BOOKINGS[0].code;

  const [bookingList, setBookingList] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [selectedCode, setSelectedCode] = useState<string>(initialKode);
  // Mobile: show list or detail
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  useEffect(() => {
    setBookingList(getStoredBookings());
  }, []);

  // If there's a kode in URL, go straight to detail on mobile
  useEffect(() => {
    const kode = searchParams.get("kode");
    if (kode) {
      setSelectedCode(kode);
      setMobileView("detail");
    }
  }, [searchParams]);

  const activeBooking = useMemo(
    () => bookingList.find((b) => b.code === selectedCode) || bookingList[0],
    [bookingList, selectedCode]
  );

  const handleSelectBooking = (code: string) => {
    setSelectedCode(code);
    setMobileView("detail");
    const params = new URLSearchParams(searchParams.toString());
    params.set("kode", code);
    router.replace(`/customer/status-booking?${params.toString()}`, { scroll: false });
  };

  const handleContactAdmin = () => {
    const text = encodeURIComponent(
      `Halo Admin CampRent, saya ingin bertanya terkait pesanan booking saya (${activeBooking.code} - ${activeBooking.items}).`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  const handleCancelBooking = (code: string) => {
    if (activeBooking.status === "Cancelled") {
      alert(`Booking ${code} sudah dibatalkan sebelumnya.`);
      return;
    }
    if (activeBooking.status !== "Pending") {
      alert(
        `Booking ${code} berstatus "${activeBooking.status}" dan tidak dapat dibatalkan secara langsung melalui web. Silakan hubungi admin CampRent untuk bantuan pembatalan.`
      );
      return;
    }

    if (confirm(`Apakah Anda yakin ingin membatalkan booking ${code}?`)) {
      const updated = bookingList.map((b) =>
        b.code === code
          ? {
              ...b,
              status: "Cancelled" as const,
              timeline: [
                ...b.timeline,
                {
                  title: "Booking dibatalkan",
                  detail: "Dibatalkan oleh customer",
                  done: true,
                },
              ],
            }
          : b
      );
      setBookingList(updated);
      saveStoredBookings(updated);
      alert(`Booking ${code} telah berhasil dibatalkan.`);
    }
  };

  const currentStepIdx = getStatusIndex(activeBooking.status);

  // ── DETAIL PANEL (shared between mobile and desktop) ──
  const DetailPanel = () => (
    <div className="flex-1 w-full bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-8 md:p-10 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {activeBooking.code}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {activeBooking.detailItems || activeBooking.items}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${getStatusBadge(activeBooking.status)}`}
        >
          {activeBooking.status}
        </span>
      </div>

      {/* Stepper */}
      <div className="my-8 relative">
        <div className="absolute top-4 left-[12.5%] right-[12.5%] h-[1.5px] bg-gray-200 z-0" />
        <div className="relative z-10 grid grid-cols-4 text-center">
          {STEPS.map((step, idx) => {
            const isCurrent  = idx === currentStepIdx && activeBooking.status !== "Cancelled";
            const isCompleted= idx < currentStepIdx  && activeBooking.status !== "Cancelled";
            const timestamp  = getStepTimestamp(activeBooking, idx);
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent || isCompleted
                        ? "bg-[#e07a2c] text-white shadow-xs"
                        : "bg-white border border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.number}
                  </div>
                </div>
                <span
                  className={`mt-2 text-[10px] sm:text-xs ${
                    isCurrent || isCompleted
                      ? "font-bold text-gray-900"
                      : "font-semibold text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
                <span className="mt-0.5 text-[10px] sm:text-xs text-gray-400">
                  {timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-y-5 gap-x-6 my-6 pt-2 border-t border-gray-100">
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-1">Ambil</p>
          <p className="text-sm sm:text-base font-bold text-gray-900">{activeBooking.startDate}</p>
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-1">Kembali</p>
          <p className="text-sm sm:text-base font-bold text-gray-900">{activeBooking.endDate}</p>
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-1">Lokasi</p>
          <p className="text-xs sm:text-sm font-bold text-gray-900">{activeBooking.location}</p>
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-1">Total bayar</p>
          <p className="text-sm sm:text-base font-bold text-[#1b4332]">
            Rp {activeBooking.total.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Riwayat Status */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4">Riwayat status</h3>
        <div className="relative pl-6 space-y-5">
          <div className="absolute left-[3.5px] top-2 bottom-2 w-[1.5px] bg-gray-200" />
          {activeBooking.timeline.map((item, idx) => (
            <div key={idx} className="relative flex items-start gap-3">
              <span
                className={`absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                  item.done ? "bg-[#1b4332]" : "bg-gray-300"
                }`}
              />
              <div>
                <p className={`text-xs sm:text-sm ${item.done ? "font-bold text-gray-900" : "font-semibold text-gray-500"}`}>
                  {item.title}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleContactAdmin}
          className="w-full sm:flex-1 py-3 px-6 rounded-xl border border-[#1b4332] text-[#1b4332] hover:bg-emerald-50/50 font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-center"
        >
          Hubungi Admin
        </button>
        <button
          type="button"
          onClick={() => handleCancelBooking(activeBooking.code)}
          className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-[#b83828] hover:bg-[#a53022] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-center shadow-xs"
        >
          Batalkan
        </button>
      </div>
    </div>
  );

  // ── BOOKING LIST CARDS (shared) ──
  const BookingListCards = ({ onSelect }: { onSelect?: (code: string) => void }) => (
    <div className="space-y-3">
      {bookingList.map((b) => {
        const isSelected = b.code === activeBooking.code;
        return (
          <button
            key={b.code}
            type="button"
            onClick={() => onSelect ? onSelect(b.code) : handleSelectBooking(b.code)}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              isSelected
                ? "border-2 border-[#2d6a4f] bg-white shadow-xs"
                : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-gray-900 text-sm tracking-tight">{b.code}</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(b.status)}`}>
                  {b.status}
                </span>
                {/* Show chevron only on mobile */}
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 lg:hidden" />
              </div>
            </div>
            <p className="text-xs text-gray-500 truncate">{b.shortItems || b.items}</p>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fbfbfa]">

      {/* ── MOBILE LAYOUT (hidden on lg+) ── */}
      <div className="lg:hidden">
        {mobileView === "list" ? (
          /* Mobile: Booking List */
          <div className="px-4 py-6">
            <div className="mb-5">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Status Booking</h1>
              <p className="text-xs text-gray-500 mt-0.5">Pilih booking untuk melihat detail</p>
            </div>
            <BookingListCards onSelect={(code) => handleSelectBooking(code)} />
          </div>
        ) : (
          /* Mobile: Booking Detail */
          <div className="flex flex-col h-full">
            {/* Back button */}
            <div className="px-4 pt-4 pb-2">
              <button
                type="button"
                onClick={() => setMobileView("list")}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#2d6a4f] cursor-pointer hover:opacity-80"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                Semua Booking
              </button>
            </div>

            <div className="px-4 pb-6">
              <DetailPanel />
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP LAYOUT (hidden on mobile, shown on lg+) ── */}
      <div className="hidden lg:block py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Status Booking</h1>
          </div>
          <div className="flex flex-row items-start gap-6">
            {/* Left Sidebar */}
            <div className="w-72 xl:w-80 shrink-0">
              <BookingListCards />
            </div>
            {/* Right Detail */}
            <DetailPanel />
          </div>
        </div>
      </div>

    </div>
  );
}

export default function CustomerStatusBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-gray-500">
          Memuat status booking...
        </div>
      }
    >
      <StatusBookingContent />
    </Suspense>
  );
}
