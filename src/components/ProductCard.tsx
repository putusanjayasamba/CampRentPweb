"use client";

import React from "react";
import { Product } from "@/data/customerData";

export function ProductIllustration({ type }: { type: Product["type"] }) {
  if (type === "tent") {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-xs">
        <ellipse cx="50" cy="78" rx="26" ry="4" fill="#00000018" />
        <polygon points="50,26 24,74 48,74" fill="#d94814" />
        <polygon points="50,26 48,74 76,74" fill="#ea580c" />
        <line x1="50" y1="26" x2="48" y2="74" stroke="#b93815" strokeWidth="1" />
        <polygon points="50,42 42,74 58,74" fill="#fef08a" />
        <polygon points="50,42 46,74 54,74" fill="#fde047" />
        <polygon points="50,42 38,74 44,74" fill="#ea580c" />
        <polygon points="50,42 56,74 62,74" fill="#ea580c" />
        <line x1="50" y1="42" x2="50" y2="74" stroke="#ca8a04" strokeWidth="1" />
      </svg>
    );
  }

  if (type === "sleeping") {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-xs">
        <ellipse cx="50" cy="78" rx="24" ry="4" fill="#00000018" />
        <path d="M32 30 C32 20, 68 20, 68 30 L66 68 C66 76, 34 76, 34 68 Z" fill="#0284c7" />
        <path d="M36 30 C36 24, 64 24, 64 30 L62 46 C62 48, 38 48, 38 46 Z" fill="#38bdf8" />
        <ellipse cx="50" cy="34" rx="10" ry="6" fill="#0f172a" opacity="0.6" />
      </svg>
    );
  }

  if (type === "stove") {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-xs">
        <ellipse cx="50" cy="78" rx="22" ry="4" fill="#00000018" />
        <rect x="36" y="52" width="28" height="20" rx="3" fill="#64748b" />
        <rect x="38" y="54" width="24" height="6" fill="#94a3b8" />
        <circle cx="50" cy="66" r="3" fill="#f97316" />
      </svg>
    );
  }

  if (type === "light") {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-xs">
        <ellipse cx="50" cy="78" rx="20" ry="4" fill="#00000018" />
        <rect x="40" y="28" width="20" height="6" rx="2" fill="#1e293b" />
        <path d="M35 34 L65 34 L62 58 L38 58 Z" fill="#fef08a" opacity="0.9" />
        <rect x="34" y="58" width="32" height="14" rx="4" fill="#047857" />
      </svg>
    );
  }

  if (type === "backpack") {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-xs">
        <ellipse cx="50" cy="78" rx="20" ry="4" fill="#00000018" />
        <rect x="34" y="24" width="32" height="48" rx="8" fill="#4338ca" />
        <rect x="32" y="20" width="36" height="10" rx="3" fill="#3730a3" />
        <rect x="38" y="40" width="24" height="14" rx="3" fill="#6366f1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-xs">
      <ellipse cx="50" cy="78" rx="22" ry="4" fill="#00000018" />
      <ellipse cx="50" cy="50" rx="20" ry="6" fill="#94a3b8" />
      <path d="M30 50 L30 68 C30 74, 70 74, 70 68 L70 50 Z" fill="#64748b" />
      <rect x="68" y="54" width="10" height="4" rx="1" fill="#ea580c" />
    </svg>
  );
}

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group">
      {/* Top product image */}
      <div className="relative h-32 sm:h-44 lg:h-48 w-full bg-gray-100 overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`${product.bgPastel} w-full h-full`} />
        )}
      </div>

      {/* Card body */}
      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2">
            {product.name}
          </h4>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
            {product.categoryLabel}
          </p>

          <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-bold text-gray-900">
            Rp {product.price.toLocaleString("id-ID")}{" "}
            <span className="text-[10px] sm:text-xs text-gray-400 font-normal">/ hari</span>
          </div>

          <div className="mt-1.5 sm:mt-2">
            {product.available ? (
              <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-medium bg-[#e6f4ea] text-[#1e7e34]">
                Available
              </span>
            ) : (
              <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-medium bg-[#fee2e2] text-[#b91c1c]">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 sm:mt-4">
          {product.available ? (
            <button
              type="button"
              onClick={() => onSelect(product)}
              className="w-full py-1.5 sm:py-2 bg-[#e07a2c] hover:bg-[#c8651e] text-white text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <span className="sm:hidden">Sewa</span>
              <span className="hidden sm:inline">Sewa Sekarang</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-1.5 sm:py-2 bg-[#cbd5e1] text-[#64748b] text-[11px] sm:text-xs font-semibold rounded-lg cursor-not-allowed"
            >
              Habis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
