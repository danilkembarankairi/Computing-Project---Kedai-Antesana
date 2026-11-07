import Link from "next/link";
import {
  Coffee,
  MapPin,
  Clock,
  Wallet,
  QrCode,
  Smartphone,
  CreditCard,
  ArrowRight,
  Store,
  Settings,
  ShoppingBag,
  Flame,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-zinc-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
          {/* Logo dengan Glow Effect */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-amber-200/50">
              <img
                src="/kedai-antasena.jpeg"
                alt="Kedai Antasena Logo"
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl"
              />
            </div>
            {/* Badge Rating */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 ring-4 ring-white">
              <Star className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight mb-3">
            Kedai Antasena
          </h1>
          <p className="text-lg sm:text-xl text-amber-700 font-semibold mb-2">
            Ngopi Santai, Harga Pelajar
          </p>
          <div className="flex items-center justify-center gap-2 text-zinc-600 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Purwokerto, Jawa Tengah</span>
          </div>
        </div>

        {/* Info Cards (Alamat, Jam Buka, Harga) */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-200/60 mb-10 sm:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Alamat */}
            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 mb-1">Alamat</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Jl. Kh. Moch. Syafei, Kauman Lama, Purwokerto Lor, Kec.
                  Purwokerto Tim., Kabupaten Banyumas, Jawa Tengah 53114
                </p>
              </div>
            </div>

            {/* Jam Buka */}
            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 mb-1">Jam Buka</h3>
                <p className="text-sm text-zinc-600">Setiap Hari</p>
                <p className="text-sm font-bold text-zinc-900">
                  17.00 – 01.00 WIB
                </p>
              </div>
            </div>

            {/* Harga & Layanan */}
            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 mb-1">
                  Harga & Layanan
                </h3>
                <p className="text-sm font-bold text-zinc-900">
                  Rp 1.000 – 25.000 / orang
                </p>
                <p className="text-sm text-zinc-600">
                  Makan di tempat & Bawa pulang
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fitur Unggulan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 sm:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="bg-white rounded-2xl p-5 border-2 border-amber-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <QrCode className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">Scan QR di Meja</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Scan kode QR yang tersedia di setiap meja untuk langsung mengakses
              menu digital
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">
              Pesan via Smartphone
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Pilih menu, isi data, dan konfirmasi pesanan langsung dari HP Anda
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-emerald-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">
              Pembayaran Fleksibel
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Bayar dengan QRIS (GoPay, OVO, Dana) atau tunai langsung di kasir
            </p>
          </div>
        </div>

        {/* 3 Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
          {/* Pesan Sekarang (Customer - Mode Takeaway) */}
          <Link
            href="/order"
            className="group relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900 rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/40 transition-all duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Coffee className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Pesan Sekarang
              </h3>
              <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
                Pemesanan langsung tanpa scan QR (Mode Takeaway)
              </p>
              <div className="flex items-center gap-2 text-amber-400 font-bold group-hover:gap-3 transition-all duration-300">
                <span>Mulai Pesan</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Dashboard Kasir */}
          <Link
            href="/kasir"
            className="group relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl group-hover:bg-blue-200/50 transition-all duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Store className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                Dashboard Kasir
              </h3>
              <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
                Kelola pesanan masuk real-time & mode takeaway
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-3 transition-all duration-300">
                <span>Buka Kasir</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Panel Admin */}
          <Link
            href="/admin"
            className="group relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-500/20 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl group-hover:bg-emerald-200/50 transition-all duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                Panel Admin
              </h3>
              <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
                Kelola menu, meja, harga & sistem keseluruhan
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold group-hover:gap-3 transition-all duration-300">
                <span>Buka Admin</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 border-t-2 border-amber-200/50 animate-in fade-in duration-700 delay-500">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-zinc-900">Kedai Antasena</span>
          </div>
          <p className="text-sm text-zinc-600">
            © 2026 • Sistem Pemesanan Digital Berbasis QR Code
          </p>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-amber-700 font-semibold">
            <Flame className="w-3 h-3 fill-amber-500" />
            <span>Dibuat dengan ☕ di Purwokerto</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
