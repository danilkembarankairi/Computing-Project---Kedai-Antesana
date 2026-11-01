import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/models/Order";
import crypto from "crypto";
// import { sendStatusUpdate } from "@/lib/email"; // Opsional: Aktifkan jika ingin kirim email saat bayar berhasil

export async function POST(req) {
  try {
    await dbConnect();

    // 1. Ambil raw body untuk parsing
    const body = await req.text();
    const notification = JSON.parse(body);

    // 2. Ambil data yang diperlukan untuk verifikasi signature (Sesuai docs resmi Midtrans)
    const orderId = notification.order_id;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      console.error("❌ MIDTRANS_SERVER_KEY tidak ditemukan di .env");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // 3. Verifikasi Signature (WAJIB HEX, BUKAN BASE64)
    const expectedSignature = crypto
      .createHash("sha512")
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest("hex");

    const signatureKey = req.headers.get("x-midtrans-signature") || "";

    if (signatureKey !== expectedSignature) {
      console.warn("⚠️ Invalid signature detected:", signatureKey);
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // 4. Cari order di database
    const order = await Order.findOne({ orderNumber: orderId });
    if (!order) {
      console.warn(`⚠️ Order not found: ${orderId}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 5. Update Status Pembayaran
    let newPaymentStatus = order.paymentStatus;
    let newOrderStatus = order.orderStatus;

    if (transactionStatus === "capture" && fraudStatus === "accept") {
      newPaymentStatus = "paid";
      newOrderStatus = "preparing"; // Langsung ubah status jadi disiapkan
    } else if (transactionStatus === "settlement") {
      newPaymentStatus = "paid";
      newOrderStatus = "preparing";
    } else if (["deny", "expire", "cancel"].includes(transactionStatus)) {
      newPaymentStatus = "cancelled";
    }

    // 6. Simpan ke database (Hanya update jika ada perubahan)
    if (
      newPaymentStatus !== order.paymentStatus ||
      newOrderStatus !== order.orderStatus
    ) {
      order.paymentStatus = newPaymentStatus;
      order.orderStatus = newOrderStatus;
      await order.save();

      console.log(
        `✅ Order ${orderId} updated: Payment=${newPaymentStatus}, Status=${newOrderStatus}`,
      );

      // Opsional: Kirim notifikasi email ke pelanggan bahwa pembayaran berhasil
      // try {
      //   await sendStatusUpdate(order);
      // } catch (emailErr) {
      //   console.error("Gagal kirim email notifikasi:", emailErr);
      // }
    }

    // 7. Wajib return 200 OK agar Midtrans berhenti mengirim retry
    return NextResponse.json({ success: true, status: 200 });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    // Tetap return 200 agar Midtrans tidak terus-menerus retry jika error parsing
    return NextResponse.json(
      { success: true, message: "Logged error" },
      { status: 200 },
    );
  }
}
