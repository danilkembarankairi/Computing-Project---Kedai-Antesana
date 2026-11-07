"use client";
import { useState } from "react";
import { User, Mail, Phone, AlertCircle, ArrowRight } from "lucide-react";

export default function CustomerForm({ onSubmit, onBack }) {
  const [data, setData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.name.trim()) e.name = "Nama wajib diisi";
    if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Email tidak valid";
    if (!/^[0-9+\-\s]{8,15}$/.test(data.phone)) e.phone = "No HP tidak valid";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (validate()) onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header Form */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Data Pelanggan
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Isi data untuk menerima notifikasi pesanan.
          </p>
        </div>
      </div>

      {/* Input: Nama */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
          Nama Lengkap
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className={`w-full pl-11 pr-4 py-3 bg-zinc-50 border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all ${
              errors.name
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-200 focus:border-amber-500 focus:ring-amber-500/20"
            }`}
            placeholder="Contoh: Christ Daniel"
          />
        </div>
        {errors.name && (
          <p className="flex items-center gap-1.5 text-red-600 text-xs font-semibold mt-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
          </p>
        )}
      </div>

      {/* Input: Email */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
          Alamat Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className={`w-full pl-11 pr-4 py-3 bg-zinc-50 border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all ${
              errors.email
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-200 focus:border-amber-500 focus:ring-amber-500/20"
            }`}
            placeholder="email@contoh.com"
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1.5 text-red-600 text-xs font-semibold mt-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
          </p>
        )}
      </div>

      {/* Input: No. HP */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
          Nomor WhatsApp / HP
        </label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className={`w-full pl-11 pr-4 py-3 bg-zinc-50 border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all ${
              errors.phone
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-200 focus:border-amber-500 focus:ring-amber-500/20"
            }`}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        {errors.phone && (
          <p className="flex items-center gap-1.5 text-red-600 text-xs font-semibold mt-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border-2 border-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-100 active:scale-95 transition-all duration-200"
        >
          Kembali
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 active:scale-95 transition-all duration-200 shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
        >
          Lanjut Pembayaran
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
