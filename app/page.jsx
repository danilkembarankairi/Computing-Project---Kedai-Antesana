import Link from "next/link";
import {
  Coffee,
  QrCode,
  Smartphone,
  CreditCard,
  MapPin,
  Clock,
  Banknote,
  ArrowRight,
  Store,
  ShoppingBag,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(120, 80, 50, 0.08) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header dengan Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex flex-col items-center">
            {/* Logo Container dengan efek premium */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl blur-xl opacity-30 animate-pulse-soft"></div>
              <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white">
                <img
                  src="/kedai-antasena.jpeg"
                  alt="Kedai Antasena"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 mb-2 tracking-tight">
              Kedai Antasena
            </h1>
            <p className="text-lg text-amber-700 font-medium mb-1">
              Ngopi Santai, Harga Pelajar
            </p>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <MapPin className="w-4 h-4" />
              <span>Purwokerto, Jawa Tengah</span>
            </div>
          </div>
        </div>

        {/* Info Card Utama - Data Asli dari Google Maps */}
        <div className="bg-white rounded-3xl shadow-xl shadow-zinc-900/5 border border-zinc-200/60 p-6 lg:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Alamat */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-sm mb-1">Alamat</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Jl. Kh. Moch. Syafei, Kauman Lama, Purwokerto Lor, Kec.
                  Purwokerto Tim., Kabupaten Banyumas, Jawa Tengah 53114
                </p>
              </div>
            </div>

            {/* Jam Buka */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-sm mb-1">
                  Jam Buka
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Setiap Hari
                  <br />
                  <span className="font-semibold text-zinc-900">
                    17.00 – 01.00 WIB
                  </span>
                </p>
              </div>
            </div>

            {/* Harga & Fasilitas */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Banknote className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-sm mb-1">
                  Harga & Layanan
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  <span className="font-semibold text-zinc-900">
                    Rp 1.000 – 25.000
                  </span>{" "}
                  / orang
                  <br />
                  Makan di tempat & Bawa pulang
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Fitur Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <FeatureCard
            icon={QrCode}
            title="Scan QR di Meja"
            description="Scan kode QR yang tersedia di setiap meja untuk langsung mengakses menu digital"
            color="amber"
          />
          <FeatureCard
            icon={Smartphone}
            title="Pesan via Smartphone"
            description="Pilih menu, isi data, dan konfirmasi pesanan langsung dari HP Anda"
            color="blue"
          />
          <FeatureCard
            icon={CreditCard}
            title="Pembayaran Fleksibel"
            description="Bayar dengan QRIS (GoPay, OVO, Dana) atau tunai langsung di kasir"
            color="emerald"
          />
        </div>

        {/* 3 Tombol Navigasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/order?table=1"
            className="group relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 text-white overflow-hidden hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Coffee className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold mb-1">Pesan Sekarang</h3>
              <p className="text-sm text-zinc-300 mb-4">
                Simulasi pemesanan pelanggan
              </p>
              <div className="flex items-center text-sm font-semibold text-amber-400">
                Mulai Pesan{" "}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            href="/kasir"
            className="group relative bg-white rounded-2xl p-6 border border-zinc-200/60 hover:border-amber-300/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">
                Dashboard Kasir
              </h3>
              <p className="text-sm text-zinc-600 mb-4">
                Kelola pesanan masuk real-time
              </p>
              <div className="flex items-center text-sm font-semibold text-blue-600">
                Buka Kasir{" "}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            href="/admin"
            className="group relative bg-white rounded-2xl p-6 border border-zinc-200/60 hover:border-amber-300/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">
                Panel Admin
              </h3>
              <p className="text-sm text-zinc-600 mb-4">
                Kelola menu, meja & sistem
              </p>
              <div className="flex items-center text-sm font-semibold text-emerald-600">
                Buka Admin{" "}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Simple */}
        <div className="mt-16 pt-8 border-t border-zinc-200/60 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Coffee className="w-3 h-3 text-amber-500" />
            </div>
            <span className="font-bold text-zinc-900 text-sm">
              Kedai Antasena
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            © 2026 • Sistem Pemesanan Digital Berbasis QR Code
          </p>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, color }) {
  const colorClasses = {
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="group bg-white rounded-2xl p-5 border border-zinc-200/60 hover:border-amber-300/60 hover:shadow-lg transition-all duration-300">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${colorClasses[color]} group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-zinc-900 mb-1">{title}</h3>
      <p className="text-xs text-zinc-600 leading-relaxed">{description}</p>
    </div>
  );
}
