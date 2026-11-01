"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  QrCode,
  Download,
  Trash2,
  Edit2,
  X,
  Table as TableIcon,
  CheckCircle,
  Copy,
} from "lucide-react";

export default function AdminTablesPage() {
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTable, setNewTable] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    fetchTables();
  }, []);

  const addTable = async () => {
    if (!newTable.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber: newTable }),
      });
      setNewTable("");
      setShowForm(false);
      fetchTables();
    } catch (err) {
      alert("Gagal menambah meja: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateQR = async (id) => {
    try {
      const res = await fetch(`/api/tables/${id}/qr`);
      const data = await res.json();

      // Download QR
      const link = document.createElement("a");
      link.href = data.qrCodeUrl;
      link.download = `qr-meja-${data.tableNumber}.png`;
      link.click();

      fetchTables();
    } catch (err) {
      alert("Gagal generate QR Code");
    }
  };

  const deleteTable = async (id) => {
    if (!confirm("Hapus meja ini? Semua pesanan di meja ini akan hilang."))
      return;

    try {
      await fetch(`/api/tables/${id}`, { method: "DELETE" });
      fetchTables();
    } catch (err) {
      alert("Gagal menghapus meja");
    }
  };

  const copyLink = (tableNumber) => {
    const url = `${window.location.origin}/order?table=${tableNumber}`;
    navigator.clipboard.writeText(url);
    alert("Link disalin ke clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] relative">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-zinc-200/60 supports-[backdrop-filter]:bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-zinc-900 text-xl tracking-tight">
              Kelola Meja
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Generate QR Code untuk setiap meja
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Meja
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <TableIcon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-zinc-500">
                Total Meja
              </span>
            </div>
            <p className="text-3xl font-bold text-zinc-900">{tables.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-zinc-500">
                Meja Aktif
              </span>
            </div>
            <p className="text-3xl font-bold text-zinc-900">
              {tables.filter((t) => t.isActive).length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <QrCode className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-zinc-500">
                QR Generated
              </span>
            </div>
            <p className="text-3xl font-bold text-zinc-900">
              {tables.filter((t) => t.qrCodeUrl).length}
            </p>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table._id}
              className="group bg-white rounded-2xl p-5 border border-zinc-200/60 shadow-sm hover:shadow-xl hover:border-amber-300/60 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <TableIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg">
                      #{table.tableNumber}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {table.isActive ? "Aktif" : "Non-aktif"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteTable(table._id)}
                  className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* QR Code Preview */}
              <div className="aspect-square rounded-xl bg-zinc-50 border border-zinc-200 mb-4 flex items-center justify-center overflow-hidden">
                {table.qrCodeUrl ? (
                  <img
                    src={table.qrCodeUrl}
                    alt={`QR Meja ${table.tableNumber}`}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center p-4">
                    <QrCode className="w-12 h-12 text-zinc-300 mx-auto mb-2" />
                    <p className="text-xs text-zinc-400">Belum generate QR</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => generateQR(table._id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  {table.qrCodeUrl ? "Download Ulang" : "Generate QR"}
                </button>

                <button
                  onClick={() => copyLink(table.tableNumber)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </button>
              </div>
            </div>
          ))}

          {tables.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TableIcon className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">
                Belum ada meja
              </h3>
              <p className="text-sm text-zinc-500 mb-4">
                Tambahkan meja pertama Anda untuk memulai
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Meja
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Table Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-zinc-200 animate-scale-in overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h3 className="font-bold text-lg text-zinc-900">
                Tambah Meja Baru
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Nomor/Nama Meja
                </label>
                <input
                  type="text"
                  value={newTable}
                  onChange={(e) => setNewTable(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTable()}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  placeholder="Contoh: 1, A1, VIP-1"
                  autoFocus
                />
                <p className="text-xs text-zinc-500 mt-1.5">
                  Gunakan format yang konsisten untuk memudahkan identifikasi
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-zinc-200 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={addTable}
                  disabled={isSubmitting || !newTable.trim()}
                  className="flex-1 px-4 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
