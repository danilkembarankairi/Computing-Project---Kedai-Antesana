import "./globals.css";

export const metadata = {
  title: "Kedai Antasena - QR Order System",
  description: "Pesan kopi via QR Code, langsung ke meja!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-amber-50/30 min-h-screen">{children}</body>
    </html>
  );
}
