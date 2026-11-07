import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Menu } from "@/models/Menu";

// GET: Mengambil data menu
export async function GET(req) {
  await dbConnect();

  // Cek apakah ada parameter ?available=true dari URL
  const { searchParams } = new URL(req.url);
  const availableOnly = searchParams.get("available") === "true";

  // Jika availableOnly = true, filter hanya yang tersedia.
  // Jika tidak, ambil SEMUA menu (termasuk yang Habis) agar bisa ditampilkan badge-nya.
  const query = availableOnly ? { isAvailable: true } : {};

  const menus = await Menu.find(query).sort({
    category: 1,
    name: 1,
  });

  return NextResponse.json(menus);
}

// POST: Menambah menu baru dari Admin
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  // Validasi sederhana agar tidak error jika field penting kosong
  if (!body.name || !body.category || !body.price) {
    return NextResponse.json(
      { error: "Nama, kategori, dan harga wajib diisi" },
      { status: 400 },
    );
  }

  // Jika tidak ada isAvailable yang dikirim, default-nya true (Tersedia)
  if (body.isAvailable === undefined) {
    body.isAvailable = true;
  }

  const menu = await Menu.create(body);
  return NextResponse.json(menu, { status: 201 });
}
