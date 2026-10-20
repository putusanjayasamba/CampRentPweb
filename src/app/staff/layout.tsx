"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem } from "@/components/Sidebar";
import { ArrowLeftRight, Clock, ClipboardCheck } from "lucide-react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const staffNavItems: SidebarItem[] = [
    {
      label: "Pengambilan & Pengembalian",
      href: "/staff/pengambilan-pengembalian",
      icon: ArrowLeftRight,
      active: pathname.startsWith("/staff/pengambilan-pengembalian"),
    },
    {
      label: "Antrean Hari Ini",
      href: "/staff/antrean",
      icon: Clock,
      active: pathname.startsWith("/staff/antrean"),
    },
    {
      label: "Riwayat Pengecekan",
      href: "/staff/riwayat",
      icon: ClipboardCheck,
      active: pathname.startsWith("/staff/riwayat"),
    },
  ];

  const getPageTitle = () => {
    if (pathname.startsWith("/staff/antrean")) return "Antrean Hari Ini";
    if (pathname.startsWith("/staff/riwayat")) return "Riwayat Pengecekan";
    return "Panel Operasional Pengambilan & Pengembalian";
  };

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Reusable Sidebar with theme="staff" */}
      <Sidebar
        brandHref="/staff/pengambilan-pengembalian"
        items={staffNavItems}
        roleLabel="Login sebagai Staff"
        theme="staff"
      />

      {/* Main Staff Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
          <h1 className="font-semibold text-gray-900 text-sm">
            {getPageTitle()}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 font-medium">Putu Sanjaya</span>
            <div className="w-8 h-8 rounded-full bg-[#1e5c36] flex items-center justify-center shadow-xs">
              <span className="text-xs font-bold text-white">PS</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
