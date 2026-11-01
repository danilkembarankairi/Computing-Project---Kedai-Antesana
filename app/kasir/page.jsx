"use client";
import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import {
  ChefHat,
  Package,
  CheckCircle,
  Clock,
  RefreshCw,
  Coffee,
  TrendingUp,
  Bell,
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
    const interval = setInterval(fetchOrders, 10000); // Polling setiap 10 detik (lebih efisien)
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
    <div className="min-h-screen bg-[#faf8f5] relative">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-zinc-200/60 supports-[backdrop-filter]:bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-md">
              <Coffee className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h1 className="font-bold text-zinc-900 text-lg tracking-tight leading-none">
                Dashboard Kasir
              </h1>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                {currentTime.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-600 bg-zinc-100/80 px-3 py-1.5 rounded-lg border border-zinc-200">
              <Clock className="w-3.5 h-3.5" />
              {currentTime.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Segarkan</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Diterima"
            value={stats.received}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Disiapkan"
            value={stats.preparing}
            icon={ChefHat}
            color="orange"
          />
          <StatCard
            title="Siap Saji"
            value={stats.ready}
            icon={Package}
            color="emerald"
          />
          <StatCard
            title="Total Order"
            value={stats.totalToday}
            icon={TrendingUp}
            color="zinc"
          />
        </div>

        {/* Modern Filter Tabs (Segmented Control) */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {[
              { key: "active", label: "Pesanan Aktif" },
              { key: "received", label: "Baru Masuk" },
              { key: "preparing", label: "Sedang Dibuat" },
              { key: "ready", label: "Siap Diantar" },
              { key: "completed", label: "Selesai" },
              { key: "all", label: "Semua" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  filter === f.key
                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {loading && filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-zinc-200/60">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">
              Tidak ada pesanan
            </h3>
            <p className="text-sm text-zinc-500">
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

// Komponen Kecil untuk Stat Card agar kode lebih rapi
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    zinc: "bg-zinc-100 text-zinc-700 border-zinc-200",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/60 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-zinc-500">{title}</span>
        <div className={`p-2 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</p>
    </div>
  );
}
