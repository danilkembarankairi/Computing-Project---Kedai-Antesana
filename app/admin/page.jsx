"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
  CheckCircle,
  AlertCircle,
  QrCode,
  Download,
  Copy,
  LayoutGrid,
  Loader2,
  Image as ImageIcon,
  Flame,
  Home,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("menu");

  // --- STATE UNTUK MENU ---
  const [menus, setMenus] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [isSubmittingMenu, setIsSubmittingMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const initialMenuForm = {
    name: "",
    category: "Kopi",
    price: 0,
    description: "",
    imageUrl: "",
    isAvailable: true,
    isFeatured: false,
  };
  const [menuForm, setMenuForm] = useState(initialMenuForm);

  // --- STATE UNTUK MEJA ---
  const [tables, setTables] = useState([]);
  const [showTableForm, setShowTableForm] = useState(false);
  const [newTable, setNewTable] = useState("");
  const [isSubmittingTable, setIsSubmittingTable] = useState(false);
  const [generatingQRId, setGeneratingQRId] = useState(null);
  const [copiedTableId, setCopiedTableId] = useState(null);

  // --- FETCH DATA ---
  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      console.error("Gagal mengambil data menu:", err);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await fetch("/api/tables");
      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.error("Gagal mengambil data meja:", err);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchTables();
  }, []);

  // --- FUNGSI MENU ---
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingMenu(true);
    try {
      const method = editingMenu ? "PUT" : "POST";
      const url = editingMenu ? `/api/menu/${editingMenu._id}` : "/api/menu";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuForm),
      });
      resetMenuForm();
      fetchMenus();
    } catch (err) {
      alert("Gagal menyimpan menu: " + err.message);
    } finally {
      setIsSubmittingMenu(false);
    }
  };

  const toggleMenuStatus = async (id, currentStatus) => {
    setMenus((prev) =>
      prev.map((m) =>
        m._id === id ? { ...m, isAvailable: !currentStatus } : m,
      ),
    );

    try {
      await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
    } catch (err) {
      console.error("Gagal update status:", err);
      fetchMenus();
    }
  };

  const handleEditMenu = (menu) => {
    setMenuForm({
      name: menu.name,
      category: menu.category,
      price: menu.price,
      description: menu.description || "",
      imageUrl: menu.imageUrl || "",
      isAvailable: menu.isAvailable !== undefined ? menu.isAvailable : true,
      isFeatured: menu.isFeatured || false,
    });
    setEditingMenu(menu);
    setShowMenuForm(true);
  };

  const handleDeleteMenu = async (id) => {
    if (!confirm("Yakin hapus menu ini? Tindakan ini tidak dapat dibatalkan."))
      return;
    try {
      await fetch(`/api/menu/${id}`, { method: "DELETE" });
      fetchMenus();
    } catch (err) {
      alert("Gagal menghapus menu.");
    }
  };

  const resetMenuForm = () => {
    setMenuForm(initialMenuForm);
    setEditingMenu(null);
    setShowMenuForm(false);
  };

  const filteredMenus = menus.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // --- FUNGSI MEJA ---
  const addTable = async () => {
    if (!newTable.trim()) return;
    setIsSubmittingTable(true);
    try {
      await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber: newTable }),
      });
      setNewTable("");
      setShowTableForm(false);
      fetchTables();
    } catch (err) {
      alert("Gagal menambah meja: " + err.message);
    } finally {
      setIsSubmittingTable(false);
    }
  };

  const generateQR = async (id) => {
    setGeneratingQRId(id);
    try {
      const res = await fetch(`/api/tables/${id}/qr`);
      const data = await res.json();

      if (data.qrCodeUrl) {
        const link = document.createElement("a");
        link.href = data.qrCodeUrl;
        link.download = `qr-meja-${data.tableNumber}.png`;
        link.click();
        fetchTables();
      }
    } catch (err) {
      alert("Gagal generate QR Code");
    } finally {
      setGeneratingQRId(null);
    }
  };

  const deleteTable = async (id) => {
    if (!confirm("Hapus meja ini? Pesanan di meja ini akan terpengaruh."))
      return;
    try {
      await fetch(`/api/tables/${id}`, { method: "DELETE" });
      fetchTables();
    } catch (err) {
      alert("Gagal menghapus meja");
    }
  };

  const copyLink = (tableNumber, id) => {
    const url = `${window.location.origin}/order?table=${tableNumber}`;
    navigator.clipboard.writeText(url);
    setCopiedTableId(id);
    setTimeout(() => setCopiedTableId(null), 2000);
  };

  // --- RENDER UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-zinc-50 relative selection:bg-amber-200 selection:text-amber-900">
      {/* Premium Header dengan Gradient */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-amber-100/90 via-orange-100/90 to-amber-100/90 border-b border-amber-200/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Tombol Kembali ke Beranda (Subtle & Tidak Mencolok) */}
            <Link
              href="/"
              className="p-2.5 text-zinc-400 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all duration-200 active:scale-95"
              title="Kembali ke Beranda"
            >
              <Home className="w-5 h-5" />
            </Link>

            {/* Logo Kedai Antasena */}
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-200 shadow-sm bg-white flex-shrink-0">
              <img
                src="/kedai-antasena.jpeg"
                alt="Kedai Antasena"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="font-bold text-zinc-900 text-2xl tracking-tight">
                Dashboard Admin
              </h1>
              <p className="text-sm text-zinc-600 font-medium">
                Kelola operasional Kedai Antasena
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              fetchMenus();
              fetchTables();
            }}
            className="p-3 bg-white border-2 border-amber-200 rounded-xl hover:bg-amber-50 hover:border-amber-300 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg group"
            title="Refresh Semua Data"
          >
            <RefreshCw className="w-5 h-5 text-amber-700 group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation dengan Warna */}
        <div className="flex gap-2 mb-8 bg-white/80 backdrop-blur-sm p-2 rounded-2xl border-2 border-amber-200/60 w-fit shadow-lg">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
              activeTab === "menu"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                : "text-zinc-600 hover:bg-amber-100 hover:text-amber-900"
            }`}
          >
            <Coffee className="w-5 h-5" /> Kelola Menu
          </button>
          <button
            onClick={() => setActiveTab("meja")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
              activeTab === "meja"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                : "text-zinc-600 hover:bg-amber-100 hover:text-amber-900"
            }`}
          >
            <LayoutGrid className="w-5 h-5" /> Kelola Meja
          </button>
        </div>

        {/* ================= TAB 1: KELOLA MENU ================= */}
        {activeTab === "menu" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Summary Menu dengan Gradient Colorful */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl shadow-blue-500/20 text-white hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <span className="text-blue-100 text-sm font-semibold">
                    Total
                  </span>
                </div>
                <p className="text-4xl font-bold">{menus.length}</p>
                <p className="text-blue-100 text-sm mt-1">Menu tersedia</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-xl shadow-emerald-500/20 text-white hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className="text-emerald-100 text-sm font-semibold">
                    Aktif
                  </span>
                </div>
                <p className="text-4xl font-bold">
                  {menus.filter((m) => m.isAvailable).length}
                </p>
                <p className="text-emerald-100 text-sm mt-1">Menu tersedia</p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-xl shadow-red-500/20 text-white hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <span className="text-red-100 text-sm font-semibold">
                    Habis
                  </span>
                </div>
                <p className="text-4xl font-bold">
                  {menus.filter((m) => !m.isAvailable).length}
                </p>
                <p className="text-red-100 text-sm mt-1">Perlu restock</p>
              </div>
            </div>

            {/* Search & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="relative max-w-md w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                <input
                  type="text"
                  placeholder="Cari nama menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-amber-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 shadow-md"
                />
              </div>
              <button
                onClick={() => {
                  resetMenuForm();
                  setShowMenuForm(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 active:scale-95 transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40"
              >
                <Plus className="w-5 h-5" /> Tambah Menu
              </button>
            </div>

            {/* Menu Grid dengan Gambar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMenus.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-amber-200">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coffee className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="font-bold text-zinc-900">
                    Tidak ada menu yang ditemukan
                  </p>
                </div>
              ) : (
                filteredMenus.map((m) => (
                  <div
                    key={m._id}
                    className={`group bg-white rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 ${
                      m.isAvailable
                        ? "border-amber-200 hover:border-amber-400"
                        : "border-zinc-200 opacity-75"
                    }`}
                  >
                    <div className="flex">
                      {/* Gambar Menu */}
                      <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
                        {m.imageUrl ? (
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-zinc-400" />
                          </div>
                        )}

                        {/* Badge Favorit */}
                        {m.isFeatured && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            FAVORIT
                          </div>
                        )}

                        {/* Badge Habis */}
                        {!m.isAvailable && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                              HABIS
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Konten Menu */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-zinc-900 text-lg leading-tight">
                              {m.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${
                                m.category === "Kopi"
                                  ? "bg-amber-100 text-amber-800"
                                  : m.category === "Non-Kopi"
                                    ? "bg-blue-100 text-blue-800"
                                    : m.category === "Makanan"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {m.category}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 line-clamp-2 mb-2">
                            {m.description || "Tidak ada deskripsi"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-amber-700 font-bold text-xl">
                            Rp {m.price.toLocaleString("id-ID")}
                          </p>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                toggleMenuStatus(m._id, m.isAvailable)
                              }
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
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
                            <button
                              onClick={() => handleEditMenu(m)}
                              className="p-2 text-zinc-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all active:scale-95"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenu(m._id)}
                              className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: KELOLA MEJA ================= */}
        {activeTab === "meja" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Summary Meja */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl shadow-blue-500/20 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <LayoutGrid className="w-6 h-6" />
                  </div>
                  <span className="text-blue-100 text-sm font-semibold">
                    Total
                  </span>
                </div>
                <p className="text-4xl font-bold">{tables.length}</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-xl shadow-emerald-500/20 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className="text-emerald-100 text-sm font-semibold">
                    Aktif
                  </span>
                </div>
                <p className="text-4xl font-bold">
                  {tables.filter((t) => t.isActive).length}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-xl shadow-amber-500/20 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <span className="text-amber-100 text-sm font-semibold">
                    QR Ready
                  </span>
                </div>
                <p className="text-4xl font-bold">
                  {tables.filter((t) => t.qrCodeUrl).length}
                </p>
              </div>
            </div>

            {/* Header & Add Button */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <LayoutGrid className="w-6 h-6 text-amber-600" />
                Daftar Meja & QR Code
              </h2>
              <button
                onClick={() => setShowTableForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 active:scale-95 transition-all duration-200 shadow-lg shadow-amber-500/30"
              >
                <Plus className="w-5 h-5" /> Tambah Meja
              </button>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className="group bg-white rounded-2xl p-5 border-2 border-amber-200/60 shadow-lg hover:shadow-2xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <LayoutGrid className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 text-lg">
                          #{table.tableNumber}
                        </h3>
                        <p className="text-xs text-zinc-500 font-medium">
                          {table.isActive ? "Aktif" : "Non-aktif"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTable(table._id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="aspect-square rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 border-2 border-zinc-200 mb-4 flex items-center justify-center overflow-hidden">
                    {table.qrCodeUrl ? (
                      <img
                        src={table.qrCodeUrl}
                        alt={`QR Meja ${table.tableNumber}`}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <QrCode className="w-12 h-12 text-zinc-300 mx-auto mb-2" />
                        <p className="text-xs text-zinc-500 font-medium">
                          Belum generate QR
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => generateQR(table._id)}
                      disabled={generatingQRId === table._id}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold rounded-lg hover:from-amber-600 hover:to-orange-700 active:scale-95 transition-all duration-200 shadow-md disabled:opacity-70"
                    >
                      {generatingQRId === table._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {table.qrCodeUrl ? "Download Ulang" : "Generate QR"}
                    </button>
                    <button
                      onClick={() => copyLink(table.tableNumber, table._id)}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 ${
                        copiedTableId === table._id
                          ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-2 border-zinc-200"
                      }`}
                    >
                      {copiedTableId === table._id ? (
                        <>
                          <CheckCircle className="w-4 h-4" /> Disalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {tables.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-amber-200">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-1">
                    Belum ada meja
                  </h3>
                  <p className="text-sm text-zinc-500 mb-6">
                    Tambahkan meja pertama Anda
                  </p>
                  <button
                    onClick={() => setShowTableForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 active:scale-95 transition-all duration-200 shadow-lg shadow-amber-500/30"
                  >
                    <Plus className="w-5 h-5" /> Tambah Meja
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL FORM MENU ================= */}
      {showMenuForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border-4 border-amber-200 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="font-bold text-lg text-zinc-900">
                {editingMenu ? "Edit Menu & Harga" : "Tambah Menu Baru"}
              </h3>
              <button
                onClick={resetMenuForm}
                className="p-2 hover:bg-amber-200 rounded-lg transition-all active:scale-95 text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleMenuSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                    Nama Menu
                  </label>
                  <input
                    type="text"
                    required
                    value={menuForm.name}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    placeholder="Contoh: Kopi Susu Gula Aren"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                    Kategori
                  </label>
                  <select
                    value={menuForm.category}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  >
                    <option value="Kopi">Kopi</option>
                    <option value="Non-Kopi">Non-Kopi</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={menuForm.price}
                    onChange={(e) =>
                      setMenuForm({
                        ...menuForm,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    placeholder="15000"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                    URL Gambar
                  </label>
                  <input
                    type="url"
                    value={menuForm.imageUrl}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, imageUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                    Deskripsi
                  </label>
                  <textarea
                    value={menuForm.description}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                    rows={2}
                    placeholder="Deskripsi singkat..."
                  />
                </div>
                <div className="col-span-2 flex gap-4">
                  <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-zinc-200 bg-zinc-50 cursor-pointer flex-1 hover:bg-amber-50 hover:border-amber-300 transition-all active:scale-[0.98]">
                    <input
                      type="checkbox"
                      checked={menuForm.isAvailable}
                      onChange={(e) =>
                        setMenuForm({
                          ...menuForm,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-emerald-600 rounded-lg border-2 border-zinc-300 focus:ring-emerald-500/20"
                    />
                    <span className="text-sm font-bold text-zinc-900">
                      Stok Tersedia
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-zinc-200 bg-zinc-50 cursor-pointer flex-1 hover:bg-amber-50 hover:border-amber-300 transition-all active:scale-[0.98]">
                    <input
                      type="checkbox"
                      checked={menuForm.isFeatured}
                      onChange={(e) =>
                        setMenuForm({
                          ...menuForm,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-amber-600 rounded-lg border-2 border-zinc-300 focus:ring-amber-500/20"
                    />
                    <span className="text-sm font-bold text-zinc-900">
                      Menu Favorit
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetMenuForm}
                  className="flex-1 px-4 py-3 border-2 border-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-100 active:scale-95 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMenu}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/30"
                >
                  {isSubmittingMenu ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
                    </>
                  ) : editingMenu ? (
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

      {/* ================= MODAL FORM MEJA ================= */}
      {showTableForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border-4 border-amber-200 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="font-bold text-lg text-zinc-900">
                Tambah Meja Baru
              </h3>
              <button
                onClick={() => setShowTableForm(false)}
                className="p-2 hover:bg-amber-200 rounded-lg transition-all active:scale-95 text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                  Nomor/Nama Meja
                </label>
                <input
                  type="text"
                  value={newTable}
                  onChange={(e) => setNewTable(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTable()}
                  className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  placeholder="Contoh: 1, A1, VIP-1"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTableForm(false)}
                  className="flex-1 px-4 py-3 border-2 border-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-100 active:scale-95 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={addTable}
                  disabled={isSubmittingTable || !newTable.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/30"
                >
                  {isSubmittingTable ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
