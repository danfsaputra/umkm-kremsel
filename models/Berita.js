import mongoose from "mongoose";

const beritaSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  tanggal: { type: Date },
  deskripsi: { type: String },
  gambar: { type: String },
}, { timestamps: true });

export default mongoose.models.Berita || mongoose.model("Berita", beritaSchema);
