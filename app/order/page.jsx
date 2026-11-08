"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  Sun,
  Moon,
  Sunset,
  Home,
} from "lucide-react";

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
  const router = useRouter();
  const tableNumber = searchParams.get("table") || "Takeaway";
  const isTakeaway = tableNumber === "Takeaway";
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
  const [countdown, setCountdown] = useState(4);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step === "success") {
      setCountdown(4);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCart([]);
            setTimeout(() => {
              const currentUrl = window.location.href;
              const separator = currentUrl.includes("?") ? "&" : "?";
              window.location.href = `${currentUrl}${separator}refresh=${Date.now()}`;
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

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
      const calculatedTotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber,
          customer,
          items: cart,
          paymentMethod,
          totalAmount: calculatedTotal,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal membuat pesanan di server");
      }

      const data = await res.json();

      const goToSuccess = (order) => {
        const finalOrder = {
          ...order,
          orderNumber:
            order?.orderNumber ||
            order?._id ||
            `TRX-${Date.now().toString().slice(-6)}`,
          totalAmount: order?.totalAmount || calculatedTotal,
        };
        setOrderResult(finalOrder);
        setStep("success");
      };

      if (paymentMethod === "qris" && data.paymentToken) {
        if (!window.snap) {
          const script = document.createElement("script");
          script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
          script.setAttribute(
            "data-client-key",
            process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
          );
          script.async = true;
          document.body.appendChild(script);

          await new Promise((resolve) => {
            script.onload = resolve;
            setTimeout(resolve, 3000);
          });
        }

        if (window.snap) {
          window.snap.pay(data.paymentToken, {
            onSuccess: function (result) {
              console.log("Pembayaran Berhasil:", result);
              goToSuccess(data.order);
            },
            onPending: function (result) {
              console.log("Menunggu Pembayaran:", result);
              goToSuccess(data.order);
            },
            onError: function (result) {
              console.log("Pembayaran Gagal:", result);
              alert(
                "Pembayaran gagal. Silakan coba lagi atau pilih bayar di kasir.",
              );
              setLoading(false);
            },
            onClose: function () {
              console.log("Popup ditutup tanpa menyelesaikan pembayaran");
              alert(
                "Pembayaran dibatalkan. Silakan coba lagi atau pilih bayar di kasir.",
              );
              setLoading(false);
            },
          });
        } else {
          alert(
            "Gagal memuat sistem pembayaran Midtrans. Periksa Client Key Anda.",
          );
          setLoading(false);
        }
      } else {
        goToSuccess(data.order);
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Gagal membuat pesanan: " + err.message);
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

  // ✅ Logic: Ambil maksimal 4 menu favorit
  const featuredMenus = menu.filter((m) => m.isFeatured).slice(0, 4);

  // ✅ SUCCESS STATE
  if (step === "success") {
    const displayId = orderResult?.orderNumber || "ID Tidak Ditemukan";
    const displayTotal = orderResult?.totalAmount || 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-zinc-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-200 text-center animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Pesanan Diterima!
          </h1>
          <p className="text-zinc-600 mb-8 font-medium">
            Konfirmasi telah dikirim ke{" "}
            <span className="text-zinc-900 font-bold">{customer?.email}</span>
          </p>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-amber-200 text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 font-semibold text-sm">
                ID Pesanan
              </span>
              <span className="font-mono font-bold text-zinc-900 text-lg">
                {displayId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 font-semibold text-sm">
                Lokasi
              </span>
              <span className="font-bold text-zinc-900">
                {tableNumber === "Takeaway"
                  ? "Takeaway"
                  : `Meja #${tableNumber}`}
              </span>
            </div>
            <div className="border-t-2 border-amber-200 pt-4 flex justify-between items-center">
              <span className="font-bold text-zinc-900">Total Pembayaran</span>
              <span className="font-bold text-amber-700 text-2xl">
                Rp {displayTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 text-left">
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-900 leading-relaxed font-medium">
              {orderResult?.paymentMethod === "qris"
                ? "Silakan selesaikan pembayaran QRIS Anda. Pesanan akan langsung diproses oleh barista."
                : "Silakan lakukan pembayaran di kasir setelah pesanan Anda siap disajikan."}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-600 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 4) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-zinc-600 font-medium">
              Kembali ke menu dalam{" "}
              <span className="font-bold text-amber-600 text-lg">
                {countdown} detik
              </span>
              ...
            </p>
            <button
              onClick={() =>
                (window.location.href = `/order?table=${tableNumber}`)
              }
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold underline"
            >
              Atau klik di sini untuk kembali sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ MAIN ORDER FLOW
  return (
    <div className="min-h-screen relative pb-32 lg:pb-8 bg-gradient-to-br from-amber-50 via-orange-50 to-zinc-50 selection:bg-amber-200 selection:text-amber-900">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-amber-100/95 via-orange-100/95 to-amber-100/95 border-b-2 border-amber-200 shadow-lg transition-all duration-300">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isTakeaway && step === "menu" && (
              <Link
                href="/"
                className="p-1.5 text-zinc-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0"
                title="Kembali ke Beranda"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            )}

            {step !== "menu" && (
              <button
                onClick={() => setStep(step === "payment" ? "data" : "menu")}
                className="p-1.5 text-zinc-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0"
                title="Kembali"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden border-2 border-amber-200 shadow-sm bg-white">
                <img
                  src="/kedai-antasena.jpeg"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3.5 sm:w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 bg-green-500 border-2 border-white"></span>
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-zinc-900 text-sm sm:text-xl tracking-tight leading-none truncate">
                Kedai Antasena
              </h1>
              <p className="text-[10px] sm:text-xs text-zinc-600 font-medium mt-0.5 flex items-center gap-1 truncate">
                <span className="w-1 h-1 rounded-full bg-zinc-400 flex-shrink-0"></span>
                <span className="truncate">
                  {tableNumber === "Takeaway"
                    ? "Takeaway"
                    : `Meja #${tableNumber}`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="flex sm:hidden items-center gap-1 text-[10px] font-bold text-amber-800 bg-white px-2 py-1.5 rounded-lg border-2 border-amber-200 shadow-sm">
              <Wifi className="w-3 h-3" />
              <span className="font-mono text-[9px]">kedai2026</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border-2 border-amber-200">
                <Wifi className="w-3.5 h-3.5" />
                <span>Antasena_Guest</span>
                <span className="text-amber-300">|</span>
                <span className="font-mono text-amber-900 bg-white px-1.5 py-0.5 rounded border border-amber-200 text-[10px]">
                  kedai2026
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border-2 border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pembayaran Aman</span>
              </div>

              <div
                className={`flex items-center gap-1.5 text-xs font-bold ${greeting.color} bg-white px-3 py-1.5 rounded-xl border-2 border-amber-200 shadow-sm`}
              >
                <GreetingIcon className="w-3.5 h-3.5" />
                <span>{greeting.text}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {step === "menu" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Banner Carousel */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl h-[200px] sm:h-[240px] lg:h-[280px] border-2 border-amber-200/50">
              {bannerSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-700 ease-out flex items-center ${
                    currentSlide === index
                      ? "opacity-100 translate-x-0 scale-100 z-10"
                      : "opacity-0 translate-x-10 scale-105 z-0 pointer-events-none"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="relative z-10 p-6 lg:p-10 w-full flex flex-col justify-center h-full">
                    <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white ring-2 ring-white/30 mb-3 w-fit">
                      <Sparkles className="w-3 h-3 mr-1.5" /> {slide.badge}
                    </div>
                    <h2 className="text-2xl lg:text-4xl font-black tracking-tight mb-2 leading-tight text-white max-w-xl drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="text-white/90 text-xs lg:text-sm leading-relaxed max-w-lg drop-shadow-sm">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {bannerSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative group max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 group-focus-within:text-amber-700 transition-colors" />
              <input
                type="text"
                placeholder="Cari menu favorit Anda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border-2 border-amber-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium shadow-md focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all"
              />
            </div>

            {/* ✅ Featured Section: Hanya muncul jika ada menu favorit (length > 0) */}
            {category === "Semua" &&
              !searchQuery &&
              featuredMenus.length > 0 && (
                <div
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-red-100 rounded-xl border-2 border-red-200">
                        <Flame className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="font-bold text-zinc-900 tracking-tight text-lg">
                        Paling Laris
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                    {featuredMenus.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => addToCart(item)}
                        className="group cursor-pointer bg-white rounded-2xl border-2 border-amber-200 p-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 mb-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 shadow-sm border border-zinc-100">
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
                        <h4 className="font-bold text-sm text-zinc-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-amber-700 font-bold text-sm mt-1">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Category Tabs */}
            <div className="sticky top-16 sm:top-20 z-30 bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-lg py-2 -mx-3 px-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:static lg:bg-transparent lg:backdrop-blur-none">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                      category === c
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                        : "bg-white/80 text-zinc-700 border border-amber-200/60 hover:border-amber-400 hover:bg-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              {filteredMenu.map((item) => (
                <div
                  key={item._id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
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

            {/* Empty State */}
            {filteredMenu.length === 0 && (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-amber-200">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-amber-600" />
                </div>
                <p className="font-bold text-zinc-900 text-lg">
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
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-2xl border-4 border-amber-200">
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
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-2xl border-4 border-amber-200">
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-zinc-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
            <p className="text-sm text-zinc-600 font-medium animate-pulse">
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
