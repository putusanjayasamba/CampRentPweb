"use client";

import React, { useState, useMemo } from "react";
import { Users, Search, Shield, UserCheck, UserX } from "lucide-react";
import { INITIAL_USERS, UserItem } from "@/data/adminData";

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [roleFilter, setRoleFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const roles = ["Semua", "Customer", "Admin", "Staff"];

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === "Semua" || u.role === roleFilter;
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const handleChangeRole = (id: string, newRole: UserItem["role"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "Aktif" ? "Nonaktif" : "Aktif";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Pengguna & Hak Akses Role
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola akun terdaftar, ubah hak akses (Customer, Admin, Staff), dan aktifkan/nonaktifkan akun.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === r
                  ? "bg-[#1b4332] text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama / email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3.5 py-2 pl-9 w-full sm:w-64 focus:outline-none focus:border-[#1b4332]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Nama Lengkap</th>
                <th className="py-3.5 px-4">Email Terdaftar</th>
                <th className="py-3.5 px-4">Hak Akses Role</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-5 text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#1b4332] font-bold flex items-center justify-center text-xs">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <span className="font-bold text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-600">{u.email}</td>
                  <td className="py-4 px-4">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleChangeRole(u.id, e.target.value as UserItem["role"])
                      }
                      className="text-xs font-semibold border border-gray-200 bg-white rounded-lg px-2.5 py-1 text-gray-700 focus:outline-none focus:border-[#1b4332] cursor-pointer"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.status === "Aktif" ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        u.status === "Aktif"
                          ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {u.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
