"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Eye } from "lucide-react";
import { useCurrentUser } from "@/data/auth";
import {
  BookingRecord,
  useStoredBookings,
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

// ── DETAIL PANEL COMPONENT ──
interface DetailPanelProps {
  activeBooking: BookingRecord;
  currentStepIdx: number;
  onContactAdmin: () => void;
  onCancelBooking: (code: string) => void;
}

function DetailPanel({
  activeBooking,
  currentStepIdx,
  onContactAdmin,
  onCancelBooking,
}: DetailPanelProps) {
  return (
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
                <div className="mt-2 text-xs font-semibold text-gray-800">
                  {step.label}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {timestamp}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta Grid */}
      <div className="bg-[#fcfbf9] rounded-xl p-5 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-gray-400 block text-[11px] font-normal">Periode Sewa</span>
          <span className="font-semibold text-gray-800 mt-0.5 block">{activeBooking.period}</span>
        </div>
        <div>
          <span className="text-gray-400 block text-[11px] font-normal">Total Biaya</span>
          <span className="font-bold text-gray-900 mt-0.5 block text-sm">
            Rp {activeBooking.total.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="sm:col-span-2">
          <span className="text-gray-400 block text-[11px] font-normal">Lokasi Pengambilan &amp; Pengembalian</span>
          <span className="font-medium text-gray-800 mt-0.5 block">{activeBooking.location}</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="mt-8">
        <h3 className="font-bold text-sm text-gray-900 mb-4">Aktivitas Booking</h3>
        <div className="space-y-4">
          {activeBooking.timeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div
                className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                  item.done ? "bg-[#2d6a4f]" : "bg-gray-300"
                }`}
              />
              <div>
                <p className={`font-semibold ${item.done ? "text-gray-900" : "text-gray-400"}`}>
                  {item.title}
                </p>
                <p className="text-gray-400 text-[11px] mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onContactAdmin}
          className="w-full sm:flex-1 py-3 px-6 rounded-xl border border-[#1b4332] text-[#1b4332] hover:bg-emerald-50/50 font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-center"
        >
          Hubungi Admin
        </button>
        <button
          type="button"
          onClick={() => onCancelBooking(activeBooking.code)}
          className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-[#b83828] hover:bg-[#a53022] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-center shadow-xs"
        >
          Batalkan
        </button>
      </div>
    </div>
  );
}

// ── BOOKING LIST CARDS COMPONENT ──
interface BookingListCardsProps {
  bookingList: BookingRecord[];
  activeCode: string;
  onSelect: (code: string) => void;
}

function BookingListCards({ bookingList, activeCode, onSelect }: BookingListCardsProps) {
  return (
    <div className="space-y-3">
      {bookingList.map((b) => {
        const isSelected = b.code === activeCode;
        return (
          <button
            key={b.code}
            type="button"
            onClick={() => onSelect(b.code)}
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
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 lg:hidden" />
              </div>
            </div>
            <p className="text-xs text-gray-500 truncate">{b.shortItems || b.items}</p>
          </button>
        );
      })}
    </div>
  );
}

function StatusBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingList = useStoredBookings();
  const currentUser = useCurrentUser();
  const isGuest = currentUser?.role === "guest" || !!currentUser?.isGuest;

  const urlKode = searchParams.get("kode");
  const [userSelectedCode, setUserSelectedCode] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "detail">(urlKode ? "detail" : "list");

  const selectedCode = userSelectedCode || urlKode || bookingList[0]?.code || "";
  const activeBooking = useMemo(
    () => bookingList.find((b) => b.code === selectedCode) || bookingList[0],
    [bookingList, selectedCode]
  );

  const handleSelectBooking = (code: string) => {
    setUserSelectedCode(code);
    setMobileView("detail");
    const params = new URLSearchParams(searchParams.toString());
    params.set("kode", code);
    router.replace(`/customer/status-booking?${params.toString()}`, { scroll: false });
  };

  const handleContactAdmin = () => {
    if (!activeBooking) return;
    const text = encodeURIComponent(
      `Halo Admin CampRent, saya ingin bertanya terkait pesanan booking saya (${activeBooking.code} - ${activeBooking.items}).`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  const handleCancelBooking = (code: string) => {
    if (!activeBooking) return;
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
      saveStoredBookings(updated);
      alert(`Booking ${code} telah berhasil dibatalkan.`);
    }
  };

  const currentStepIdx = activeBooking ? getStatusIndex(activeBooking.status) : 0;

  if (isGuest) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#fbfbfa] py-8 sm:py-16 px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Eye className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Mode Tamu (Hanya Lihat)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">
            Status booking real-time hanya dapat dipantau oleh akun yang melakukan pemesanan. Silakan masuk atau daftar akun Anda untuk menyewa alat camping.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => router.push("/login?reason=guest_auth")}
              className="px-5 py-2.5 bg-[#1b4332] hover:bg-[#143326] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Login Akun Sekarang
            </button>
            <button
              type="button"
              onClick={() => router.push("/customer/katalog")}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Lihat Katalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeBooking) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#fbfbfa] p-10 text-center text-gray-500">
        Belum ada data booking.
      </div>
    );
  }

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
            <BookingListCards
              bookingList={bookingList}
              activeCode={activeBooking.code}
              onSelect={handleSelectBooking}
            />
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
              <DetailPanel
                activeBooking={activeBooking}
                currentStepIdx={currentStepIdx}
                onContactAdmin={handleContactAdmin}
                onCancelBooking={handleCancelBooking}
              />
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
              <BookingListCards
                bookingList={bookingList}
                activeCode={activeBooking.code}
                onSelect={handleSelectBooking}
              />
            </div>
            {/* Right Detail */}
            <DetailPanel
              activeBooking={activeBooking}
              currentStepIdx={currentStepIdx}
              onContactAdmin={handleContactAdmin}
              onCancelBooking={handleCancelBooking}
            />
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
