"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  LogOut,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Camera,
  Check,
  UserPlus,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface BookingItem {
  kode: string;
  customer: string;
  alat: string;
  periode: string;
  total: number;
  pembayaran: "Belum bayar" | "Lunas";
  status: "Pending" | "Approved" | "Picked Up" | "Completed" | "Cancelled";
}

interface EquipmentStockItem {
  idDoc: string;
  name: string;
  category: "Tenda" | "Sleeping Gear" | "Cooking" | "Lighting";
  stock: number;
  pricePerDay: number;
  totalValue: number;
  description?: string;
  tags?: string[];
  status: "Tersedia" | "Menipis" | "Habis";
  iconType: "tent" | "sleeping" | "matras" | "stove" | "light";
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Admin" | "Staff";
  status: "Aktif" | "Nonaktif";
}

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    kode: "BK-0128",
    customer: "Kadek Ayu",
    alat: "Tenda Dome 4P, Lampu LED",
    periode: "28–30 Sep",
    total: 255000,
    pembayaran: "Belum bayar",
    status: "Pending",
  },
  {
    kode: "BK-0127",
    customer: "Rian Pratama",
    alat: "Sleeping Bag ×2",
    periode: "24–25 Sep",
    total: 100000,
    pembayaran: "Lunas",
    status: "Approved",
  },
  {
    kode: "BK-0117",
    customer: "Wayan Dita",
    alat: "Carrier 60L",
    periode: "14–17 Sep",
    total: 105000,
    pembayaran: "Lunas",
    status: "Picked Up",
  },
  {
    kode: "BK-0102",
    customer: "Bagus Arya",
    alat: "Set Nesting Masak",
    periode: "02–04 Sep",
    total: 36000,
    pembayaran: "Lunas",
    status: "Completed",
  },
];

const INITIAL_STOCK_ITEMS: EquipmentStockItem[] = [
  {
    idDoc: "6500a1b2c3d4...5678",
    name: "Tenda Dome 4 Orang",
    category: "Tenda",
    stock: 3,
    pricePerDay: 75000,
    totalValue: 950000,
    description: "Tenda luas untuk keluarga, double layer, anti air 3000 mm.",
    tags: ["family", "waterproof"],
    status: "Menipis",
    iconType: "tent",
  },
  {
    idDoc: "6500a1b2c3d4...5679",
    name: "Tenda Dome 2 Orang",
    category: "Tenda",
    stock: 6,
    pricePerDay: 45000,
    totalValue: 550000,
    description: "Tenda praktis 2 orang, ringan dibawa mendaki.",
    tags: ["compact", "waterproof"],
    status: "Tersedia",
    iconType: "tent",
  },
  {
    idDoc: "6500a1b2c3d4...5680",
    name: "Sleeping Bag Mummy",
    category: "Sleeping Gear",
    stock: 12,
    pricePerDay: 25000,
    totalValue: 300000,
    description: "Bahan polar hangat tahan suhu hingga 10°C.",
    tags: ["warm", "polar"],
    status: "Tersedia",
    iconType: "sleeping",
  },
  {
    idDoc: "6500a1b2c3d4...5681",
    name: "Matras Gulung",
    category: "Sleeping Gear",
    stock: 2,
    pricePerDay: 10000,
    totalValue: 120000,
    description: "Matras busa empuk penahan dingin tanah.",
    tags: ["lightweight"],
    status: "Menipis",
    iconType: "matras",
  },
  {
    idDoc: "6500a1b2c3d4...5682",
    name: "Kompor Portable",
    category: "Cooking",
    stock: 0,
    pricePerDay: 15000,
    totalValue: 180000,
    description: "Kompor mini windproof pemantik piezo elektrik.",
    tags: ["portable", "windproof"],
    status: "Habis",
    iconType: "stove",
  },
  {
    idDoc: "6500a1b2c3d4...5683",
    name: "Lampu Tenda LED",
    category: "Lighting",
    stock: 9,
    pricePerDay: 10000,
    totalValue: 90000,
    description: "Lampu LED gantung recharge USB baterai 2400 mAh.",
    tags: ["rechargeable", "bright"],
    status: "Tersedia",
    iconType: "light",
  },
];

const INITIAL_USERS: UserItem[] = [
  {
    id: "u1",
    name: "Kadek Ayu",
    email: "kadek@mail.com",
    role: "Customer",
    status: "Aktif",
  },
  {
    id: "u2",
    name: "Ida Bagus",
    email: "idabagus@mail.com",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: "u3",
    name: "Putu Sanjaya",
    email: "putu@mail.com",
    role: "Staff",
    status: "Aktif",
  },
  {
    id: "u4",
    name: "Rian Pratama",
    email: "rian@mail.com",
    role: "Customer",
    status: "Aktif",
  },
];

function MiniEquipmentIcon({ type }: { type: EquipmentStockItem["iconType"] }) {
  if (type === "tent") {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#ebf6ed] flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#ea6a20]" fill="currentColor">
          <polygon points="12,3 3,20 21,20" />
          <polygon points="12,8 9,20 15,20" fill="#facc15" />
        </svg>
      </div>
    );
  }
  if (type === "sleeping") {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#fef3c7] flex items-center justify-center shrink-0 text-xs">
        🛌
      </div>
    );
  }
  if (type === "matras") {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#fef3c7] flex items-center justify-center shrink-0 text-xs">
        ⛺
      </div>
    );
  }
  if (type === "stove") {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#fee2e2] flex items-center justify-center shrink-0 text-xs">
        🔥
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-lg bg-[#e0f2fe] flex items-center justify-center shrink-0 text-xs">
      🔦
    </div>
  );
}

function DashboardApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab =
    (searchParams.get("tab") as "dashboard" | "stok" | "booking" | "pengguna") ||
    "dashboard";

  const [activeMenu, setActiveMenu] = useState<
    "dashboard" | "stok" | "booking" | "pengguna"
  >(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "stok") {
      setActiveMenu("stok");
    } else if (tabParam === "booking") {
      setActiveMenu("booking");
    } else if (tabParam === "pengguna") {
      setActiveMenu("pengguna");
    } else if (tabParam === "dashboard") {
      setActiveMenu("dashboard");
    }
  }, [searchParams]);

  // Dashboard state
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  // Booking & Pembayaran state
  const [bookingFilter, setBookingFilter] = useState<
    "Semua" | "Pending" | "Approved" | "Picked Up" | "Completed"
  >("Semua");
  const [bookingPage, setBookingPage] = useState(1);

  // Stok state
  const [stockItems, setStockItems] = useState<EquipmentStockItem[]>(INITIAL_STOCK_ITEMS);
  const [searchStock, setSearchStock] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal 1: Tambah / Edit Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentStockItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Tenda" as EquipmentStockItem["category"],
    stock: 4,
    pricePerDay: 95000,
    totalValue: 850000,
    description: "Tenda luas untuk keluarga, double layer, anti air 3000 mm.",
    tags: ["family", "waterproof"],
  });

  // Modal 2: Konfirmasi Hapus Modal state
  const [itemToDelete, setItemToDelete] = useState<EquipmentStockItem | null>(null);

  // Pengguna & Role state
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingRoleUser, setEditingRoleUser] = useState<UserItem | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "Customer" as UserItem["role"],
  });

  const handleApprove = (kode: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.kode === kode ? { ...b, status: "Approved", pembayaran: "Lunas" } : b
      )
    );
  };

  const handleReject = (kode: string) => {
    if (confirm(`Apakah Anda yakin ingin menolak booking ${kode}?`)) {
      setBookings((prev) =>
        prev.map((b) => (b.kode === kode ? { ...b, status: "Cancelled" } : b))
      );
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("camprent_user");
    }
    router.push("/login");
  };

  // Stock Filter Logic
  const filteredStockItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchCat =
        selectedCategory === "Semua" || item.category === selectedCategory;
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchStock.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [stockItems, selectedCategory, searchStock]);

  // Booking & Pembayaran Filter Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (bookingFilter === "Semua") return true;
      return b.status === bookingFilter;
    });
  }, [bookings, bookingFilter]);

  // Open Edit Modal
  const handleOpenEdit = (item: EquipmentStockItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      stock: item.stock,
      pricePerDay: item.pricePerDay,
      totalValue: item.totalValue,
      description: item.description || "",
      tags: item.tags || ["family", "waterproof"],
    });
    setIsFormModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "Tenda Dome 6 Orang",
      category: "Tenda",
      stock: 4,
      pricePerDay: 95000,
      totalValue: 850000,
      description: "Tenda luas untuk keluarga, double layer, anti air 3000 mm.",
      tags: ["family", "waterproof"],
    });
    setIsFormModalOpen(true);
  };

  // Save Add / Edit Stock
  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    let computedStatus: EquipmentStockItem["status"] = "Tersedia";
    if (formData.stock <= 0) computedStatus = "Habis";
    else if (formData.stock <= 3) computedStatus = "Menipis";

    if (editingItem) {
      setStockItems((prev) =>
        prev.map((item) =>
          item.idDoc === editingItem.idDoc
            ? {
                ...item,
                name: formData.name,
                category: formData.category,
                stock: Number(formData.stock),
                pricePerDay: Number(formData.pricePerDay),
                totalValue: Number(formData.totalValue),
                description: formData.description,
                tags: formData.tags,
                status: computedStatus,
              }
            : item
        )
      );
    } else {
      const newId = `6500a1b2c3d4...${Math.floor(5684 + Math.random() * 50)}`;
      const newItem: EquipmentStockItem = {
        idDoc: newId,
        name: formData.name,
        category: formData.category,
        stock: Number(formData.stock),
        pricePerDay: Number(formData.pricePerDay),
        totalValue: Number(formData.totalValue),
        description: formData.description,
        tags: formData.tags,
        status: computedStatus,
        iconType:
          formData.category === "Tenda"
            ? "tent"
            : formData.category === "Sleeping Gear"
            ? "sleeping"
            : formData.category === "Cooking"
            ? "stove"
            : "light",
      };
      setStockItems([newItem, ...stockItems]);
    }
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setStockItems((prev) => prev.filter((item) => item.idDoc !== itemToDelete.idDoc));
    setItemToDelete(null);
  };

  const handleAddTag = () => {
    const newTag = prompt("Masukkan tag baru:");
    if (newTag && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
    }
  };

  // User & Role Actions
  const handleOpenAddUser = () => {
    setUserFormData({ name: "", email: "", role: "Customer" });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name || !userFormData.email) return;

    const newUser: UserItem = {
      id: `u${Date.now()}`,
      name: userFormData.name,
      email: userFormData.email,
      role: userFormData.role,
      status: "Aktif",
    };
    setUsers([...users, newUser]);
    setIsUserModalOpen(false);
  };

  const handleOpenEditRole = (user: UserItem) => {
    setEditingRoleUser(user);
  };

  const handleSaveRole = (newRole: UserItem["role"]) => {
    if (!editingRoleUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingRoleUser.id ? { ...u, role: newRole } : u))
    );
    setEditingRoleUser(null);
  };

  const handleToggleUserStatus = (id: string, name: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "Aktif" ? "Nonaktif" : "Aktif";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 flex font-sans">
      {/* ================= 1. LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-[#1b4332] text-white flex flex-col justify-between shrink-0 min-h-screen sticky top-0">
        <div>
          {/* Logo Brand */}
          <div className="px-6 py-6 border-b border-white/10">
            <Link href="/dashboard" className="text-2xl font-bold tracking-tight">
              Camp<span className="text-[#f97316]">Rent</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveMenu("dashboard");
                router.replace("/dashboard");
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeMenu === "dashboard"
                  ? "bg-white/15 text-white shadow-xs"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMenu("stok");
                router.replace("/dashboard?tab=stok");
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeMenu === "stok"
                  ? "bg-white/15 text-white shadow-xs"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Manajemen Stok Alat</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMenu("booking");
                router.replace("/dashboard?tab=booking");
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeMenu === "booking"
                  ? "bg-white/15 text-white shadow-xs"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Booking & Pembayaran</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMenu("pengguna");
                router.replace("/dashboard?tab=pengguna");
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeMenu === "pengguna"
                  ? "bg-white/15 text-white shadow-xs"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Pengguna & Role</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-gray-400">Login sebagai Admin</span>
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ================= 2. MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {activeMenu === "stok"
              ? "Manajemen Stok Alat"
              : activeMenu === "booking"
              ? "Booking & Pembayaran"
              : activeMenu === "pengguna"
              ? "Pengguna & Role"
              : "Dashboard Admin"}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-700">Ida Bagus</span>
            <div className="w-8 h-8 rounded-full bg-[#ea6a20] text-white text-xs font-bold flex items-center justify-center shadow-xs select-none">
              IB
            </div>
          </div>
        </header>

        {/* ================= 3. BODY VIEW ================= */}
        {activeMenu === "pengguna" ? (
          /* ================= PENGGUNA & ROLE VIEW (PERSIS MOCKUP) ================= */
          <main className="p-6 sm:p-8 space-y-6 flex-1">
            {/* Header: Title & Tambah Pengguna Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Pengguna & Role
              </h2>

              <button
                type="button"
                onClick={handleOpenAddUser}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#256c38] hover:bg-[#1e582e] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <span>+ Tambah Pengguna</span>
              </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f9fa] text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-medium text-gray-600">Nama</th>
                      <th className="px-6 py-4 font-medium text-gray-600">Email</th>
                      <th className="px-6 py-4 font-medium text-gray-600">Role</th>
                      <th className="px-6 py-4 font-medium text-gray-600">Status</th>
                      <th className="px-6 py-4 font-medium text-gray-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => {
                      const firstLetter = user.name.charAt(0).toUpperCase();

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50/80 transition-colors"
                        >
                          {/* Nama dengan avatar bulat oranye */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#ea6a20] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {firstLetter}
                              </div>
                              <span className="font-bold text-gray-900 text-xs">
                                {user.name}
                              </span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                            {user.email}
                          </td>

                          {/* Role Badge */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.role === "Customer" && (
                              <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-semibold bg-[#e0f2fe] text-[#2563eb]">
                                Customer
                              </span>
                            )}
                            {user.role === "Admin" && (
                              <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-semibold bg-[#ffedd5] text-[#ea580c]">
                                Admin
                              </span>
                            )}
                            {user.role === "Staff" && (
                              <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-semibold bg-[#dcfce7] text-[#16a34a]">
                                Staff
                              </span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.status === "Aktif" ? (
                              <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-semibold bg-[#dcfce7] text-[#16a34a]">
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500">
                                Nonaktif
                              </span>
                            )}
                          </td>

                          {/* Tombol Aksi: Ubah Role & Nonaktifkan */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditRole(user)}
                                className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                              >
                                Ubah Role
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleUserStatus(user.id, user.name)
                                }
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                  user.status === "Aktif"
                                    ? "bg-[#b91c1c] hover:bg-[#991b1b] text-white"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                }`}
                              >
                                {user.status === "Aktif"
                                  ? "Nonaktifkan"
                                  : "Aktifkan"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        ) : activeMenu === "booking" ? (
          /* ================= BOOKING & PEMBAYARAN VIEW ================= */
          <main className="p-6 sm:p-8 space-y-6 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Booking & Pembayaran
              </h2>

              <div className="flex items-center gap-2 flex-wrap">
                {(
                  [
                    "Semua",
                    "Pending",
                    "Approved",
                    "Picked Up",
                    "Completed",
                  ] as const
                ).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setBookingFilter(status)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      bookingFilter === status
                        ? "bg-[#1b4332] text-white shadow-xs"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f9fa] text-gray-400 font-medium border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Kode</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Alat</th>
                      <th className="px-6 py-4">Periode</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Pembayaran</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.map((row) => (
                      <tr
                        key={row.kode}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                          {row.kode}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-medium whitespace-nowrap">
                          {row.customer}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {row.alat}
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                          {row.periode}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                          Rp {row.total.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.pembayaran === "Belum bayar" ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#ea580c]">
                              Belum bayar
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ebf6ed] text-[#2e7d32]">
                              Lunas
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.status === "Pending" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ffedd5] text-[#c2410c]">
                              Pending
                            </span>
                          )}
                          {row.status === "Approved" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e0f2fe] text-[#0369a1]">
                              Approved
                            </span>
                          )}
                          {row.status === "Picked Up" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ccfbf1] text-[#0f766e]">
                              Picked Up
                            </span>
                          )}
                          {row.status === "Completed" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f1f5f9] text-[#64748b]">
                              Completed
                            </span>
                          )}
                          {row.status === "Cancelled" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">
                              Cancelled
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {row.status === "Pending" ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleApprove(row.kode)}
                                className="px-3 py-1 bg-[#235832] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Setujui
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(row.kode)}
                                className="px-3 py-1 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(row)}
                              className="px-3 py-1 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            >
                              Detail
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                <span>
                  Menampilkan 1–{filteredBookings.length} dari 128 booking
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled
                    className="w-7 h-7 rounded-md border border-gray-200 text-gray-300 flex items-center justify-center cursor-not-allowed"
                  >
                    &lsaquo;
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingPage(1)}
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                      bookingPage === 1
                        ? "bg-[#1b4332] text-white"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    1
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingPage(2)}
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                      bookingPage === 2
                        ? "bg-[#1b4332] text-white"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    2
                  </button>

                  <button
                    type="button"
                    className="w-7 h-7 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                  >
                    &rsaquo;
                  </button>
                </div>
              </div>
            </div>
          </main>
        ) : activeMenu === "stok" ? (
          /* ================= MANAJEMEN STOK ALAT VIEW ================= */
          <main className="p-6 sm:p-8 space-y-6 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Manajemen Stok Alat
              </h2>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1b4332] hover:bg-[#143527] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Alat</span>
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Cari nama alat..."
                  value={searchStock}
                  onChange={(e) => setSearchStock(e.target.value)}
                  className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b4332] shadow-2xs transition-colors"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {["Semua", "Tenda", "Sleeping Gear", "Cooking", "Lighting"].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#1b4332] text-white shadow-xs"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f9fa] text-gray-400 font-medium border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">ID Document</th>
                      <th className="px-6 py-4">Nama Alat</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Stok</th>
                      <th className="px-6 py-4">Harga / Hari</th>
                      <th className="px-6 py-4">Nilai Alat</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStockItems.map((item) => (
                      <tr
                        key={item.idDoc}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                          {item.idDoc}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <MiniEquipmentIcon type={item.iconType} />
                            <span className="font-bold text-gray-900 text-xs">
                              {item.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {item.category}
                        </td>

                        <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                          {item.stock}
                        </td>

                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          Rp {item.pricePerDay.toLocaleString("id-ID")}
                        </td>

                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          Rp {item.totalValue.toLocaleString("id-ID")}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.status === "Tersedia" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ebf6ed] text-[#2e7d32]">
                              Tersedia
                            </span>
                          )}
                          {item.status === "Menipis" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ffedd5] text-[#c2410c]">
                              Menipis
                            </span>
                          )}
                          {item.status === "Habis" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fee2e2] text-[#dc2626]">
                              Habis
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="px-3 py-1 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setItemToDelete(item)}
                              className="px-3 py-1 bg-[#ba2d2d] hover:bg-[#a32222] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                <span>
                  Menampilkan 1–{filteredStockItems.length} dari 34 alat
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled
                    className="w-7 h-7 rounded-md border border-gray-200 text-gray-300 flex items-center justify-center cursor-not-allowed"
                  >
                    &lsaquo;
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                      currentPage === 1
                        ? "bg-[#1b4332] text-white"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    1
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(2)}
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                      currentPage === 2
                        ? "bg-[#1b4332] text-white"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    2
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(3)}
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                      currentPage === 3
                        ? "bg-[#1b4332] text-white"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    3
                  </button>

                  <button
                    type="button"
                    className="w-7 h-7 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                  >
                    &rsaquo;
                  </button>
                </div>
              </div>
            </div>
          </main>
        ) : (
          /* ================= DASHBOARD UTAMA VIEW ================= */
          <main className="p-6 sm:p-8 space-y-6 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 border-l-4 border-l-[#235832] shadow-xs">
                <p className="text-xs text-gray-500 font-medium mb-1.5">
                  Total Booking
                </p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                  128
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 border-l-4 border-l-[#ea6a20] shadow-xs">
                <p className="text-xs text-gray-500 font-medium mb-1.5">
                  Alat Sedang Dipinjam
                </p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                  17
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 border-l-4 border-l-[#235832] shadow-xs">
                <p className="text-xs text-gray-500 font-medium mb-1.5">
                  Total Stok Alat
                </p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                  214
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 border-l-4 border-l-[#ea6a20] shadow-xs">
                <p className="text-xs text-gray-500 font-medium mb-1.5">
                  Total Pendapatan
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Rp 24,6 jt
                </p>
              </div>
            </div>

            {/* Chart & Alat Terpopuler */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-sm text-gray-900">
                    Pendapatan 7 Hari Terakhir
                  </h2>
                  <span className="text-xs text-gray-400 font-medium">
                    Rp 4,2 jt minggu ini
                  </span>
                </div>

                <div className="flex items-end justify-between gap-3 sm:gap-6 h-52 pt-6 pb-2 px-2 sm:px-4 border-b border-gray-100">
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full bg-[#286237] rounded-md h-[40%] hover:opacity-90 transition-all cursor-pointer" />
                    <span className="text-[11px] text-gray-400 font-medium">Sen</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full bg-[#286237] rounded-md h-[60%] hover:opacity-90 transition-all cursor-pointer" />
                    <span className="text-[11px] text-gray-400 font-medium">Sel</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full bg-[#286237] rounded-md h-[50%] hover:opacity-90 transition-all cursor-pointer" />
                    <span className="text-[11px] text-gray-400 font-medium">Rab</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full bg-[#286237] rounded-md h-[72%] hover:opacity-90 transition-all cursor-pointer" />
                    <span className="text-[11px] text-gray-400 font-medium">Kam</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full bg-[#286237] rounded-md h-[88%] hover:opacity-90 transition-all cursor-pointer" />
                    <span className="text-[11px] text-gray-400 font-medium">Jum</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full bg-[#ea6a20] rounded-md h-[100%] shadow-xs hover:opacity-90 transition-all cursor-pointer" />
                    <span className="text-[11px] text-gray-400 font-bold text-[#ea6a20]">
                      Sab
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full bg-[#286237] rounded-md h-[65%] hover:opacity-90 transition-all cursor-pointer" />
                    <span className="text-[11px] text-gray-400 font-medium">Min</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
                <h2 className="font-bold text-sm text-gray-900 mb-6">
                  Alat Terpopuler
                </h2>

                <div className="space-y-5 text-xs flex-1 flex flex-col justify-around">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">
                      Tenda Dome 4 Orang
                    </span>
                    <span className="font-bold text-gray-900 text-sm">42×</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">
                      Sleeping Bag Mummy
                    </span>
                    <span className="font-bold text-gray-900 text-sm">37×</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Carrier 60L</span>
                    <span className="font-bold text-gray-900 text-sm">25×</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">
                      Lampu Tenda LED
                    </span>
                    <span className="font-bold text-gray-900 text-sm">19×</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Terbaru Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-gray-900">Booking Terbaru</h2>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMenu("booking");
                    router.replace("/dashboard?tab=booking");
                  }}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Lihat semua
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f9fa] text-gray-500 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Kode</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Alat</th>
                        <th className="px-6 py-4">Periode</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Pembayaran</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((row) => (
                        <tr
                          key={row.kode}
                          className="hover:bg-gray-50/80 transition-colors"
                        >
                          <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                            {row.kode}
                          </td>
                          <td className="px-6 py-4 text-gray-800 font-medium whitespace-nowrap">
                            {row.customer}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {row.alat}
                          </td>
                          <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                            {row.periode}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                            Rp {row.total.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {row.pembayaran === "Belum bayar" ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#ea580c]">
                                Belum bayar
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ebf6ed] text-[#2e7d32]">
                                Lunas
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {row.status === "Pending" && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ffedd5] text-[#c2410c]">
                                Pending
                              </span>
                            )}
                            {row.status === "Approved" && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e0f2fe] text-[#0369a1]">
                                Approved
                              </span>
                            )}
                            {row.status === "Picked Up" && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ccfbf1] text-[#0f766e]">
                                Picked Up
                              </span>
                            )}
                            {row.status === "Completed" && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f1f5f9] text-[#64748b]">
                                Completed
                              </span>
                            )}
                            {row.status === "Cancelled" && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">
                                Cancelled
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            {row.status === "Pending" ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleApprove(row.kode)}
                                  className="px-3 py-1 bg-[#235832] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Setujui
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(row.kode)}
                                  className="px-3 py-1 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Tolak
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedBooking(row)}
                                className="px-3 py-1 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                              >
                                Detail
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* ================= MODAL 1: TAMBAH / EDIT ALAT BARU ================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3">
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                {editingItem ? "Edit Data Alat" : "Tambah Alat Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="mt-3 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Nama alat
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#1b4332] transition-colors"
                    placeholder="Tenda Dome 6 Orang"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as EquipmentStockItem["category"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#1b4332] bg-white transition-colors cursor-pointer"
                  >
                    <option value="Tenda">Tenda ▾</option>
                    <option value="Sleeping Gear">Sleeping Gear ▾</option>
                    <option value="Cooking">Cooking ▾</option>
                    <option value="Lighting">Lighting ▾</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Jumlah stok
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#1b4332] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Harga / hari (Rp)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    required
                    value={formData.pricePerDay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePerDay: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#1b4332] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Harga Beli / Nilai Alat (Rp) — dasar hitung denda
                </label>
                <input
                  type="number"
                  min={10000}
                  step={10000}
                  required
                  value={formData.totalValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalValue: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#1b4332] transition-colors"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#1b4332] transition-colors resize-none"
                  placeholder="Tenda luas untuk keluarga, double layer, anti air 3000 mm."
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1.5">
                  Tags
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-medium inline-flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tags: formData.tags.filter((t) => t !== tag),
                          })
                        }
                        className="text-gray-400 hover:text-red-500 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-medium cursor-pointer transition-colors"
                  >
                    + tag
                  </button>
                </div>
              </div>

              <div className="border border-dashed border-gray-300 rounded-xl py-3 px-4 text-center cursor-pointer hover:bg-gray-50/80 transition-colors flex items-center justify-center gap-2 text-xs text-gray-500">
                <Camera className="w-4 h-4 text-gray-500" />
                <span>Unggah foto alat (JPG/PNG, maks 2 MB)</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#235832] hover:bg-[#1b4332] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Simpan Alat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: KONFIRMASI HAPUS ================= */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-gray-100 text-center relative animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center">
              <svg
                viewBox="0 0 64 64"
                className="w-12 h-12 text-gray-400 drop-shadow-xs"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 18 L48 18" stroke="#94a3b8" />
                <path d="M26 18 L26 14 C26 12.89 26.89 12 28 12 L36 12 C37.11 12 38 12.89 38 14 L38 18" stroke="#94a3b8" />
                <path d="M20 18 L23 50 C23.2 52.2 25 54 27.2 54 L36.8 54 C39 54 40.8 52.2 41 50 L44 18" stroke="#64748b" />
                <line x1="27" y1="24" x2="37" y2="48" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="37" y1="24" x2="27" y2="48" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="24" y1="36" x2="40" y2="36" stroke="#94a3b8" strokeWidth="1.5" />
              </svg>
            </div>

            <h3 className="font-bold text-base text-gray-900 mb-2">
              Hapus alat ini?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto mb-6">
              <span className="font-medium text-gray-700">{itemToDelete.name}</span> (ID {itemToDelete.idDoc}) akan dihapus dari database dan tidak bisa dikembalikan.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="w-full py-2.5 px-4 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-2.5 px-4 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: TAMBAH PENGGUNA BARU ================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                Tambah Pengguna Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#1b4332]"
                  placeholder="Contoh: Wayan Pratama"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#1b4332]"
                  placeholder="wayan@mail.com"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={userFormData.role}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      role: e.target.value as UserItem["role"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#1b4332] bg-white cursor-pointer"
                >
                  <option value="Customer">Customer</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1b4332] hover:bg-[#143527] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: UBAH ROLE PENGGUNA ================= */}
      {editingRoleUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                Ubah Role Pengguna
              </h3>
              <button
                type="button"
                onClick={() => setEditingRoleUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <p className="text-gray-500">Pengguna:</p>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {editingRoleUser.name}
                </p>
                <p className="text-gray-400 text-[11px]">{editingRoleUser.email}</p>
              </div>

              <div className="pt-2">
                <label className="block font-medium text-gray-700 mb-2">
                  Pilih Role Baru:
                </label>
                <div className="space-y-2">
                  {(["Customer", "Staff", "Admin"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleSaveRole(r)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        editingRoleUser.role === r
                          ? "bg-[#eef7f0] border-[#1b4332] text-[#1b4332]"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{r}</span>
                      {editingRoleUser.role === r && (
                        <Check className="w-4 h-4 text-[#1b4332]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingRoleUser(null)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors mt-2"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">
                Detail Booking {selectedBooking.kode}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold text-gray-900">
                  {selectedBooking.customer}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Alat:</span>
                <span className="font-semibold text-gray-800">
                  {selectedBooking.alat}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Periode:</span>
                <span className="font-semibold text-gray-800">
                  {selectedBooking.periode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold text-[#235832]">
                  Rp {selectedBooking.total.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status Pembayaran:</span>
                <span className="font-semibold">{selectedBooking.pembayaran}</span>
              </div>
              <div className="flex justify-between">
                <span>Status Booking:</span>
                <span className="font-semibold">{selectedBooking.status}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors mt-2"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat Dashboard Admin...</div>}>
      <DashboardApp />
    </Suspense>
  );
}
