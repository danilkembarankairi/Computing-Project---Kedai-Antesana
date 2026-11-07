"use client";
import { useEffect, useState } from "react";
import { Plus, QrCode, Download, Trash2 } from "lucide-react";

export default function AdminTablesPage() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState("");

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
    try {
      await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber: newTable }),
      });
      setNewTable("");
      fetchTables();
    } catch (err) {
      alert("Gagal menambah meja.");
    }
  };

  const generateQR = async (id) => {
    try {
      const res = await fetch(`/api/tables/${id}/qr`);
      const data = await res.json();

      const link = document.createElement("a");
      link.href = data.qrCodeUrl;
      link.download = `qr-meja-${id}.png`;
      link.click();

      fetchTables();
    } catch (err) {
      alert("Gagal generate QR Code");
    }
  };

  // ✅ FUNGSI BARU: Hapus Meja
  const deleteTable = async (id) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus meja ini? Tindakan ini tidak dapat dibatalkan.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/tables/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchTables(); // Refresh daftar meja setelah berhasil dihapus
      } else {
        alert("Gagal menghapus meja.");
      }
    } catch (err) {
      console.error("Error deleting table:", err);
      alert("Terjadi kesalahan saat menghapus meja.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Kelola Meja</h1>
          <p className="text-sm opacity-80">
            Generate QR Code dan kelola daftar meja
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Nomor meja (contoh: 1, A1, VIP)"
            value={newTable}
            onChange={(e) => setNewTable(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={addTable}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tables.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-xl p-4 shadow-sm border text-center relative group"
            >
              {/* ✅ TOMBOL HAPUS BARU (Muncul saat di-hover) */}
              <button
                onClick={() => deleteTable(t._id)}
                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Hapus Meja"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="text-3xl font-bold text-primary mb-2">
                #{t.tableNumber}
              </div>

              {t.qrCodeUrl ? (
                <img
                  src={t.qrCodeUrl}
                  alt={`QR Meja ${t.tableNumber}`}
                  className="w-full aspect-square object-contain mb-2"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center mb-2">
                  <QrCode className="w-12 h-12 text-gray-300" />
                </div>
              )}

              <button
                onClick={() => generateQR(t._id)}
                className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                {t.qrCodeUrl ? "Download" : "Generate QR"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
