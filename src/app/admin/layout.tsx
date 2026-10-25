"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem } from "@/components/Sidebar";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const adminNavItems: SidebarItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Manajemen Stok Alat",
      href: "/admin/stok",
      icon: Package,
      active: pathname.startsWith("/admin/stok"),
    },
    {
      label: "Booking & Pembayaran",
      href: "/admin/booking",
      icon: ClipboardList,
      active: pathname.startsWith("/admin/booking"),
    },
    {
      label: "Pengguna & Role",
      href: "/admin/pengguna",
      icon: Users,
      active: pathname.startsWith("/admin/pengguna"),
    },
  ];

  const desktopTitle = pathname.startsWith("/admin/stok")
    ? "Manajemen Stok Alat"
    : pathname.startsWith("/admin/booking")
    ? "Booking & Pembayaran"
    : pathname.startsWith("/admin/pengguna")
    ? "Pengguna & Role"
    : "Dashboard Admin";

  const mobileTitle = pathname.startsWith("/admin/stok")
    ? "Stok Alat"
    : desktopTitle;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 flex font-sans">
      {/* Sidebar — handles both mobile top bar + desktop sidebar */}
      <Sidebar
        brandHref="/admin"
        items={adminNavItems}
        roleLabel="Login sebagai Admin"
        theme="admin"
        pageTitle={mobileTitle}
      />

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header (hidden on mobile — mobile has its own bar in Sidebar) */}
        <header className="hidden lg:flex bg-white border-b border-gray-100 px-6 sm:px-8 py-4 items-center justify-between sticky top-0 z-20">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {desktopTitle}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Ida Bagus</span>
            <div className="w-8 h-8 rounded-full bg-[#e07a2c] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              IB
            </div>
          </div>
        </header>

        {/* Content Body — add top padding on mobile to offset the fixed top bar */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pt-20 lg:pt-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
