"use client";

import React, { useState } from "react";
import { INITIAL_STAFF_RIWAYAT, RiwayatItem, KondisiFilter } from "@/data/staffData";

function KondisiBadge({ kondisi }: { kondisi: RiwayatItem["kondisi"] }) {
  const styles: Record<RiwayatItem["kondisi"], string> = {
    Baik: "bg-[#e0f2e9] text-[#1e5c36]",
    "Rusak Ringan": "bg-orange-50 text-orange-600",
    "Rusak Berat": "bg-red-50 text-red-600",
    Hilang: "bg-gray-800 text-white",
  };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${styles[kondisi]}`}>
      {kondisi}
    </span>
  );
}

// Kartu riwayat untuk tampilan mobile
function RiwayatCard({ item }: { item: RiwayatItem }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="font-bold text-gray-900 text-sm">{item.kode}</p>
        <KondisiBadge kondisi={item.kondisi} />
      </div>
      <p className="text-xs text-gray-500 mb-1">
        {item.alat} &middot; {item.customer}
      </p>
      <p className="text-xs text-gray-400">
        Denda{" "}
        <span className={item.denda > 0 ? "font-semibold text-gray-700" : ""}>
          Rp {item.denda.toLocaleString("id-ID")}
        </span>
        {" \u00b7 "}
        {item.tanggal.split(",")[0]}
      </p>
    </div>
  );
}

export default function RiwayatPage() {
  const [filter, setFilter] = useState<KondisiFilter>("semua");
  const riwayat = INITIAL_STAFF_RIWAYAT;

  const filtered = riwayat.filter((r) => {
    if (filter === "semua") return true;
    return r.kondisi === filter;
  });

  // Filter pills singkat untuk mobile
  const filterTabsMobile: { key: KondisiFilter; label: string }[] = [
    { key: "semua", label: "Semua" },
    { key: "Baik", label: "Baik" },
    { key: "Rusak Ringan", label: "Rusak" },
    { key: "Hilang", label: "Hilang" },
  ];

  // Filter pills lengkap untuk desktop
  const filterTabsDesktop: { key: KondisiFilter; label: string }[] = [
    { key: "semua", label: "Semua" },
    { key: "Baik", label: "Baik" },
    { key: "Rusak Ringan", label: "Rusak Ringan" },
    { key: "Rusak Berat", label: "Rusak Berat" },
    { key: "Hilang", label: "Hilang" },
  ];

  return (
    <div className="space-y-5 max-w-5xl">

      {/* ===== MOBILE (hidden di lg ke atas) ===== */}
      <div className="lg:hidden space-y-4">
        <div className="flex gap-2 flex-wrap">
          {filterTabsMobile.map(({ key, label }) => (
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

        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-xs text-gray-400">
              Tidak ada riwayat untuk filter ini.
            </div>
          ) : (
            filtered.map((item) => <RiwayatCard key={item.kode} item={item} />)
          )}
        </div>
      </div>

      {/* ===== DESKTOP (hidden di bawah lg) — tidak diubah ===== */}
      <div className="hidden lg:block space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Riwayat Pengecekan Kondisi Alat
          </h2>
          <div className="flex flex-wrap gap-2">
            {filterTabsDesktop.map(({ key, label }) => (
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

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] text-gray-500 text-xs font-medium border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">Kode</th>
                  <th className="py-3.5 px-4">Alat</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Kondisi</th>
                  <th className="py-3.5 px-4">Denda</th>
                  <th className="py-3.5 px-4">Diperiksa Oleh</th>
                  <th className="py-3.5 px-5">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.kode} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-5 font-bold text-gray-900">{item.kode}</td>
                    <td className="py-4 px-4 font-medium text-gray-800">{item.alat}</td>
                    <td className="py-4 px-4 text-gray-600">{item.customer}</td>
                    <td className="py-4 px-4">
                      <KondisiBadge kondisi={item.kondisi} />
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      {item.denda > 0 ? (
                        <span className="text-gray-900">Rp {item.denda.toLocaleString("id-ID")}</span>
                      ) : (
                        <span className="text-gray-500">Rp 0</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{item.diperiksa}</td>
                    <td className="py-4 px-5 text-gray-400">{item.tanggal}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-xs text-gray-400">
                      Tidak ada riwayat untuk filter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
