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
  Banknote,
  Coffee,
  Flame,
  Calendar,
} from "lucide-react";

export default function KasirPage() {
  const [orders, setOrders] = useState([]);
  const [menus, setMenus] = useState([]); // ✅ STATE BARU: Untuk mencocokkan gambar
  const [filter, setFilter] = useState("active");
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // ✅ FETCH DATA: Ambil Orders DAN Menus sekaligus
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, menuRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/menu"),
      ]);

      const ordersData = await ordersRes.json();
      const menuData = await menuRes.json();

      setOrders(ordersData);
      setMenus(menuData);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: status }),
    });
    fetchData();
  };

  const updatePayment = async (id, status) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: status }),
    });
    fetchData();
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "active") return o.orderStatus !== "completed";
    if (filter === "all") return true;
    return o.orderStatus === filter;
  });

  const targetDate = new Date(selectedDate);

  const dailyOrders = orders.filter((o) => {
    if (!o.createdAt) return false;
    const d = new Date(o.createdAt);
    return (
      d.getDate() === targetDate.getDate() &&
      d.getMonth() === targetDate.getMonth() &&
      d.getFullYear() === targetDate.getFullYear()
    );
  });

  const dailyRevenue = dailyOrders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0,
  );

  // ✅ AGREGASI MENU: Fallback ke data 'menus' jika imageUrl tidak ada di order
  const menuSummary = {};
  dailyOrders.forEach((order) => {
    if (order.items) {
      order.items.forEach((item) => {
        // Cari gambar dari database menu jika item.imageUrl kosong
        const matchedMenu = menus.find(
          (m) => m.name === item.name || m._id === item.menuId,
        );
        const finalImageUrl = item.imageUrl || matchedMenu?.imageUrl || null;

        if (menuSummary[item.name]) {
          menuSummary[item.name].quantity += item.quantity;
          menuSummary[item.name].revenue += item.price * item.quantity;
        } else {
          menuSummary[item.name] = {
            quantity: item.quantity,
            revenue: item.price * item.quantity,
            price: item.price,
            imageUrl: finalImageUrl, // ✅ Sekarang pasti ada gambarnya!
          };
        }
      });
    }
  });

  const topMenus = Object.entries(menuSummary)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.quantity - a.quantity);

  const stats = {
    received: orders.filter((o) => o.orderStatus === "received").length,
    preparing: orders.filter((o) => o.orderStatus === "preparing").length,
    ready: orders.filter((o) => o.orderStatus === "ready").length,
    totalDaily: dailyOrders.length,
  };

  const formattedDateTitle = targetDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-zinc-50 relative selection:bg-amber-200 selection:text-amber-900">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-amber-100/90 via-orange-100/90 to-amber-100/90 border-b border-amber-200/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2.5 text-zinc-400 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all duration-200 active:scale-95"
              title="Kembali ke Beranda"
            >
              <Home className="w-5 h-5" />
            </Link>

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
            <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-amber-200 shadow-sm">
              <Calendar className="w-4 h-4 text-amber-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent outline-none text-sm font-bold text-zinc-700 cursor-pointer focus:text-amber-700"
              />
            </div>

            <button
              onClick={fetchData}
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

        <div className="sm:hidden px-4 pb-3 -mt-2">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-amber-200 shadow-sm w-full justify-center">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-zinc-500">
              Laporan Tanggal:
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent outline-none text-sm font-bold text-zinc-700 cursor-pointer"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-8 w-1.5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-zinc-800">
            Laporan: {formattedDateTitle}
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 shadow-xl shadow-emerald-500/20 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-emerald-100">
                Pendapatan
              </span>
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Banknote className="w-5 h-5" />
              </div>
            </div>
            <p
              className="text-xl lg:text-2xl font-black tracking-tight truncate"
              title={`Rp ${dailyRevenue.toLocaleString("id-ID")}`}
            >
              Rp {dailyRevenue.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-emerald-100 mt-1">
              {dailyOrders.length} Transaksi
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  filter === f.key
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                    : "text-zinc-600 hover:bg-amber-100 hover:text-amber-900 bg-white border border-amber-200/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* ✅ SECTION: RINGKASAN MENU DENGAN GAMBAR ASLI */}
        {topMenus.length > 0 ? (
          <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-amber-200/60 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-lg">
                  Menu Terjual ({formattedDateTitle})
                </h3>
                <p className="text-xs text-zinc-500">
                  Total {topMenus.length} jenis menu terjual
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {topMenus.map((menu, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100 hover:border-amber-300 transition-all"
                >
                  {/* ✅ GAMBAR ASLI MENU (Dengan Fallback yang Aman) */}
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0 border border-zinc-100">
                    {menu.imageUrl ? (
                      <img
                        src={menu.imageUrl}
                        alt={menu.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Jika link gambar rusak, tampilkan ikon kopi
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    {/* Fallback Icon (Muncul jika tidak ada imageUrl atau gambar error) */}
                    <div
                      className={`w-full h-full items-center justify-center bg-zinc-50 ${menu.imageUrl ? "hidden" : "flex"}`}
                    >
                      <Coffee className="w-6 h-6 text-zinc-400" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-900 text-sm truncate">
                      {menu.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {menu.quantity} porsi • Rp{" "}
                      {menu.revenue.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-dashed border-amber-200 text-center">
            <Calendar className="w-10 h-10 text-amber-300 mx-auto mb-2" />
            <p className="text-zinc-500 font-medium">
              Tidak ada data penjualan untuk tanggal ini.
            </p>
          </div>
        )}

        {/* Orders Grid */}
        {loading && filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
            <p className="text-zinc-600 font-medium">Memuat data...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-amber-200/60 shadow-lg">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-zinc-300" />
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

function StatCard({ title, value, icon: Icon, color, gradient }) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 shadow-xl text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-white/90">{title}</span>
        <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}
