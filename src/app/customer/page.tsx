"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  CheckCircle2,
  LogOut,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

interface ProductSpec {
  label: string;
  value: string;
}

interface Product {
  id: string;
  codeId: string;
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

interface BookingRecord {
  code: string;
  items: string;
  shortItems?: string;
  period: string;
  startDate: string;
  endDate: string;
  location: string;
  total: number;
  status: "Pending" | "Approved" | "Picked Up" | "Completed" | "Cancelled";
  timeline: {
    title: string;
    detail: string;
    done: boolean;
  }[];
}

// Custom SVGs matching exact 3D outdoor gear from mockups
function ProductIllustration({ type }: { type: Product["type"] }) {
  if (type === "tent") {
    // 3D Orange Tent matching B4 screenshot exactly
    return (
      <svg
        viewBox="0 0 100 100"
        className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-md transform hover:scale-105 transition-transform duration-300"
      >
        <ellipse cx="50" cy="80" rx="34" ry="5" fill="#00000018" />
        <polygon points="50,22 18,76 48,76" fill="#d94814" />
        <polygon points="50,22 48,76 82,76" fill="#f97316" />
        <line x1="50" y1="22" x2="48" y2="76" stroke="#b93815" strokeWidth="1" />
        <polygon points="50,38 42,76 58,76" fill="#fef08a" />
        <polygon points="50,38 46,76 54,76" fill="#fde047" />
        <polygon points="50,38 38,76 44,76" fill="#ea580c" />
        <polygon points="50,38 56,76 62,76" fill="#ea580c" />
      </svg>
    );
  }

  if (type === "sleeping") {
    return (
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-md transform hover:scale-105 transition-transform duration-300"
      >
        <ellipse cx="50" cy="74" rx="30" ry="5" fill="#00000015" />
        <rect x="25" y="44" width="50" height="26" rx="4" fill="#d4a359" />
        <rect x="28" y="47" width="44" height="20" rx="3" fill="#ecd292" />
        <rect x="30" y="50" width="12" height="14" rx="2" fill="#fff" opacity="0.8" />
        <rect x="44" y="50" width="26" height="14" rx="2" fill="#d99938" />
      </svg>
    );
  }

  if (type === "stove") {
    return (
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-md transform hover:scale-105 transition-transform duration-300"
      >
        <ellipse cx="50" cy="76" rx="24" ry="4" fill="#00000015" />
        <path
          d="M50 20 C56 35 72 45 68 64 C64 76 54 80 50 80 C46 80 36 76 32 64 C28 45 44 35 50 20 Z"
          fill="#f97316"
        />
        <path
          d="M50 38 C54 48 64 56 61 68 C59 74 53 76 50 76 C47 76 41 74 39 68 C36 56 46 48 50 38 Z"
          fill="#facc15"
        />
      </svg>
    );
  }

  if (type === "light") {
    return (
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-md transform -rotate-45 hover:scale-105 transition-transform duration-300"
      >
        <ellipse cx="50" cy="78" rx="14" ry="3" fill="#00000015" />
        <rect x="42" y="38" width="16" height="34" rx="3" fill="#475569" />
        <polygon points="36,24 64,24 58,38 42,38" fill="#94a3b8" />
        <rect x="36" y="20" width="28" height="4" rx="1" fill="#cbd5e1" />
        <circle cx="50" cy="46" r="3" fill="#38bdf8" />
      </svg>
    );
  }

  if (type === "backpack") {
    return (
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-md transform hover:scale-105 transition-transform duration-300"
      >
        <ellipse cx="50" cy="78" rx="20" ry="4" fill="#00000015" />
        <rect x="34" y="28" width="32" height="46" rx="8" fill="#ef4444" />
        <rect x="38" y="44" width="24" height="22" rx="4" fill="#dc2626" />
        <rect x="44" y="22" width="12" height="8" rx="2" fill="#991b1b" />
        <line x1="38" y1="40" x2="62" y2="40" stroke="#7f1d1d" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-md transform hover:scale-105 transition-transform duration-300"
    >
      <ellipse cx="50" cy="74" rx="26" ry="5" fill="#00000015" />
      <circle cx="48" cy="48" r="22" fill="#334155" />
      <circle cx="48" cy="48" r="18" fill="#1e293b" />
      <ellipse cx="48" cy="48" rx="11" ry="9" fill="#f8fafc" />
      <circle cx="48" cy="48" r="5" fill="#f59e0b" />
      <rect x="68" y="45" width="18" height="6" rx="2" fill="#0f172a" />
    </svg>
  );
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    codeId: "6500a1b2c3d4e5f678905678",
    name: "Tenda Dome 4 Orang",
    category: "tenda",
    categoryLabel: "Tenda",
    price: 75000,
    available: true,
    stock: 3,
    bgPastel: "bg-[#9dc4b1]",
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
    codeId: "6500a1b2c3d4e5f678905679",
    name: "Sleeping Bag Mummy",
    category: "sleeping",
    categoryLabel: "Sleeping Gear",
    price: 25000,
    available: true,
    stock: 5,
    bgPastel: "bg-[#ecd292]",
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
    codeId: "6500a1b2c3d4e5f678905680",
    name: "Kompor Portable",
    category: "cooking",
    categoryLabel: "Cooking",
    price: 15000,
    available: false,
    stock: 0,
    bgPastel: "bg-[#f2a99b]",
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
    codeId: "6500a1b2c3d4e5f678905681",
    name: "Lampu Tenda LED",
    category: "lighting",
    categoryLabel: "Lighting",
    price: 10000,
    available: true,
    stock: 8,
    bgPastel: "bg-[#9fc3d9]",
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
    codeId: "6500a1b2c3d4e5f678905682",
    name: "Carrier 60L",
    category: "carrier",
    categoryLabel: "Lainnya",
    price: 35000,
    available: true,
    stock: 4,
    bgPastel: "bg-[#c9bfdb]",
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
    codeId: "6500a1b2c3d4e5f678905683",
    name: "Set Nesting Masak",
    category: "cooking",
    categoryLabel: "Cooking",
    price: 12000,
    available: true,
    stock: 6,
    bgPastel: "bg-[#ccd99f]",
    type: "nesting",
    specs: [
      { label: "Isi set", value: "2 Panci + 1 Wajan" },
      { label: "Bahan", value: "Anodized aluminium" },
      { label: "Pegangan", value: "Anti-panas lipat" },
      { label: "Kapasitas", value: "3-4 orang" },
    ],
  },
];

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    code: "BK-0128",
    items: "Tenda Dome 4 Orang, Lampu Tenda LED",
    shortItems: "Tenda Dome 4P, Lampu LED",
    period: "28–30 Sep 2026",
    startDate: "28 Sep 2026",
    endDate: "30 Sep 2026",
    location: "Kantor CampRent, Denpasar",
    total: 255000,
    status: "Pending",
    timeline: [
      {
        title: "Booking dibuat",
        detail: "28 Sep 2026, 09:12 · Menunggu konfirmasi admin",
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
  },
  {
    code: "BK-0121",
    items: "Sleeping Bag Mummy ×2",
    shortItems: "Sleeping Bag Mummy ×2",
    period: "20–22 Sep 2026",
    startDate: "20 Sep 2026",
    endDate: "22 Sep 2026",
    location: "Kantor CampRent, Denpasar",
    total: 100000,
    status: "Approved",
    timeline: [
      {
        title: "Booking dibuat",
        detail: "20 Sep 2026, 10:15 · Berhasil dicatat",
        done: true,
      },
      {
        title: "Disetujui admin",
        detail: "20 Sep 2026, 11:30 · Siap diambil di basecamp",
        done: true,
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
  },
  {
    code: "BK-0117",
    items: "Carrier 60L Osprey Volt",
    shortItems: "Carrier 60L",
    period: "14–17 Sep 2026",
    startDate: "14 Sep 2026",
    endDate: "17 Sep 2026",
    location: "Kantor CampRent, Denpasar",
    total: 105000,
    status: "Picked Up",
    timeline: [
      {
        title: "Booking dibuat",
        detail: "14 Sep 2026, 08:20 · Berhasil dicatat",
        done: true,
      },
      {
        title: "Disetujui admin",
        detail: "14 Sep 2026, 09:00 · Terkonfirmasi",
        done: true,
      },
      {
        title: "Alat diambil",
        detail: "14 Sep 2026, 14:00 · Fisik unit lengkap & lulus cek",
        done: true,
      },
      {
        title: "Alat dikembalikan",
        detail: "Menunggu",
        done: false,
      },
    ],
  },
  {
    code: "BK-0102",
    items: "Set Nesting Masak DS-308",
    shortItems: "Set Nesting Masak",
    period: "02–04 Sep 2026",
    startDate: "02 Sep 2026",
    endDate: "04 Sep 2026",
    location: "Kantor CampRent, Denpasar",
    total: 36000,
    status: "Completed",
    timeline: [
      {
        title: "Booking dibuat",
        detail: "02 Sep 2026, 09:00 · Berhasil dicatat",
        done: true,
      },
      {
        title: "Disetujui admin",
        detail: "02 Sep 2026, 09:45 · Terkonfirmasi",
        done: true,
      },
      {
        title: "Alat diambil",
        detail: "02 Sep 2026, 13:00 · Selesai serah terima",
        done: true,
      },
      {
        title: "Alat dikembalikan",
        detail: "04 Sep 2026, 17:30 · Unit bersih & deposit kembali",
        done: true,
      },
    ],
  },
];

function CustomerPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search & Navigation states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState<"katalog" | "sewa" | "status">("katalog");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Date hero filters
  const [startDate, setStartDate] = useState("2026-09-28");
  const [endDate, setEndDate] = useState("2026-09-30");

  // Sidebar filters - empty by default so ALL 6 products display initially
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [availabilityFilter, setAvailabilityFilter] = useState<"available" | "all">("available");

  // Detail Modal & Price Calculator
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalStartDate, setModalStartDate] = useState("2026-09-28");
  const [modalEndDate, setModalEndDate] = useState("2026-09-30");
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);

  // Bookings list state
  const [bookingList, setBookingList] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  // Active tracking code in B5 section
  const [selectedTrackingCode, setSelectedTrackingCode] = useState<string>("BK-0128");

  // Auto-open modal if requested via URL param (e.g. ?open=tenda or ?modal=1)
  useEffect(() => {
    const modalParam = searchParams.get("modal") || searchParams.get("open");
    if (modalParam) {
      const match = INITIAL_PRODUCTS.find((p) =>
        p.id === modalParam || p.category === modalParam || p.name.toLowerCase().includes(modalParam.toLowerCase())
      );
      if (match) {
        setModalProduct(match);
      } else {
        setModalProduct(INITIAL_PRODUCTS[0]);
      }
    }
  }, [searchParams]);

  // Helper to calculate days inclusive (e.g. 28 Sep to 30 Sep = 3 days)
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

  // Selected booking record for tracker B5
  const activeBooking = useMemo(() => {
    return (
      bookingList.find((b) => b.code === selectedTrackingCode) ||
      bookingList[0] ||
      INITIAL_BOOKINGS[0]
    );
  }, [bookingList, selectedTrackingCode]);

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

  // Filtered products: shows all items if selectedCategories is empty
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((item) => {
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

  const handleApplyFilter = () => {
    const catalogEl = document.getElementById("catalog-section");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Confirm booking action
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalProduct) return;

    const newCode = `BK-0${Math.floor(130 + Math.random() * 50)}`;
    const formatPeriod = (startStr: string, endStr: string) => {
      const s = new Date(startStr);
      const e = new Date(endStr);
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
      ];
      return `${s.getDate()}–${e.getDate()} ${monthNames[e.getMonth()]} ${e.getFullYear()}`;
    };

    const newRecord: BookingRecord = {
      code: newCode,
      items: modalProduct.name,
      shortItems: modalProduct.name,
      period: formatPeriod(modalStartDate, modalEndDate),
      startDate: `${new Date(modalStartDate).getDate()} Sep 2026`,
      endDate: `${new Date(modalEndDate).getDate()} Sep 2026`,
      location: "Kantor CampRent, Denpasar",
      total: calculatedTotal,
      status: "Pending",
      timeline: [
        {
          title: "Booking dibuat",
          detail: "Baru saja · Menunggu konfirmasi admin",
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

    setBookingList([newRecord, ...bookingList]);
    setBookingSuccessCode(newCode);
    setSelectedTrackingCode(newCode);

    setTimeout(() => {
      setModalProduct(null);
      const el = document.getElementById("status-booking-section");
      el?.scrollIntoView({ behavior: "smooth" });
    }, 1500);
  };

  const handleCancelBooking = (code: string) => {
    if (confirm(`Apakah Anda yakin ingin membatalkan booking ${code}?`)) {
      setBookingList((prev) =>
        prev.map((b) => (b.code === code ? { ...b, status: "Cancelled" } : b))
      );
      alert(`Booking ${code} telah dibatalkan.`);
    }
  };

  const handleContactAdmin = () => {
    alert("Menghubungi Admin CampRent melalui WhatsApp: +62 812-3456-7890 (Universitas Primakara).");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("camprent_user");
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 flex flex-col font-sans">
      {/* ================= 1. TOP NAVBAR ================= */}
      <nav className="bg-[#1e4732] text-white px-6 py-3.5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Nav Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Camp<span className="text-[#f97316]">Rent</span>
            </Link>

            <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
              <button
                type="button"
                onClick={() => {
                  setActiveNav("katalog");
                  const el = document.getElementById("catalog-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`transition-colors cursor-pointer ${
                  activeNav === "katalog"
                    ? "text-[#f97316] font-semibold"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                Katalog
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveNav("sewa");
                  const el = document.getElementById("riwayat-booking-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`transition-colors cursor-pointer ${
                  activeNav === "sewa"
                    ? "text-[#f97316] font-semibold"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                Sewa Saya
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveNav("status");
                  const el = document.getElementById("status-booking-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`transition-colors cursor-pointer ${
                  activeNav === "status"
                    ? "text-[#f97316] font-semibold"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                Status Booking
              </button>
            </div>
          </div>

          {/* Search bar & Avatar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari alat camping..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 sm:w-64 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-gray-300 text-xs px-3.5 py-2 pl-8 rounded-full border border-white/20 focus:outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gray-300 absolute left-3 top-2.5" />
            </div>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-[#f97316] text-white text-xs font-bold flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              >
                AN
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-xs text-gray-700 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-900">
                    Gede Santana (Customer)
                    <div className="text-[10px] text-gray-400 font-normal">
                      customer@gmail.com
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      const el = document.getElementById("riwayat-booking-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    Riwayat Sewa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      const el = document.getElementById("status-booking-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    Pelacakan Booking (B5)
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="bg-[#24523b] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Hero Left Text */}
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3 tracking-tight">
              Sewa Alat Camping<br />
              Tanpa Ribet
            </h1>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              Pilih tanggal, cek stok yang tersedia, dan booking dalam hitungan menit.
            </p>
          </div>

          {/* Date Picker Form Card (Matches Design) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg max-w-lg w-full text-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Tanggal ambil
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#24523b]"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Tanggal kembali
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#24523b]"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="w-full py-2.5 px-3 bg-[#e66e19] hover:bg-[#d46112] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Cek Ketersediaan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. SIDEBAR FILTER + PRODUCT GRID ================= */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Filter */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Filter
            </h2>

            {/* Kategori Checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-3">
                Kategori
              </label>
              <div className="space-y-2.5">
                {[
                  { key: "tenda", label: "Tenda", count: 12 },
                  { key: "sleeping", label: "Sleeping Gear", count: 9 },
                  { key: "cooking", label: "Cooking", count: 7 },
                  { key: "lighting", label: "Lighting", count: 5 },
                ].map((cat) => {
                  const isChecked = selectedCategories.includes(cat.key);
                  return (
                    <label
                      key={cat.key}
                      className="flex items-center justify-between text-xs text-gray-700 cursor-pointer select-none hover:text-gray-900"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCategoryToggle(cat.key)}
                          className="w-4 h-4 rounded text-[#24523b] focus:ring-[#24523b] border-gray-300"
                        />
                        <span>{cat.label}</span>
                      </div>
                      <span className="text-gray-400 text-[11px]">{cat.count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Harga / hari Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-semibold text-gray-800">
                <span>Harga / hari</span>
                <span className="text-[#24523b] font-bold">
                  Rp {maxPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={100000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#24523b] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>Rp 10.000</span>
                <span>Rp 100.000</span>
              </div>
            </div>

            {/* Ketersediaan Radios */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-2">
                Ketersediaan
              </label>
              <div className="space-y-2 text-xs text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    value="available"
                    checked={availabilityFilter === "available"}
                    onChange={() => setAvailabilityFilter("available")}
                    className="text-[#24523b] focus:ring-[#24523b]"
                  />
                  <span>Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    value="all"
                    checked={availabilityFilter === "all"}
                    onChange={() => setAvailabilityFilter("all")}
                    className="text-[#24523b] focus:ring-[#24523b]"
                  />
                  <span>Semua</span>
                </label>
              </div>
            </div>

            {/* Terapkan Button */}
            <button
              type="button"
              onClick={handleApplyFilter}
              className="w-full py-2.5 bg-[#276738] hover:bg-[#1f542d] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Terapkan
            </button>
          </div>

          {/* Product Grid (3 Columns) - ALL 6 Products Rendered */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  id={`card-${prod.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg hover:border-gray-200 group"
                >
                  <div
                    onClick={() => handleOpenDetailModal(prod)}
                    className="cursor-pointer"
                  >
                    {/* Pastel Header with exact 3D illustration */}
                    <div
                      className={`h-44 ${prod.bgPastel} flex items-center justify-center p-4 transition-transform group-hover:scale-102 duration-300`}
                    >
                      <ProductIllustration type={prod.type} />
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-1.5">
                      <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-[#24523b] transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        {prod.categoryLabel}
                      </p>

                      <div className="flex items-baseline gap-1 text-sm font-extrabold text-gray-900 pt-1">
                        <span>Rp {prod.price.toLocaleString("id-ID")}</span>
                        <span className="text-[11px] font-normal text-gray-400">/ hari</span>
                      </div>

                      {/* Availability Tag */}
                      <div className="pt-1">
                        {prod.available ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#eaf5ea] text-[#2e7d32] border border-[#2e7d32]/20">
                            Available
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#fde8e8] text-[#c53030] border border-[#c53030]/20">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Button */}
                  <div className="p-4 pt-0 mt-3">
                    {prod.available ? (
                      <button
                        type="button"
                        id={`btn-sewa-${prod.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetailModal(prod);
                        }}
                        className="w-full py-2.5 bg-[#e66e19] hover:bg-[#d46112] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs active:scale-98"
                      >
                        Sewa Sekarang
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2.5 bg-[#cbd5e1] text-gray-500 text-xs font-semibold rounded-lg cursor-not-allowed"
                      >
                        Stok Habis
                      </button>
                    )}
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
                    setSelectedCategories([]);
                    setMaxPrice(100000);
                    setAvailabilityFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-[#24523b] bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                >
                  Tampilkan Semua Alat
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= 4. RIWAYAT BOOKING TABLE ================= */}
      <section
        id="riwayat-booking-section"
        className="max-w-7xl mx-auto px-6 pb-12 w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">
            Sewa Saya – Riwayat Booking
          </h2>
          <span className="text-xs text-gray-400">
            Klik baris untuk melihat status pelacakan real-time di bawah
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9fa] text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Kode</th>
                  <th className="px-6 py-3.5">Alat</th>
                  <th className="px-6 py-3.5">Periode</th>
                  <th className="px-6 py-3.5">Total</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookingList.map((row) => {
                  let badgeClass = "bg-gray-100 text-gray-600";
                  if (row.status === "Pending") {
                    badgeClass = "bg-[#ffedd5] text-[#c2410c]";
                  } else if (row.status === "Approved") {
                    badgeClass = "bg-[#e0f2fe] text-[#0369a1]";
                  } else if (row.status === "Picked Up") {
                    badgeClass = "bg-[#ccfbf1] text-[#0f766e]";
                  } else if (row.status === "Completed") {
                    badgeClass = "bg-[#f1f5f9] text-[#64748b]";
                  } else if (row.status === "Cancelled") {
                    badgeClass = "bg-red-100 text-red-700";
                  }

                  const isSelected = row.code === selectedTrackingCode;

                  return (
                    <tr
                      key={row.code}
                      onClick={() => {
                        setSelectedTrackingCode(row.code);
                        const el = document.getElementById("status-booking-section");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`hover:bg-gray-50/80 cursor-pointer transition-colors ${
                        isSelected ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                        {row.code}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {row.items}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {row.period}
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-semibold whitespace-nowrap">
                        Rp {row.total.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${badgeClass}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= B5. CUSTOMER – STATUS BOOKING (PELACAKAN REAL-TIME) ================= */}
      <section
        id="status-booking-section"
        className="max-w-7xl mx-auto px-6 pb-20 w-full"
      >
        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#387e45] block">
            B5. Pelacakan Real-time
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
            Status Booking
          </h2>
        </div>

        {/* Outer White Card Container matching Mockup B5 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 1. Kolom Kiri: Daftar Booking Aktif */}
            <div className="lg:col-span-4 space-y-3">
              {bookingList.map((item) => {
                const isActive = item.code === activeBooking.code;

                // Status Badge Color
                let pillClass = "bg-gray-100 text-gray-600";
                if (item.status === "Pending") {
                  pillClass = "bg-[#ffedd5] text-[#c2410c]";
                } else if (item.status === "Approved") {
                  pillClass = "bg-[#e0f2fe] text-[#0369a1]";
                } else if (item.status === "Picked Up") {
                  pillClass = "bg-[#ccfbf1] text-[#0f766e]";
                } else if (item.status === "Completed") {
                  pillClass = "bg-[#f1f5f9] text-[#64748b]";
                } else if (item.status === "Cancelled") {
                  pillClass = "bg-red-100 text-red-700";
                }

                return (
                  <div
                    key={item.code}
                    onClick={() => setSelectedTrackingCode(item.code)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#eef7f0] border-[#387e45] shadow-xs"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-gray-900">
                        {item.code}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${pillClass}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-snug line-clamp-1">
                      {item.shortItems || item.items}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* 2. Kolom Kanan: Detail Pelacakan Status & Stepper */}
            <div className="lg:col-span-8 space-y-6">
              {/* Header: Kode, Nama Unit, dan Badge Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {activeBooking.code}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeBooking.items}
                  </p>
                </div>

                <div>
                  {activeBooking.status === "Pending" && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c]">
                      Pending
                    </span>
                  )}
                  {activeBooking.status === "Approved" && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e0f2fe] text-[#0369a1]">
                      Approved
                    </span>
                  )}
                  {activeBooking.status === "Picked Up" && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#ccfbf1] text-[#0f766e]">
                      Picked Up
                    </span>
                  )}
                  {activeBooking.status === "Completed" && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#f1f5f9] text-[#64748b]">
                      Completed
                    </span>
                  )}
                  {activeBooking.status === "Cancelled" && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>

              {/* Horizontal Stepper (Pending -> Approved -> Picked Up -> Completed) */}
              <div className="py-4">
                {/* Stepper Grid Container */}
                <div className="relative flex items-center justify-between w-full">
                  {/* Background connecting line */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 z-0" />

                  {/* Step 1: Pending */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        activeBooking.status === "Pending"
                          ? "bg-[#f97316] text-white shadow-sm ring-4 ring-orange-100"
                          : "bg-[#276738] text-white"
                      }`}
                    >
                      1
                    </div>
                    <span className="text-xs font-bold text-gray-900 mt-2">
                      Pending
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      28 Sep, 09:12
                    </span>
                  </div>

                  {/* Step 2: Approved */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        activeBooking.status === "Approved"
                          ? "bg-[#0284c7] text-white ring-4 ring-sky-100"
                          : activeBooking.status === "Picked Up" ||
                            activeBooking.status === "Completed"
                          ? "bg-[#276738] text-white"
                          : "bg-white border-2 border-gray-300 text-gray-400"
                      }`}
                    >
                      2
                    </div>
                    <span
                      className={`text-xs mt-2 ${
                        activeBooking.status === "Approved"
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      Approved
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      {activeBooking.status === "Pending"
                        ? "Menunggu"
                        : "20 Sep, 11:30"}
                    </span>
                  </div>

                  {/* Step 3: Picked Up */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        activeBooking.status === "Picked Up"
                          ? "bg-[#0f766e] text-white ring-4 ring-teal-100"
                          : activeBooking.status === "Completed"
                          ? "bg-[#276738] text-white"
                          : "bg-white border-2 border-gray-300 text-gray-400"
                      }`}
                    >
                      3
                    </div>
                    <span
                      className={`text-xs mt-2 ${
                        activeBooking.status === "Picked Up"
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      Picked Up
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      {activeBooking.status === "Picked Up"
                        ? "14 Sep, 14:00"
                        : activeBooking.status === "Completed"
                        ? "02 Sep, 13:00"
                        : "Menunggu"}
                    </span>
                  </div>

                  {/* Step 4: Completed */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        activeBooking.status === "Completed"
                          ? "bg-[#64748b] text-white ring-4 ring-slate-100"
                          : "bg-white border-2 border-gray-300 text-gray-400"
                      }`}
                    >
                      4
                    </div>
                    <span
                      className={`text-xs mt-2 ${
                        activeBooking.status === "Completed"
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      Completed
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      {activeBooking.status === "Completed"
                        ? "04 Sep, 17:30"
                        : "Menunggu"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid 2x2: Tanggal ambil, Tanggal kembali, Lokasi, Total bayar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-y border-gray-100 py-4 text-xs">
                <div>
                  <span className="text-gray-400 text-[11px] block">
                    Tanggal ambil
                  </span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">
                    {activeBooking.startDate}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 text-[11px] block">
                    Tanggal kembali
                  </span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">
                    {activeBooking.endDate}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 text-[11px] block">
                    Lokasi pengambilan
                  </span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">
                    {activeBooking.location}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 text-[11px] block">
                    Total bayar
                  </span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">
                    Rp {activeBooking.total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Riwayat Status (Vertical Timeline) */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 mb-3">
                  Riwayat status
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {activeBooking.timeline.map((tl, idx) => (
                    <div key={idx} className="relative">
                      {/* Node Dot */}
                      <div
                        className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ${
                          tl.done ? "bg-[#276738] ring-2 ring-emerald-100" : "bg-gray-300"
                        }`}
                      />
                      <p
                        className={`text-xs ${
                          tl.done ? "font-bold text-gray-900" : "font-medium text-gray-600"
                        }`}
                      >
                        {tl.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {tl.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Hubungi Admin & Batalkan Booking */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
                <button
                  type="button"
                  id="btn-hubungi-admin"
                  onClick={handleContactAdmin}
                  className="w-full sm:w-1/2 py-2.5 px-4 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-center"
                >
                  Hubungi Admin
                </button>

                <button
                  type="button"
                  id="btn-batalkan-booking"
                  onClick={() => handleCancelBooking(activeBooking.code)}
                  className="w-full sm:w-1/2 py-2.5 px-4 bg-[#ba2d2d] hover:bg-[#a32222] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center shadow-xs"
                >
                  Batalkan Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= B4. MODAL DETAIL ALAT & KALKULATOR HARGA (2 KOLOM PERSIS DESAIN B4) ================= */}
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
                <div className="w-16 h-16 bg-emerald-100 text-[#24523b] rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-95">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  Booking Berhasil Dikonfirmasi!
                </h3>
                <p className="text-xs text-gray-500 mb-5">
                  Kode reservasi Anda telah tercatat dan masuk ke daftar Sewa Saya.
                </p>
                <div className="bg-emerald-50 text-[#24523b] font-mono font-bold text-lg px-6 py-2.5 rounded-xl inline-block mb-6 border border-emerald-200">
                  {bookingSuccessCode}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setModalProduct(null);
                      const el = document.getElementById("status-booking-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-6 py-2.5 bg-[#276738] hover:bg-[#1f542d] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Lihat Pelacakan Real-time
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
                {/* 1. Kolom Kiri: Foto / Thumbnail Pastel */}
                <div
                  className={`md:col-span-6 ${modalProduct.bgPastel} p-8 flex items-center justify-center relative overflow-hidden select-none`}
                >
                  <ProductIllustration type={modalProduct.type} />
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
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fde8e8] text-[#c53030] border border-[#c53030]/20">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Judul & ID */}
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">
                      {modalProduct.name}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5 mb-5 font-mono">
                      {modalProduct.categoryLabel} · ID {modalProduct.codeId}
                    </p>

                    {/* Spesifikasi Grid */}
                    <div className="space-y-2 mb-6">
                      {modalProduct.specs.map((sp, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-xs"
                        >
                          <span className="text-gray-400">{sp.label}</span>
                          <span className="font-semibold text-gray-900">
                            {sp.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Input Tanggal Ambil & Kembali */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Tanggal ambil
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={modalStartDate}
                            onChange={(e) => setModalStartDate(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                          />
                          <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-800 bg-white flex items-center justify-between">
                            <span>
                              {(() => {
                                try {
                                  const d = new Date(modalStartDate);
                                  const m = [
                                    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
                                    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
                                  ];
                                  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
                                } catch {
                                  return modalStartDate;
                                }
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Tanggal kembali
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={modalEndDate}
                            onChange={(e) => setModalEndDate(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                          />
                          <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-800 bg-white flex items-center justify-between">
                            <span>
                              {(() => {
                                try {
                                  const d = new Date(modalEndDate);
                                  const m = [
                                    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
                                    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
                                  ];
                                  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
                                } catch {
                                  return modalEndDate;
                                }
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Box Kalkulator Total */}
                    <div className="bg-[#f8f9fa] rounded-xl p-4 space-y-2 text-xs border border-gray-100 mb-6">
                      <div className="flex justify-between text-gray-500">
                        <span>Total hari</span>
                        <span className="font-bold text-gray-900">
                          {calculatedDays} hari
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Harga / hari</span>
                        <span className="font-bold text-gray-900">
                          Rp {modalProduct.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between items-center text-sm">
                        <span className="font-bold text-[#24523b]">Total Bayar</span>
                        <span className="font-extrabold text-[#24523b] text-base">
                          Rp {calculatedTotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Konfirmasi Booking */}
                  <div>
                    {modalProduct.available ? (
                      <button
                        type="button"
                        id="btn-confirm-booking"
                        onClick={handleConfirmBooking}
                        className="w-full py-3 bg-[#276738] hover:bg-[#1f542d] active:bg-[#184524] text-white font-semibold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
                      >
                        Konfirmasi Booking
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full py-3 bg-[#cbd5e1] text-gray-500 font-semibold rounded-lg text-xs sm:text-sm cursor-not-allowed"
                      >
                        Stok Tidak Tersedia
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat Katalog...</div>}>
      <CustomerPortal />
    </Suspense>
  );
}
