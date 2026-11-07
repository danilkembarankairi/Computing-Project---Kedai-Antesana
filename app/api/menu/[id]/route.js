import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Menu } from "@/models/Menu";

// 1. PUT: Untuk Edit Menu (Ganti Harga, Nama, Kategori, dll)
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const updatedMenu = await Menu.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMenu) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedMenu, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate menu" },
      { status: 500 },
    );
  }
}

// 2. PATCH: Khusus untuk ubah status Habis/Tersedia dengan cepat (1 klik)
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const menu = await Menu.findById(id);
    if (!menu) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan" },
        { status: 404 },
      );
    }

    // Jika admin mengirim status isAvailable, update di database
    if (body.isAvailable !== undefined) {
      menu.isAvailable = body.isAvailable;
      await menu.save();
    }

    return NextResponse.json(menu, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}

// 3. DELETE: Untuk menghapus menu dari database
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedMenu = await Menu.findByIdAndDelete(id);
    if (!deletedMenu) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Menu berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus menu" },
      { status: 500 },
    );
  }
}
