const mongoose = require("mongoose");

const gedungSchema = new mongoose.Schema(
  {
    namaGedung: {
      type: String,
      required: [true, "Nama gedung harus diisi"],
    },
    alamat: {
      type: String,
      required: [true, "Alamat harus diisi"],
    },
    deskripsi: {
      type: String,
      required: [true, "Deskripsi harus diisi"],
    },
    fasilitas: [String], // Array of strings untuk fasilitas
    hargaSewa: {
      type: Number,
      required: [true, "Harga sewa harus diisi"],
    },
    gambarUrl: {
      type: String,
      default: "/images/default.jpg", // Gambar default jika tidak diunggah
    },
  },
  { timestamps: true }
);

const Gedung = mongoose.model("Gedung", gedungSchema);

module.exports = Gedung;
