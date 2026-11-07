"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Coffee,
} from "lucide-react";

export default function AdminMenuPage() {
  const [menus, setMenus] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const initialFormState = {
    name: "",
    category: "Kopi",
    price: 0,
    description: "",
    imageUrl: "",
    isAvailable: true,
    isFeatured: false,
  };
  const [form, setForm] = useState(initialFormState);

  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      console.error("Gagal mengambil data menu:", err);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // 1. Fungsi Tambah / Edit Menu (Termasuk Ganti Harga)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/menu/${editing._id}` : "/api/menu";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      resetForm();
      fetchMenus();
    } catch (err) {
      alert("Gagal menyimpan menu: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Fungsi Toggle Status Habis / Tersedia (1 Klik)
  const toggleStatus = async (id, currentStatus) => {
    try {
      // Optimistic update (ubah UI dulu agar responsif)
      setMenus((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, isAvailable: !currentStatus } : m,
        ),
      );

      await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
    } catch (err) {
      console.error("Gagal update status:", err);
      fetchMenus(); // Rollback jika error
    }
  };

  const handleEdit = (menu) => {
    setForm({
      name: menu.name,
      category: menu.category,
      price: menu.price,
      description: menu.description || "",
      imageUrl: menu.imageUrl || "",
      isAvailable: menu.isAvailable !== undefined ? menu.isAvailable : true,
      isFeatured: menu.isFeatured || false,
    });
    setEditing(menu);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus menu ini? Tindakan ini tidak dapat dibatalkan."))
      return;
    try {
      await fetch(`/api/menu/${id}`, { method: "DELETE" });
      fetchMenus();
    } catch (err) {
      alert("Gagal menghapus menu.");
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditing(null);
    setShowForm(false);
  };

  const filteredMenus = menus.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] relative">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-zinc-200/60 supports-[backdrop-filter]:bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-zinc-900 text-xl tracking-tight">
              Kelola Menu
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Tambah, edit harga, dan atur ketersediaan menu
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchMenus}
              className="p-2.5 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5 text-zinc-600" />
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-all duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tambah Menu
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari nama menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/80 text-zinc-500 font-semibold border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4">Nama Menu</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Harga</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredMenus.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-zinc-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Coffee className="w-8 h-8 text-zinc-300" />
                        <p>Tidak ada menu yang ditemukan</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMenus.map((m) => (
                    <tr
                      key={m._id}
                      className="hover:bg-zinc-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-zinc-900">{m.name}</p>
                        <p className="text-xs text-zinc-500 line-clamp-1 max-w-[200px]">
                          {m.description || "Tidak ada deskripsi"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-zinc-100 text-zinc-700 border-zinc-200">
                          {m.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-900">
                        Rp {m.price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleStatus(m._id, m.isAvailable)}
                          className={`flex items-center justify-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            m.isAvailable
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {m.isAvailable ? (
                            <>
                              <ToggleRight className="w-4 h-4" /> Tersedia
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4" /> Habis
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(m)}
                            className="p-2 text-zinc-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Harga & Detail"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(m._id)}
                            className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Form Tambah / Edit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-zinc-200 animate-scale-in overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h3 className="font-bold text-lg text-zinc-900">
                {editing ? "Edit Menu & Harga" : "Tambah Menu Baru"}
              </h3>
              <button
                onClick={resetForm}
                className="p-1.5 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Nama Menu
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    placeholder="Contoh: Kopi Susu Gula Aren"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  >
                    <option value="Kopi">Kopi</option>
                    <option value="Non-Kopi">Non-Kopi</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    placeholder="15000"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    URL Gambar
                  </label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    placeholder="https://..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Deskripsi
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                    rows={2}
                    placeholder="Deskripsi singkat tentang menu..."
                  />
                </div>

                <div className="col-span-2 flex gap-4">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer flex-1 hover:bg-zinc-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(e) =>
                        setForm({ ...form, isAvailable: e.target.checked })
                      }
                      className="w-4 h-4 text-emerald-600 rounded border-zinc-300 focus:ring-emerald-500/20"
                    />
                    <span className="text-sm font-semibold text-zinc-900">
                      Stok Tersedia
                    </span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer flex-1 hover:bg-zinc-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm({ ...form, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 text-amber-600 rounded border-zinc-300 focus:ring-amber-500/20"
                    />
                    <span className="text-sm font-semibold text-zinc-900">
                      Menu Favorit
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 border border-zinc-200 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Menyimpan...
                    </>
                  ) : editing ? (
                    "Update Menu"
                  ) : (
                    "Simpan Menu"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
