"use client";
import {
  Clock,
  CheckCircle,
  ChefHat,
  Package,
  CreditCard,
  Banknote,
} from "lucide-react";

const statusConfig = {
  received: {
    icon: Clock,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Diterima",
    dot: "bg-blue-500",
  },
  preparing: {
    icon: ChefHat,
    color: "bg-orange-50 text-orange-700 border-orange-200",
    label: "Disiapkan",
    dot: "bg-orange-500",
  },
  ready: {
    icon: Package,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Siap Saji",
    dot: "bg-emerald-500",
  },
  completed: {
    icon: CheckCircle,
    color: "bg-zinc-100 text-zinc-600 border-zinc-200",
    label: "Selesai",
    dot: "bg-zinc-400",
  },
};

export default function OrderCard({ order, onUpdateStatus, onUpdatePayment }) {
  const cfg = statusConfig[order.orderStatus];
  const Icon = cfg.icon;
  const nextStatus = {
    received: "preparing",
    preparing: "ready",
    ready: "completed",
  };

  const isPaid = order.paymentStatus === "paid";

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-lg hover:border-amber-200/60 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="p-4 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-zinc-900 tracking-tight">
              #{order.orderNumber}
            </h3>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
          </div>
          <p className="text-xs text-zinc-500 font-medium flex items-center gap-1">
            Meja{" "}
            <span className="text-zinc-900 font-bold">
              #{order.tableNumber}
            </span>
          </p>
        </div>
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${cfg.color}`}
        >
          <Icon className="w-3 h-3" />
          {cfg.label}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1">
        <div className="space-y-2 mb-4">
          {order.items.map((i, idx) => (
            <div key={idx} className="flex justify-between items-start text-sm">
              <div className="flex gap-2">
                <span className="font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded text-xs h-fit mt-0.5">
                  {i.quantity}x
                </span>
                <span className="text-zinc-700 line-clamp-1">{i.name}</span>
              </div>
              <span className="text-zinc-900 font-semibold whitespace-nowrap">
                Rp {i.subtotal.toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-zinc-200 pt-3 flex justify-between items-center">
          <span className="text-sm font-medium text-zinc-500">Total</span>
          <span className="text-lg font-bold text-amber-700">
            Rp {order.totalAmount.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Customer Info (Collapsible feel) */}
        <div className="mt-3 pt-3 border-t border-zinc-100">
          <p className="text-xs text-zinc-500 mb-1">Pelanggan:</p>
          <p className="text-sm font-semibold text-zinc-900">
            {order.customer.name}
          </p>
          <p className="text-xs text-zinc-500">{order.customer.phone}</p>
        </div>
      </div>

      {/* Card Footer (Actions) */}
      <div className="p-4 bg-zinc-50/80 border-t border-zinc-100 grid grid-cols-2 gap-2">
        {/* Payment Action */}
        {!isPaid && order.paymentMethod === "cashier" && (
          <button
            onClick={() => onUpdatePayment(order._id, "paid")}
            className="col-span-2 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm shadow-emerald-600/20"
          >
            <Banknote className="w-4 h-4" /> Konfirmasi Pembayaran
          </button>
        )}

        {!isPaid && order.paymentMethod === "qris" && (
          <div className="col-span-2 flex items-center justify-center gap-2 py-2.5 bg-amber-100 text-amber-800 text-sm font-semibold rounded-xl border border-amber-200">
            <Clock className="w-4 h-4 animate-pulse" /> Menunggu QRIS...
          </div>
        )}

        {/* Status Action */}
        {isPaid && nextStatus[order.orderStatus] && (
          <button
            onClick={() =>
              onUpdateStatus(order._id, nextStatus[order.orderStatus])
            }
            className="col-span-2 flex items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm"
          >
            <ChefHat className="w-4 h-4" />
            Ubah ke: {statusConfig[nextStatus[order.orderStatus]].label}
          </button>
        )}

        {order.orderStatus === "completed" && (
          <div className="col-span-2 flex items-center justify-center gap-2 py-2.5 bg-zinc-100 text-zinc-500 text-sm font-semibold rounded-xl cursor-default">
            <CheckCircle className="w-4 h-4" /> Pesanan Selesai
          </div>
        )}
      </div>
    </div>
  );
}
