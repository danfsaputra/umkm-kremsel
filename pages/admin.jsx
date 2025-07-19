// pages/admin.js
import Link from "next/link";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/surabaya.jpg"
                alt="Logo UMKM Kultura"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                KUMPULAN UMKM KREMBANGAN SELATAN
              </h1>
              <p className="text-sm text-gray-600">
                Produk Lokal asli krembangan selatan
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-orange-700 mb-6">
            Dashboard Admin
          </h1>
          <p className="mb-6 text-gray-600">Pilih menu yang ingin dikelola:</p>
          <div className="flex flex-col gap-4">
            <Link
              href="/umkmadmin"
              className="block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-md transition"
            >
              Kelola UMKM
            </Link>
            <Link
              href="/beritaadmin"
              className="block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition"
            >
              Kelola Berita
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
