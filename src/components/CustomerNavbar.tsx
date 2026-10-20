"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, LogOut } from "lucide-react";

interface CustomerNavbarProps {
  activePage: "katalog" | "sewa" | "status";
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function CustomerNavbar({
  activePage,
  searchQuery = "",
  onSearchChange,
}: CustomerNavbarProps) {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("camprent_user");
    }
    router.push("/login");
  };

  return (
    <nav className="bg-[#1e4732] text-white px-6 py-3.5 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Camp<span className="text-[#f97316]">Rent</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/customer"
              className={`transition-colors ${
                activePage === "katalog"
                  ? "text-[#f97316] font-semibold"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Katalog
            </Link>

            <Link
              href="/customer/sewa"
              className={`transition-colors ${
                activePage === "sewa"
                  ? "text-[#f97316] font-semibold"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Sewa Saya
            </Link>

            <Link
              href="/customer/status"
              className={`transition-colors ${
                activePage === "status"
                  ? "text-[#f97316] font-semibold"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Status Booking
            </Link>
          </div>
        </div>

        {/* Search bar & Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari alat camping..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-36 sm:w-64 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-gray-300 text-xs px-3.5 py-2 pl-8 rounded-full border border-white/20 focus:outline-none transition-all"
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
                <Link
                  href="/customer"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full block px-4 py-2 hover:bg-gray-50"
                >
                  Katalog
                </Link>
                <Link
                  href="/customer/sewa"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full block px-4 py-2 hover:bg-gray-50"
                >
                  Sewa Saya
                </Link>
                <Link
                  href="/customer/status"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full block px-4 py-2 hover:bg-gray-50"
                >
                  Status Booking
                </Link>
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

      {/* Mobile nav links */}
      <div className="flex sm:hidden items-center justify-around gap-2 pt-2.5 mt-2 border-t border-white/10 text-xs font-medium">
        <Link
          href="/customer"
          className={`transition-colors py-1 ${
            activePage === "katalog"
              ? "text-[#f97316] font-semibold border-b-2 border-[#f97316]"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Katalog
        </Link>
        <Link
          href="/customer/sewa"
          className={`transition-colors py-1 ${
            activePage === "sewa"
              ? "text-[#f97316] font-semibold border-b-2 border-[#f97316]"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Sewa Saya
        </Link>
        <Link
          href="/customer/status"
          className={`transition-colors py-1 ${
            activePage === "status"
              ? "text-[#f97316] font-semibold border-b-2 border-[#f97316]"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Status Booking
        </Link>
      </div>
    </nav>
  );
}
