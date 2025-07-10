import React, { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../lib/productAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    nama: "",
    alamat: "",
    deskripsi: "",
    gambar: "",
    info: "",
  });
  const [editProductId, setEditProductId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewProduct((prev) => ({ ...prev, gambar: ev.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setNewProduct((prev) => ({ ...prev, gambar: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama", newProduct.nama || "");
    formData.append("alamat", newProduct.alamat || "");
    formData.append("deskripsi", newProduct.deskripsi || "");
    formData.append("info", newProduct.info || "");
    if (selectedFile) formData.append("gambar", selectedFile);

    let data;
    if (editProductId) {
      data = await updateProduct(editProductId, formData);
    } else {
      data = await createProduct(formData);
    }

    if (data.error) {
      notifyError(data.error || "Gagal menyimpan UMKM");
      return;
    }

    notifySuccess(editProductId ? "UMKM berhasil diperbarui" : "UMKM berhasil ditambahkan");

    setNewProduct({ nama: "", alamat: "", deskripsi: "", gambar: "", info: "" });
    setSelectedFile(null);
    setEditProductId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setNewProduct({
      nama: product.nama,
      alamat: product.alamat || "",
      deskripsi: product.deskripsi,
      gambar: product.gambar,
      info: product.info || "",
    });
    setEditProductId(product._id);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const res = await deleteProduct(productToDelete._id);
    if (res.error) {
      notifyError(res.error || "Gagal menghapus UMKM");
    } else {
      notifySuccess("UMKM berhasil dihapus");
      fetchProducts();
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <>
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full overflow-hidden">
              <img src="/surabaya.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">KUMPULAN UMKM KREMBANGAN SELATAN</h1>
              <p className="text-sm text-gray-600">Produk Lokal asli krembangan selatan</p>
            </div>
          </div>
        </div>
      </header>

      <ToastContainer position="top-right" autoClose={3000} />

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus UMKM{" "}
              <span className="font-semibold">{productToDelete?.nama}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-sm"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-5xl mx-auto pt-10 pb-20">
          <h1 className="text-3xl font-bold text-orange-700 mb-8 text-center">
            Kelola Data UMKM
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 mb-10 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama UMKM
                </label>
                <input
                  placeholder="Nama UMKM"
                  value={newProduct.nama}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, nama: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <input
                  placeholder="Alamat Lengkap"
                  value={newProduct.alamat}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, alamat: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi UMKM
              </label>
              <textarea
                placeholder="Jelaskan tentang UMKM ini..."
                value={newProduct.deskripsi}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, deskripsi: e.target.value })
                }
                className="w-full border border-gray-300 p-3 rounded-md"
                rows="3"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Info Kontak / Website
              </label>
              <input
                placeholder="Contoh: 08123456789 atau azahbucket.com"
                value={newProduct.info}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, info: e.target.value })
                }
                className="w-full border border-gray-300 p-3 rounded-md"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 p-3 rounded-md"
            />

            {newProduct.gambar && (
              <img
                src={newProduct.gambar}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-md border mx-auto mt-4"
              />
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md"
            >
              {editProductId ? "Update UMKM" : "Tambah UMKM"}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow p-4 flex flex-col"
              >
                {product.gambar && (
                  <img
                    src={product.gambar}
                    alt={product.nama}
                    className="w-full h-40 object-cover mb-3 rounded-md"
                  />
                )}
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {product.nama}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Alamat:</strong> {product.alamat || "-"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Info:</strong> {product.info || "-"}
                </p>
                <p className="text-sm text-gray-600 flex-1">
                  {product.deskripsi}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full overflow-hidden">
              <img src="/surabaya.jpg" alt="Logo UMKM" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-semibold">UMKM KREMBANGAN SELATAN </span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Kumpulan UMKM. Dibuat dengan ❤️ untuk UMKM Lokal
          </p>
        </div>
      </footer>
    </>
  );
}
