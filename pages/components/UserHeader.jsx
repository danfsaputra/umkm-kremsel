import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/router";

export default function UserHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const router = useRouter();

  const navigationItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'umkm', label: 'UMKM' },
    { id: 'berita', label: 'Berita' },
    { id: 'kontak', label: 'Kontak' }
  ];

  const handleNavigation = (itemId) => {
    setMenuOpen(false);
    if (router.pathname !== '/') {
      router.push(`/#${itemId}`);
    } else {
      const element = document.getElementById(itemId);
      if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    if (router.pathname === '/') {
      const handleScroll = () => {
        const scrollY = window.scrollY + 100;
        for (const section of navigationItems.map(n => n.id)) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const bottom = top + el.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
              setActiveSection(section);
              break;
            }
          }
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [router.pathname]);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center overflow-hidden">
              <img src="/surabaya.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-800">
                KUMPULAN UMKM KREMBANGAN SELATAN
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Produk Lokal asli krembangan selatan
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
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
                  onClick={() => handleNavigation(item.id)}
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
  );
}
