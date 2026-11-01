const mongoose = require("mongoose");
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env.local"),
});

const MenuSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  imageUrl: String,
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
});

const Menu = mongoose.models.Menu || mongoose.model("Menu", MenuSchema);

const menus = [
  {
    name: "Kopi Susu Gula Aren",
    category: "Kopi",
    price: 18000,
    description: "Espresso + susu segar + gula aren asli. Best seller kami!",
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
    isFeatured: true,
    rating: 4.9,
  },
  {
    name: "Americano",
    category: "Kopi",
    price: 15000,
    description: "Espresso shot + air panas. Strong & bold.",
    imageUrl: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400",
    rating: 4.7,
  },
  {
    name: "Cappuccino",
    category: "Kopi",
    price: 20000,
    description: "Espresso + steamed milk + foam lembut.",
    imageUrl:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
    isFeatured: true,
    rating: 4.8,
  },
  {
    name: "Caramel Macchiato",
    category: "Kopi",
    price: 22000,
    description: "Espresso + vanilla + karamel + susu.",
    imageUrl:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400",
    rating: 4.6,
  },
  {
    name: "Matcha Latte",
    category: "Non-Kopi",
    price: 20000,
    description: "Matcha premium Jepang + susu segar.",
    imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400",
    isFeatured: true,
    rating: 4.8,
  },
  {
    name: "Coklat Panas",
    category: "Non-Kopi",
    price: 18000,
    description: "Coklat Belgia + susu hangat. Comforting!",
    imageUrl: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400",
    rating: 4.7,
  },
  {
    name: "Lemon Tea",
    category: "Non-Kopi",
    price: 15000,
    description: "Teh segar + lemon + madu. Seger banget!",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    rating: 4.5,
  },
  {
    name: "Red Velvet Latte",
    category: "Non-Kopi",
    price: 22000,
    description: "Red velvet + susu creamy. Instagramable!",
    imageUrl:
      "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400",
    rating: 4.6,
  },
  {
    name: "Nasi Goreng Kampung",
    category: "Makanan",
    price: 25000,
    description: "Nasi goreng + telur + ayam + kerupuk.",
    imageUrl:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
    isFeatured: true,
    rating: 4.8,
  },
  {
    name: "Mie Goreng Jawa",
    category: "Makanan",
    price: 22000,
    description: "Mie goreng khas Jawa + telur + sayuran.",
    imageUrl:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400",
    rating: 4.6,
  },
  {
    name: "Roti Bakar Coklat Keju",
    category: "Snack",
    price: 15000,
    description: "Roti bakar + coklat + keju melimpah.",
    imageUrl:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400",
    rating: 4.7,
  },
  {
    name: "Pisang Goreng Keju",
    category: "Snack",
    price: 12000,
    description: "Pisang goreng crispy + topping keju + coklat.",
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
    rating: 4.5,
  },
  {
    name: "Kentang Goreng",
    category: "Snack",
    price: 18000,
    description: "French fries crispy + saus sambal & mayo.",
    imageUrl:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
    rating: 4.6,
  },
  {
    name: "Dimsum Ayam",
    category: "Snack",
    price: 20000,
    description: "5 pcs dimsum ayam + saus spesial.",
    imageUrl:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400",
    rating: 4.7,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Menu.deleteMany({});
    console.log("🗑️  Cleared existing menus");

    await Menu.insertMany(menus);
    console.log(`✅ Seeded ${menus.length} menus`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
