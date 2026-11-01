"use client";
import { useState } from "react";
import { CreditCard, Banknote, Loader2 } from "lucide-react";

export default function PaymentView({ total, onSubmit, onBack, loading }) {
  const [method, setMethod] = useState("qris");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary">Pilih Pembayaran</h2>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">Total Pembayaran</p>
        <p className="text-2xl font-bold text-primary">
          Rp {total.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setMethod("qris")}
          className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition ${
            method === "qris"
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold">QRIS (Scan & Bayar)</p>
            <p className="text-xs text-gray-500">
              Bayar via GoPay, OVO, Dana, ShopeePay, Mobile Banking
            </p>
          </div>
        </button>

        <button
          onClick={() => setMethod("cashier")}
          className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition ${
            method === "cashier"
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <Banknote className="w-5 h-5 text-white" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold">Bayar di Kasir</p>
            <p className="text-xs text-gray-500">
              Tunai / EDC setelah pesanan diproses
            </p>
          </div>
        </button>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Kembali
        </button>
        <button
          onClick={() => onSubmit(method)}
          disabled={loading}
          className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-accent disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
            </>
          ) : (
            "Konfirmasi Pesanan"
          )}
        </button>
      </div>
    </div>
  );
}
