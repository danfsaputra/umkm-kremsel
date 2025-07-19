import { useEffect, useState } from "react";
import { Phone, MapPin, Menu, X, ExternalLink, Calendar, Share2 } from "lucide-react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [beritas, setBeritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [beritasLoading, setBeritasLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [showAllBeritas, setShowAllBeritas] = useState(false);
  const [selectedBerita, setSelectedBerita] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/beritas")
      .then((res) => res.json())
      .then((data) => {
        setBeritas(data);
        setBeritasLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching beritas:", err);
        setBeritasLoading(false);
      });
  }, []);

  // NEW: Handle akses langsung dari URL yang dibagikan
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const beritaId = urlParams.get('berita');
    
    if (beritaId && beritas.length > 0) {
      const foundBerita = beritas.find(b => b._id === beritaId);
      if (foundBerita) {
        setSelectedBerita(foundBerita);
        // Scroll ke section berita setelah modal terbuka
        setTimeout(() => {
          scrollToSection('berita');
        }, 500);
        
        // Bersihkan URL setelah modal dibuka (opsional)
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [beritas]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    const handleScroll = () => {
      const sections = ['beranda', 'umkm', 'berita', 'kontak'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setMenuOpen(false);
  };

  const handleInfoClick = (info) => {
    if (!info) return;
    
    // Check if it's a WhatsApp number (starts with +62, 62, or 08)
    const whatsappPattern = /^(\+62|62|08)\d+$/;
    if (whatsappPattern.test(info.replace(/\s|-/g, ''))) {
      let cleanNumber = info.replace(/\s|-/g, '');
      if (cleanNumber.startsWith('08')) {
        cleanNumber = '62' + cleanNumber.substring(1);
      } else if (cleanNumber.startsWith('+62')) {
        cleanNumber = cleanNumber.substring(1);
      }
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    } else {
      // Check if it's a URL
      if (info.startsWith('http://') || info.startsWith('https://')) {
        window.open(info, '_blank');
      } else {
        // Assume it's a website without protocol
        window.open(`https://${info}`, '_blank');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // UPDATED: Enhanced shareBerita function with specific news URL
  const shareBerita = async (berita) => {
    // Buat URL khusus untuk berita ini menggunakan query parameter
    const newsUrl = `${window.location.origin}?berita=${berita._id}`;
    
    const shareData = {
      title: berita.judul,
      text: berita.deskripsi.substring(0, 100) + '...',
      url: newsUrl // Gunakan URL berita spesifik
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        const textToShare = `${berita.judul}\n\n${berita.deskripsi.substring(0, 100)}...\n\nBaca selengkapnya di: ${newsUrl}`;
        await navigator.clipboard.writeText(textToShare);
        alert('Link berita telah disalin ke clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Manual fallback
      const textToShare = `${berita.judul}\n\n${berita.deskripsi.substring(0, 100)}...\n\nBaca selengkapnya di: ${newsUrl}`;
      prompt('Salin teks ini untuk berbagi berita:', textToShare);
    }
  };

  const navigationItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'umkm', label: 'UMKM' },
    { id: 'berita', label: 'Berita' },
    { id: 'kontak', label: 'Kontak' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center overflow-hidden">
                <img src="/surabaya.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-800">KUMPULAN UMKM KREMBANGAN SELATAN</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Produk Lokal asli krembangan selatan</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                    activeSection === item.id ? 'text-amber-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-colors font-semibold text-sm"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            </nav>
            <div className="lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-amber-600 focus:outline-none"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="lg:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left py-2 px-3 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  className="bg-amber-600 text-white py-2 px-3 rounded-lg font-semibold text-sm"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/login");
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-[70vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-amber-400 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-orange-400 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-32 w-24 h-24 bg-yellow-400 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-10 w-12 h-12 bg-amber-500 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="krembangan.webp" 
                  alt="UMKM Products" 
                  className="rounded-3xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              {/* Decorative elements around image */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-200 rounded-full blur-2xl opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-orange-200 rounded-full blur-2xl opacity-50"></div>
            </div>
            
            {/* Right Side - Content */}
            <div className="space-y-6 sm:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-full px-4 py-2 shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-amber-700">Platform UMKM Terpercaya</span>
              </div>
              
              {/* Main Title */}
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  Selamat Datang di{' '}
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Kumpulan UMKM Lokal
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  Menampilkan beragam produk kreatif dari berbagai pelaku UMKM lokal yang 
                  <span className="font-semibold text-amber-700"> inspiratif </span>
                  dan 
                  <span className="font-semibold text-orange-700"> inovatif</span>
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => scrollToSection('umkm')}
                  className="group bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  Jelajahi UMKM
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <button
                  onClick={() => scrollToSection('kontak')}
                  className="bg-white/80 backdrop-blur-sm border-2 border-amber-300 text-amber-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-16 sm:pt-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-2">{products.length}</div>
              <div className="text-gray-600 font-medium">UMKM Terdaftar</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
                {products.filter(product => product.info).length}
              </div>
              <div className="text-gray-600 font-medium">UMKM Dengan Kontak</div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent"></div>
      </section>

      {/* Produk */}
      <section id="umkm" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">KUMPULAN UMKM</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Berikut daftar UMKM yang tergabung bersama kami
          </p>
        </div>

        {/* STATE: showAll dan visibleProducts */}
        {(() => {
          const visibleProducts = showAll ? products : products.slice(0, 9);

          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
                      <div className="h-40 sm:h-48 bg-gray-300"></div>
                      <div className="p-4 sm:p-6 space-y-3">
                        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))
                ) : visibleProducts.length > 0 ? (
                  visibleProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative">
                        <img
                          src={product.gambar}
                          alt={product.nama}
                          className="w-full h-40 sm:h-48 object-cover"
                          onError={(e) => (e.target.src = "")}
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{product.nama}</h3>
                        <p className="text-gray-600 mb-3 text-sm sm:text-base">{product.deskripsi}</p>
                        <p className="text-sm sm:text-base text-gray-600 mb-3">Alamat: {product.alamat}</p>

                        {product.info && (
                          <button
                            onClick={() => handleInfoClick(product.info)}
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Hubungi/Kunjungi
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Belum ada data UMKM</h3>
                    <p className="text-sm sm:text-base text-gray-500">Silakan cek kembali nanti</p>
                  </div>
                )}
              </div>

              {/* TOMBOL LIHAT SEMUA */}
              {!showAll && products.length > 9 && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setShowAll(true)}
                    className="bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition"
                  >
                    Lihat Semua UMKM
                  </button>
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* Berita */}
      <section id="berita" className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">BERITA & INFORMASI</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Dapatkan informasi terbaru seputar UMKM dan perkembangan terkini
            </p>
          </div>

          {(() => {
            const visibleBeritas = showAllBeritas ? beritas : beritas.slice(0, 6);

            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {beritasLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
                        <div className="h-40 sm:h-48 bg-gray-300"></div>
                        <div className="p-4 sm:p-6 space-y-3">
                          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-full"></div>
                          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  ) : visibleBeritas.length > 0 ? (
                    visibleBeritas.map((berita) => (
                      <div key={berita._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="relative">
                          <img
                            src={berita.gambar}
                            alt={berita.judul}
                            className="w-full h-40 sm:h-48 object-cover"
                            onError={(e) => (e.target.src = "/placeholder-news.jpg")}
                          />
                        </div>
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 text-amber-600 text-sm mb-3">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(berita.tanggal)}</span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">{berita.judul}</h3>
                          <p className="text-gray-600 text-sm sm:text-base line-clamp-3 mb-4">{berita.deskripsi}</p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedBerita(berita)}
                              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                            >
                              Baca Selengkapnya
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => shareBerita(berita)}
                              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors"
                              title="Bagikan berita"
                            >
                              <Share2 className="w-4 h-4" />
                              Bagikan
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Belum ada berita</h3>
                      <p className="text-sm sm:text-base text-gray-500">Silakan cek kembali nanti</p>
                    </div>
                  )}
                </div>

                {/* TOMBOL LIHAT SEMUA BERITA */}
                {!showAllBeritas && beritas.length > 6 && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setShowAllBeritas(true)}
                      className="bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition"
                    >
                      Lihat Semua Berita
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* Modal untuk Detail Berita */}
      {selectedBerita && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-800">Detail Berita</h2>
              <button
                onClick={() => setSelectedBerita(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content Modal */}
            <div className="p-6">
              {/* Gambar */}
              <div className="mb-6">
                <img
                  src={selectedBerita.gambar}
                  alt={selectedBerita.judul}
                  className="w-full h-64 sm:h-80 object-cover rounded-xl"
                  onError={(e) => (e.target.src = "/placeholder-news.jpg")}
                />
              </div>
              
              {/* Tanggal */}
              <div className="flex items-center gap-2 text-amber-600 text-sm mb-4">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedBerita.tanggal)}</span>
              </div>
              
              {/* Judul */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                {selectedBerita.judul}
              </h1>
              
              {/* Deskripsi Lengkap */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedBerita.deskripsi}
                </p>
              </div>
              
              {/* Footer Modal */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => shareBerita(selectedBerita)}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Bagikan
                </button>
                <button
                  onClick={() => setSelectedBerita(null)}
                  className="bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kontak */}
      <section id="kontak" className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">Hubungi Kami</h3>
            <p className="opacity-90 text-sm sm:text-base max-w-xl mx-auto">
              Punya pertanyaan atau ingin bergabung sebagai UMKM? Silakan hubungi kami!
            </p>
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>031 3570574</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Jl. Pesapen Selatan No.4, Krembangan Sel., Kec. Krembangan, Surabaya, Jawa Timur</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full overflow-hidden">
              <img src="/surabaya.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-base sm:text-lg font-semibold">UMKM KREMBANGAN SELATAN</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2025 Kumpulan UMKM. Dibuat dengan ❤️ untuk UMKM Lokal
          </p>
        </div>
      </footer>
    </div>
  );
}