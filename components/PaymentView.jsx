"use client";
import { useState } from "react";
import { CreditCard, Banknote, Loader2, CheckCircle2 } from "lucide-react";

export default function PaymentView({ total, onSubmit, onBack, loading }) {
  const [method, setMethod] = useState("qris");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Pilih Pembayaran
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Pilih metode pembayaran favoritmu
          </p>
        </div>
      </div>

      {/* Total Box */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
          Total Pembayaran
        </p>
        <p className="text-3xl font-black text-amber-700 tracking-tight">
          Rp {total.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        {/* QRIS */}
        <button
          onClick={() => setMethod("qris")}
          className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-all duration-200 active:scale-[0.98] text-left ${
            method === "qris"
              ? "border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 shadow-md shadow-amber-500/10"
              : "border-zinc-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
              method === "qris"
                ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30"
                : "bg-zinc-100"
            }`}
          >
            <CreditCard
              className={`w-6 h-6 ${
                method === "qris" ? "text-white" : "text-zinc-600"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-zinc-900">QRIS (Scan & Bayar)</p>
              {method === "qris" && (
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Bayar via GoPay, OVO, Dana, ShopeePay, Mobile Banking
            </p>
          </div>
        </button>

        {/* Cash */}
        <button
          onClick={() => setMethod("cash")}
          className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-all duration-200 active:scale-[0.98] text-left ${
            method === "cash"
              ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
              : "border-zinc-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
              method === "cash"
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30"
                : "bg-zinc-100"
            }`}
          >
            <Banknote
              className={`w-6 h-6 ${
                method === "cash" ? "text-white" : "text-zinc-600"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-zinc-900">Bayar di Kasir</p>
              {method === "cash" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tunai / EDC setelah pesanan diproses
            </p>
          </div>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 border-2 border-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-50 hover:border-zinc-300 active:scale-95 transition-all disabled:opacity-50"
        >
          Kembali
        </button>
        <button
          onClick={() => onSubmit(method)}
          disabled={loading}
          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 active:scale-95 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
            </>
          ) : (
            "Konfirmasi Pesanan"
          )}
        </button>
      </div>
    </div>
  );
}
