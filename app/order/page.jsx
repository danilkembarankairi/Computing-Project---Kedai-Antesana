"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MenuCard from "@/components/MenuCard";
import Cart from "@/components/Cart";
import CustomerForm from "@/components/CustomerForm";
import PaymentView from "@/components/PaymentView";
import AIChatbot from "@/components/AIChatbot";
import {
  Coffee,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Sparkles,
  Star,
  Flame,
  Search,
  ChevronRight,
  ShieldCheck,
  Wifi,
  Bell,
  Sun,
  Moon,
  Sunset,
} from "lucide-react";

// Fungsi untuk mendapatkan salam berdasarkan waktu
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { text: "Selamat Pagi", icon: Sun, color: "text-amber-600" };
  } else if (hour >= 12 && hour < 15) {
    return { text: "Selamat Siang", icon: Sun, color: "text-orange-600" };
  } else if (hour >= 15 && hour < 18) {
    return { text: "Selamat Sore", icon: Sunset, color: "text-orange-700" };
  } else {
    return { text: "Selamat Malam", icon: Moon, color: "text-indigo-600" };
  }
}

// Data Banner Carousel (3 Slide - Tanpa Diskon)
const bannerSlides = [
  {
    id: 1,
    badge: "Pengalaman Premium",
    title: "Temukan Kopi Terbaikmu",
    subtitle:
      "Diseduh dengan biji kopi pilihan lokal, menghadirkan rasa bintang lima dengan harga yang bersahabat.",
    gradient: "from-zinc-900 via-zinc-800 to-amber-900",
  },
  {
    id: 2,
    badge: "Menu Signature",
    title: "Kopi Susu Gula Aren",
    subtitle:
      "Perpaduan sempurna espresso premium dengan susu segar dan gula aren asli. Best seller kami yang wajib dicoba!",
    gradient: "from-amber-900 via-orange-900 to-zinc-900",
  },
  {
    id: 3,
    badge: "Menu Baru",
    title: "Matcha Series Telah Hadir",
    subtitle:
      "Perpaduan matcha premium Jepang dengan susu segar yang creamy. Wajib dicoba dan diabadikan momen serunya!",
    gradient: "from-emerald-900 via-teal-900 to-zinc-900",
  },
];

function OrderContent() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table");
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState("menu");
  const [customer, setCustomer] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then(setMenu)
      .catch(console.error);

    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Auto-play Carousel setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === id);
      if (existing.quantity === 1) return prev.filter((i) => i._id !== id);
      return prev.map((i) =>
        i._id === id ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  };

  const deleteFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i._id !== id));

  const submitOrder = async (paymentMethod) => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber,
          customer,
          items: cart,
          paymentMethod,
        }),
      });

      const data = await res.json();

      // Jika memilih QRIS dan ada paymentToken dari backend
      if (paymentMethod === "qris" && data.paymentToken) {
        // 1. Cek apakah script Midtrans sudah dimuat di browser
        if (!window.snap) {
          const script = document.createElement("script");
          // Gunakan URL sandbox karena MIDTRANS_IS_PRODUCTION=false
          script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
          script.setAttribute(
            "data-client-key",
            process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
          );
          script.async = true;
          document.body.appendChild(script);

          // Tunggu script selesai dimuat (maksimal 3 detik)
          await new Promise((resolve) => {
            script.onload = resolve;
            setTimeout(resolve, 3000);
          });
        }

        // 2. Buka Popup Midtrans
        if (window.snap) {
          window.snap.pay(data.paymentToken, {
            onSuccess: function (result) {
              console.log("Pembayaran Berhasil:", result);
              setOrderResult(data.order);
              setStep("success");
            },
            onPending: function (result) {
              console.log("Menunggu Pembayaran:", result);
              setOrderResult(data.order);
              setStep("success"); // Bisa juga dibuat step "pending"
            },
            onError: function (result) {
              console.log("Pembayaran Gagal:", result);
              alert(
                "Pembayaran gagal. Silakan coba lagi atau pilih bayar di kasir.",
              );
            },
            onClose: function () {
              console.log("Popup ditutup tanpa menyelesaikan pembayaran");
              // JANGAN pindah ke success, biarkan user tetap di halaman payment
              alert(
                "Pembayaran dibatalkan. Silakan coba lagi atau pilih bayar di kasir.",
              );
            },
          });
        } else {
          alert(
            "Gagal memuat sistem pembayaran Midtrans. Periksa Client Key Anda.",
          );
        }
      } else {
        // Jika bayar di kasir (atau token tidak ada), langsung success
        setOrderResult(data.order);
        setStep("success");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Gagal membuat pesanan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Semua", "Kopi", "Non-Kopi", "Makanan", "Snack"];
  const filteredMenu = menu.filter((m) => {
    const matchCategory = category === "Semua" || m.category === category;
    const matchSearch = m.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });
  const featuredMenus = menu.filter((m) => m.isFeatured).slice(0, 4);

  // --- ERROR STATE ---
  if (!tableNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#faf8f5]">
        <div className="text-center max-w-md w-full bg-white rounded-[2rem] p-10 shadow-xl border border-zinc-200/50 animate-scale-in">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-10 h-10 text-zinc-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-3 tracking-tight">
            QR Code Tidak Valid
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Silakan scan QR Code yang tersedia di meja Anda untuk memulai
            pemesanan.
          </p>
        </div>
      </div>
    );
  }

  // --- SUCCESS STATE ---
  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#faf8f5]">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-2xl border border-zinc-200/50 text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-50">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">
            Pesanan Diterima!
          </h1>
          <p className="text-zinc-500 text-sm mb-8">
            Konfirmasi telah dikirim ke{" "}
            <span className="text-zinc-900 font-semibold">
              {customer.email}
            </span>
          </p>

          <div className="bg-zinc-50 rounded-2xl p-6 mb-6 text-left space-y-4 border border-zinc-100">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm font-medium">
                ID Pesanan
              </span>
              <span className="font-mono font-bold text-zinc-900 text-sm tracking-wide">
                {orderResult.orderNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm font-medium">Lokasi</span>
              <span className="font-semibold text-zinc-900 text-sm">
                Meja #{tableNumber}
              </span>
            </div>
            <div className="border-t border-zinc-200 pt-4 flex justify-between items-center">
              <span className="font-bold text-zinc-900">Total Pembayaran</span>
              <span className="font-bold text-amber-600 text-xl">
                Rp {orderResult.totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-amber-50 border border-amber-100 rounded-2xl p-5 text-left">
            <ShieldCheck className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              {orderResult.paymentMethod === "qris"
                ? "Silakan selesaikan pembayaran QRIS Anda. Pesanan akan langsung diproses oleh barista setelah pembayaran terkonfirmasi."
                : "Silakan lakukan pembayaran di kasir setelah pesanan Anda siap disajikan."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN ORDER FLOW ---
  return (
    <div className="min-h-screen relative pb-32 lg:pb-8 bg-[#faf8f5]">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-zinc-200/60 supports-[backdrop-filter]:bg-white/80 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            {step !== "menu" && (
              <button
                onClick={() => setStep(step === "payment" ? "data" : "menu")}
                className="p-2 -ml-2 hover:bg-zinc-100 rounded-xl transition-all duration-200 lg:hidden group"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-600 group-hover:text-zinc-900 group-hover:-translate-x-0.5 transition-all" />
              </button>
            )}

            {/* Logo Tanpa Sela Putih */}
            <div className="relative group">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                <img
                  src="/kedai-antasena.jpeg"
                  alt="Logo Kedai Antasena"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <h1 className="font-bold text-zinc-900 text-base lg:text-lg tracking-tight leading-none">
                Kedai Antasena
              </h1>
              <p className="text-xs text-zinc-500 font-medium mt-0.5 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                Pemesanan Digital • Meja #{tableNumber}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {/* WiFi Info */}
            <div className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-100/80 px-3.5 py-2 rounded-xl border border-zinc-200/80">
              <Wifi className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-medium">WiFi: Antasena_Guest</span>
              <span className="text-zinc-300">|</span>
              <span className="font-mono text-zinc-800 font-semibold bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                kedaiantasena2026
              </span>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50/80 px-3.5 py-2 rounded-xl border border-green-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-semibold">Pembayaran Aman</span>
            </div>

            {/* Greeting Dinamis (Pagi/Siang/Sore/Malam) */}
            <div
              className={`flex items-center gap-2 text-xs font-semibold ${greeting.color} bg-white px-3.5 py-2 rounded-xl border border-zinc-200 shadow-sm`}
            >
              <GreetingIcon className="w-3.5 h-3.5" />
              <span>{greeting.text}</span>
            </div>
          </div>

          {/* Mobile Greeting */}
          <div className="lg:hidden">
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${greeting.color} bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm`}
            >
              <GreetingIcon className="w-3.5 h-3.5" />
              <span>{greeting.text}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {step === "menu" && (
          <div className="animate-fade-in-up space-y-6">
            {/* Banner Carousel - Auto Swipe Only (Tanpa Tombol Panah) */}
            <div className="relative overflow-hidden rounded-[1.5rem] shadow-xl shadow-zinc-900/10 h-[200px] sm:h-[240px] lg:h-[280px]">
              {bannerSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-700 ease-out flex items-center ${
                    currentSlide === index
                      ? "opacity-100 translate-x-0 scale-100 z-10"
                      : "opacity-0 translate-x-10 scale-105 z-0 pointer-events-none"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="relative z-10 p-6 lg:p-10 w-full flex flex-col justify-center h-full">
                    <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 mb-3 w-fit">
                      <Sparkles className="w-3 h-3 mr-1.5" /> {slide.badge}
                    </div>
                    <h2 className="text-2xl lg:text-4xl font-bold tracking-tight mb-2 leading-tight text-white max-w-xl">
                      {slide.title}
                    </h2>
                    <p className="text-zinc-200 text-xs lg:text-sm leading-relaxed max-w-lg">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              ))}

              {/* Carousel Dots (Indikator tetap ada) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {bannerSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-amber-600 transition-colors duration-300">
                <Search className="w-full h-full" />
              </div>
              <input
                type="text"
                placeholder="Cari menu favorit Anda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-sm py-3.5 pl-12 pr-4 text-sm shadow-sm shadow-zinc-200/50 transition-all duration-300 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white"
              />
            </div>

            {/* Featured Section */}
            {category === "Semua" &&
              !searchQuery &&
              featuredMenus.length > 0 && (
                <div
                  className="animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-red-50 rounded-xl border border-red-100">
                        <Flame className="w-5 h-5 text-red-500" />
                      </div>
                      <h3 className="font-bold text-zinc-900 tracking-tight text-lg">
                        Paling Laris
                      </h3>
                    </div>
                    <button className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors">
                      Lihat Semua <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {featuredMenus.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => addToCart(item)}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 mb-2 shadow-sm ring-1 ring-zinc-100 group-hover:ring-amber-500/30 group-hover:shadow-xl group-hover:shadow-amber-900/5 transition-all duration-300">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 shadow-sm ring-1 ring-black/5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-zinc-900">
                              {item.rating}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-white text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              + Tambah
                            </span>
                          </div>
                        </div>
                        <h4 className="font-semibold text-sm text-zinc-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-amber-700 font-bold text-sm mt-0.5">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Category Tabs */}
            <div className="sticky top-20 z-30 bg-transparent py-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:static">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                      category === c
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 scale-105"
                        : "bg-white/80 backdrop-blur-sm text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:bg-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              {filteredMenu.map((item, idx) => (
                <div
                  key={item._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <MenuCard
                    item={item}
                    quantity={
                      cart.find((c) => c._id === item._id)?.quantity || 0
                    }
                    onAdd={() => addToCart(item)}
                    onRemove={() => removeFromCart(item._id)}
                  />
                </div>
              ))}
            </div>

            {filteredMenu.length === 0 && (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-zinc-100 shadow-sm animate-fade-in">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-zinc-300" />
                </div>
                <p className="text-zinc-900 font-bold text-lg">
                  Menu tidak ditemukan
                </p>
                <p className="text-sm text-zinc-500 mt-2 max-w-xs mx-auto">
                  Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
                </p>
              </div>
            )}
          </div>
        )}

        {step === "data" && (
          <div className="max-w-lg mx-auto animate-scale-in">
            <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-6 lg:p-10 shadow-xl border border-zinc-200/50">
              <CustomerForm
                onSubmit={(data) => {
                  setCustomer(data);
                  setStep("payment");
                }}
                onBack={() => setStep("menu")}
              />
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="max-w-lg mx-auto animate-scale-in">
            <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-6 lg:p-10 shadow-xl border border-zinc-200/50">
              <PaymentView
                total={cart.reduce((s, i) => s + i.price * i.quantity, 0)}
                onSubmit={submitOrder}
                onBack={() => setStep("data")}
                loading={loading}
              />
            </div>
          </div>
        )}
      </main>

      {step === "menu" && (
        <Cart
          items={cart}
          onRemove={deleteFromCart}
          onCheckout={() => setStep("data")}
          isDesktop={isDesktop}
        />
      )}
      <AIChatbot isDesktop={isDesktop} />
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
            <p className="text-sm text-zinc-500 font-medium animate-pulse">
              Memuat menu...
            </p>
          </div>
        </div>
      }
    >
      <OrderContent />
    </Suspense>
  );
}
