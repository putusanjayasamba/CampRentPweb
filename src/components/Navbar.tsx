"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, LogOut, Compass, CalendarCheck, Clock, User } from "lucide-react";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Navbar({
  searchQuery = "",
  onSearchChange,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
      icon: Compass,
    },
    {
      name: "Sewa Saya",
      href: "/customer/sewa-saya",
      active: pathname.startsWith("/customer/sewa-saya") || pathname === "/customer/sewa",
      icon: CalendarCheck,
    },
    {
      name: "Status Booking",
      href: "/customer/status-booking",
      active: pathname.startsWith("/customer/status-booking") || pathname === "/customer/status",
      icon: Clock,
    },
  ];

  return (
    <nav className="bg-[#1e4732] text-white px-6 py-3.5 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/customer/katalog" className="text-xl font-bold tracking-tight">
            Camp<span className="text-[#f97316]">Rent</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors flex items-center gap-1.5 ${
                  link.active
                    ? "text-[#f97316] font-semibold"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Search input & User Profile */}
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
              CS
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-xs text-gray-700 animate-in fade-in">
                <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-900">
                  Customer CampRent
                  <div className="text-[10px] text-gray-400 font-normal">
                    customer@gmail.com
                  </div>
                </div>

                <div className="py-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setShowProfileMenu(false)}
                      className={`w-full block px-4 py-2 hover:bg-gray-50 ${
                        link.active ? "text-[#f97316] font-semibold" : ""
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
              link.active ? "text-[#f97316] font-bold" : "text-gray-200"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
