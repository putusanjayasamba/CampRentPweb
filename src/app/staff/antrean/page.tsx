"use client";

import React, { useState } from "react";
import { INITIAL_STAFF_ANTREAN, AntreanItem } from "@/data/staffData";

// Tanggal hari ini format: "28 Sep 2026"
function formatTanggal(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Toast notifikasi sukses
function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-[#1e5c36] text-white text-xs font-semibold px-5 py-3 rounded-full shadow-xl">
      <span className="text-base">&#10003;</span>
      {message}
    </div>
  );
}

// Kartu antrean untuk tampilan mobile
function AntreanCard({
  item,
  onAksi,
}: {
  item: AntreanItem;
  onAksi: (item: AntreanItem) => void;
}) {
  const isAmbil = item.jenis === "Pengambilan";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-1.5">
        <p className="font-bold text-gray-900 text-sm">{item.kode}</p>
        <div className="flex items-center gap-1.5">
          {item.terlambat && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
              Terlambat
            </span>
          )}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              item.terlambat ? "text-red-600" : "text-gray-600"
            }`}
          >
            {item.jam}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        {item.alat} &middot; {item.customer}
      </p>
      <button
        type="button"
        onClick={() => onAksi(item)}
        className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer active:scale-95 ${
          isAmbil
            ? "bg-[#1e5c36] hover:bg-[#164327]"
            : "bg-[#f97316] hover:bg-[#ea580c]"
        }`}
      >
        {isAmbil ? "Verifikasi Pengambilan" : "Proses Pengembalian"}
      </button>
    </div>
  );
}

export default function AntreanPage() {
  const [antrean, setAntrean] = useState<AntreanItem[]>(INITIAL_STAFF_ANTREAN);
  const [filter, setFilter] = useState<"semua" | "pengambilan" | "pengembalian">("semua");
  const [toast, setToast] = useState<string | null>(null);

  const today = new Date();
  const tanggalStr = formatTanggal(today);

  const perluDiambil = antrean.filter((a) => a.jenis === "Pengambilan").length;
  const perluDikembalikan = antrean.filter((a) => a.jenis === "Pengembalian").length;

  const filtered = antrean.filter((a) => {
    if (filter === "semua") return true;
    if (filter === "pengambilan") return a.jenis === "Pengambilan";
    return a.jenis === "Pengembalian";
  });

  const filterOptions = [
    { key: "semua" as const, label: "Semua" },
    { key: "pengambilan" as const, label: "Pengambilan" },
    { key: "pengembalian" as const, label: "Pengembalian" },
  ];

  const handleAksi = (item: AntreanItem) => {
    setAntrean((prev) => prev.filter((a) => a.kode !== item.kode));
    const pesan =
      item.jenis === "Pengambilan"
        ? `${item.kode} - Pengambilan diverifikasi`
        : `${item.kode} - Pengembalian diproses`;
    setToast(pesan);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Perlu Diambil */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-[#1e5c36]">
          <p className="text-xs text-gray-500 mb-1">Perlu Diambil Hari Ini</p>
          <p className="text-3xl font-black text-gray-900">{perluDiambil}</p>
        </div>
        {/* Perlu Dikembalikan */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-orange-400">
          <p className="text-xs text-gray-500 mb-1">Perlu Dikembalikan Hari Ini</p>
          <p className="text-3xl font-black text-gray-900">{perluDikembalikan}</p>
        </div>
      </div>

      {/* Mobile: Filter Tabs */}
      <div className="flex gap-2 flex-wrap lg:hidden">
        {filterOptions.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === key
                ? "bg-[#1b4332] text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mobile: Kartu */}
      <div className="flex flex-col gap-3 lg:hidden">
        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-xs text-gray-400">
            Semua antrean sudah diproses.
          </div>
        ) : (
          filtered.map((item) => (
            <AntreanCard key={item.kode} item={item} onAksi={handleAksi} />
          ))
        )}
      </div>

      {/* Desktop: Tabel */}
      <div className="hidden lg:block space-y-4">
        {/* Judul + Filter sejajar */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            Daftar Antrean &middot; {tanggalStr}
          </h2>
          <div className="flex gap-2">
            {filterOptions.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === key
                    ? "bg-[#1b4332] text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] text-gray-500 text-xs font-medium border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">Kode</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Alat</th>
                  <th className="py-3.5 px-4">Jenis</th>
                  <th className="py-3.5 px-4">Jam</th>
                  <th className="py-3.5 px-5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.kode} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-5 font-bold text-gray-900">{item.kode}</td>
                    <td className="py-4 px-4 text-gray-800">{item.customer}</td>
                    <td className="py-4 px-4 text-gray-600">{item.alat}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.jenis === "Pengambilan"
                            ? "bg-[#e0f2e9] text-[#1e5c36]"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {item.jenis}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-700 font-medium">{item.jam}</span>
                        {item.terlambat && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                            Terlambat
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <button
                        type="button"
                        onClick={() => handleAksi(item)}
                        className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors cursor-pointer active:scale-95 ${
                          item.jenis === "Pengambilan"
                            ? "bg-[#1e5c36] hover:bg-[#164327]"
                            : "bg-[#f97316] hover:bg-[#ea580c]"
                        }`}
                      >
                        {item.jenis === "Pengambilan" ? "Verifikasi Pengambilan" : "Proses Pengembalian"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-gray-400">
                      Semua antrean sudah diproses.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} />}
    </div>
  );
}
