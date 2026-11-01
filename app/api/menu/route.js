import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Menu } from "@/models/Menu";

export async function GET() {
  await dbConnect();
  const menus = await Menu.find({ isAvailable: true }).sort({
    category: 1,
    name: 1,
  });
  return NextResponse.json(menus);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const menu = await Menu.create(body);
  return NextResponse.json(menu, { status: 201 });
}
