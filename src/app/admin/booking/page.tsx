"use client";

import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react";
import { INITIAL_BOOKINGS, BookingItem } from "@/data/adminData";

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const statuses = ["Semua", "Pending", "Approved", "Picked Up", "Completed", "Cancelled"];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus =
        selectedStatus === "Semua" || b.status === selectedStatus;
      const matchSearch =
        b.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.alat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [bookings, selectedStatus, searchQuery]);

  const handleApprove = (kode: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.kode === kode ? { ...b, status: "Approved" } : b))
    );
  };

  const handleReject = (kode: string) => {
    if (confirm(`Yakin ingin menolak booking ${kode}?`)) {
      setBookings((prev) =>
        prev.map((b) => (b.kode === kode ? { ...b, status: "Cancelled" } : b))
      );
    }
  };

  const handleMarkPaid = (kode: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.kode === kode ? { ...b, pembayaran: "Lunas" } : b))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Booking & Verifikasi Pembayaran
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola persetujuan sewa, status pembayaran customer, dan verifikasi transaksi.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === st
                  ? "bg-[#1b4332] text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Cari kode / customer / alat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3.5 py-2 pl-9 w-full sm:w-64 focus:outline-none focus:border-[#1b4332]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Booking Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Kode Transaksi</th>
                <th className="py-3.5 px-4">Nama Pelanggan</th>
                <th className="py-3.5 px-4">Alat Disewa</th>
                <th className="py-3.5 px-4">Periode</th>
                <th className="py-3.5 px-4">Total Biaya</th>
                <th className="py-3.5 px-4">Pembayaran</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.kode} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-5 font-bold text-gray-900">{b.kode}</td>
                    <td className="py-4 px-4 font-medium text-gray-800">{b.customer}</td>
                    <td className="py-4 px-4 text-gray-600">{b.alat}</td>
                    <td className="py-4 px-4 text-gray-500 font-medium">{b.periode}</td>
                    <td className="py-4 px-4 font-bold text-[#1b4332]">
                      Rp {b.total.toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.pembayaran === "Lunas"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {b.pembayaran}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : b.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : b.status === "Picked Up"
                            ? "bg-teal-50 text-teal-700"
                            : b.status === "Completed"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(b.kode)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              Setujui
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(b.kode)}
                              className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                        {b.pembayaran === "Belum bayar" && (
                          <button
                            type="button"
                            onClick={() => handleMarkPaid(b.kode)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-[10px] font-semibold transition-colors cursor-pointer"
                          >
                            Set Lunas
                          </button>
                        )}
                        {b.status !== "Pending" && b.pembayaran === "Lunas" && (
                          <span className="text-[11px] text-gray-400 font-medium">Selesai</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                    Tidak ada pesanan booking yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
