import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Tutup menu saat route berubah
  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/surabaya.jpg"
                alt="Logo UMKM Kultura"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base md:text-xl font-bold text-gray-800">
                KUMPULAN UMKM KREMBANGAN SELATAN
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                Produk Lokal asli krembangan selatan
              </p>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-4">
            <Link
              href="/umkmadmin"
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                router.pathname === "/umkmadmin"
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-orange-100"
              }`}
            >
              Kelola UMKM
            </Link>
            <Link
              href="/beritaadmin"
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                router.pathname === "/beritaadmin"
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-orange-100"
              }`}
            >
              Kelola Berita
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="flex flex-col mt-4 md:hidden gap-2">
            <Link
              href="/umkmadmin"
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                router.pathname === "/umkmadmin"
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-orange-100"
              }`}
            >
              Kelola UMKM
            </Link>
            <Link
              href="/beritaadmin"
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                router.pathname === "/beritaadmin"
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-orange-100"
              }`}
            >
              Kelola Berita
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
