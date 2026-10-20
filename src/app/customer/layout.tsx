import React from "react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "CampRent - Sewa Alat Camping & Gunung",
  description: "Portal penyewaan alat camping dan outdoor terlengkap dan terpercaya.",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-gray-800">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
