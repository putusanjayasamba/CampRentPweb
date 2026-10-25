"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { X, CheckCircle2, SlidersHorizontal } from "lucide-react";
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

  // Mobile: active category tab
  const [activeTab, setActiveTab] = useState<string>("semua");

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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

  const mobileTabs = [
    { id: "semua", label: "Semua" },
    { id: "tenda", label: "Tenda" },
    { id: "sleeping", label: "Sleeping Gear" },
    { id: "cooking", label: "Cooking" },
    { id: "lighting", label: "Lighting" },
    { id: "carrier", label: "Carrier" },
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
    setMobileFilterOpen(false);
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

  // Filter products based on applied filters, active mobile tab, and query search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Mobile tab filter
      if (activeTab !== "semua" && p.category !== activeTab) {
        return false;
      }

      // 1. Category Filter (sidebar): if any selected, product category must match
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
  }, [products, appliedFilters, querySearch, activeTab]);

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
      period: `${modalPickupDate}${modalReturnDate}`,
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
      {/* HERO SECTION */}
      <section className="bg-[#1b4332] text-white pt-6 pb-6 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Desktop: side-by-side | Mobile: stacked */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-8">

            {/* Hero Left Content */}
            <div className="max-w-xl">
              <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-tight text-white">
                Sewa Alat Camping
                <br />
                Tanpa Ribet
              </h1>
              {/* Hide subtitle on mobile to keep it compact */}
              <p className="hidden sm:block mt-3 text-xs sm:text-sm text-[#9ebcae] font-normal leading-relaxed max-w-md">
                Pilih tanggal, cek stok yang tersedia, dan booking dalam hitungan menit.
              </p>
            </div>

            {/* Hero Right: Availability Card */}
            {/* Mobile: full-width stacked vertical | Desktop: inline horizontal */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-white/20 text-gray-800 w-full lg:w-auto lg:shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                {/* Date Inputs */}
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                      Tanggal ambil
                    </label>
                    <input
                      type="text"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      placeholder="28 Sep 2026"
                      className="border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-normal text-gray-700 w-full focus:outline-none focus:border-[#2d6a4f]"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                      Tanggal kembali
                    </label>
                    <input
                      type="text"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      placeholder="30 Sep 2026"
                      className="border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-normal text-gray-700 w-full focus:outline-none focus:border-[#2d6a4f]"
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#e07a2c] hover:bg-[#c8651e] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap flex items-center justify-center"
                >
                  Cek Ketersediaan
                </button>
              </div>
            </div>
          </div>

          {/* Availability Notification Toast */}
          {availabilityMessage && (
            <div className="mt-4">
              <div className="bg-[#245b43] text-emerald-100 text-xs px-4 py-2.5 rounded-lg border border-emerald-500/30 flex items-center justify-between">
                <span>{availabilityMessage}</span>
                <button
                  type="button"
                  onClick={() => setAvailabilityMessage(null)}
                  className="text-white hover:text-emerald-200 ml-4 cursor-pointer"
                >
                  &#x2715;
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MOBILE CATEGORY TABS — only visible on mobile/tablet (hidden on md+) */}
      <div className="md:hidden bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center">
          {/* Scrollable Tabs */}
          <div className="flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="flex gap-1.5 px-3 py-2.5" style={{ width: "max-content" }}>
              {mobileTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#1b4332] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter icon button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center justify-center px-3.5 py-2.5 text-gray-600 border-l border-gray-100 cursor-pointer shrink-0 relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {isFilterActive && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#e07a2c]" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          {/* Drawer slides up from bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto -mt-1 mb-1" />

            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-sm">Filter Produk</h2>
              <div className="flex items-center gap-3">
                {isFilterActive && (
                  <button
                    type="button"
                    onClick={handleResetFilter}
                    className="text-[11px] text-[#2d6a4f] hover:underline font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Kategori */}
            <div>
              <h3 className="font-semibold text-xs text-gray-900 mb-3">Kategori</h3>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                        isChecked
                          ? "border-[#2d6a4f] bg-[#e6f4ea] text-[#2d6a4f]"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] font-normal ${isChecked ? "text-[#2d6a4f]" : "text-gray-400"}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Harga */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-900 mb-2">
                <span>Harga / hari</span>
                <span className="text-[#2d6a4f] font-bold text-[11px]">
                  &#8804; Rp {maxPrice.toLocaleString("id-ID")}
                </span>
              </div>
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
              <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                <span>Rp 10.000</span>
                <span>Rp 100.000</span>
              </div>
            </div>

            {/* Ketersediaan */}
            <div>
              <h3 className="font-semibold text-xs text-gray-900 mb-2.5">Ketersediaan</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                  <input
                    type="radio"
                    name="mob-availability"
                    value="available"
                    checked={availabilityFilter === "available"}
                    onChange={() => setAvailabilityFilter("available")}
                    className="w-3.5 h-3.5 cursor-pointer accent-[#2d6a4f]"
                  />
                  <span className="text-gray-700">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                  <input
                    type="radio"
                    name="mob-availability"
                    value="all"
                    checked={availabilityFilter === "all"}
                    onChange={() => setAvailabilityFilter("all")}
                    className="w-3.5 h-3.5 cursor-pointer accent-[#2d6a4f]"
                  />
                  <span className="text-gray-700">Semua</span>
                </label>
              </div>
            </div>

            {/* Apply button */}
            <button
              type="button"
              onClick={handleApplyFilter}
              className="w-full py-3 bg-[#2d6a4f] hover:bg-[#23583c] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer active:scale-[0.99]"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-5 lg:py-10">
        <div className="flex flex-col md:flex-row items-start gap-8">

          {/* DESKTOP SIDEBAR FILTER (hidden on mobile) */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-sm tracking-tight">Filter</h2>
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

              {/* Kategori */}
              <div>
                <h3 className="font-semibold text-xs text-gray-900 mb-3">Kategori</h3>
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
                        <span className="text-gray-400 text-xs font-normal">{cat.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Harga / hari */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-900 mb-2">
                  <span>Harga / hari</span>
                  <span className="text-[#2d6a4f] font-bold text-[11px]">
                    &#8804; Rp {maxPrice.toLocaleString("id-ID")}
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

              {/* Ketersediaan */}
              <div>
                <h3 className="font-semibold text-xs text-gray-900 mb-2.5">Ketersediaan</h3>
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

          {/* PRODUCT GRID */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500 font-medium">
                Menampilkan{" "}
                <span className="font-bold text-gray-900">{filteredProducts.length}</span>{" "}
                item alat
              </p>
              {isFilterActive && (
                <span className="text-[11px] bg-emerald-50 text-[#2d6a4f] px-2 py-0.5 rounded-md font-medium border border-emerald-100">
                  Filter Aktif
                </span>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              /* Mobile: 2 columns | sm: 2 columns | lg: 3 columns */
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
                  onClick={() => {
                    handleResetFilter();
                    setActiveTab("semua");
                  }}
                  className="mt-4 px-4 py-2 bg-[#2d6a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#23583c] transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* BOOKING MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm sm:max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 max-h-[90vh]">

            {/* Left Column: Product Image - hidden on mobile, shown on md+ */}
            <div className="hidden md:flex w-full md:w-1/2 min-h-[220px] md:min-h-full shrink-0 relative bg-gray-100 overflow-hidden items-center justify-center">
              {selectedProduct.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`${selectedProduct.bgPastel} w-full h-full min-h-[200px]`} />
              )}
            </div>

            {/* Right Column: Content */}
            <div className="w-full md:w-1/2 p-5 sm:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">


              {bookingSuccess ? (
                <div className="text-center py-6 space-y-4 my-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      Booking Berhasil!
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Kode booking Anda:{" "}
                      <span className="font-bold text-[#1b4332] text-sm">
                        {newBookingCode}
                      </span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    Booking telah dicatat di tabel <strong>Sewa Saya</strong>. Pantau
                    perkembangan melalui halaman <strong>Status Booking</strong>.
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

                  {/* Product image — only on mobile */}
                  <div className="md:hidden w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`${selectedProduct.bgPastel} w-full h-full`} />
                    )}
                  </div>

                  {/* Title & Category */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 font-normal">
                      {selectedProduct.categoryLabel} &#183; ID {selectedProduct.codeId}
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

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Tanggal ambil
                      </label>
                      <input
                        type="text"
                        value={modalPickupDate}
                        onChange={(e) => setModalPickupDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#2d6a4f]"
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
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#2d6a4f]"
                      />
                    </div>
                  </div>

                  {/* Calculation Card */}
                  <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4 space-y-2">
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
                      <span className="font-bold text-sm text-[#1b4332]">Total Bayar</span>
                      <span className="font-extrabold text-base text-[#1b4332]">
                        Rp {(selectedProduct.price * modalDays).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Konfirmasi Booking Button */}
                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    disabled={!selectedProduct.available}
                    className="w-full py-3 bg-[#2d6a4f] hover:bg-[#23583c] disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
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
