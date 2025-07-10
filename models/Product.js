import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  deskripsi: { type: String },
  gambar: { type: String },
  alamat: { type: String },
  info: { type: String },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
