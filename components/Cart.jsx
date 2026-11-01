"use client";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function Cart({ items, onRemove, onCheckout, isDesktop }) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) return null;

  // Desktop version: Top bar style
  if (isDesktop) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
        <div className="bg-stone-900 text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">{totalQty} item</p>
              <p className="text-xs text-stone-400">Siap checkout</p>
            </div>
          </div>
          <div className="h-8 w-px bg-stone-700"></div>
          <div className="text-right">
            <p className="text-xs text-stone-400">Total</p>
            <p className="font-bold text-lg text-amber-400">
              Rp {total.toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={onCheckout}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
          >
            Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Mobile version: Bottom sheet
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 animate-slide-up lg:hidden">
      <div className="max-w-lg mx-auto">
        <div className="bg-stone-900 text-white rounded-2xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">{totalQty} item</p>
                <p className="text-xs text-stone-400">Siap checkout</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400">Total</p>
              <p className="font-bold text-lg text-amber-400">
                Rp {total.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg"
          >
            Checkout Sekarang <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
