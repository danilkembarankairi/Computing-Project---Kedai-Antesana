import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmation(order) {
  const itemsHtml = order.items
    .map(
      (i) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${i.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">Rp ${i.subtotal.toLocaleString("id-ID")}</td>
        </tr>
      `,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:20px;">
      <div style="text-align:center;background:#6F4E37;color:#fff;padding:20px;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;">☕ Kedai Antasena</h1>
        <p style="margin:5px 0 0;">Pesanan Dikonfirmasi</p>
      </div>
      <div style="padding:20px;border:1px solid #eee;">
        <p>Halo <strong>${order.customer.name}</strong>,</p>
        <p>Terima kasih! Pesanan kamu sudah kami terima:</p>
        <div style="background:#f9f5f0;padding:15px;border-radius:8px;margin:15px 0;">
          <p style="margin:0;"><strong>Nomor Pesanan:</strong> ${order.orderNumber}</p>
          <p style="margin:5px 0 0;"><strong>Meja:</strong> #${order.tableNumber}</p>
          <p style="margin:5px 0 0;"><strong>Pembayaran:</strong> ${order.paymentMethod === "qris" ? "QRIS" : "Tunai di Kasir"}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead>
            <tr style="background:#6F4E37;color:#fff;">
              <th style="padding:10px;text-align:left;">Menu</th>
              <th style="padding:10px;text-align:center;">Qty</th>
              <th style="padding:10px;text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr style="background:#f9f5f0;font-weight:bold;">
              <td colspan="2" style="padding:10px;">TOTAL</td>
              <td style="padding:10px;text-align:right;">Rp ${order.totalAmount.toLocaleString("id-ID")}</td>
            </tr>
          </tfoot>
        </table>
        <p>Kami akan segera menyiapkan pesananmu. Nikmati ngobrolnya bareng teman-teman! 🙌</p>
        <p style="color:#6F4E37;font-style:italic;">Salam hangat,<br/>Tim Kedai Antasena</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: order.customer.email,
    subject: `✅ Pesanan #${order.orderNumber} Diterima - Kedai Antasena`,
    html,
  });
}

export async function sendStatusUpdate(order) {
  const statusText = {
    preparing: "🔥 Sedang kami siapkan",
    ready: "✅ Siap diantar ke mejamu!",
    completed: "🎉 Selesai, terima kasih!",
  };

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: order.customer.email,
    subject: `Update Pesanan #${order.orderNumber} - ${statusText[order.orderStatus]}`,
    html: `
      <div style="font-family:Arial;padding:20px;max-width:600px;margin:auto;">
        <h2 style="color:#6F4E37;">Halo ${order.customer.name}!</h2>
        <p>Pesanan <strong>#${order.orderNumber}</strong> kamu sekarang:</p>
        <div style="background:#6F4E37;color:#fff;padding:15px;border-radius:8px;text-align:center;font-size:18px;">
          ${statusText[order.orderStatus]}
        </div>
      </div>
    `,
  });
}
