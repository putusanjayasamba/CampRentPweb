"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem } from "@/components/Sidebar";

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
      active: pathname.startsWith("/staff/pengambilan-pengembalian"),
    },
    {
      label: "Antrean Hari Ini",
      href: "/staff/antrean",
      active: pathname.startsWith("/staff/antrean"),
    },
    {
      label: "Riwayat Pengecekan",
      href: "/staff/riwayat",
      active: pathname.startsWith("/staff/riwayat"),
    },
  ];

  const getPageTitle = () => {
    if (pathname.startsWith("/staff/antrean")) return "Antrean Hari Ini";
    if (pathname.startsWith("/staff/riwayat")) return "Riwayat Pengecekan";
    return "Panel Staff";
  };

  return (
    <div
      className="flex min-h-screen bg-[#f5f5f4]"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* Sidebar */}
      <Sidebar
        brandHref="/staff/pengambilan-pengembalian"
        items={staffNavItems}
        roleLabel="Login sebagai Staff"
        theme="staff"
        pageTitle={getPageTitle()}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Header — desktop only */}
        <header className="hidden lg:flex bg-white border-b border-gray-200 px-8 py-4 items-center justify-between shrink-0">
          <h1 className="font-semibold text-gray-800 text-sm">
            {getPageTitle()}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 font-medium">Putu Sanjaya</span>
            <div className="w-8 h-8 rounded-full bg-[#1e5c36] flex items-center justify-center">
              <span className="text-xs font-bold text-white">PS</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto p-8 pt-20 lg:pt-8">{children}</main>
      </div>
    </div>
  );
}
