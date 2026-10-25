"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LucideIcon } from "lucide-react";

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
}

export default function Sidebar({
  brandHref = "/",
  items,
  roleLabel,
  theme = "admin",
}: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("camprent_user");
    }
    router.push("/login");
  };

  const isStaff = theme === "staff";
  const bgClass = isStaff ? "bg-[#1e3a2f]" : "bg-[#1b4332]";
  const borderClass = isStaff ? "border-[#2e5040]" : "border-white/10";
  const activeClass = isStaff
    ? "bg-[#2e5040] text-white font-semibold"
    : "bg-white/15 text-white font-semibold shadow-xs";
  const hoverClass = isStaff
    ? "text-[#a0b8aa] hover:bg-[#264335] hover:text-white"
    : "text-gray-300 hover:text-white hover:bg-white/5";

  return (
    <aside
      className={`w-60 ${bgClass} text-white flex flex-col justify-between shrink-0 min-h-screen sticky top-0`}
    >
      <div>
        {/* Brand Header */}
        <div className={`px-6 py-6 ${isStaff ? `border-b ${borderClass}` : ""}`}>
          <Link href={brandHref} className="text-xl font-bold tracking-tight">
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
        className={`px-6 py-5 ${isStaff ? `border-t ${borderClass}` : "border-t border-white/10"} flex items-center justify-between gap-2`}
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
    </aside>
  );
}
