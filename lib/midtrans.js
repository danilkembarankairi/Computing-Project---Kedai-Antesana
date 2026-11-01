import midtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

// Validasi environment variables
if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
  console.warn("⚠️ Midtrans keys are not configured in .env.local");
}

const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const core = new midtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function createQRISTransaction(params) {
  try {
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.amount,
      },
      customer_details: {
        first_name: params.customerName,
        email: params.email,
        phone: params.phone,
      },
      // ⚠️ PENTING: Tambahkan metode pembayaran lain sebagai fallback
      // agar popup Midtrans pasti muncul dan bisa dites,
      // meskipun Sandbox sedang membatasi QRIS.
      enabled_payments: ["qris", "gopay", "shopeepay", "bca_va", "bni_va"],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/order?table=${params.tableNumber}`,
      },
    });
    return transaction;
  } catch (error) {
    console.error("Midtrans create transaction error:", error);
    throw error;
  }
}

export async function checkTransactionStatus(orderId) {
  try {
    const status = await core.checkTransaction(orderId);
    return status;
  } catch (error) {
    console.error("Midtrans check status error:", error);
    throw error;
  }
}
