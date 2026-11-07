"use client";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function Cart({ items, onRemove, onCheckout, isDesktop }) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) return null;

  // Desktop version: Floating bar
  if (isDesktop) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300">
        <div className="bg-zinc-900 text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">{totalQty} item</p>
              <p className="text-xs text-zinc-400">Siap checkout</p>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-700"></div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">Total</p>
            <p className="font-bold text-lg text-amber-400">
              Rp {total.toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={onCheckout}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Mobile version: Bottom sheet
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 transition-all duration-300 lg:hidden">
      <div className="max-w-lg mx-auto">
        <div className="bg-zinc-900 text-white rounded-2xl shadow-2xl p-4 border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">{totalQty} item</p>
                <p className="text-xs text-zinc-400">Siap checkout</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-400">Total</p>
              <p className="font-bold text-lg text-amber-400">
                Rp {total.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            Checkout Sekarang <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
