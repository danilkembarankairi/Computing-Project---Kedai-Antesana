"use client";
import { useEffect, useState } from "react";
import { Plus, QrCode, Download } from "lucide-react";

export default function AdminTablesPage() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState("");

  const fetchTables = async () => {
    const res = await fetch("/api/tables");
    const data = await res.json();
    setTables(data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const addTable = async () => {
    if (!newTable.trim()) return;
    await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableNumber: newTable }),
    });
    setNewTable("");
    fetchTables();
  };

  const generateQR = async (id) => {
    const res = await fetch(`/api/tables/${id}/qr`);
    const data = await res.json();

    // Download QR
    const link = document.createElement("a");
    link.href = data.qrCodeUrl;
    link.download = `qr-meja-${id}.png`;
    link.click();

    fetchTables();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Kelola Meja</h1>
          <p className="text-sm opacity-80">
            Generate QR Code untuk setiap meja
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
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            onClick={addTable}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tables.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-xl p-4 shadow-sm border text-center"
            >
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
                className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
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
