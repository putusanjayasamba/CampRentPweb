"use client";

import React, { useState } from "react";
import { INITIAL_STAFF_ANTREAN, AntreanItem } from "@/data/staffData";

export default function AntreanPage() {
  const [filter, setFilter] = useState<"semua" | "pengambilan" | "pengembalian">("semua");
  const antrean = INITIAL_STAFF_ANTREAN;

  const perluDiambil = antrean.filter((a) => a.jenis === "Pengambilan").length;
  const perluDikembalikan = antrean.filter((a) => a.jenis === "Pengembalian").length;

  const filtered = antrean.filter((a) => {
    if (filter === "semua") return true;
    if (filter === "pengambilan") return a.jenis === "Pengambilan";
    return a.jenis === "Pengembalian";
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Perlu Diambil */}
        <div className="bg-white border-l-4 border-[#1e5c36] rounded-xl p-5 shadow-xs">
          <p className="text-xs text-gray-500 mb-1">Perlu Diambil Hari Ini</p>
          <p className="text-3xl font-black text-gray-900">{perluDiambil}</p>
        </div>

        {/* Perlu Dikembalikan */}
        <div className="bg-white border-l-4 border-orange-400 rounded-xl p-5 shadow-xs">
          <p className="text-xs text-gray-500 mb-1">Perlu Dikembalikan Hari Ini</p>
          <p className="text-3xl font-black text-gray-900">{perluDikembalikan}</p>
        </div>
      </div>

      {/* Heading + Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Daftar Antrean · 28 Sep 2026</h2>

        <div className="flex gap-2">
          {([
            { key: "semua" as const, label: "Semua" },
            { key: "pengambilan" as const, label: "Pengambilan" },
            { key: "pengembalian" as const, label: "Pengembalian" },
          ]).map(({ key, label }) => (
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
      </div>

      {/* Table */}
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
                      className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors cursor-pointer ${
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
