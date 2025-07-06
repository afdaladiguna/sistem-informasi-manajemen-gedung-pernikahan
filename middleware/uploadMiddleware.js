const multer = require("multer");
const path = require("path");

// Konfigurasi storage untuk Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Menentukan folder untuk menyimpan gambar
    cb(null, "public/uploads/gedung/");
  },
  filename: function (req, file, cb) {
    // Membuat nama file yang unik untuk menghindari konflik
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter untuk memastikan hanya file gambar yang diunggah
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extname) {
    return cb(null, true);
  }
  cb("Error: Hanya file gambar (jpeg, jpg, png) yang diizinkan!");
};

// Inisialisasi Multer dengan konfigurasi di atas
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Batas ukuran file 5MB
});

module.exports = upload;
