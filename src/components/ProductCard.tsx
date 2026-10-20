"use client";

import React from "react";
import { Product } from "@/data/customerData";

export function ProductIllustration({ type }: { type: Product["type"] }) {
  if (type === "tent") {
    return (
      <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm">
        <ellipse cx="50" cy="78" rx="26" ry="4" fill="#00000018" />
        <polygon points="50,26 24,74 48,74" fill="#d94814" />
        <polygon points="50,26 48,74 76,74" fill="#ea580c" />
        <line x1="50" y1="26" x2="48" y2="74" stroke="#b93815" strokeWidth="1" />
        <polygon points="50,42 42,74 58,74" fill="#fef08a" />
        <polygon points="50,42 46,74 54,74" fill="#fde047" />
        <polygon points="50,42 38,74 44,74" fill="#ea580c" />
        <polygon points="50,42 56,74 62,74" fill="#ea580c" />
        <line x1="50" y1="42" x2="50" y2="74" stroke="#ca8a04" strokeWidth="1" />
        <line x1="50" y1="26" x2="20" y2="76" stroke="#9a3412" strokeWidth="0.8" />
        <line x1="50" y1="26" x2="80" y2="76" stroke="#9a3412" strokeWidth="0.8" />
      </svg>
    );
  }

  if (type === "sleeping") {
    return (
      <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm">
        <ellipse cx="50" cy="78" rx="24" ry="4" fill="#00000018" />
        <path
          d="M32 30 C32 20, 68 20, 68 30 L66 68 C66 76, 34 76, 34 68 Z"
          fill="#0284c7"
        />
        <path
          d="M36 30 C36 24, 64 24, 64 30 L62 46 C62 48, 38 48, 38 46 Z"
          fill="#38bdf8"
        />
        <ellipse cx="50" cy="34" rx="10" ry="6" fill="#0f172a" opacity="0.6" />
        <line x1="50" y1="44" x2="50" y2="72" stroke="#0369a1" strokeWidth="1.5" />
        <line x1="38" y1="54" x2="62" y2="54" stroke="#0369a1" strokeWidth="1" opacity="0.6" />
        <line x1="37" y1="62" x2="63" y2="62" stroke="#0369a1" strokeWidth="1" opacity="0.6" />
      </svg>
    );
  }

  if (type === "stove") {
    return (
      <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm">
        <ellipse cx="50" cy="78" rx="22" ry="4" fill="#00000018" />
        <rect x="36" y="52" width="28" height="20" rx="3" fill="#64748b" />
        <rect x="38" y="54" width="24" height="6" fill="#94a3b8" />
        <circle cx="50" cy="66" r="3" fill="#f97316" />
        <path d="M30 52 L36 44 L44 44" stroke="#475569" strokeWidth="2" fill="none" />
        <path d="M70 52 L64 44 L56 44" stroke="#475569" strokeWidth="2" fill="none" />
        <path d="M42 42 Q50 32 58 42 Z" fill="#38bdf8" opacity="0.8" />
        <path d="M46 42 Q50 35 54 42 Z" fill="#fbbf24" />
      </svg>
    );
  }

  if (type === "light") {
    return (
      <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm">
        <ellipse cx="50" cy="78" rx="20" ry="4" fill="#00000018" />
        <path d="M42 28 C42 22, 58 22, 58 28" stroke="#475569" strokeWidth="2" fill="none" />
        <rect x="40" y="28" width="20" height="6" rx="2" fill="#1e293b" />
        <path d="M35 34 L65 34 L62 58 L38 58 Z" fill="#fef08a" opacity="0.9" />
        <line x1="50" y1="36" x2="50" y2="56" stroke="#eab308" strokeWidth="3" />
        <rect x="34" y="58" width="32" height="14" rx="4" fill="#047857" />
        <circle cx="50" cy="65" r="2.5" fill="#a7f3d0" />
      </svg>
    );
  }

  if (type === "backpack") {
    return (
      <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm">
        <ellipse cx="50" cy="78" rx="20" ry="4" fill="#00000018" />
        <rect x="34" y="24" width="32" height="48" rx="8" fill="#4338ca" />
        <rect x="32" y="20" width="36" height="10" rx="3" fill="#3730a3" />
        <rect x="38" y="40" width="24" height="14" rx="3" fill="#6366f1" />
        <rect x="38" y="58" width="24" height="10" rx="2" fill="#312e81" />
        <line x1="34" y1="36" x2="66" y2="36" stroke="#312e81" strokeWidth="2" />
        <circle cx="50" cy="47" r="1.5" fill="#ffffff" />
      </svg>
    );
  }

  // Nesting
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm">
      <ellipse cx="50" cy="78" rx="22" ry="4" fill="#00000018" />
      <ellipse cx="50" cy="50" rx="20" ry="6" fill="#94a3b8" />
      <path d="M30 50 L30 68 C30 74, 70 74, 70 68 L70 50 Z" fill="#64748b" />
      <ellipse cx="50" cy="68" rx="20" ry="5" fill="#475569" />
      <rect x="68" y="54" width="10" height="4" rx="1" fill="#ea580c" />
      <rect x="46" y="44" width="8" height="4" rx="2" fill="#1e293b" />
    </svg>
  );
}

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Top illustration container */}
      <div
        className={`${product.bgPastel} relative h-44 flex items-center justify-center p-4`}
      >
        <ProductIllustration type={product.type} />

        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs ${
            product.available
              ? "bg-white text-emerald-700"
              : "bg-white text-gray-500"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              product.available ? "bg-emerald-500" : "bg-gray-400"
            }`}
          />
          {product.available ? `Tersedia (${product.stock})` : "Habis"}
        </span>

        {/* Category tag */}
        <span className="absolute bottom-3 left-3 bg-black/20 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
          {product.categoryLabel}
        </span>
      </div>

      {/* Body details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
            {product.name}
          </h3>

          {/* Quick specs preview */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.specs.slice(0, 2).map((sp, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100"
              >
                {sp.label}: {sp.value}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Harga sewa</p>
            <p className="text-sm font-bold text-emerald-800">
              Rp {product.price.toLocaleString("id-ID")}{" "}
              <span className="text-[10px] font-normal text-gray-400">/hari</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelect(product)}
            className="px-3.5 py-1.5 bg-[#1e4732] hover:bg-[#163525] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            Detail & Sewa
          </button>
        </div>
      </div>
    </div>
  );
}
