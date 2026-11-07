"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import OrderCard from "@/components/OrderCard";
import {
  ChefHat,
  Package,
  CheckCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  Home,
  Receipt,
  Coffee,
} from "lucide-react";

export default function KasirPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("active");
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update waktu setiap menit
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Gagal mengambil data pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling setiap 10 detik
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: status }),
    });
    fetchOrders();
  };

  const updatePayment = async (id, status) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: status }),
    });
    fetchOrders();
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "active") return o.orderStatus !== "completed";
    if (filter === "all") return true;
    return o.orderStatus === filter;
  });

  const stats = {
    received: orders.filter((o) => o.orderStatus === "received").length,
    preparing: orders.filter((o) => o.orderStatus === "preparing").length,
    ready: orders.filter((o) => o.orderStatus === "ready").length,
    totalToday: orders.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-zinc-50 relative selection:bg-amber-200 selection:text-amber-900">
      {/* Premium Header (Persis seperti Admin) */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-amber-100/90 via-orange-100/90 to-amber-100/90 border-b border-amber-200/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Tombol Kembali ke Beranda (Subtle) */}
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
                Dashboard Kasir
              </h1>
              <p className="text-sm text-zinc-600 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Jam Digital */}
            <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-amber-800 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
              <Clock className="w-4 h-4" />
              {currentTime.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Tombol Refresh (Persis seperti Admin) */}
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-3 bg-white border-2 border-amber-200 rounded-xl hover:bg-amber-50 hover:border-amber-300 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg group disabled:opacity-50"
              title="Segarkan Data"
            >
              <RefreshCw
                className={`w-5 h-5 text-amber-700 group-hover:rotate-180 transition-transform duration-700 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid (Gradient Colorful seperti Admin) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Baru Masuk"
            value={stats.received}
            icon={Clock}
            color="blue"
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Sedang Dibuat"
            value={stats.preparing}
            icon={ChefHat}
            color="orange"
            gradient="from-orange-500 to-orange-600"
          />
          <StatCard
            title="Siap Saji"
            value={stats.ready}
            icon={Package}
            color="emerald"
            gradient="from-emerald-500 to-emerald-600"
          />
          <StatCard
            title="Total Order"
            value={stats.totalToday}
            icon={TrendingUp}
            color="amber"
            gradient="from-amber-500 to-orange-600"
          />
        </div>

        {/* Modern Filter Tabs (Persis seperti Admin) */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
          {[
            { key: "active", label: "Pesanan Aktif", icon: Receipt },
            { key: "received", label: "Baru Masuk", icon: Clock },
            { key: "preparing", label: "Sedang Dibuat", icon: ChefHat },
            { key: "ready", label: "Siap Saji", icon: Package },
            { key: "completed", label: "Selesai", icon: CheckCircle },
            { key: "all", label: "Semua", icon: TrendingUp },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  filter === f.key
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                    : "text-zinc-600 hover:bg-amber-100 hover:text-amber-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Orders Grid */}
        {loading && filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
            <p className="text-zinc-600 font-medium">Memuat pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-amber-200">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">
              Tidak ada pesanan
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              Pesanan baru akan muncul di sini secara otomatis.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onUpdateStatus={updateStatus}
                onUpdatePayment={updatePayment}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Komponen Stat Card (Persis seperti Admin Page)
function StatCard({ title, value, icon: Icon, color, gradient }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl shadow-${color}-500/20 text-white hover:shadow-2xl hover:shadow-${color}-500/30 hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-white/90">{title}</span>
      </div>
      <p className="text-4xl font-bold">{value}</p>
      <p className="text-sm text-white/80 mt-1">Pesanan hari ini</p>
    </div>
  );
}
