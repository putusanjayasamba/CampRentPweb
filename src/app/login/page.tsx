"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, AlertCircle, LogIn } from "lucide-react";
import { setGuestUser } from "@/data/auth";

type AuthTab = "login" | "register";
type ToastType = "success" | "error" | null;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const [tab, setTab] = useState<AuthTab>("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toast notification state
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setToast(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    setTimeout(() => {
      setIsLoading(false);

      if (tab === "login") {
        // 1. Admin authentication rule
        if (trimmedEmail === "admin@gmail.com") {
          if (trimmedPassword === "admin123") {
            handleSuccessAuth("admin", "Admin CampRent");
          } else {
            showToast("error", "Email atau password salah. Coba lagi.");
          }
          return;
        }

        // 2. Staff authentication rule
        if (trimmedEmail === "staff@gmail.com") {
          if (trimmedPassword === "staff123" || trimmedPassword === "admin123") {
            handleSuccessAuth("staff", "Staff Operasional");
          } else {
            showToast("error", "Email atau password salah. Coba lagi.");
          }
          return;
        }

        // 3. Customer authentication rule
        // Customer email can be any valid email, password minimum 6 chars
        if (trimmedEmail.includes("@") && trimmedPassword.length >= 6) {
          handleSuccessAuth("customer", trimmedEmail.split("@")[0]);
        } else {
          showToast("error", "Email atau password salah. Coba lagi.");
        }
      } else {
        // Register Tab logic
        if (!name.trim()) {
          showToast("error", "Silakan masukkan nama lengkap.");
          return;
        }
        if (trimmedPassword.length < 6) {
          showToast("error", "Password minimal 6 karakter.");
          return;
        }
        if (trimmedPassword !== confirmPassword.trim()) {
          showToast("error", "Konfirmasi password tidak cocok.");
          return;
        }

        handleSuccessAuth("customer", name);
      }
    }, 600);
  };

  const handleSuccessAuth = (role: "customer" | "admin" | "staff", displayName: string) => {
    showToast("success", "Login berhasil. Mengalihkan ke dashboard...");

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "camprent_user",
        JSON.stringify({
          name: displayName,
          email: email.trim(),
          role: role,
          loggedAt: new Date().toISOString(),
        })
      );
    }

    setTimeout(() => {
      if (role === "customer") {
        router.push("/customer/katalog");
      } else if (role === "staff") {
        router.push("/staff/pengambilan-pengembalian");
      } else {
        router.push("/admin");
      }
    }, 1200);
  };

  // Handler for Guest login (look-around only)
  const handleGuestLogin = () => {
    setIsLoading(true);
    setToast(null);

    setGuestUser();
    showToast("success", "Masuk sebagai Tamu. Mengalihkan ke katalog...");

    setTimeout(() => {
      router.push("/customer/katalog");
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* ================= LEFT SIDE (DESKTOP) ================= */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 bg-[#26533c] p-12 xl:p-16 text-white justify-between relative overflow-hidden select-none">
        {/* Brand Logo */}
        <div className="text-2xl xl:text-3xl font-bold tracking-tight">
          Camp<span className="text-[#f97316]">Rent</span>
        </div>

        {/* Hero Text */}
        <div className="max-w-lg mb-16">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6 text-white tracking-tight">
            Sewa alat camping<br />
            tanpa ribet.
          </h1>
          <p className="text-gray-300 text-sm xl:text-base leading-relaxed max-w-md">
            Cek stok berdasarkan tanggal, booking online, dan pantau status sewa dalam satu tempat.
          </p>
        </div>

        {/* Footer */}
        <div className="text-gray-400 text-xs">
          &copy; 2026 CampRent &middot; Universitas Primakara
        </div>
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <div className="lg:hidden bg-[#26533c] text-white p-6 pt-10 rounded-b-3xl select-none">
        <div className="text-2xl font-bold tracking-tight mb-5">
          Camp<span className="text-[#f97316]">Rent</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
          Sewa alat camping tanpa<br />
          ribet.
        </h1>
      </div>

      {/* ================= RIGHT SIDE / FORM CONTAINER ================= */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 bg-[#f9fafb] lg:bg-white relative min-h-[500px]">
        {/* Toast Notifications */}
        <div className="w-full max-w-md lg:absolute lg:top-8 lg:right-8 lg:max-w-xs space-y-2.5 z-30 mb-4 lg:mb-0">
          {toast?.type === "success" && (
            <div
              id="toast-success"
              className="bg-[#277a3d] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-lg shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2"
            >
              <span>{toast.message}</span>
            </div>
          )}

          {toast?.type === "error" && (
            <div
              id="toast-error"
              className="bg-[#ba2d2d] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-lg shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2"
            >
              <span>{toast.message}</span>
            </div>
          )}
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100 p-6 sm:p-8 transition-all">
          {/* Reason Alert: when redirected from guest rent attempt */}
          {reason === "guest_sewa" && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-semibold block text-amber-950">
                  Login Diperlukan untuk Menyewa
                </strong>
                Anda sedang masuk sebagai <span className="font-semibold">Tamu</span>. Silakan login akun Anda atau daftar baru untuk menyewa alat camping.
              </div>
            </div>
          )}

          {reason === "guest_auth" && (
            <div className="mb-5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-semibold block text-blue-950">
                  Akses Khusus Akun Terdaftar
                </strong>
                Fitur riwayat dan status booking hanya dapat diakses dengan akun terdaftar. Silakan login akun Anda.
              </div>
            </div>
          )}

          {/* Tabs: Masuk / Daftar */}
          <div className="flex bg-[#f3f4f6] p-1.5 rounded-xl mb-6">
            <button
              type="button"
              id="tab-masuk"
              onClick={() => {
                setTab("login");
                setToast(null);
              }}
              className={`flex-1 py-2 text-center rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === "login"
                  ? "bg-white shadow-xs text-gray-900"
                  : "text-gray-500 hover:text-gray-700 font-medium"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              id="tab-daftar"
              onClick={() => {
                setTab("register");
                setToast(null);
              }}
              className={`flex-1 py-2 text-center rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === "register"
                  ? "bg-white shadow-xs text-gray-900"
                  : "text-gray-500 hover:text-gray-700 font-medium"
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* If Register tab: Nama Lengkap */}
            {tab === "register" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="input-name"
                  required
                  placeholder="Nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#26533c] focus:ring-1 focus:ring-[#26533c] transition-colors"
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="input-email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#26533c] focus:ring-1 focus:ring-[#26533c] transition-colors"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="input-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#26533c] focus:ring-1 focus:ring-[#26533c] transition-colors"
              />
            </div>

            {/* If Register tab: Konfirmasi Password */}
            {tab === "register" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  id="input-confirm-password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#26533c] focus:ring-1 focus:ring-[#26533c] transition-colors"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#276738] hover:bg-[#1e542d] active:bg-[#184524] text-white font-medium py-3 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {isLoading
                  ? "Memproses..."
                  : tab === "login"
                  ? "Masuk"
                  : "Daftar"}
              </span>
            </button>
          </form>

          {/* Guest / Tamu Login Option */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-xs text-gray-400 font-medium">atau</span>
          </div>

          <button
            type="button"
            id="btn-guest-login"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-[#26533c]/30 hover:border-[#26533c] hover:bg-[#26533c]/5 active:bg-[#26533c]/10 text-[#26533c] font-semibold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-60 shadow-xs group"
          >
            <Eye className="w-4 h-4 text-[#26533c] group-hover:scale-110 transition-transform" />
            <span>Masuk sebagai Tamu (Mode Lihat)</span>
          </button>
          <p className="text-[11px] text-gray-400 text-center mt-1.5">
            Jelajahi dan lihat seluruh katalog alat tanpa perlu login akun
          </p>

          {/* Bottom Switcher */}
          <div className="mt-5 text-center text-xs text-gray-600">
            {tab === "login" ? (
              <span>
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("register");
                    setToast(null);
                  }}
                  className="text-[#f97316] font-semibold hover:underline cursor-pointer"
                >
                  Daftar sekarang
                </button>
              </span>
            ) : (
              <span>
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("login");
                    setToast(null);
                  }}
                  className="text-[#f97316] font-semibold hover:underline cursor-pointer"
                >
                  Masuk sekarang
                </button>
              </span>
            )}
          </div>

          {/* Quick Demo Helper Hint */}
          <div className="mt-7 pt-4 border-t border-gray-100 text-[11px] text-gray-400 space-y-1">
            <div className="font-medium text-gray-500">Kredensial Demo:</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@gmail.com");
                  setPassword("admin123");
                }}
                className="text-[#276738] hover:underline cursor-pointer"
              >
                • Admin: admin@gmail.com / admin123
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("staff@gmail.com");
                  setPassword("staff123");
                }}
                className="text-[#276738] hover:underline cursor-pointer"
              >
                • Staff: staff@gmail.com / staff123
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("customer@gmail.com");
                  setPassword("password123");
                }}
                className="text-[#276738] hover:underline cursor-pointer"
              >
                • Customer: customer@gmail.com / password123
              </button>
              <button
                type="button"
                onClick={handleGuestLogin}
                className="text-[#f97316] font-semibold hover:underline cursor-pointer"
              >
                • Tamu: Masuk tanpa akun (Hanya Lihat)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-sm text-gray-500">
          Memuat halaman login...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
