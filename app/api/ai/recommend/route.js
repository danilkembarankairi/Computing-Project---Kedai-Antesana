import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Menu } from "@/models/Menu";
import { getAIRecommendation } from "@/lib/ai";

export async function POST(req) {
  try {
    await dbConnect();
    const { message } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Pesan kosong" }, { status: 400 });
    }

    const menuItems = await Menu.find({ isAvailable: true });
    const reply = await getAIRecommendation(message, menuItems);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI error:", err);
    return NextResponse.json(
      { error: "AI sedang sibuk, coba lagi ya!" },
      { status: 500 },
    );
  }
}
