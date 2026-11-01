"use client";
import { useState } from "react";
import { User, Mail, Phone } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-primary">Data Pelanggan</h2>
      <p className="text-sm text-gray-600">
        Isi data untuk menerima notifikasi pesanan via email.
      </p>

      <div>
        <label className="text-sm font-medium flex items-center gap-1 mb-1">
          <User className="w-4 h-4" /> Nama Lengkap
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          placeholder="Nama kamu"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium flex items-center gap-1 mb-1">
          <Mail className="w-4 h-4" /> Email
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          placeholder="email@contoh.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium flex items-center gap-1 mb-1">
          <Phone className="w-4 h-4" /> No. HP
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          placeholder="08xxxxxxxxxx"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
        >
          Kembali
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-accent"
        >
          Lanjut Pembayaran
        </button>
      </div>
    </form>
  );
}
