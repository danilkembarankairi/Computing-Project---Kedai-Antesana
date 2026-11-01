import Link from "next/link";
import { Coffee } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Coffee className="w-6 h-6" />
          <span>Kedai Antasena</span>
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/kasir" className="hover:text-secondary">
            Kasir
          </Link>
          <Link href="/admin" className="hover:text-secondary">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
