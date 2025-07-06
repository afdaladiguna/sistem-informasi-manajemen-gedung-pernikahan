// 1. Impor modul yang diperlukan
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const User = require("./models/userModel"); // Pastikan User model diimpor

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes"); // Impor rute baru
const bookingRoutes = require("./routes/bookingRoutes");
const kepalaGedungRoutes = require("./routes/kepalaGedungRoutes");

// 2. Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Koneksi ke Database MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Berhasil terhubung ke MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Koneksi database gagal:", err);
    process.exit(1);
  });

// 4. Konfigurasi Middleware
app.use(express.json()); // Untuk mem-parsing body request JSON
app.use(express.urlencoded({ extended: true })); // Untuk mem-parsing body request dari form URL-encoded
app.use(express.static(path.join(__dirname, "public"))); // Menyajikan file statis dari folder 'public'

app.use(
  session({
    secret: "kunci-rahasia-untuk-enkripsi-session", // Ganti dengan string acak yang kuat
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions", // Nama koleksi untuk menyimpan sesi
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Masa berlaku cookie sesi (contoh: 1 hari)
    },
  })
);

app.use(async (req, res, next) => {
  res.locals.isAuthenticated = req.session.userId ? true : false;
  res.locals.userRole = req.session.role || null;

  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select("namaLengkap");
      res.locals.currentUser = user;
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
      res.locals.currentUser = null;
    }
  } else {
    res.locals.currentUser = null;
  }

  next();
});
// 5. Konfigurasi View Engine EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 6. Rute Dasar (Contoh)
app.use("/", userRoutes); // Rute publik sebagai rute utama
app.use("/auth", authRoutes); // Gunakan semua rute dari authRoutes
app.use("/admin", adminRoutes);
app.use("/booking", bookingRoutes); // Semua rute booking diawali /booking
app.use("/kepala-gedung", kepalaGedungRoutes);

// Rute ini akan kita pindahkan nanti ke folder /routes
// app.get("/", (req, res) => {
//   res.render("index", { title: "Sistem Informasi Gedung Pernikahan" });
// });

// 7. Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
