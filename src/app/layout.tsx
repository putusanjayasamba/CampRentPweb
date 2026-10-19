import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampRent - Sewa Alat Camping Tanpa Ribet",
  description:
    "Cek stok, booking, dan pantau status sewa peralatan camping dalam satu sistem terpadu. Universitas Primakara.",
  keywords: [
    "CampRent",
    "sewa alat camping",
    "sewa tenda",
    "camping equipment rental",
    "Universitas Primakara",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-gray-900 selection:bg-[#2d5b45] selection:text-white">
        {children}
      </body>
    </html>
  );
}
