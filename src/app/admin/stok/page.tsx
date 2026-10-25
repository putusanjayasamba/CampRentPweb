"use client";

import React, { useState, useMemo } from "react";
import { Search, X, Plus } from "lucide-react";
import { INITIAL_STOCK_ITEMS, EquipmentStockItem } from "@/data/adminData";

function getStatusBadge(status: EquipmentStockItem["status"]) {
  switch (status) {
    case "Tersedia":
      return "bg-[#e8f5e9] text-[#286043]";
    case "Menipis":
      return "bg-[#fef3e9] text-[#c2410c]";
    case "Habis":
      return "bg-[#fee2e2] text-[#b91c1c]";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getItemEmoji(item: EquipmentStockItem) {
  if (item.name.toLowerCase().includes("matras") || item.iconType === "matras") return "🧘";
  if (item.category === "Tenda" || item.iconType === "tent") return "⛺";
  if (item.category === "Sleeping Gear" || item.iconType === "sleeping") return "🛏️";
  if (item.category === "Cooking" || item.iconType === "stove") return "🍳";
  if (item.category === "Lighting" || item.iconType === "light") return "💡";
  return "🎒";
}

function ItemIcon({
  iconType,
  category,
}: {
  iconType?: EquipmentStockItem["iconType"];
  category: string;
}) {
  if (category === "Tenda" || iconType === "tent") {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#e8f5e9] flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <polygon points="12,4 4,19 20,19" fill="#e07a2c" />
          <polygon points="12,4 8,19 16,19" fill="#fde047" opacity="0.9" />
          <line x1="12" y1="4" x2="12" y2="19" stroke="#b45309" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  if (category === "Sleeping Gear" || iconType === "sleeping" || iconType === "matras") {
    if (iconType === "matras") {
      return (
        <div className="w-8 h-8 rounded-lg bg-[#fef9c3] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
            <rect x="5" y="6" width="14" height="12" rx="3" fill="#ca8a04" />
            <line x1="9" y1="6" x2="9" y2="18" stroke="#fef08a" strokeWidth="1.5" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <rect x="4" y="6" width="16" height="12" rx="3" fill="#0284c7" />
          <rect x="6" y="8" width="8" height="8" rx="2" fill="#bae6fd" />
        </svg>
      </div>
    );
  }

  if (category === "Cooking" || iconType === "stove") {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#ffedd5] flex items-center justify-center shrink-0">
        <span className="text-sm">🔥</span>
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-lg bg-[#e2e8f0] flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 text-gray-700"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 6l-4 4-2-2 4-4a2 2 0 112.83 2.83z" fill="#64748b" />
        <path d="M14 10l-8 8a2 2 0 002.83 2.83l8-8" fill="#94a3b8" />
      </svg>
    </div>
  );
}

export default function AdminStokPage() {
  const [stockItems, setStockItems] = useState<EquipmentStockItem[]>(INITIAL_STOCK_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal form states (Tambah / Edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentStockItem | null>(null);

  // Form input fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<EquipmentStockItem["category"]>("Tenda");
  const [formStock, setFormStock] = useState<number | string>(4);
  const [formPrice, setFormPrice] = useState<number | string>(95000);
  const [formValue, setFormValue] = useState<number | string>(850000);
  const [formDescription, setFormDescription] = useState("");
  const [formTags, setFormTags] = useState<string[]>(["family", "waterproof"]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  // Modal delete states
  const [itemToDelete, setItemToDelete] = useState<EquipmentStockItem | null>(null);

  const categories = ["Semua", "Tenda", "Cooking", "Sleeping Gear", "Lighting"];

  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchCat =
        selectedCategory === "Semua" || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.idDoc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [stockItems, selectedCategory, searchQuery]);

  // Open modal for Add
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName("");
    setFormCategory("Tenda");
    setFormStock(4);
    setFormPrice(95000);
    setFormValue(850000);
    setFormDescription("Tenda luas untuk keluarga, double layer, anti air 3000 mm.");
    setFormTags(["family", "waterproof"]);
    setIsAddingTag(false);
    setNewTagInput("");
    setIsFormModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: EquipmentStockItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormStock(item.stock);
    setFormPrice(item.pricePerDay);
    setFormValue(item.totalValue);
    setFormDescription(
      item.description || "Tenda luas untuk keluarga, double layer, anti air 3000 mm."
    );
    setFormTags(item.tags && item.tags.length > 0 ? item.tags : ["family", "waterproof"]);
    setIsAddingTag(false);
    setNewTagInput("");
    setIsFormModalOpen(true);
  };

  // Save Add / Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = Number(formStock);
    const priceNum = Number(formPrice);
    const valueNum = Number(formValue);
    const status: EquipmentStockItem["status"] =
      stockNum > 5 ? "Tersedia" : stockNum > 0 ? "Menipis" : "Habis";

    if (editingItem) {
      // Update existing item
      setStockItems((prev) =>
        prev.map((item) =>
          item.idDoc === editingItem.idDoc
            ? {
                ...item,
                name: formName,
                category: formCategory,
                stock: stockNum,
                pricePerDay: priceNum,
                totalValue: valueNum,
                description: formDescription,
                tags: formTags,
                status,
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: EquipmentStockItem = {
        idDoc: `6500a1b2c3d4...${Math.floor(1000 + Math.random() * 9000)}`,
        name: formName || "Tenda Dome 6 Orang",
        category: formCategory,
        stock: stockNum,
        pricePerDay: priceNum,
        totalValue: valueNum,
        description: formDescription,
        tags: formTags,
        status,
        iconType:
          formCategory === "Tenda"
            ? "tent"
            : formCategory === "Sleeping Gear"
            ? "sleeping"
            : formCategory === "Cooking"
            ? "stove"
            : "light",
      };
      setStockItems((prev) => [newItem, ...prev]);
    }

    setIsFormModalOpen(false);
  };

  // Add tag chip
  const handleAddTag = () => {
    if (newTagInput.trim()) {
      setFormTags((prev) => [...prev, newTagInput.trim().toLowerCase()]);
      setNewTagInput("");
      setIsAddingTag(false);
    }
  };

  // Remove tag chip
  const handleRemoveTag = (tagToRemove: string) => {
    setFormTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setStockItems((prev) => prev.filter((item) => item.idDoc !== itemToDelete.idDoc));
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Title & Action Button */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          <span className="lg:hidden">Stok Alat</span>
          <span className="hidden lg:inline">Manajemen Stok Alat</span>
        </h1>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#286043] hover:bg-[#1e4a33] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="lg:hidden">Tambah</span>
          <span className="hidden lg:inline">Tambah Alat</span>
        </button>
      </div>

      {/* Search Input & Category Filters: sebaris horizontal di desktop, bertumpuk di mobile */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full lg:w-64 shrink-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5 lg:top-3" />
          <input
            type="text"
            placeholder="Cari nama alat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm border border-gray-200 bg-white rounded-xl pl-9 pr-4 py-2 lg:py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#286043] shadow-2xs"
          />
        </div>

        {/* Category Pills (horizontal scrollable on mobile, inline on desktop) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 lg:py-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#286043] text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── MOBILE VIEW: CARD LIST (< lg) ── */}
      <div className="space-y-3 lg:hidden">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center text-gray-500 text-xs">
            Tidak ada alat yang cocok dengan filter atau pencarian.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.idDoc}
              className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs space-y-2.5 transition-all"
            >
              {/* Top row: Emoji + Name & Status Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0 leading-none">
                    {getItemEmoji(item)}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm truncate">
                    {item.name}
                  </h3>
                </div>
                <span
                  className={`shrink-0 px-3 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Middle row: Category · Stock · Price */}
              <div className="text-xs text-gray-500 flex items-center flex-wrap gap-x-1.5 gap-y-0.5">
                <span>{item.category}</span>
                <span className="text-gray-300 font-bold">·</span>
                <span>Stok {item.stock}</span>
                <span className="text-gray-300 font-bold">·</span>
                <span>Rp {item.pricePerDay.toLocaleString("id-ID")}/hari</span>
              </div>

              {/* Bottom row: Edit & Hapus Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="px-4 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  className="px-4 py-1.5 bg-[#b83828] hover:bg-[#a53022] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}

        {/* Mobile Pagination Info */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-3.5 flex items-center justify-between text-xs text-gray-500 shadow-2xs">
          <span>{filteredItems.length} alat</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="px-2.5 py-1 rounded-md border border-gray-200 text-gray-400 bg-white cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md bg-[#286043] text-white font-bold cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP VIEW: MAIN TABLE (≥ lg) ── */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#eff1f3] text-gray-400 font-medium">
              <tr>
                <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                  ID Document
                </th>
                <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                  Nama Alat
                </th>
                <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                  Kategori
                </th>
                <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                  Stok
                </th>
                <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                  Harga / Hari
                </th>
                <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                  Nilai Alat
                </th>
                <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                  Status
                </th>
                <th scope="col" className="py-4 px-6 font-medium text-gray-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-normal">
              {filteredItems.map((item) => (
                <tr key={item.idDoc} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-4 px-6 text-gray-500 font-mono text-xs whitespace-nowrap">
                    {item.idDoc}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <ItemIcon iconType={item.iconType} category={item.category} />
                      <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                    {item.stock}
                  </td>
                  <td className="py-4 px-6 text-gray-800 whitespace-nowrap">
                    Rp {item.pricePerDay.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-6 text-gray-800 whitespace-nowrap">
                    Rp {item.totalValue.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="px-3.5 py-1.5 bg-[#b83828] hover:bg-[#a53022] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Pagination */}
        <div className="p-4 sm:px-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
          <span>Menampilkan 1–{filteredItems.length} dari 34 alat</span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="px-2.5 py-1 rounded-md border border-gray-200 text-gray-400 hover:text-gray-600 bg-white cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md bg-[#286043] text-white font-bold cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white cursor-pointer"
            >
              3
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Tambah / Edit Alat Baru */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {editingItem ? "Edit Alat" : "Tambah Alat Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
              {/* Row 1: Nama Alat & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    Nama alat
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tenda Dome 6 Orang"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-[#286043]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    Kategori
                  </label>
                  <div className="relative">
                    <select
                      value={formCategory}
                      onChange={(e) =>
                        setFormCategory(e.target.value as EquipmentStockItem["category"])
                      }
                      className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-[#286043] bg-white cursor-pointer appearance-none pr-8"
                    >
                      <option value="Tenda">Tenda ▾</option>
                      <option value="Sleeping Gear">Sleeping Gear ▾</option>
                      <option value="Cooking">Cooking ▾</option>
                      <option value="Lighting">Lighting ▾</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-gray-400">
                      ▾
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Jumlah Stok & Harga / Hari */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    Jumlah stok
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="4"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-[#286043]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    Harga / hari (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    placeholder="95000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-[#286043]"
                  />
                </div>
              </div>

              {/* Row 3: Harga Beli / Nilai Alat */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Harga Beli / Nilai Alat (Rp) — dasar hitung denda
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  required
                  placeholder="850000"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-[#286043]"
                />
              </div>

              {/* Row 4: Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  placeholder="Tenda luas untuk keluarga, double layer, anti air 3000 mm."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-[#286043]"
                />
              </div>

              {/* Row 5: Tags */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {formTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-700 bg-white"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {isAddingTag ? (
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Tag baru..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="text-xs border border-gray-300 rounded-full px-2.5 py-0.5 w-24 focus:outline-none focus:border-[#286043]"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="text-xs text-[#286043] font-bold px-1"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingTag(false)}
                        className="text-xs text-gray-400 font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingTag(true)}
                      className="px-3 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white cursor-pointer"
                    >
                      + tag
                    </button>
                  )}
                </div>
              </div>

              {/* Row 6: Upload Box */}
              <div className="border border-dashed border-gray-300 rounded-xl py-3 px-4 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
                <p className="text-xs text-gray-500 font-medium">
                  📷 Unggah foto alat (JPG/PNG, maks 2 MB)
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#286043] hover:bg-[#1e4a33] text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs text-center"
                >
                  Simpan Alat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Konfirmasi Hapus Alat */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 sm:p-7 border border-gray-100 flex flex-col items-center text-center">
            {/* Trash Basket Illustration */}
            <div className="w-16 h-16 flex items-center justify-center mb-2">
              <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none">
                <ellipse
                  cx="32"
                  cy="14"
                  rx="18"
                  ry="4.5"
                  stroke="#475569"
                  strokeWidth="1.5"
                  fill="#f1f5f9"
                />
                <path
                  d="M26 13 C26 9, 38 9, 38 13 Z"
                  fill="#e2e8f0"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <ellipse cx="32" cy="14" rx="16" ry="4" fill="#ffffff" />
                <path
                  d="M14 14 L19 50 C19 53, 45 53, 45 50 L50 14"
                  stroke="#475569"
                  strokeWidth="1.5"
                  fill="#f8fafc"
                />
                <ellipse
                  cx="32"
                  cy="50"
                  rx="13"
                  ry="3"
                  stroke="#475569"
                  strokeWidth="1.5"
                  fill="#cbd5e1"
                />
                <line
                  x1="16"
                  y1="22"
                  x2="48"
                  y2="22"
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="1,1"
                />
                <line
                  x1="17"
                  y1="31"
                  x2="47"
                  y2="31"
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="1,1"
                />
                <line
                  x1="18"
                  y1="40"
                  x2="46"
                  y2="40"
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="1,1"
                />
                <line x1="23" y1="16" x2="23" y2="49" stroke="#94a3b8" strokeWidth="1" />
                <line x1="32" y1="18" x2="32" y2="50" stroke="#94a3b8" strokeWidth="1" />
                <line x1="41" y1="16" x2="41" y2="49" stroke="#94a3b8" strokeWidth="1" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 tracking-tight mt-1">
              Hapus alat ini?
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-500 mt-2 leading-relaxed px-2">
              <span className="font-semibold text-gray-700">{itemToDelete.name}</span>{" "}
              (ID {itemToDelete.idDoc}) akan dihapus dari database dan tidak bisa
              dikembalikan.
            </p>

            {/* Footer Buttons */}
            <div className="w-full flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 bg-[#b83828] hover:bg-[#a53022] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer text-center shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
