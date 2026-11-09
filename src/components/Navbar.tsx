"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, LogOut, Menu, X, LayoutGrid, BookOpen, ClipboardList, LogIn } from "lucide-react";
import { useCurrentUser } from "@/data/auth";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  activePage?: string;
}

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useCurrentUser();

  const isGuest = user?.role === "guest" || !!user?.isGuest;
  const displayName = isGuest ? "Tamu (Guest)" : user?.name || "Customer CampRent";
  const displayEmail = isGuest ? "Mode Hanya Lihat" : user?.email || "an.customer@camprent.id";
  const userInitials = isGuest
    ? "TM"
    : displayName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || "")
        .join("") || "AN";

  // Derive and adjust search value during render (avoids cascading render effect)
  const currentQuery = searchQuery !== undefined ? searchQuery : (searchParams.get("q") || "");
  const [searchValue, setSearchValue] = useState(currentQuery);
  const [prevQuery, setPrevQuery] = useState(currentQuery);

  if (currentQuery !== prevQuery) {
    setPrevQuery(currentQuery);
    setSearchValue(currentQuery);
  }

  // Adjust mobile menu state during render on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Prevent body scroll when menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
      icon: LayoutGrid,
      active: pathname.startsWith("/customer/katalog") || pathname === "/customer",
    },
    {
      name: "Sewa Saya",
      href: "/customer/sewa-saya",
      icon: BookOpen,
      active: pathname.startsWith("/customer/sewa-saya") || pathname === "/customer/sewa",
    },
    {
      name: "Status Booking",
      href: "/customer/status-booking",
      icon: ClipboardList,
      active:
        pathname.startsWith("/customer/status-booking") || pathname === "/customer/status",
    },
  ];

  return (
    <>
      {/* ── NAVBAR BAR ── */}
      <nav className="bg-[#1b4332] text-white px-4 sm:px-6 lg:px-12 py-3.5 z-40 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Brand Logo & Desktop Nav Links */}
          <div className="flex items-center gap-10">
            <Link href="/customer/katalog" className="text-xl font-extrabold tracking-tight">
              Camp<span className="text-[#e07a2c]">Rent</span>
            </Link>

            {/* Desktop nav links — hidden on mobile */}
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

          {/* Right side: Search + Avatar (desktop) | Avatar + Hamburger (mobile) */}
          <div className="flex items-center gap-3">
            {/* Search — hidden on mobile, shown on sm+ */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Cari alat camping..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-44 sm:w-64 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-gray-300 text-xs px-3.5 py-2 rounded-lg border border-white/15 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>

            {/* User Avatar Dropdown (desktop) */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`h-8 px-2.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-xs ${
                  isGuest ? "bg-[#ea580c]" : "bg-[#e07a2c]"
                }`}
                title={isGuest ? "Mode Tamu" : displayName}
              >
                <span>{userInitials}</span>
                {isGuest && (
                  <span className="text-[10px] font-medium bg-black/20 px-1.5 py-0.2 rounded-full">
                    Tamu
                  </span>
                )}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-xs text-gray-700 animate-in fade-in">
                  <div className="px-4 py-2.5 border-b border-gray-100 font-semibold text-gray-900">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{displayName}</span>
                      {isGuest && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          Tamu
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 font-normal mt-0.5 truncate">
                      {displayEmail}
                    </div>
                  </div>

                  {isGuest && (
                    <div className="p-2 border-b border-gray-100 bg-amber-50/50">
                      <Link
                        href="/login?reason=guest_sewa"
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#26533c] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Login Akun untuk Sewa</span>
                      </Link>
                    </div>
                  )}

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
                      <LogOut className="w-3.5 h-3.5" /> {isGuest ? "Keluar Mode Tamu" : "Keluar"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: Avatar initial + Hamburger button */}
            <div className="flex items-center gap-2 sm:hidden">
              {/* Small avatar badge */}
              <div
                className={`w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-xs ${
                  isGuest ? "bg-[#ea580c]" : "bg-[#e07a2c]"
                }`}
              >
                {userInitials}
              </div>

              {/* Hamburger button */}
              <button
                type="button"
                id="hamburger-btn"
                onClick={() => setMobileMenuOpen(true)}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Buka menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU DRAWER ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer slides in from right */}
          <div className="absolute top-0 right-0 h-full w-72 bg-[#1b4332] flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span className="text-white font-extrabold text-lg tracking-tight">
                Camp<span className="text-[#e07a2c]">Rent</span>
              </span>
              <button
                type="button"
                id="close-menu-btn"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0 ${
                    isGuest ? "bg-[#ea580c]" : "bg-[#e07a2c]"
                  }`}
                >
                  {userInitials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-white text-sm font-semibold">{displayName}</p>
                    {isGuest && (
                      <span className="text-[9px] bg-amber-400 text-amber-950 font-bold px-1.5 py-0.2 rounded-full">
                        Tamu
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-[11px]">{displayEmail}</p>
                </div>
              </div>

              {isGuest && (
                <div className="mt-3">
                  <Link
                    href="/login?reason=guest_sewa"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#e07a2c] hover:bg-[#c8651e] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login Akun untuk Sewa</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="px-5 py-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                <input
                  type="text"
                  placeholder="Cari alat camping..."
                  value={searchValue}
                  onChange={(e) => {
                    handleSearchChange(e.target.value);
                  }}
                  className="w-full bg-white/10 text-white placeholder-white/40 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      link.active
                        ? "bg-white/10 text-[#e07a2c] font-semibold"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button at bottom */}
            <div className="px-3 py-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
