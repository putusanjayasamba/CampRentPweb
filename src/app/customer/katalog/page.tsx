"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { X, CheckCircle2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  INITIAL_PRODUCTS,
  INITIAL_BOOKINGS,
  Product,
  BookingRecord,
  getStoredBookings,
  saveStoredBookings,
} from "@/data/customerData";

function KatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("q") || "";

  // Date states for hero availability check
  const [pickupDate, setPickupDate] = useState("28 Sep 2026");
  const [returnDate, setReturnDate] = useState("30 Sep 2026");
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  // Form Filter states (interactive inputs in sidebar)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [availabilityFilter, setAvailabilityFilter] = useState<"available" | "all">("all");

  // Applied Filter states (takes effect on catalog grid)
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [] as string[],
    maxPrice: 100000,
    availability: "all" as "available" | "all",
  });

  // Products and bookings data
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  // Selected product for modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modal form states
  const [modalPickupDate, setModalPickupDate] = useState("28 Sep 2026");
  const [modalReturnDate, setModalReturnDate] = useState("30 Sep 2026");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [newBookingCode, setNewBookingCode] = useState("");

  const modalDays = useMemo(() => {
    // Try to extract day number from strings like "28 Sep 2026" and "30 Sep 2026"
    const matchStart = modalPickupDate.match(/^(\d{1,2})/);
    const matchEnd = modalReturnDate.match(/^(\d{1,2})/);
    if (matchStart && matchEnd) {
      const d1 = parseInt(matchStart[1], 10);
      const d2 = parseInt(matchEnd[1], 10);
      if (d2 >= d1) {
        return d2 - d1 + 1;
      }
    }
    return 3;
  }, [modalPickupDate, modalReturnDate]);

  const categoryOptions = [
    { id: "tenda", label: "Tenda", count: 12 },
    { id: "sleeping", label: "Sleeping Gear", count: 9 },
    { id: "cooking", label: "Cooking", count: 7 },
    { id: "lighting", label: "Lighting", count: 5 },
  ];

  const handleCategoryToggle = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleApplyFilter = () => {
    setAppliedFilters({
      categories: [...selectedCategories],
      maxPrice: maxPrice,
      availability: availabilityFilter,
    });
  };

  const handleResetFilter = () => {
    setSelectedCategories([]);
    setMaxPrice(100000);
    setAvailabilityFilter("all");
    setAppliedFilters({
      categories: [],
      maxPrice: 100000,
      availability: "all",
    });
  };

  const isFilterActive =
    appliedFilters.categories.length > 0 ||
    appliedFilters.maxPrice < 100000 ||
    appliedFilters.availability === "available" ||
    querySearch !== "";

  // Filter products based on applied filters and query search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Category Filter: if any selected, product category must match
      if (appliedFilters.categories.length > 0) {
        if (!appliedFilters.categories.includes(p.category)) {
          return false;
        }
      }

      // 2. Price Filter: product price must not exceed maxPrice
      if (p.price > appliedFilters.maxPrice) {
        return false;
      }

      // 3. Availability Filter: if 'available', hide out of stock items
      if (appliedFilters.availability === "available" && !p.available) {
        return false;
      }

      // 4. Text Search Query from Navbar
      if (querySearch) {
        const q = querySearch.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCat = p.categoryLabel.toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }

      return true;
    });
  }, [products, appliedFilters, querySearch]);

  const handleCheckAvailability = () => {
    setAvailabilityMessage(
      `Stok peralatan camping untuk periode ${pickupDate} s/d ${returnDate} telah diperiksa dan siap disewa.`
    );
    setTimeout(() => {
      setAvailabilityMessage(null);
    }, 4500);
  };

  const totalPrice = selectedProduct ? selectedProduct.price * modalDays : 0;

  const handleBookingSubmit = () => {
    if (!selectedProduct) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `BK-0${randomNum}`;
    setNewBookingCode(code);

    const newBooking: BookingRecord = {
      code: code,
      items: selectedProduct.name,
      shortItems: selectedProduct.name,
      period: `${modalPickupDate}–${modalReturnDate}`,
      startDate: modalPickupDate,
      endDate: modalReturnDate,
      location: "Kantor CampRent, Denpasar",
      total: totalPrice,
      status: "Pending",
      timeline: [
        {
          title: "Booking dibuat",
          detail: "Baru saja · Menunggu konfirmasi staff",
          done: true,
        },
        {
          title: "Disetujui admin",
          detail: "Menunggu",
          done: false,
        },
        {
          title: "Alat diambil",
          detail: "Menunggu",
          done: false,
        },
        {
          title: "Alat dikembalikan",
          detail: "Menunggu",
          done: false,
        },
      ],
    };

    const updated = [newBooking, ...getStoredBookings()];
    saveStoredBookings(updated);
    setBookings(updated);
    setBookingSuccess(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setBookingSuccess(false);
  };

  // Dynamic slider track percentage (0% to 100%)
  const sliderPercentage = Math.round(((maxPrice - 10000) / (100000 - 10000)) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Seamless Deep Forest Green Hero Section */}
      <section className="bg-[#1b4332] text-white pt-6 pb-16 px-6 sm:px-10 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Hero Left Content */}
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-tight text-white">
              Sewa Alat Camping
              <br />
              Tanpa Ribet
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-[#9ebcae] font-normal leading-relaxed max-w-md">
              Pilih tanggal, cek stok yang tersedia, dan booking dalam hitungan menit.
            </p>
          </div>

          {/* Hero Right Floating Availability Card */}
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-white/20 flex flex-col sm:flex-row items-end gap-3 sm:gap-4 shrink-0 text-gray-800">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                Tanggal ambil
              </label>
              <input
                type="text"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                placeholder="28 Sep 2026"
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-normal text-gray-700 w-36 sm:w-40 focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                Tanggal kembali
              </label>
              <input
                type="text"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                placeholder="30 Sep 2026"
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-normal text-gray-700 w-36 sm:w-40 focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <button
              type="button"
              onClick={handleCheckAvailability}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#e07a2c] hover:bg-[#c8651e] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap h-[37px] flex items-center justify-center"
            >
              Cek Ketersediaan
            </button>
          </div>
        </div>

        {/* Availability Notification Toast */}
        {availabilityMessage && (
          <div className="max-w-7xl mx-auto mt-4">
            <div className="bg-[#245b43] text-emerald-100 text-xs px-4 py-2.5 rounded-lg border border-emerald-500/30 flex items-center justify-between">
              <span>{availabilityMessage}</span>
              <button
                type="button"
                onClick={() => setAvailabilityMessage(null)}
                className="text-white hover:text-emerald-200 ml-4 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Main Content Area: Sidebar Filter + Catalog Grid */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left Sidebar Filter */}
          <aside className="w-full md:w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs space-y-6">
              {/* Filter Header with optional Reset link */}
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-sm tracking-tight">
                  Filter
                </h2>
                {isFilterActive && (
                  <button
                    type="button"
                    onClick={handleResetFilter}
                    className="text-[11px] text-[#2d6a4f] hover:underline font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Kategori Section */}
              <div>
                <h3 className="font-semibold text-xs text-gray-900 mb-3">
                  Kategori
                </h3>
                <div className="space-y-2.5 text-xs">
                  {categoryOptions.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat.id)}
                        className="flex items-center justify-between cursor-pointer select-none group py-0.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCategoryToggle(cat.id)}
                            className="w-3.5 h-3.5 rounded-xs border-gray-300 text-[#2d6a4f] focus:ring-0 cursor-pointer accent-[#2d6a4f]"
                          />
                          <span
                            className={`text-xs transition-colors ${
                              isChecked
                                ? "font-semibold text-gray-900"
                                : "text-gray-700 group-hover:text-gray-900"
                            }`}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs font-normal">
                          {cat.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Harga / hari Section */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-900 mb-2">
                  <span>Harga / hari</span>
                  <span className="text-[#2d6a4f] font-bold text-[11px]">
                    ≤ Rp {maxPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="10000"
                    max="100000"
                    step="5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #2d6a4f 0%, #2d6a4f ${sliderPercentage}%, #cbd5e1 ${sliderPercentage}%, #cbd5e1 100%)`,
                    }}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#2d6a4f]"
                  />
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-normal">
                    <span>Rp 10.000</span>
                    <span>Rp 100.000</span>
                  </div>
                </div>
              </div>

              {/* Ketersediaan Section */}
              <div>
                <h3 className="font-semibold text-xs text-gray-900 mb-2.5">
                  Ketersediaan
                </h3>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="availability"
                      value="available"
                      checked={availabilityFilter === "available"}
                      onChange={() => setAvailabilityFilter("available")}
                      className="w-3.5 h-3.5 text-[#2d6a4f] focus:ring-0 cursor-pointer accent-[#2d6a4f]"
                    />
                    <span className="text-gray-700">Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="availability"
                      value="all"
                      checked={availabilityFilter === "all"}
                      onChange={() => setAvailabilityFilter("all")}
                      className="w-3.5 h-3.5 text-[#2d6a4f] focus:ring-0 cursor-pointer accent-[#2d6a4f]"
                    />
                    <span className="text-gray-700">Semua</span>
                  </label>
                </div>
              </div>

              {/* Terapkan Button */}
              <button
                type="button"
                onClick={handleApplyFilter}
                className="w-full py-2 bg-[#2d6a4f] hover:bg-[#23583c] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
              >
                Terapkan
              </button>
            </div>
          </aside>

          {/* Right Product Grid (3 Columns) */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500 font-medium">
                Menampilkan <span className="font-bold text-gray-900">{filteredProducts.length}</span> item alat
              </p>
              {isFilterActive && (
                <span className="text-[11px] bg-emerald-50 text-[#2d6a4f] px-2 py-0.5 rounded-md font-medium border border-emerald-100">
                  Filter Aktif
                </span>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={(prod) => {
                      setSelectedProduct(prod);
                      setModalPickupDate(pickupDate);
                      setModalReturnDate(returnDate);
                      setBookingSuccess(false);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-sm">
                  Tidak ada alat camping yang cocok dengan filter yang dipilih.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="mt-4 px-4 py-2 bg-[#2d6a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#23583c] transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Booking Form Modal matching user's design image */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 max-h-[92vh]">
            {/* Left Column: Product Image */}
            <div className="w-full md:w-1/2 min-h-[220px] md:min-h-full shrink-0 relative bg-gray-100 overflow-hidden flex items-center justify-center">
              {selectedProduct.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`${selectedProduct.bgPastel} w-full h-full min-h-[200px]`}
                />
              )}
            </div>

            {/* Right Column: Content */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              {bookingSuccess ? (
                <div className="text-center py-8 space-y-4 my-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      Booking Berhasil Dikonfirmasi!
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Kode booking Anda:{" "}
                      <span className="font-bold text-[#1b4332] text-sm">
                        {newBookingCode}
                      </span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    Booking telah dicatat di tabel <strong>Sewa Saya</strong>. Silakan pantau perkembangannya melalui halaman <strong>Status Booking</strong>.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/customer/status-booking?kode=${newBookingCode}`)
                      }
                      className="flex-1 py-2.5 bg-[#2d6a4f] text-white text-xs font-semibold rounded-xl hover:bg-[#23583c] transition-colors cursor-pointer"
                    >
                      Lihat Status Booking
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="py-2.5 px-4 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Top Bar: Badge & Close Button */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#2d6a4f]">
                      {selectedProduct.available
                        ? `Available - Stok ${selectedProduct.stock}`
                        : "Out of Stock"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Category with ID */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 font-normal">
                      {selectedProduct.categoryLabel} · ID {selectedProduct.codeId}
                    </p>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2 text-xs pt-1">
                    {selectedProduct.specs.map((sp, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-gray-400 font-normal">{sp.label}</span>
                        <span className="font-bold text-gray-900">{sp.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dates: Tanggal ambil & Tanggal kembali */}
                  <div className="grid grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Tanggal ambil
                      </label>
                      <input
                        type="text"
                        value={modalPickupDate}
                        onChange={(e) => setModalPickupDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#2d6a4f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Tanggal kembali
                      </label>
                      <input
                        type="text"
                        value={modalReturnDate}
                        onChange={(e) => setModalReturnDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#2d6a4f]"
                      />
                    </div>
                  </div>

                  {/* Calculation Card */}
                  <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4 space-y-2 mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Total hari</span>
                      <span className="font-bold text-gray-900">{modalDays} hari</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Harga / hari</span>
                      <span className="font-bold text-gray-900">
                        Rp {selectedProduct.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 pt-2.5 mt-2 flex items-center justify-between">
                      <span className="font-bold text-sm sm:text-base text-[#1b4332]">
                        Total Bayar
                      </span>
                      <span className="font-extrabold text-base sm:text-lg text-[#1b4332]">
                        Rp {(selectedProduct.price * modalDays).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Konfirmasi Booking Button */}
                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    disabled={!selectedProduct.available}
                    className="w-full py-3 bg-[#2d6a4f] hover:bg-[#23583c] disabled:bg-gray-300 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-xs active:scale-[0.99] mt-2"
                  >
                    Konfirmasi Booking
                  </button>
                </div>
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
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-gray-500">
          Memuat katalog...
        </div>
      }
    >
      <KatalogContent />
    </Suspense>
  );
}
