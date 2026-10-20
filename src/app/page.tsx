"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth transition to /login after 2.4 seconds
    const timeout = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }, 2400);

    return () => clearTimeout(timeout);
  }, [router]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      router.push("/login");
    }, 300);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f6f4ee] p-6 transition-all duration-500 cursor-pointer select-none ${
        isFadingOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Centered Logo Graphic matching exact mockup */}
      <div className="flex flex-col items-center justify-center max-w-xl w-full">
        <img
          src="/camp-rent-logo.png"
          alt="CampRent - Gear Up, Adventure Out - Rental Peralatan Camping"
          className="w-[320px] sm:w-[460px] md:w-[540px] max-w-full object-contain transition-all duration-700 animate-in fade-in zoom-in-95"
        />

        {/* Minimal elegant loading bar matching logo colors */}
        <div className="w-32 sm:w-40 h-1 bg-[#224835]/10 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-[#224835] rounded-full animate-pulse w-full" />
        </div>
      </div>
    </div>
  );
}
