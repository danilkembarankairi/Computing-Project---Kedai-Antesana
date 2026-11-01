import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Table } from "@/models/Table";
import QRCode from "qrcode";

export async function GET(req, { params }) {
  await dbConnect();
  const table = await Table.findById(params.id);
  if (!table) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const url = `${baseUrl}/order?table=${table.tableNumber}`;
  const qrCodeUrl = await QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: "#2C1810", light: "#FFFFFF" },
  });

  table.qrCodeUrl = qrCodeUrl;
  await table.save();

  return NextResponse.json({ qrCodeUrl, url });
}
