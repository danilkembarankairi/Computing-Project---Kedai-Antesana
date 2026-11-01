import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/models/Order";
// import { sendStatusUpdate } from "@/lib/email"; // ❌ DI-COMMENT: Tidak perlu kirim email update status

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();
    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update status pesanan atau pembayaran
    if (body.paymentStatus) order.paymentStatus = body.paymentStatus;
    if (body.orderStatus) order.orderStatus = body.orderStatus;

    await order.save();

    // ❌ EMAIL TIDAK DIKIRIM DI SINI
    // Email hanya dikirim 1x saat POST /api/orders (saat order dibuat)

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("PATCH Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    await Order.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
