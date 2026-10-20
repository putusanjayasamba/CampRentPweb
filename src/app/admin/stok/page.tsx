"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { INITIAL_STOCK_ITEMS, EquipmentStockItem } from "@/data/adminData";

export default function AdminStokPage() {
  const [stockItems, setStockItems] = useState<EquipmentStockItem[]>(INITIAL_STOCK_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for adding new equipment
  const [name, setName] = useState("");
  const [category, setCategory] = useState<EquipmentStockItem["category"]>("Tenda");
  const [stock, setStock] = useState<number>(5);
  const [pricePerDay, setPricePerDay] = useState<number>(50000);
  const [totalValue, setTotalValue] = useState<number>(500000);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const categories = ["Semua", "Tenda", "Sleeping Gear", "Cooking", "Lighting"];

  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchCat =
        selectedCategory === "Semua" || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [stockItems, selectedCategory, searchQuery]);

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: EquipmentStockItem = {
      idDoc: `6500a1b2c3d4...${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      category,
      stock: Number(stock),
      pricePerDay: Number(pricePerDay),
      totalValue: Number(totalValue),
      description,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: stock > 5 ? "Tersedia" : stock > 0 ? "Menipis" : "Habis",
      iconType:
        category === "Tenda"
          ? "tent"
          : category === "Sleeping Gear"
          ? "sleeping"
          : category === "Cooking"
          ? "stove"
          : "light",
    };

    setStockItems((prev) => [newItem, ...prev]);
    setIsModalOpen(false);
    // Reset form
    setName("");
    setDescription("");
    setTags("");
    alert(`Alat "${name}" berhasil ditambahkan ke inventaris!`);
  };

  const handleDeleteItem = (idDoc: string, itemName: string) => {
    if (confirm(`Hapus "${itemName}" dari daftar stok?`)) {
      setStockItems((prev) => prev.filter((item) => item.idDoc !== idDoc));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Inventaris & Manajemen Stok Alat
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola persediaan unit peralatan camping, harga sewa per hari, dan nilai aset.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#1b4332] hover:bg-[#143225] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tambah Alat Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1b4332] text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Cari alat camping..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3.5 py-2 pl-9 w-full sm:w-64 focus:outline-none focus:border-[#1b4332]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Nama Alat</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Stok Unit</th>
                <th className="py-3.5 px-4">Harga Sewa</th>
                <th className="py-3.5 px-4">Nilai Barang</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.idDoc} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-5">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {item.idDoc}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-600">
                    {item.category}
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {item.stock} unit
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#1b4332]">
                    Rp {item.pricePerDay.toLocaleString("id-ID")}{" "}
                    <span className="text-[10px] text-gray-400 font-normal">/hari</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    Rp {item.totalValue.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === "Tersedia"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.status === "Menipis"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          alert(`Fitur edit untuk "${item.name}" dapat disesuaikan langsung.`)
                        }
                        className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Alat"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.idDoc, item.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Alat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Equipment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                Tambah Alat Camping Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEquipment} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Alat Camping
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tenda Dome 6 Orang Waterproof"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as EquipmentStockItem["category"])
                    }
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#1b4332] bg-white cursor-pointer"
                  >
                    <option value="Tenda">Tenda</option>
                    <option value="Sleeping Gear">Sleeping Gear</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Lighting">Lighting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Jumlah Stok Unit
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#1b4332]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Harga Sewa / Hari (Rp)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(Number(e.target.value))}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Estimasi Nilai Barang (Rp)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    required
                    value={totalValue}
                    onChange={(e) => setTotalValue(Number(e.target.value))}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#1b4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Deskripsi / Spesifikasi
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kapasitas, ketahanan air, lapisan bahan..."
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tags (Pisahkan koma)
                </label>
                <input
                  type="text"
                  placeholder="waterproof, family, lightweight"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1b4332] hover:bg-[#143225] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Alat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
