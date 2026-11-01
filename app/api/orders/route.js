import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { sendOrderConfirmation } from "@/lib/email";
import { createQRISTransaction } from "@/lib/midtrans";

async function generateOrderNumber() {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

  // Reset jam ke 00:00:00 untuk mulai hari ini
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  // Set jam ke 23:59:59 untuk akhir hari ini
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const count = await Order.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });

  return `ANT-${dateStr}-${String(count + 1).padStart(3, "0")}`;
}

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengambil data pesanan" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { tableNumber, customer, items, paymentMethod } = body;

    // Validasi input
    if (!tableNumber || !customer?.email || !items?.length) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    // Hitung total
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Cegah error Midtrans (tidak boleh 0 atau negatif)
    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: "Total pesanan harus lebih dari Rp 0" },
        { status: 400 },
      );
    }

    const orderNumber = await generateOrderNumber();

    const orderData = {
      orderNumber,
      tableNumber,
      customer,
      items: items.map((i) => ({
        menuItemId: i._id || i.menuItemId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
        notes: i.notes || "",
      })),
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "qris" ? "pending" : "paid",
      orderStatus: "received",
    };

    const order = await Order.create(orderData);

    // Kirim email konfirmasi (jangan sampai gagal total kalau email error)
    try {
      await sendOrderConfirmation(order);
    } catch (e) {
      console.error("Email failed:", e);
    }

    // Logika Pembayaran QRIS
    if (paymentMethod === "qris") {
      try {
        const tx = await createQRISTransaction({
          orderId: order.orderNumber,
          amount: totalAmount,
          customerName: customer.name,
          email: customer.email,
          phone: customer.phone,
          tableNumber: tableNumber, // ⚠️ PENTING: Ditambahkan agar callback URL benar
        });

        order.midtransOrderId = order.orderNumber;
        await order.save();

        return NextResponse.json(
          {
            order,
            paymentToken: tx.token,
            redirectUrl: tx.redirect_url,
          },
          { status: 201 },
        );
      } catch (e) {
        console.error("Midtrans error:", e);
        // Jika Midtrans error, kita tetap kembalikan data order agar user bisa bayar di kasir
        return NextResponse.json(
          {
            order,
            message: "Order dibuat, tapi QRIS gagal. Silakan bayar di kasir.",
          },
          { status: 201 },
        );
      }
    }

    // Untuk pembayaran di kasir
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Order API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
