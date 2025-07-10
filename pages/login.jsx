import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (username === "kremseladmin" && password === "kremsel123") {
      localStorage.setItem("isLoggedIn", "true");
      setSuccessMessage("Login berhasil. Mengarahkan ke dashboard...");
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } else {
      setErrorMessage("Username atau password salah");
    }
  };

  return (
    <>
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
              <h1 className="text-xl font-bold text-gray-800">KUMPULAN UMKM KREMBANGAN SELATAN</h1>
              <p className="text-sm text-gray-600">Produk Lokal asli krembangan selatan</p>
            </div>
          </div>
        </div>
      </header>

      {/* LOGIN FORM */}
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4 pt-10">
        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
            Login Admin
          </h1>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Username</label>
              <input
                type="text"
                placeholder="Masukkan username"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
