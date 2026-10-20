"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem } from "@/components/Sidebar";
import { LayoutDashboard, Package, CreditCard, Users, Bell } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const adminNavItems: SidebarItem[] = [
    {
      label: "Dashboard Ringkasan",
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
      icon: CreditCard,
      active: pathname.startsWith("/admin/booking"),
    },
    {
      label: "Pengguna & Role",
      href: "/admin/pengguna",
      icon: Users,
      active: pathname.startsWith("/admin/pengguna"),
    },
  ];

  const getPageTitle = () => {
    if (pathname.startsWith("/admin/stok")) return "Manajemen Stok Alat";
    if (pathname.startsWith("/admin/booking")) return "Booking & Pembayaran";
    if (pathname.startsWith("/admin/pengguna")) return "Pengguna & Hak Akses Role";
    return "Dashboard Overview";
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
        <header className="bg-white border-b border-gray-100 px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-[11px] text-gray-400">
              Panel Pengelolaan Administrator CampRent
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs">
                IB
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-bold text-gray-800 block">Ida Bagus</span>
                <span className="text-[10px] text-gray-400">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
