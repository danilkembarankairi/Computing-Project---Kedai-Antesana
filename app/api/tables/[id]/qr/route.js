import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Table } from "@/models/Table";
import QRCode from "qrcode";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const table = await Table.findById(id);
    if (!table) {
      return NextResponse.json(
        { error: "Meja tidak ditemukan" },
        { status: 404 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const orderUrl = `${appUrl}/order?table=${table.tableNumber}`;

    const qrCodeUrl = await QRCode.toDataURL(orderUrl);

    table.qrCodeUrl = qrCodeUrl;
    await table.save();

    return NextResponse.json(
      { qrCodeUrl, tableNumber: table.tableNumber },
      { status: 200 },
    );
  } catch (error) {
    console.error("QR Error:", error);
    return NextResponse.json({ error: "Gagal generate QR" }, { status: 500 });
  }
}
