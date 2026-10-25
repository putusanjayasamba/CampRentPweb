"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  LucideIcon,
  Menu,
  X,
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  active: boolean;
}

interface SidebarProps {
  brandHref?: string;
  items: SidebarItem[];
  roleLabel: string;
  theme?: "admin" | "staff";
  pageTitle?: string;
}

export default function Sidebar({
  brandHref = "/",
  items,
  roleLabel,
  theme = "admin",
  pageTitle,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("camprent_user");
    }
    router.push("/login");
  };

  const isStaff = theme === "staff";
  const bgClass      = isStaff ? "bg-[#1e3a2f]" : "bg-[#1b4332]";
  const borderClass  = isStaff ? "border-[#2e5040]" : "border-white/10";
  const activeClass  = isStaff
    ? "bg-[#2e5040] text-white font-semibold"
    : "bg-white/15 text-white font-semibold shadow-xs";
  const hoverClass   = isStaff
    ? "text-[#a0b8aa] hover:bg-[#264335] hover:text-white"
    : "text-gray-300 hover:text-white hover:bg-white/5";

  // Shared sidebar nav content
  const SidebarNav = () => (
    <>
      <div>
        {/* Brand Header */}
        <div className={`px-6 py-6 ${isStaff ? `border-b ${borderClass}` : ""}`}>
          <Link href={brandHref} className="text-xl font-bold tracking-tight text-white">
            Camp<span className="text-[#f97316]">Rent</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  item.active ? activeClass : hoverClass
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-emerald-400 shrink-0" />}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer: Role + Logout */}
      <div
        className={`px-6 py-5 border-t flex items-center justify-between gap-2 ${
          isStaff ? borderClass : "border-white/10"
        }`}
      >
        <span className="text-xs text-[#a0b8aa]/80 truncate">{roleLabel}</span>
        <button
          type="button"
          onClick={handleLogout}
          title="Keluar / Log Out"
          aria-label="Keluar / Log Out"
          className="p-1.5 text-[#a0b8aa] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── MOBILE TOP HEADER BAR ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white flex items-center justify-between px-4 py-3 border-b border-gray-200 shadow-2xs"
      >
        {/* Hamburger */}
        <button
          type="button"
          id="admin-hamburger-btn"
          onClick={() => setMobileOpen(true)}
          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title centered */}
        <h1 className="text-sm font-bold text-gray-900 tracking-tight absolute left-1/2 -translate-x-1/2">
          {pageTitle || "Dashboard Admin"}
        </h1>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#e07a2c] text-white text-xs font-bold flex items-center justify-center shadow-xs">
          IB
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer from left */}
          <aside
            className={`absolute top-0 left-0 h-full w-64 ${bgClass} text-white flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200`}
          >
            {/* Close button */}
            <div>
              <div className={`flex items-center justify-between px-6 py-5 border-b ${borderClass}`}>
                <Link href={brandHref} className="text-xl font-bold tracking-tight text-white">
                  Camp<span className="text-[#f97316]">Rent</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-3.5 space-y-1.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all cursor-pointer ${
                        item.active ? activeClass : hoverClass
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4 text-emerald-400 shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className={`px-6 py-5 border-t flex items-center justify-between gap-2 ${isStaff ? borderClass : "border-white/10"}`}>
              <span className="text-xs text-[#a0b8aa]/80 truncate">{roleLabel}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-[#a0b8aa] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR (hidden on mobile) ── */}
      <aside
        className={`hidden lg:flex w-60 ${bgClass} text-white flex-col justify-between shrink-0 min-h-screen sticky top-0`}
      >
        <SidebarNav />
      </aside>
    </>
  );
}
