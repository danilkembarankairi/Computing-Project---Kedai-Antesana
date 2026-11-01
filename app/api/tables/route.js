import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Table } from "@/models/Table";

export async function GET() {
  await dbConnect();
  const tables = await Table.find().sort({ tableNumber: 1 });
  return NextResponse.json(tables);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const table = await Table.create(body);
  return NextResponse.json(table, { status: 201 });
}
