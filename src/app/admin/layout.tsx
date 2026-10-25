"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem } from "@/components/Sidebar";

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
      active: pathname === "/admin",
    },
    {
      label: "Manajemen Stok Alat",
      href: "/admin/stok",
      active: pathname.startsWith("/admin/stok"),
    },
    {
      label: "Booking & Pembayaran",
      href: "/admin/booking",
      active: pathname.startsWith("/admin/booking"),
    },
    {
      label: "Pengguna & Role",
      href: "/admin/pengguna",
      active: pathname.startsWith("/admin/pengguna"),
    },
  ];

  const getPageTitle = () => {
    if (pathname.startsWith("/admin/stok")) return "Manajemen Stok Alat";
    if (pathname.startsWith("/admin/booking")) return "Booking & Pembayaran";
    if (pathname.startsWith("/admin/pengguna")) return "Pengguna & Role";
    return "Dashboard Admin";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 flex font-sans">
      {/* Reusable Sidebar */}
      <Sidebar
        brandHref="/admin"
        items={adminNavItems}
        roleLabel="Login sebagai Admin"
        theme="admin"
      />

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {getPageTitle()}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Ida Bagus</span>
            <div className="w-8 h-8 rounded-full bg-[#e07a2c] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              IB
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
