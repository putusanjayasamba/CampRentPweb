"use client";

import React, { useState } from "react";
import { INITIAL_STAFF_RIWAYAT, RiwayatItem, KondisiFilter } from "@/data/staffData";

function KondisiBadge({ kondisi }: { kondisi: RiwayatItem["kondisi"] }) {
  const styles: Record<RiwayatItem["kondisi"], string> = {
    Baik: "bg-emerald-100 text-emerald-800 border-emerald-300",
    "Rusak Ringan": "bg-orange-100 text-orange-800 border-orange-300",
    "Rusak Berat": "bg-red-100 text-red-800 border-red-300",
    Hilang: "bg-gray-800 text-white border-gray-700",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${styles[kondisi]}`}>
      {kondisi}
    </span>
  );
}

export default function RiwayatPage() {
  const [filter, setFilter] = useState<KondisiFilter>("semua");
  const riwayat = INITIAL_STAFF_RIWAYAT;

  const filtered = riwayat.filter((r) => {
    if (filter === "semua") return true;
    return r.kondisi === filter;
  });

  const filterTabs: KondisiFilter[] = ["semua", "Baik", "Rusak Ringan", "Rusak Berat", "Hilang"];

  return (
    <div className="p-6 max-w-5xl">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Riwayat Pengecekan Fisik</h2>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filterTabs.map((tab) => (
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
              <th className="py-3 px-4">Kode</th>
              <th className="py-3 px-4">Alat</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Kondisi</th>
              <th className="py-3 px-4">Denda</th>
              <th className="py-3 px-4">Diperiksa Oleh</th>
              <th className="py-3 px-4">Tanggal & Jam</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <tr key={item.kode} className="hover:bg-gray-50">
                <td className="py-3.5 px-4 font-bold text-gray-900">{item.kode}</td>
                <td className="py-3.5 px-4 text-gray-800 font-medium">{item.alat}</td>
                <td className="py-3.5 px-4 text-gray-600">{item.customer}</td>
                <td className="py-3.5 px-4">
                  <KondisiBadge kondisi={item.kondisi} />
                </td>
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  {item.denda > 0 ? (
                    <span className="text-red-600">Rp {item.denda.toLocaleString("id-ID")}</span>
                  ) : (
                    <span className="text-gray-400">Rp 0</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-gray-600">{item.diperiksa}</td>
                <td className="py-3.5 px-4 text-gray-400">{item.tanggal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
