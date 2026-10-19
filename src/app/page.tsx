"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#f7f5ef] p-8 text-[#203d34] transition-opacity duration-500 cursor-pointer select-none ${
        isFadingOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Top spacing */}
      <div className="w-full flex justify-end">
        <span className="text-xs text-[#203d34]/50 tracking-wider">
          Ketuk untuk lewati &rarr;
        </span>
      </div>

      {/* Center Logo */}
      <div className="flex flex-col items-center justify-center text-center">
        <Image
          src="/camp-rent-logo.png"
          alt="CampRent — Gear up, adventure out. Rental peralatan camping."
          width={990}
          height={471}
          priority
          className="h-auto w-[min(82vw,700px)] animate-in fade-in zoom-in-95"
        />

        {/* Minimal Progress Bar */}
        <div className="w-48 sm:w-64 h-1.5 bg-[#203d34]/15 rounded-full mt-5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c9a66b] to-[#a77d42] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom attribution */}
      <div className="text-xs text-[#203d34]/50 tracking-wider">
        Universitas Primakara
      </div>
    </div>
  );
}
