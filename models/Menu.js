import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["Kopi", "Non-Kopi", "Makanan", "Snack"],
      required: true,
    },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true }, // Kunci untuk fitur Habis/Tersedia
  },
  { timestamps: true },
);

export const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
