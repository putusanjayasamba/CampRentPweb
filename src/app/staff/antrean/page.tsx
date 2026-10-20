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
    <div className="p-6 max-w-5xl">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Antrean Hari Ini</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-black text-2xl text-[#1e5c36]">
            {perluDiambil}
          </div>
          <div>
            <p className="text-xs text-gray-500">Perlu Diambil</p>
            <p className="font-bold text-gray-900 text-sm">Pengambilan Hari Ini</p>
          </div>
        </div>

        <div className="bg-white border-2 border-orange-400 rounded-xl p-4 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-black text-2xl text-[#f97316]">
            {perluDikembalikan}
          </div>
          <div>
            <p className="text-xs text-gray-500">Perlu Dikembalikan</p>
            <p className="font-bold text-gray-900 text-sm">Pengembalian Hari Ini</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {(["semua", "pengambilan", "pengembalian"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
              filter === tab
                ? "bg-[#1e5c36] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Jam</th>
              <th className="py-3 px-4">Kode</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Alat</th>
              <th className="py-3 px-4">Jenis</th>
              <th className="py-3 px-4">Status Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <tr key={item.kode} className="hover:bg-gray-50">
                <td className="py-3.5 px-4 font-mono font-bold text-gray-800">{item.jam}</td>
                <td className="py-3.5 px-4 font-bold text-gray-900">{item.kode}</td>
                <td className="py-3.5 px-4 text-gray-700">{item.customer}</td>
                <td className="py-3.5 px-4 text-gray-600">{item.alat}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.jenis === "Pengambilan"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.jenis}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  {item.terlambat ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                      Terlambat
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Tepat Waktu</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
