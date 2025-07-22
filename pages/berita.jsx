import { useState } from "react";
import { Calendar, Share2, X } from "lucide-react";
import Head from "next/head";
import UserHeader from "../pages/components/UserHeader";

// Format tanggal
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Fungsi untuk meta deskripsi
const getMetaDescription = (text) =>
  text?.length > 155 ? `${text.substring(0, 155)}...` : text;

export default function Berita({ beritas, currentBerita }) {
  const [selectedBerita, setSelectedBerita] = useState(currentBerita || null);

  const shareBerita = async (berita) => {
    const newsUrl = `${window.location.origin}/berita?id=${berita._id}`;
    const shareData = {
      title: berita.judul,
      text: berita.deskripsi.substring(0, 100) + "...",
      url: newsUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${berita.judul}\n\n${berita.deskripsi.substring(0, 100)}...\n\nBaca selengkapnya di: ${newsUrl}`
        );
        alert("Link berita telah disalin ke clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <>
      <Head>
        <title>
          {currentBerita
            ? `${currentBerita.judul} - Berita UMKM Krembangan Selatan`
            : "Berita UMKM Krembangan Selatan"}
        </title>
        <meta
          name="description"
          content={
            currentBerita
              ? getMetaDescription(currentBerita.deskripsi)
              : "Kumpulan berita dan informasi terkini seputar UMKM Krembangan Selatan"
          }
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={
            currentBerita
              ? currentBerita.judul
              : "Berita UMKM Krembangan Selatan"
          }
        />
        <meta
          property="og:description"
          content={
            currentBerita
              ? getMetaDescription(currentBerita.deskripsi)
              : "Kumpulan berita dan informasi terkini seputar UMKM Krembangan Selatan"
          }
        />
        <meta
          property="og:image"
          content={
            currentBerita?.gambar || `${process.env.NEXT_PUBLIC_BASE_URL}/surabaya.jpg`
          }
        />
        <meta property="og:site_name" content="UMKM Krembangan Selatan" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        
        <UserHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Berita & Informasi Terkini
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beritas.map((berita) => (
              <div
                key={berita._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                {berita.gambar && (
                  <img
                    src={berita.gambar}
                    alt={berita.judul}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-amber-600 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(berita.tanggal)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {berita.judul}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {berita.deskripsi}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedBerita(berita)}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Baca Selengkapnya
                    </button>
                    <button
                      onClick={() => shareBerita(berita)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {selectedBerita && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Detail Berita</h2>
                <button
                  onClick={() => setSelectedBerita(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                {selectedBerita.gambar && (
                  <img
                    src={selectedBerita.gambar}
                    alt={selectedBerita.judul}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                )}
                <div className="flex items-center gap-2 text-amber-600 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedBerita.tanggal)}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedBerita.judul}
                </h3>
                <p className="text-gray-600 whitespace-pre-line mb-6">
                  {selectedBerita.deskripsi}
                </p>
                <div className="flex justify-between items-center pt-4 border-t">
                  <button
                    onClick={() => shareBerita(selectedBerita)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <Share2 className="w-5 h-5" />
                    Bagikan
                  </button>
                  <button
                    onClick={() => setSelectedBerita(null)}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full overflow-hidden">
                <img
                  src="/surabaya.jpg"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-semibold">
                BERITA KREMBANGAN SELATAN
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Kumpulan Berita. Dibuat dengan ❤️ untuk Berita Lokal
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

// SSR: Ambil data dari server sebelum render
export async function getServerSideProps(context) {
  const { id } = context.query;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/beritas`);
  const beritas = await res.json();
  const currentBerita = id ? beritas.find((b) => b._id === id) : null;

  return {
    props: {
      beritas,
      currentBerita,
    },
  };
}
