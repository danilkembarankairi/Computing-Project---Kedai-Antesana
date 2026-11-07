import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Table } from "@/models/Table";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const deletedTable = await Table.findByIdAndDelete(id);

    if (!deletedTable) {
      return NextResponse.json(
        { error: "Meja tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Meja berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus meja" },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const updatedTable = await Table.findByIdAndUpdate(id, body, { new: true });

    if (!updatedTable) {
      return NextResponse.json(
        { error: "Meja tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedTable, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal update meja" }, { status: 500 });
  }
}
