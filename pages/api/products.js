import cloudinaryModule from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import connectDB from "/lib/mongodb";
import Product from "/models/Product";

// Nonaktifkan bodyParser bawaan Next.js
export const config = {
  api: { bodyParser: false },
};

// Konfigurasi Cloudinary
const cloudinary = cloudinaryModule.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfigurasi multer storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });

// Helper middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      return result instanceof Error ? reject(result) : resolve(result);
    });
  });
}

// Handler utama
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  try {
    if (req.method === "GET") {
      const products = await Product.find();
      return res.status(200).json(products);
    }

    if (req.method === "POST") {
      await runMiddleware(req, res, upload.single("gambar"));

      const { nama, deskripsi, alamat, info } = req.body;
      const gambar = req.file?.path;

      const newProduct = new Product({ nama, deskripsi, alamat, info, gambar });
      await newProduct.save();

      return res.status(201).json(newProduct);
    }

    if (req.method === "PUT") {
      await runMiddleware(req, res, upload.single("gambar"));

      const { id, nama, alamat, deskripsi, info } = req.body;

      const updateData = { nama, alamat, deskripsi, info };
      if (req.file) updateData.gambar = req.file.path;

      const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: "UMKM tidak ditemukan" });

      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "UMKM tidak ditemukan" });

      return res.status(200).json({ message: "UMKM berhasil dihapus" });
    }

    return res.status(405).json({ error: `Method ${req.method} tidak diizinkan` });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", detail: error.message });
  }
}
