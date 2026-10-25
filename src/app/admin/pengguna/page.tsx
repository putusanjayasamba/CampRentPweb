"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Shield,
  Mail,
  User,
} from "lucide-react";
import { INITIAL_USERS, UserItem } from "@/data/adminData";

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoleUser, setEditingRoleUser] = useState<UserItem | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<UserItem["role"]>("Customer");
  const [deactivatingUser, setDeactivatingUser] = useState<UserItem | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserItem["role"]>("Customer");
  const [newUserStatus, setNewUserStatus] = useState<UserItem["status"]>("Aktif");

  // Load from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("camprent_admin_users");
      if (saved) {
        try {
          setUsers(JSON.parse(saved));
        } catch {
          // ignore error
        }
      }
    }
  }, []);

  const saveUsers = (newUsers: UserItem[]) => {
    setUsers(newUsers);
    if (typeof window !== "undefined") {
      localStorage.setItem("camprent_admin_users", JSON.stringify(newUsers));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Open Edit Role modal
  const handleOpenRoleModal = (user: UserItem) => {
    setEditingRoleUser(user);
    setSelectedNewRole(user.role);
  };

  // Save new role
  const handleSaveRole = () => {
    if (!editingRoleUser) return;
    const updated = users.map((u) =>
      u.id === editingRoleUser.id ? { ...u, role: selectedNewRole } : u
    );
    saveUsers(updated);
    showToast(`Role untuk ${editingRoleUser.name} berhasil diubah menjadi ${selectedNewRole}.`);
    setEditingRoleUser(null);
  };

  // Confirm deactivate user
  const handleConfirmDeactivate = () => {
    if (!deactivatingUser) return;
    const updated = users.map((u) =>
      u.id === deactivatingUser.id ? { ...u, status: "Nonaktif" as const } : u
    );
    saveUsers(updated);
    showToast(`Akun ${deactivatingUser.name} telah dinonaktifkan.`);
    setDeactivatingUser(null);
  };

  // Reactivate user directly
  const handleActivateUser = (user: UserItem) => {
    const updated = users.map((u) =>
      u.id === user.id ? { ...u, status: "Aktif" as const } : u
    );
    saveUsers(updated);
    showToast(`Akun ${user.name} berhasil diaktifkan kembali.`);
  };

  // Handle add new user
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: UserItem = {
      id: `u-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: newUserStatus,
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    showToast(`Pengguna baru ${newUser.name} berhasil ditambahkan!`);

    // Reset and close
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Customer");
    setNewUserStatus("Aktif");
    setIsAddModalOpen(false);
  };

  // Role Badge Styling matching Image 2
  const getRoleBadge = (role: UserItem["role"]) => {
    switch (role) {
      case "Customer":
        return "bg-[#e0f2fe] text-[#0369a1]";
      case "Admin":
        return "bg-[#fff1e8] text-[#c2410c]";
      case "Staff":
        return "bg-[#d1fae5] text-[#047857]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Status Badge Styling matching Image 2
  const getStatusBadge = (status: UserItem["status"]) => {
    if (status === "Aktif") {
      return "bg-[#e6f4ea] text-[#1b7a37]";
    }
    return "bg-[#fee2e2] text-[#b91c1c]";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1b4332] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Title and Tambah Pengguna Button */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          <span className="lg:hidden">Pengguna</span>
          <span className="hidden lg:inline">Pengguna &amp; Role</span>
        </h2>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#24583b] hover:bg-[#1a442e] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="lg:hidden">Tambah</span>
          <span className="hidden lg:inline">Tambah Pengguna</span>
        </button>
      </div>

      {/* ── MOBILE CARD LIST (< lg) ── */}
      <div className="space-y-3 lg:hidden">
        {users.map((u) => {
          const initial = u.name.trim().charAt(0).toUpperCase();
          return (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs space-y-3">
              {/* Top row: Avatar+Name & Role badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#e07a2c] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {initial}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{u.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                  </div>
                </div>
                <span className={`shrink-0 px-3 py-0.5 rounded-full text-[11px] font-semibold ${getRoleBadge(u.role)}`}>
                  {u.role}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenRoleModal(u)}
                  className="px-4 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  Ubah Role
                </button>
                {u.status === "Aktif" ? (
                  <button
                    type="button"
                    onClick={() => setDeactivatingUser(u)}
                    className="px-4 py-1.5 bg-[#b83828] hover:bg-[#a53022] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Nonaktifkan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleActivateUser(u)}
                    className="px-4 py-1.5 bg-[#24583b] hover:bg-[#1a442e] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Aktifkan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DESKTOP TABLE (≥ lg) — unchanged ── */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f8fafc] text-gray-500 font-medium text-xs border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-6 font-medium">Nama</th>
                <th className="py-3.5 px-4 font-medium">Email</th>
                <th className="py-3.5 px-4 font-medium">Role</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => {
                const initialLetter = u.name.trim().charAt(0).toUpperCase();
                return (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#e07a2c] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {initialLetter}
                        </div>
                        <span className="font-bold text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap">{u.email}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenRoleModal(u)}
                          className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Ubah Role
                        </button>
                        {u.status === "Aktif" ? (
                          <button
                            type="button"
                            onClick={() => setDeactivatingUser(u)}
                            className="bg-[#b83828] hover:bg-[#a53022] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Nonaktifkan
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleActivateUser(u)}
                            className="bg-[#24583b] hover:bg-[#1a442e] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Aktifkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Pengguna */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Tambah Pengguna Baru
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tambahkan pengguna dan tentukan hak akses peran
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleAddUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Made Ariawan"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1b4332] text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="Contoh: made@mail.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1b4332] text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Role
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) =>
                      setNewUserRole(e.target.value as UserItem["role"])
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1b4332] text-xs font-medium bg-white"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Status Akun
                  </label>
                  <select
                    value={newUserStatus}
                    onChange={(e) =>
                      setNewUserStatus(e.target.value as UserItem["status"])
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1b4332] text-xs font-medium bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#24583b] hover:bg-[#1a442e] text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ubah Role */}
      {editingRoleUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <h3 className="font-bold text-gray-900 text-base">
                Ubah Role Pengguna
              </h3>
              <button
                type="button"
                onClick={() => setEditingRoleUser(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#e07a2c] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {editingRoleUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {editingRoleUser.name}
                  </h4>
                  <p className="text-gray-500 text-xs">{editingRoleUser.email}</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Pilih Role Baru
                </label>
                <select
                  value={selectedNewRole}
                  onChange={(e) =>
                    setSelectedNewRole(e.target.value as UserItem["role"])
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1b4332] text-xs font-semibold bg-white cursor-pointer"
                >
                  <option value="Customer">Customer</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingRoleUser(null)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveRole}
                  className="px-4 py-2 bg-[#24583b] hover:bg-[#1a442e] text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Nonaktifkan */}
      {deactivatingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-gray-900 text-base">
                Nonaktifkan Akun?
              </h3>
              <p className="text-xs text-gray-500">
                Apakah Anda yakin ingin menonaktifkan akun milik{" "}
                <span className="font-semibold text-gray-800">
                  {deactivatingUser.name}
                </span>
                ? Pengguna ini tidak akan bisa login ke dalam sistem.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeactivatingUser(null)}
                className="flex-1 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeactivate}
                className="flex-1 py-2 bg-[#b83828] hover:bg-[#a53022] text-white font-semibold rounded-lg text-xs cursor-pointer"
              >
                Ya, Nonaktifkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
