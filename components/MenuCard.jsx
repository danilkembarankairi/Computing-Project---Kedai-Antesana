"use client";
import { Plus, Minus, Star, Flame } from "lucide-react";

export default function MenuCard({ item, quantity, onAdd, onRemove }) {
  // Cek status ketersediaan (default true jika field tidak ada)
  const isAvailable = item.isAvailable !== false;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isAvailable
          ? "border-zinc-200/60 hover:border-amber-300/60 hover:shadow-xl hover:shadow-amber-900/5"
          : "border-zinc-200/40 bg-zinc-50 opacity-75"
      }`}
    >
      <div className="flex p-4 gap-4">
        {/* Image Container */}
        <div
          className={`relative w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-zinc-200/50 ${
            isAvailable
              ? "bg-gradient-to-br from-zinc-100 to-zinc-200"
              : "bg-gradient-to-br from-zinc-200 to-zinc-300"
          }`}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className={`w-full h-full object-cover ${
                isAvailable
                  ? "group-hover:scale-110 transition-transform duration-500 ease-out"
                  : "grayscale"
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
              <span className="text-4xl opacity-60">☕</span>
            </div>
          )}

          {/* Badge FAVORIT - Hanya muncul jika tersedia */}
          {item.isFeatured && isAvailable && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Flame className="w-2.5 h-2.5" />
              <span>FAVORIT</span>
            </div>
          )}

          {/* Badge HABIS - Muncul jika menu habis */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                HABIS
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Title & Rating Row */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3
                className={`font-bold line-clamp-1 tracking-tight text-base ${
                  isAvailable
                    ? "text-zinc-900 group-hover:text-amber-700 transition-colors"
                    : "text-zinc-500"
                }`}
              >
                {item.name}
              </h3>
              {item.rating && (
                <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-amber-700">
                    {item.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p
                className={`text-xs line-clamp-2 leading-relaxed mb-2 ${
                  isAvailable ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {item.description}
              </p>
            )}
          </div>

          {/* Price & Action Row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
            <div>
              <p className="text-xs text-zinc-400 font-medium mb-0.5">Harga</p>
              <p
                className={`font-bold text-lg tracking-tight leading-none ${
                  isAvailable ? "text-amber-700" : "text-zinc-400"
                }`}
              >
                Rp {item.price.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Tombol Pesan - Dinonaktifkan jika Habis */}
            {isAvailable ? (
              quantity > 0 ? (
                <div className="flex items-center gap-1 bg-zinc-50 rounded-full p-1 border border-zinc-200 shadow-sm">
                  <button
                    onClick={onRemove}
                    className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5 text-zinc-700" />
                  </button>
                  <span className="font-bold text-zinc-900 w-6 text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={onAdd}
                    className="w-7 h-7 rounded-full bg-zinc-900 text-white shadow-sm flex items-center justify-center hover:bg-amber-700 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAdd}
                  className="px-4 py-2 text-xs bg-zinc-900 text-white rounded-full font-semibold hover:bg-amber-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3 h-3" /> Tambah
                </button>
              )
            ) : (
              <button
                disabled
                className="px-4 py-2 text-xs bg-zinc-200 text-zinc-400 rounded-full font-semibold cursor-not-allowed flex items-center gap-1.5"
              >
                <Minus className="w-3 h-3" /> Habis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
