"use client";

import React, { useState } from "react";
import {
  INITIAL_STAFF_BOOKINGS,
  BookingOps,
} from "@/data/staffData";

// Panel Cek Kondisi Fisik
interface ConditionPanelProps {
  booking: BookingOps;
  onSave: (data: { kondisi: string; denda: number; catatan: string }) => void;
}

function ConditionPanel({ booking, onSave }: ConditionPanelProps) {
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
    "Baik",
    "Rusak Ringan",
    "Rusak Berat",
    "Hilang",
  ];

  const handleSave = () => {
    onSave({ kondisi, denda: dendaFinal, catatan });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 text-sm overflow-y-auto max-h-[calc(100vh-140px)] shadow-xs">
      <div>
        <h3 className="font-bold text-gray-900 text-base">
          Cek Kondisi Fisik - {booking.kode}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">{booking.alat} - {booking.customer}</p>
      </div>

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
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={kelengkapan}
            onChange={(e) => setKelengkapan(e.target.checked)}
            className="w-4 h-4 rounded text-[#1e5c36] accent-[#1e5c36]"
          />
          Kelengkapan aksesoris
        </label>
        <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={tidakSobekan}
            onChange={(e) => setTidakSobekan(e.target.checked)}
            className="w-4 h-4 rounded text-[#1e5c36] accent-[#1e5c36]"
          />
          Tidak ada sobekan
        </label>
        <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={bersihKering}
            onChange={(e) => setBersihKering(e.target.checked)}
            className="w-4 h-4 rounded text-[#1e5c36] accent-[#1e5c36]"
          />
          Bersih dan kering
        </label>
      </div>

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
          <span className="text-xs text-gray-400">= {jamTerlambat * 10}% dari biaya sewa</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs border border-gray-100">
        <div className="flex justify-between text-gray-600">
          <span>Estimasi nilai alat</span>
          <span className="font-semibold text-gray-800">Rp {estimasiNilai.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Denda kerusakan ({kondisi})</span>
          <span className="font-semibold text-red-600">Rp {dendaKerusakan.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Total harga sewa booking</span>
          <span className="font-semibold text-gray-800">Rp {totalSewa.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Denda keterlambatan ({jamTerlambat} jam)</span>
          <span className="font-semibold text-red-600">Rp {dendaKeterlambatan.toLocaleString("id-ID")}</span>
        </div>
        <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900">
          <span>Total denda otomatis</span>
          <span className="text-red-600">Rp {totalDendaOtomatis.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1.5">Catatan petugas</p>
        <textarea
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Tambahkan catatan kondisi fisik..."
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#1e5c36] resize-none"
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1.5">Denda final (Rp) - bisa disesuaikan</p>
        <input
          type="number"
          value={dendaFinal}
          onChange={(e) => setDendaFinal(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-bold focus:outline-none focus:border-[#1e5c36]"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
          saved
            ? "bg-emerald-700 text-white"
            : "bg-[#1e5c36] hover:bg-[#164327] text-white"
        }`}
      >
        {saved ? "✓ Berhasil Disimpan!" : "Simpan Hasil Pengecekan"}
      </button>
    </div>
  );
}

export default function PengambilanPengembalianPage() {
  const [bookings, setBookings] = useState<BookingOps[]>(INITIAL_STAFF_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<BookingOps | null>(INITIAL_STAFF_BOOKINGS[1]);

  const handleSaveCondition = (data: { kondisi: string; denda: number; catatan: string }) => {
    if (!selectedBooking) return;
    setBookings((prev) =>
      prev.map((b) => (b.kode === selectedBooking.kode ? { ...b, status: "Completed" } : b))
    );
    setSelectedBooking(null);
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* Table Side */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Kelola Status Pesanan</h2>

        {/* Status Flow Indicator */}
        <div className="flex items-center gap-2 mb-5 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200">
            Approved
          </span>
          <span className="text-gray-400">→</span>
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold border border-orange-200">
            Picked Up
          </span>
          <span className="text-gray-400">→</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold border border-gray-200">
            Completed
          </span>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Kode</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Alat</th>
                  <th className="py-3 px-4">Jadwal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr
                    key={b.kode}
                    onClick={() => b.status === "Picked Up" && setSelectedBooking(b)}
                    className={`transition-colors cursor-pointer ${
                      selectedBooking?.kode === b.kode
                        ? "bg-emerald-50/70"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-gray-900">{b.kode}</td>
                    <td className="py-3.5 px-4 text-gray-700">{b.customer}</td>
                    <td className="py-3.5 px-4 text-gray-600">{b.alat}</td>
                    <td className="py-3.5 px-4 text-gray-500">{b.jadwal}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : b.status === "Picked Up"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {b.status === "Approved" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookings((prev) =>
                              prev.map((item) =>
                                item.kode === b.kode ? { ...item, status: "Picked Up" } : item
                              )
                            );
                          }}
                          className="px-3 py-1 rounded-lg bg-[#1e5c36] text-white text-[10px] font-bold hover:bg-[#164327] transition-all cursor-pointer"
                        >
                          Verifikasi Pengambilan
                        </button>
                      )}
                      {b.status === "Picked Up" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(b);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#f97316] text-white text-[10px] font-bold hover:bg-[#ea580c] transition-all cursor-pointer"
                        >
                          Terima Pengembalian
                        </button>
                      )}
                      {b.status === "Completed" && (
                        <span className="text-gray-400 text-xs">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Side: Condition Inspection Panel */}
      <div className="w-full lg:w-80 shrink-0">
        {selectedBooking ? (
          <ConditionPanel
            key={selectedBooking.kode}
            booking={selectedBooking}
            onSave={handleSaveCondition}
          />
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-xs text-gray-400">
            <p>Pilih booking dengan status <strong>Picked Up</strong> untuk melakukan cek kondisi fisik dan denda pengembalian.</p>
          </div>
        )}
      </div>
    </div>
  );
}
