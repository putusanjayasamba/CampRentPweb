"use client";

import { useSyncExternalStore } from "react";

export interface CampRentUser {
  name: string;
  email: string;
  role: "customer" | "admin" | "staff" | "guest";
  isGuest?: boolean;
  loggedAt?: string;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("camprent_auth_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("camprent_auth_change", callback);
  };
}

let cachedRawUser: string | null = null;
let cachedUser: CampRentUser | null = null;

function getSnapshot(): CampRentUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("camprent_user");
  if (raw !== cachedRawUser) {
    cachedRawUser = raw;
    try {
      cachedUser = raw ? JSON.parse(raw) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

function getServerSnapshot(): CampRentUser | null {
  return null;
}

export function useCurrentUser(): CampRentUser | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getCurrentUser(): CampRentUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("camprent_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isGuestUser(): boolean {
  const user = getCurrentUser();
  return !!user && (user.role === "guest" || !!user.isGuest);
}

export function setGuestUser(): CampRentUser {
  const guestUser: CampRentUser = {
    name: "Tamu (Guest)",
    email: "guest@camprent.id",
    role: "guest",
    isGuest: true,
    loggedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem("camprent_user", JSON.stringify(guestUser));
    window.dispatchEvent(new Event("camprent_auth_change"));
  }
  return guestUser;
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("camprent_user");
    window.dispatchEvent(new Event("camprent_auth_change"));
  }
}
