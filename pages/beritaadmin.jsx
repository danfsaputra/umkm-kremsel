import React, { useEffect, useState } from "react";
import {
  getBeritas,
  createBerita,
  updateBerita,
  deleteBerita,
} from "../lib/beritaAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [beritas, setBeritas] = useState([]);
  const [newBerita, setNewBerita] = useState({
    judul: "",
    deskripsi: "",
    gambar: "",
    tanggal: "", // <-- Tambah tanggal
  });
  const [editBeritaId, setEditBeritaId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [beritaToDelete, setBeritaToDelete] = useState(null);

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  const fetchBeritas = async () => {
    const data = await getBeritas();
    setBeritas(data);
  };

  useEffect(() => {
    fetchBeritas();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewBerita((prev) => ({ ...prev, gambar: ev.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setNewBerita((prev) => ({ ...prev, gambar: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", newBerita.judul || "");
    formData.append("deskripsi", newBerita.deskripsi || "");
    if (newBerita.tanggal) {
      formData.append("tanggal", newBerita.tanggal); // Tambah tanggal ke formData
    }
    if (selectedFile) formData.append("gambar", selectedFile);

    let data;
    if (editBeritaId) {
      data = await updateBerita(editBeritaId, formData);
    } else {
      data = await createBerita(formData);
    }

    if (data.error) {
      notifyError(data.error || "Gagal menyimpan Berita");
      return;
    }

    notifySuccess(editBeritaId ? "Berita berhasil diperbarui" : "Berita berhasil ditambahkan");

    setNewBerita({ judul: "", deskripsi: "", gambar: "", tanggal: "" });
    setSelectedFile(null);
    setEditBeritaId(null);
    fetchBeritas();
  };

  const handleEdit = (berita) => {
    setNewBerita({
      judul: berita.judul,
      deskripsi: berita.deskripsi,
      gambar: berita.gambar,
      tanggal: berita.tanggal?.substring(0, 10) || "", // format yyyy-mm-dd
    });
    setEditBeritaId(berita._id);
  };

  const openDeleteModal = (berita) => {
    setBeritaToDelete(berita);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!beritaToDelete) return;
    const res = await deleteBerita(beritaToDelete._id);
    if (res.error) {
      notifyError(res.error || "Gagal menghapus Berita");
    } else {
      notifySuccess("Berita berhasil dihapus");
      fetchBeritas();
    }
    setShowDeleteModal(false);
    setBeritaToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBeritaToDelete(null);
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full overflow-hidden">
              <img src="/surabaya.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">KUMPULAN BERITA KREMBANGAN SELATAN</h1>
              <p className="text-sm text-gray-600">Berita Lokal Krembangan Selatan</p>
            </div>
          </div>
        </div>
      </header>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* MODAL DELETE */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus Berita{" "}
              <span className="font-semibold">{beritaToDelete?.judul}</span>?
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

      {/* MAIN */}
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-5xl mx-auto pt-10 pb-20">
          <h1 className="text-3xl font-bold text-orange-700 mb-8 text-center">
            Kelola Data Berita
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 mb-10 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Berita
                </label>
                <input
                  placeholder="Judul Berita"
                  value={newBerita.judul}
                  onChange={(e) =>
                    setNewBerita({ ...newBerita, judul: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  placeholder="Jelaskan tentang berita ini..."
                  value={newBerita.deskripsi}
                  onChange={(e) =>
                    setNewBerita({ ...newBerita, deskripsi: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-md"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={newBerita.tanggal}
                  onChange={(e) =>
                    setNewBerita({ ...newBerita, tanggal: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 p-3 rounded-md"
                />
              </div>
            </div>

            {newBerita.gambar && (
              <img
                src={newBerita.gambar}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-md border mx-auto mt-4"
              />
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md"
            >
              {editBeritaId ? "Update Berita" : "Tambah Berita"}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {beritas.map((berita) => (
              <div
                key={berita._id}
                className="bg-white rounded-xl shadow p-4 flex flex-col"
              >
                {berita.gambar && (
                  <img
                    src={berita.gambar}
                    alt={berita.judul}
                    className="w-full h-40 object-cover mb-3 rounded-md"
                  />
                )}
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {berita.judul}
                </h2>
                <p className="text-sm text-gray-600 flex-1 mb-1">
                {berita.deskripsi.length > 100
                    ? `${berita.deskripsi.slice(0, 100)}...`
                    : berita.deskripsi}
                </p>
                {berita.deskripsi.length > 100}
                {berita.tanggal && (
                  <p className="text-xs text-gray-500 italic">
                    {new Date(berita.tanggal).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(berita)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(berita)}
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

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full overflow-hidden">
              <img src="/surabaya.jpg" alt="Logo Berita" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-semibold">BERITA KREMBANGAN SELATAN</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Kumpulan Berita. Dibuat dengan ❤️ untuk Berita Lokal
          </p>
        </div>
      </footer>
    </>
  );
}
