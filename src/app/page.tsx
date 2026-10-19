"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Animate progress bar over ~1.6 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 70);

    // Trigger fade-out and navigation
    const timeout = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        router.push("/login");
      }, 400);
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      router.push("/login");
    }, 200);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#24523b] p-8 text-white transition-opacity duration-500 cursor-pointer select-none ${
        isFadingOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Top spacing */}
      <div className="w-full flex justify-end">
        <span className="text-xs text-white/50 tracking-wider">
          Ketuk untuk lewati &rarr;
        </span>
      </div>

      {/* Center Logo & Name */}
      <div className="flex flex-col items-center justify-center text-center">
        {/* CampRent Logo */}
        <div className="text-5xl sm:text-7xl font-extrabold tracking-tight transition-all duration-700 transform animate-in fade-in zoom-in-95">
          Camp<span className="text-[#f97316]">Rent</span>
        </div>

        {/* Minimal Sub-tag */}
        <p className="mt-3 text-sm sm:text-base text-emerald-100/70 font-medium tracking-wide">
          Sewa Alat Camping Tanpa Ribet
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-48 sm:w-64 h-1.5 bg-white/20 rounded-full mt-10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-[#f97316] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom attribution */}
      <div className="text-xs text-white/40 tracking-wider">
        Universitas Primakara
      </div>
    </div>
  );
}
