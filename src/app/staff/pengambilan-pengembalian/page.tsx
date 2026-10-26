"use client";

import React, { useState } from "react";
import { INITIAL_STAFF_BOOKINGS, BookingOps } from "@/data/staffData";

// Panel Cek Kondisi Fisik (Pengembalian)
interface ConditionPanelProps {
  booking: BookingOps;
  onSave: (data: { kondisi: string; denda: number; catatan: string }) => void;
  onClose?: () => void;
}

function ConditionPanel({ booking, onSave, onClose }: ConditionPanelProps) {
  const [kondisi, setKondisi] = useState<"Baik" | "Rusak Ringan" | "Rusak Berat" | "Hilang">("Rusak Ringan");
  const [kelengkapan, setKelengkapan] = useState(true);
  const [tidakSobekan, setTidakSobekan] = useState(true);
  const [bersihKering, setBersihKering] = useState(false);
  const [jamTerlambat, setJamTerlambat] = useState(1);
  const [catatan, setCatatan] = useState("");
  const [saved, setSaved] = useState(false);

  const estimasiNilai = booking.estimasiNilai;
  const totalSewa = booking.totalSewa;

  const dendaKerusakan = (() => {
    if (kondisi === "Rusak Ringan") return Math.round(estimasiNilai * 0.2);
    if (kondisi === "Rusak Berat") return Math.round(estimasiNilai * 0.5);
    if (kondisi === "Hilang") return estimasiNilai;
    return 0;
  })();

  const dendaKeterlambatan = jamTerlambat > 0 ? Math.round(totalSewa * 0.1 * jamTerlambat) : 0;
  const totalDendaOtomatis = dendaKerusakan + dendaKeterlambatan;
  const [dendaFinal, setDendaFinal] = useState<number>(totalDendaOtomatis);

  React.useEffect(() => {
    setDendaFinal(totalDendaOtomatis);
  }, [totalDendaOtomatis]);

  const kondisiOptions: Array<"Baik" | "Rusak Ringan" | "Rusak Berat" | "Hilang"> = [
    "Baik", "Rusak Ringan", "Rusak Berat", "Hilang",
  ];

  const handleSave = () => {
    onSave({ kondisi, denda: dendaFinal, catatan });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl text-sm flex flex-col h-full">
      {/* Header sticky */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 shrink-0">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">
            Cek Kondisi Fisik · {booking.kode}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {booking.alat} · {booking.customer}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel"
            className="ml-2 mt-0.5 w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer lg:hidden"
          >
            ✕
          </button>
        )}
      </div>
      {/* Body scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

      {/* Kondisi Alat */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-2">Kondisi alat</p>
        <div className="flex flex-wrap gap-2">
          {kondisiOptions.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKondisi(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                kondisi === k
                  ? k === "Baik"
                    ? "bg-[#1e5c36] text-white border-[#1e5c36]"
                    : k === "Rusak Ringan"
                    ? "bg-orange-100 text-orange-700 border-orange-400"
                    : k === "Rusak Berat"
                    ? "bg-red-100 text-red-700 border-red-400"
                    : "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Kondisi */}
      <div className="space-y-2">
        {[
          { label: "Kelengkapan aksesoris", state: kelengkapan, setter: setKelengkapan },
          { label: "Tidak ada sobekan", state: tidakSobekan, setter: setTidakSobekan },
          { label: "Bersih dan kering", state: bersihKering, setter: setBersihKering },
        ].map(({ label, state, setter }) => (
          <label key={label} className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={state}
              onChange={(e) => setter(e.target.checked)}
              className="w-4 h-4 rounded accent-[#1e5c36]"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Jam Keterlambatan */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1.5">Jam keterlambatan pengembalian</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setJamTerlambat(Math.max(0, jamTerlambat - 1))}
            className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer font-bold text-base"
          >
            -
          </button>
          <span className="font-bold text-gray-900 w-6 text-center">{jamTerlambat}</span>
          <button
            type="button"
            onClick={() => setJamTerlambat(jamTerlambat + 1)}
            className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer font-bold text-base"
          >
            +
          </button>
          <span className="text-xs text-gray-400">(0 = tepat waktu)</span>
        </div>
      </div>

      {/* Rincian Denda */}
      <div className="bg-gray-50 rounded-xl p-3.5 space-y-1.5 text-xs border border-gray-100">
        <div className="flex justify-between text-gray-600">
          <span>Estimasi nilai alat</span>
          <span className="font-semibold text-gray-800">Rp {estimasiNilai.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Denda kerusakan ({kondisi}, {kondisi === "Rusak Ringan" ? "20%" : kondisi === "Rusak Berat" ? "50%" : kondisi === "Hilang" ? "100%" : "0%"})</span>
          <span className="font-semibold text-red-600">Rp {dendaKerusakan.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Total harga sewa booking</span>
          <span className="font-semibold text-gray-800">Rp {totalSewa.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Denda keterlambatan ({jamTerlambat} jam × 10%)</span>
          <span className="font-semibold text-red-600">Rp {dendaKeterlambatan.toLocaleString("id-ID")}</span>
        </div>
        <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900">
          <span>Total denda otomatis</span>
          <span className="text-red-600">Rp {totalDendaOtomatis.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* Skema Info */}
      <p className="text-[10px] text-gray-400 leading-relaxed">
        Skema: Baik 0% · Rusak Ringan 20% · Rusak Berat 50% · Hilang 100% dari nilai alat.
        Keterlambatan 10% dari total sewa per jam.
      </p>

      {/* Catatan Petugas */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1.5">Catatan petugas</p>
        <textarea
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Catatan petugas..."
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#1e5c36] resize-none"
        />
      </div>

      {/* Denda Final */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1.5">Denda final (Rp) — bisa disesuaikan</p>
        <input
          type="number"
          value={dendaFinal}
          onChange={(e) => setDendaFinal(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#1e5c36]"
        />
      </div>
      </div>{/* end body */}

      {/* Footer sticky – tombol simpan */}
      <div className="px-5 pb-5 pt-3 shrink-0 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSave}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            saved
              ? "bg-emerald-700 text-white"
              : "bg-[#1e5c36] hover:bg-[#164327] text-white"
          }`}
        >
          {saved ? "✓ Berhasil Disimpan!" : "Simpan & Tandai Completed"}
        </button>
      </div>
    </div>
  );
}

// Kartu booking untuk tampilan mobile
function BookingCard({
  booking,
  isSelected,
  onVerifikasiPengambilan,
  onTerimaKembali,
}: {
  booking: BookingOps;
  isSelected: boolean;
  onVerifikasiPengambilan: () => void;
  onTerimaKembali: () => void;
}) {
  const statusColor =
    booking.status === "Approved"
      ? "bg-[#e0f2e9] text-[#1e5c36] border-[#a7e0bf]"
      : booking.status === "Picked Up"
      ? "bg-orange-50 text-orange-600 border-orange-200"
      : "bg-gray-100 text-gray-500 border-gray-200";

  return (
    <div
      className={`bg-white rounded-xl border transition-all ${
        isSelected
          ? "border-[#1e5c36] shadow-md shadow-emerald-100"
          : "border-gray-200"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm">{booking.kode}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {booking.alat} · {booking.customer}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{booking.jadwal}</p>
          </div>
          <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
            {booking.status}
          </span>
        </div>

        {booking.status === "Approved" && (
          <button
            type="button"
            onClick={onVerifikasiPengambilan}
            className="mt-3 w-full py-2.5 rounded-xl bg-[#1e5c36] hover:bg-[#164327] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Verifikasi Pengambilan
          </button>
        )}
        {booking.status === "Picked Up" && (
          <button
            type="button"
            onClick={onTerimaKembali}
            className="mt-3 w-full py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Terima Pengembalian
          </button>
        )}
      </div>
    </div>
  );
}

export default function PengambilanPengembalianPage() {
  const [bookings, setBookings] = useState<BookingOps[]>(INITIAL_STAFF_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<BookingOps | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const handleSaveCondition = (data: { kondisi: string; denda: number; catatan: string }) => {
    if (!selectedBooking) return;
    setBookings((prev) =>
      prev.map((b) => (b.kode === selectedBooking.kode ? { ...b, status: "Completed" } : b))
    );
    setSelectedBooking(null);
    setMobileSheetOpen(false);
  };

  const handleTerimaKembali = (booking: BookingOps) => {
    setSelectedBooking(booking);
    setMobileSheetOpen(true);
  };

  const handleVerifikasiPengambilan = (kode: string) => {
    setBookings((prev) =>
      prev.map((item) => (item.kode === kode ? { ...item, status: "Picked Up" } : item))
    );
  };

  const handleClosePanel = () => {
    setSelectedBooking(null);
    setMobileSheetOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* ======== Kiri: Header + Daftar ======== */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Status Pesanan</h2>

          {/* Status flow pills */}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#e0f2e9] text-[#1e5c36] font-semibold border border-[#a7e0bf]">
              Approved
            </span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-semibold border border-orange-200">
              Picked Up
            </span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-semibold border border-gray-200">
              Completed
            </span>
          </div>
        </div>

        {/* ---- Mobile: Kartu (hidden di lg ke atas) ---- */}
        <div className="flex flex-col gap-3 lg:hidden">
          {bookings.map((b) => (
            <BookingCard
              key={b.kode}
              booking={b}
              isSelected={selectedBooking?.kode === b.kode}
              onVerifikasiPengambilan={() => handleVerifikasiPengambilan(b.kode)}
              onTerimaKembali={() => handleTerimaKembali(b)}
            />
          ))}
        </div>

        {/* ---- Desktop: Tabel (hidden di bawah lg) ---- */}
        <div className="hidden lg:block bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] text-gray-500 text-xs font-medium border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">Kode</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Alat</th>
                  <th className="py-3.5 px-4">Jadwal</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr
                    key={b.kode}
                    className={`transition-colors ${
                      selectedBooking?.kode === b.kode
                        ? "bg-emerald-50/60"
                        : "hover:bg-gray-50/60"
                    }`}
                  >
                    <td className="py-4 px-5 font-bold text-gray-900">{b.kode}</td>
                    <td className="py-4 px-4 text-gray-800">{b.customer}</td>
                    <td className="py-4 px-4 text-gray-600">{b.alat}</td>
                    <td className="py-4 px-4 text-gray-500">{b.jadwal}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.status === "Approved"
                            ? "bg-[#e0f2e9] text-[#1e5c36]"
                            : b.status === "Picked Up"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {b.status === "Approved" && (
                        <button
                          type="button"
                          onClick={() => handleVerifikasiPengambilan(b.kode)}
                          className="px-3 py-1.5 rounded-lg bg-[#1e5c36] hover:bg-[#164327] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Verifikasi Pengambilan
                        </button>
                      )}
                      {b.status === "Picked Up" && (
                        <button
                          type="button"
                          onClick={() => handleTerimaKembali(b)}
                          className="px-3 py-1.5 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Terima Pengembalian
                        </button>
                      )}
                      {b.status === "Completed" && (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======== Kanan: Panel Kondisi – hanya desktop ======== */}
      <div
        className="hidden lg:flex w-80 shrink-0 flex-col"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {selectedBooking ? (
          <ConditionPanel
            key={selectedBooking.kode}
            booking={selectedBooking}
            onSave={handleSaveCondition}
          />
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-xs text-gray-400 flex-1 flex items-center justify-center">
            <p>
              Pilih booking dengan status <strong>Picked Up</strong> untuk melakukan cek kondisi fisik
              dan denda pengembalian.
            </p>
          </div>
        )}
      </div>

      {/* ======== Mobile: Bottom Sheet Overlay ======== */}
      {mobileSheetOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClosePanel}
          />
          {/* Sheet */}
          <div
            className="relative bg-white rounded-t-2xl shadow-2xl flex flex-col"
            style={{ maxHeight: "90dvh" }}
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <ConditionPanel
              key={selectedBooking.kode}
              booking={selectedBooking}
              onSave={handleSaveCondition}
              onClose={handleClosePanel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
