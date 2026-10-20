"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, X, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import ProductCard, { ProductIllustration } from "@/components/ProductCard";
import { INITIAL_PRODUCTS, Product } from "@/data/customerData";

function KatalogContent() {
  const router = useRouter();
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Booking Form modal state
  const [startDate, setStartDate] = useState("2026-09-20");
  const [endDate, setEndDate] = useState("2026-09-22");
  const [renterName, setRenterName] = useState("Kadek Ayu");
  const [renterPhone, setRenterPhone] = useState("081234567890");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [newBookingCode, setNewBookingCode] = useState("");

  const categories = [
    { id: "all", label: "Semua Kategori" },
    { id: "tenda", label: "Tenda" },
    { id: "sleeping", label: "Sleeping Gear" },
    { id: "cooking", label: "Cooking" },
    { id: "lighting", label: "Lighting" },
    { id: "carrier", label: "Lainnya" },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Rental duration calculation
  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [startDate, endDate]);

  const totalPrice = selectedProduct ? selectedProduct.price * rentalDays : 0;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = `BK-0${Math.floor(100 + Math.random() * 900)}`;
    setNewBookingCode(randomCode);
    setBookingSuccess(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setBookingSuccess(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Banner / Greeting */}
      <div className="bg-gradient-to-r from-[#1e4732] to-[#2d6a4f] rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Sewa Alat Camping Tanpa Ribet
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Katalog Alat Outdoor & Petualangan
          </h1>
          <p className="mt-2 text-sm text-emerald-100">
            Peralatan lengkap dan berkualitas tinggi, dicek berkala sebelum serah terima. Siap menemani pendakian dan camping serumu!
          </p>
        </div>

        {/* Decorative circle in background */}
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#1e4732] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Menampilkan <span className="font-bold text-gray-800">{filteredProducts.length}</span> item alat
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">Tidak ada produk ditemukan untuk kategori ini.</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Detail & Sewa Alat</h3>
                <p className="text-xs text-gray-500">{selectedProduct.categoryLabel}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {bookingSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Booking Berhasil Dibuat!</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Kode booking Anda: <span className="font-bold text-[#1e4732] text-sm">{newBookingCode}</span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    Silakan cek halaman <strong>Status Booking</strong> untuk melihat perkembangan persetujuan admin dan informasi pengambilan alat.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => router.push(`/customer/status-booking?kode=${newBookingCode}`)}
                      className="flex-1 py-2.5 bg-[#1e4732] text-white text-xs font-semibold rounded-xl hover:bg-[#163525] transition-colors"
                    >
                      Lihat Status Booking
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="py-2.5 px-4 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Product preview */}
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className={`${selectedProduct.bgPastel} w-16 h-16 rounded-lg flex items-center justify-center shrink-0`}>
                      <ProductIllustration type={selectedProduct.type} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{selectedProduct.name}</h4>
                      <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                        Rp {selectedProduct.price.toLocaleString("id-ID")} <span className="text-[10px] text-gray-500 font-normal">/ hari</span>
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Stok tersedia: {selectedProduct.stock} unit</p>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1.5">Spesifikasi Alat</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.specs.map((sp, idx) => (
                        <div key={idx} className="bg-gray-50 p-2 rounded-lg text-xs border border-gray-100">
                          <span className="text-gray-400 block text-[10px]">{sp.label}</span>
                          <span className="font-medium text-gray-800">{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rental Dates */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Mulai Sewa</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-[#1e4732]"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Selesai</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-[#1e4732]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Renter information */}
                  <div className="space-y-2 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Penyewa</label>
                      <input
                        type="text"
                        value={renterName}
                        onChange={(e) => setRenterName(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-[#1e4732]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
                      <input
                        type="tel"
                        value={renterPhone}
                        onChange={(e) => setRenterPhone(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-[#1e4732]"
                        required
                      />
                    </div>
                  </div>

                  {/* Calculation Box */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>Durasi sewa:</span>
                      <span className="font-semibold text-gray-800">{rentalDays} Hari</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Harga per hari:</span>
                      <span>Rp {selectedProduct.price.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="border-t border-emerald-200 pt-1 flex justify-between font-bold text-gray-900 text-sm">
                      <span>Total Biaya:</span>
                      <span className="text-[#1e4732]">Rp {totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedProduct.available}
                      className="flex-1 py-2.5 bg-[#1e4732] hover:bg-[#163525] disabled:bg-gray-300 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      Konfirmasi Booking
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerKatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat katalog...</div>}>
      <KatalogContent />
    </Suspense>
  );
}
