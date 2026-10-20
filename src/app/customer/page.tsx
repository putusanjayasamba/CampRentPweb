"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  X,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import CustomerNavbar from "@/components/CustomerNavbar";

interface ProductSpec {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  category: "tenda" | "sleeping" | "cooking" | "lighting" | "carrier";
  categoryLabel: string;
  price: number;
  available: boolean;
  stock: number;
  bgPastel: string;
  type: "tent" | "sleeping" | "stove" | "light" | "backpack" | "nesting";
  specs: ProductSpec[];
}

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Tenda Dome 4 Orang",
    category: "tenda",
    categoryLabel: "Tenda",
    price: 75000,
    available: true,
    stock: 3,
    bgPastel: "bg-[#9ec4b1]",
    type: "tent",
    specs: [
      { label: "Kapasitas", value: "4 orang" },
      { label: "Berat", value: "3,8 kg" },
      { label: "Lapisan", value: "Double layer" },
      { label: "Anti air", value: "3000 mm" },
    ],
  },
  {
    id: "p2",
    name: "Sleeping Bag Mummy",
    category: "sleeping",
    categoryLabel: "Sleeping Gear",
    price: 25000,
    available: true,
    stock: 5,
    bgPastel: "bg-[#eed089]",
    type: "sleeping",
    specs: [
      { label: "Kapasitas", value: "1 orang" },
      { label: "Berat", value: "0,9 kg" },
      { label: "Lapisan", value: "Polar fleece tebal" },
      { label: "Suhu min", value: "10°C" },
    ],
  },
  {
    id: "p3",
    name: "Kompor Portable",
    category: "cooking",
    categoryLabel: "Cooking",
    price: 15000,
    available: false,
    stock: 0,
    bgPastel: "bg-[#f2a897]",
    type: "stove",
    specs: [
      { label: "Bahan", value: "Stainless Steel" },
      { label: "Berat", value: "450 gram" },
      { label: "Pemantik", value: "Piezo elektrik" },
      { label: "Pelindung", value: "Windproof lotus" },
    ],
  },
  {
    id: "p4",
    name: "Lampu Tenda LED",
    category: "lighting",
    categoryLabel: "Lighting",
    price: 10000,
    available: true,
    stock: 8,
    bgPastel: "bg-[#a2c7dd]",
    type: "light",
    specs: [
      { label: "Baterai", value: "2400 mAh" },
      { label: "Mode", value: "3 mode cahaya" },
      { label: "Fitur", value: "USB Rechargeable" },
      { label: "Daya tahan", value: "12 jam" },
    ],
  },
  {
    id: "p5",
    name: "Carrier 60L",
    category: "carrier",
    categoryLabel: "Lainnya",
    price: 35000,
    available: true,
    stock: 4,
    bgPastel: "bg-[#ccbfe0]",
    type: "backpack",
    specs: [
      { label: "Kapasitas", value: "60 Liter" },
      { label: "Berat", value: "1,6 kg" },
      { label: "Rangka", value: "Aluminium alloy" },
      { label: "Fitur", value: "Include Rain Cover" },
    ],
  },
  {
    id: "p6",
    name: "Set Nesting Masak",
    category: "cooking",
    categoryLabel: "Cooking",
    price: 12000,
    available: true,
    stock: 6,
    bgPastel: "bg-[#d2de9e]",
    type: "nesting",
    specs: [
      { label: "Isi set", value: "2 Panci + 1 Wajan" },
      { label: "Bahan", value: "Anodized aluminium" },
      { label: "Pegangan", value: "Anti-panas lipat" },
      { label: "Kapasitas", value: "3-4 orang" },
    ],
  },
];

// Product Illustration matching exact mockup aesthetics
function ProductThumbnail({ type }: { type: Product["type"] }) {
  if (type === "tent") {
    // 3D Orange Tent
    return (
      <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm">
        <ellipse cx="50" cy="78" rx="26" ry="4" fill="#00000018" />
        <polygon points="50,26 24,74 48,74" fill="#d94814" />
        <polygon points="50,26 48,74 76,74" fill="#ea580c" />
        <line x1="50" y1="26" x2="48" y2="74" stroke="#b93815" strokeWidth="1" />
        <polygon points="50,42 42,74 58,74" fill="#fef08a" />
        <polygon points="50,42 46,74 54,74" fill="#fde047" />
        <polygon points="50,42 38,74 44,74" fill="#ea580c" />
        <polygon points="50,42 56,74 62,74" fill="#ea580c" />
      </svg>
    );
  }

  if (type === "sleeping") {
    // Sleeping Gear / Person in Bed Icon
    return (
      <svg viewBox="0 0 100 100" className="w-18 h-18 sm:w-22 sm:h-22 drop-shadow-sm">
        <ellipse cx="50" cy="74" rx="24" ry="4" fill="#00000015" />
        {/* Headboard */}
        <rect x="22" y="38" width="10" height="34" rx="2" fill="#78350f" />
        {/* Footboard */}
        <rect x="72" y="48" width="8" height="24" rx="2" fill="#78350f" />
        {/* Mattress & Frame */}
        <rect x="30" y="54" width="44" height="14" rx="2" fill="#3b82f6" />
        {/* Pillow */}
        <rect x="32" y="44" width="14" height="10" rx="3" fill="#ffffff" />
        {/* Sleeping Person Head */}
        <circle cx="39" cy="46" r="4" fill="#fed7aa" />
        {/* Blanket Fold */}
        <rect x="42" y="50" width="32" height="18" rx="2" fill="#1d4ed8" />
      </svg>
    );
  }

  if (type === "stove") {
    // Fire Flame 🔥
    return (
      <svg viewBox="0 0 100 100" className="w-18 h-18 sm:w-22 sm:h-22 drop-shadow-sm">
        <ellipse cx="50" cy="78" rx="20" ry="4" fill="#00000015" />
        <path
          d="M50 20 C56 35 72 45 68 64 C64 76 54 80 50 80 C46 80 36 76 32 64 C28 45 44 35 50 20 Z"
          fill="#ea580c"
        />
        <path
          d="M50 36 C54 48 64 56 61 68 C59 74 53 76 50 76 C47 76 41 74 39 68 C36 56 46 48 50 36 Z"
          fill="#facc15"
        />
      </svg>
    );
  }

  if (type === "light") {
    // Flashlight 🔦
    return (
      <svg viewBox="0 0 100 100" className="w-18 h-18 sm:w-22 sm:h-22 drop-shadow-sm transform -rotate-45">
        <ellipse cx="50" cy="78" rx="14" ry="3" fill="#00000015" />
        <rect x="43" y="38" width="14" height="34" rx="3" fill="#334155" />
        <polygon points="36,24 64,24 57,38 43,38" fill="#64748b" />
        <rect x="36" y="20" width="28" height="4" rx="1" fill="#cbd5e1" />
        <circle cx="50" cy="46" r="3" fill="#38bdf8" />
      </svg>
    );
  }

  if (type === "backpack") {
    // Red Backpack 🎒
    return (
      <svg viewBox="0 0 100 100" className="w-18 h-18 sm:w-22 sm:h-22 drop-shadow-sm">
        <ellipse cx="50" cy="76" rx="18" ry="4" fill="#00000015" />
        <rect x="34" y="28" width="32" height="46" rx="7" fill="#dc2626" />
        <rect x="38" y="44" width="24" height="22" rx="4" fill="#b91c1c" />
        <rect x="44" y="22" width="12" height="8" rx="2" fill="#7f1d1d" />
        <line x1="38" y1="40" x2="62" y2="40" stroke="#7f1d1d" strokeWidth="2" />
        <circle cx="50" cy="54" r="2.5" fill="#f87171" />
      </svg>
    );
  }

  // Frying Pan with Egg 🍳
  return (
    <svg viewBox="0 0 100 100" className="w-18 h-18 sm:w-22 sm:h-22 drop-shadow-sm">
      <ellipse cx="50" cy="74" rx="24" ry="4" fill="#00000015" />
      <circle cx="48" cy="48" r="20" fill="#334155" />
      <circle cx="48" cy="48" r="16" fill="#1e293b" />
      <ellipse cx="48" cy="48" rx="10" ry="8" fill="#f8fafc" />
      <circle cx="48" cy="48" r="4.5" fill="#f59e0b" />
      <rect x="66" y="45" width="18" height="6" rx="2" fill="#0f172a" />
    </svg>
  );
}

function CustomerCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  // Hero Date Pickers
  const [startDate, setStartDate] = useState("2026-09-28");
  const [endDate, setEndDate] = useState("2026-09-30");

  // Sidebar Filters: Tenda is checked by default in mockup, or user can toggle
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["tenda"]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [availabilityFilter, setAvailabilityFilter] = useState<"available" | "all">("available");

  // Detail Modal & Price Calculator
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalStartDate, setModalStartDate] = useState("2026-09-28");
  const [modalEndDate, setModalEndDate] = useState("2026-09-30");
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);

  // Auto-open modal if requested via URL param
  useEffect(() => {
    const modalParam = searchParams.get("modal") || searchParams.get("open");
    if (modalParam) {
      const match = PRODUCTS.find(
        (p) =>
          p.id === modalParam ||
          p.category === modalParam ||
          p.name.toLowerCase().includes(modalParam.toLowerCase())
      );
      if (match) {
        setModalProduct(match);
      } else {
        setModalProduct(PRODUCTS[0]);
      }
    }
  }, [searchParams]);

  // Calculate days inclusive (28 Sep to 30 Sep = 3 days)
  const calculatedDays = useMemo(() => {
    try {
      const start = new Date(modalStartDate);
      const end = new Date(modalEndDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
    } catch {
      return 1;
    }
  }, [modalStartDate, modalEndDate]);

  // Total price = days * price
  const calculatedTotal = useMemo(() => {
    if (!modalProduct) return 0;
    return calculatedDays * modalProduct.price;
  }, [calculatedDays, modalProduct]);

  // Open modal handler
  const handleOpenDetailModal = (prod: Product) => {
    setModalProduct(prod);
    setModalStartDate(startDate);
    setModalEndDate(endDate);
    setBookingSuccessCode(null);
  };

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Filtered products: if selectedCategories is empty, show all. If categories selected, filter by them.
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchCat =
        selectedCategories.length === 0 ||
        selectedCategories.includes(item.category);

      const matchPrice = item.price <= maxPrice;

      const matchAvail =
        availabilityFilter === "all" ? true : item.available;

      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchPrice && matchAvail && matchSearch;
    });
  }, [selectedCategories, maxPrice, availabilityFilter, searchQuery]);

  // Confirm booking action
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalProduct) return;

    const newCode = `BK-0${Math.floor(130 + Math.random() * 50)}`;
    setBookingSuccessCode(newCode);

    setTimeout(() => {
      setModalProduct(null);
      router.push(`/customer/status?kode=${newCode}`);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <CustomerNavbar
        activePage="katalog"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. HERO BANNER PERSIS MOCKUP */}
      <section className="bg-[#1b4332] text-white px-6 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Title & Subtitle */}
          <div className="max-w-lg">
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight text-white leading-tight">
              Sewa Alat Camping <br />
              Tanpa Ribet
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
              Pilih tanggal, cek stok yang tersedia, dan booking dalam hitungan menit.
            </p>
          </div>

          {/* Right Floating White Card (Tanggal ambil, Tanggal kembali, Cek Ketersediaan) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100 flex flex-col sm:flex-row items-center gap-4 text-gray-800 w-full lg:w-auto">
            {/* Tanggal ambil */}
            <div className="w-full sm:w-44">
              <label className="block text-[11px] font-medium text-gray-500 mb-1">
                Tanggal ambil
              </label>
              <div className="relative border border-gray-200 rounded-xl px-3 py-2 bg-white hover:border-[#1b4332] transition-colors">
                <span className="text-xs font-semibold text-gray-800">
                  {new Date(startDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </div>
            </div>

            {/* Tanggal kembali */}
            <div className="w-full sm:w-44">
              <label className="block text-[11px] font-medium text-gray-500 mb-1">
                Tanggal kembali
              </label>
              <div className="relative border border-gray-200 rounded-xl px-3 py-2 bg-white hover:border-[#1b4332] transition-colors">
                <span className="text-xs font-semibold text-gray-800">
                  {new Date(endDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </div>
            </div>

            {/* Tombol Cek Ketersediaan */}
            <div className="w-full sm:w-auto sm:self-end">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("catalog-grid");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#ea6a20] hover:bg-[#d95c14] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap mt-4 sm:mt-0"
              >
                Cek Ketersediaan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CATALOG BODY (SIDEBAR FILTER + 3x2 PRODUCT GRID) */}
      <main id="catalog-grid" className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT SIDEBAR FILTER (PERSIS DESAIN) ================= */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-5">
            <h3 className="font-bold text-sm text-gray-900">Filter</h3>

            {/* Kategori */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-2.5">
                Kategori
              </h4>
              <div className="space-y-2 text-xs text-gray-700">
                {[
                  { id: "tenda", label: "Tenda", count: 12 },
                  { id: "sleeping", label: "Sleeping Gear", count: 9 },
                  { id: "cooking", label: "Cooking", count: 7 },
                  { id: "lighting", label: "Lighting", count: 5 },
                ].map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center justify-between cursor-pointer hover:text-gray-900 select-none py-0.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="w-4 h-4 rounded text-[#1b4332] focus:ring-emerald-500 border-gray-300 cursor-pointer"
                      />
                      <span className="font-medium text-gray-700">{cat.label}</span>
                    </div>
                    <span className="text-gray-400 text-[11px]">{cat.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rentang Harga Slider */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-2">
                Harga / hari
              </h4>
              <input
                type="range"
                min={10000}
                max={100000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#235832]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1.5 font-medium">
                <span>Rp 10.000</span>
                <span>Rp 100.000</span>
              </div>
            </div>

            {/* Ketersediaan Radio */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-2">
                Ketersediaan
              </h4>
              <div className="space-y-1.5 text-xs text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="availability"
                    checked={availabilityFilter === "available"}
                    onChange={() => setAvailabilityFilter("available")}
                    className="text-[#1b4332] focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="availability"
                    checked={availabilityFilter === "all"}
                    onChange={() => setAvailabilityFilter("all")}
                    className="text-[#1b4332] focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Semua</span>
                </label>
              </div>
            </div>

            {/* Tombol Terapkan */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("catalog-grid");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full py-2.5 bg-[#235832] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center shadow-xs"
            >
              Terapkan
            </button>
          </aside>

          {/* ================= RIGHT 3x2 PRODUCT GRID (PERSIS DESAIN) ================= */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  id={`product-card-${prod.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs flex flex-col justify-between"
                >
                  {/* Top Pastel Thumbnail with Icon */}
                  <div
                    className={`${prod.bgPastel} h-40 sm:h-44 flex items-center justify-center p-4 relative overflow-hidden`}
                  >
                    <ProductThumbnail type={prod.type} />
                  </div>

                  {/* Product Info & Action Button */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {prod.categoryLabel}
                      </p>

                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-sm font-bold text-gray-900">
                          Rp {prod.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[11px] font-normal text-gray-400">
                          / hari
                        </span>
                      </div>

                      {/* Status Badge: Available or Out of Stock */}
                      <div className="mt-1.5">
                        {prod.available ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ebf6ed] text-[#2e7d32]">
                            Available
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#fee2e2] text-[#dc2626]">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Button Sewa Sekarang / Stok Habis */}
                    <div className="mt-4 pt-1">
                      {prod.available ? (
                        <button
                          type="button"
                          id={`btn-sewa-${prod.id}`}
                          onClick={() => handleOpenDetailModal(prod)}
                          className="w-full py-2.5 bg-[#ea6a20] hover:bg-[#d95c14] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs text-center"
                        >
                          Sewa Sekarang
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 bg-[#cbd5e1] text-[#64748b] text-xs font-semibold rounded-xl cursor-not-allowed text-center"
                        >
                          Stok Habis
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500 font-medium">
                  Tidak ada peralatan yang sesuai dengan filter yang dipilih.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories(["tenda"]);
                    setMaxPrice(100000);
                    setAvailabilityFilter("available");
                    setSearchQuery("");
                  }}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-[#1b4332] bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                >
                  Tampilkan Semua Alat
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ================= MODAL DETAIL ALAT & KALKULATOR HARGA (B4) ================= */}
      {modalProduct && (
        <div
          id="modal-detail-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            id="modal-detail-card"
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200"
          >
            {/* Close Button Top Right */}
            <button
              id="btn-close-modal"
              type="button"
              onClick={() => setModalProduct(null)}
              className="absolute right-4 top-4 z-20 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccessCode ? (
              <div className="p-8 text-center py-14">
                <div className="w-16 h-16 bg-emerald-100 text-[#1b4332] rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-95">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  Booking Berhasil Dikonfirmasi!
                </h3>
                <p className="text-xs text-gray-500 mb-5">
                  Kode reservasi Anda telah tercatat dan masuk ke daftar Sewa Saya.
                </p>
                <div className="bg-emerald-50 text-[#1b4332] font-mono font-bold text-lg px-6 py-2.5 rounded-xl inline-block mb-6 border border-emerald-200">
                  {bookingSuccessCode}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setModalProduct(null);
                      router.push(`/customer/status?kode=${bookingSuccessCode}`);
                    }}
                    className="px-6 py-2.5 bg-[#235832] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Buka Halaman Status Booking
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
                {/* 1. Kolom Kiri: Foto / Thumbnail Pastel */}
                <div
                  className={`md:col-span-6 ${modalProduct.bgPastel} p-8 flex items-center justify-center relative overflow-hidden select-none`}
                >
                  <ProductThumbnail type={modalProduct.type} />
                </div>

                {/* 2. Kolom Kanan: Spesifikasi & Kalkulator Harga */}
                <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    {/* Badge Available / Stock */}
                    <div className="mb-2">
                      {modalProduct.available ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#eaf5ea] text-[#2e7d32] border border-[#2e7d32]/20">
                          Available · Stok {modalProduct.stock}
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">
                          Stok Habis
                        </span>
                      )}
                    </div>

                    {/* Judul & Harga per Hari */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {modalProduct.name}
                    </h3>
                    <p className="text-base sm:text-lg font-bold text-[#1b4332] mt-1">
                      Rp {modalProduct.price.toLocaleString("id-ID")}
                      <span className="text-xs font-normal text-gray-500"> / hari</span>
                    </p>

                    {/* 4 Spesifikasi Utama Box (2 Kolom) */}
                    <div className="grid grid-cols-2 gap-2.5 my-5">
                      {modalProduct.specs.map((spec, i) => (
                        <div
                          key={i}
                          className="bg-[#f8f9fa] rounded-xl p-3 border border-gray-100 flex flex-col"
                        >
                          <span className="text-[10px] text-gray-400 font-medium">
                            {spec.label}
                          </span>
                          <span className="text-xs font-bold text-gray-800 mt-0.5">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tanggal Sewa (Mulai & Selesai) */}
                    <div className="mb-5">
                      <label className="block text-[11px] font-bold text-gray-700 mb-2">
                        Tanggal Sewa
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Box Tanggal Mulai */}
                        <div className="relative border border-gray-200 rounded-xl p-2.5 hover:border-[#1b4332] transition-colors">
                          <span className="block text-[10px] text-gray-400 font-medium">
                            Mulai
                          </span>
                          <div className="text-xs font-bold text-gray-800 mt-0.5">
                            {new Date(modalStartDate).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <input
                            type="date"
                            value={modalStartDate}
                            onChange={(e) => setModalStartDate(e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          />
                        </div>

                        {/* Box Tanggal Selesai */}
                        <div className="relative border border-gray-200 rounded-xl p-2.5 hover:border-[#1b4332] transition-colors">
                          <span className="block text-[10px] text-gray-400 font-medium">
                            Selesai
                          </span>
                          <div className="text-xs font-bold text-gray-800 mt-0.5">
                            {new Date(modalEndDate).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <input
                            type="date"
                            value={modalEndDate}
                            onChange={(e) => setModalEndDate(e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Kalkulator Total Biaya Box */}
                    <div className="bg-[#f0f7f3] border border-[#d1e7db] rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-600 block">
                          Total ({calculatedDays} hari)
                        </span>
                        <span className="text-lg font-bold text-[#1b4332]">
                          Rp {calculatedTotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#1b4332] font-medium bg-white/70 px-2 py-1 rounded-md">
                        Rp {modalProduct.price.toLocaleString("id-ID")} × {calculatedDays}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Konfirmasi Booking */}
                  <form onSubmit={handleConfirmBooking} className="mt-6">
                    <button
                      id="btn-konfirmasi-booking"
                      type="submit"
                      disabled={!modalProduct.available}
                      className="w-full py-3.5 bg-[#ea6a20] hover:bg-[#d95c14] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Konfirmasi Booking</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat Katalog...</div>}>
      <CustomerCatalogContent />
    </Suspense>
  );
}
