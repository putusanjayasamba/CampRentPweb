"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, LogOut } from "lucide-react";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  activePage?: string;
}

export default function Navbar({ searchQuery, onSearchChange, activePage }: NavbarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (searchQuery !== undefined) {
      setSearchValue(searchQuery);
    } else {
      const q = searchParams.get("q") || "";
      setSearchValue(q);
    }
  }, [searchParams, searchQuery]);

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("q", val);
    } else {
      params.delete("q");
    }

    // If not on katalog page, go to katalog page with query
    if (!pathname.startsWith("/customer/katalog")) {
      router.push(`/customer/katalog?${params.toString()}`);
    } else {
      router.replace(`/customer/katalog?${params.toString()}`);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("camprent_user");
    }
    router.push("/login");
  };

  const navLinks = [
    {
      name: "Katalog",
      href: "/customer/katalog",
      active: pathname.startsWith("/customer/katalog") || pathname === "/customer",
    },
    {
      name: "Sewa Saya",
      href: "/customer/sewa-saya",
      active: pathname.startsWith("/customer/sewa-saya") || pathname === "/customer/sewa",
    },
    {
      name: "Status Booking",
      href: "/customer/status-booking",
      active: pathname.startsWith("/customer/status-booking") || pathname === "/customer/status",
    },
  ];

  return (
    <nav className="bg-[#1b4332] text-white px-6 sm:px-10 lg:px-12 py-3.5 z-40 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Nav Links */}
        <div className="flex items-center gap-10">
          <Link href="/customer/katalog" className="text-xl font-extrabold tracking-tight">
            Camp<span className="text-[#e07a2c]">Rent</span>
          </Link>

          <div className="hidden sm:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  link.active
                    ? "text-[#e07a2c] font-semibold"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Search input & User Profile */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari alat camping..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-44 sm:w-64 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-gray-300 text-xs px-3.5 py-2 pl-3 rounded-lg border border-white/15 focus:outline-none focus:border-white/40 transition-all"
            />
          </div>

          {/* User Avatar Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full bg-[#e07a2c] text-white text-xs font-bold flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              AN
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-xs text-gray-700 animate-in fade-in">
                <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-900">
                  Customer CampRent
                  <div className="text-[10px] text-gray-400 font-normal">
                    an.customer@camprent.id
                  </div>
                </div>

                <div className="py-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setShowProfileMenu(false)}
                      className={`w-full block px-4 py-2 hover:bg-gray-50 ${
                        link.active ? "text-[#e07a2c] font-semibold" : ""
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav links */}
      <div className="flex sm:hidden items-center justify-around gap-2 pt-2.5 mt-2 border-t border-white/10 text-xs font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors ${
              link.active ? "text-[#e07a2c] font-bold" : "text-white/80"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
