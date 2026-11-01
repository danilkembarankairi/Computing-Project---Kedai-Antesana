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
    description: { type: String },
    imageUrl: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
