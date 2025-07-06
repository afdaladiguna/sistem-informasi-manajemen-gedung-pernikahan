const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Menampilkan halaman registrasi
exports.getRegister = (req, res) => {
  res.render("auth/register", { title: "Daftar Akun" });
};

// Memproses data dari form registrasi
exports.postRegister = async (req, res) => {
  try {
    const { namaLengkap, username, password } = req.body;

    // Cek apakah username sudah ada
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      // [TODO]: Tambahkan flash message untuk error
      console.log("Username sudah digunakan");
      return res.redirect("/register");
    }

    // Buat user baru (password akan di-hash oleh pre-save hook di model)
    const newUser = new User({
      namaLengkap,
      username,
      password,
      // role akan default ke 'masyarakat'
    });

    await newUser.save();
    console.log("User baru berhasil dibuat!");
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Error saat registrasi:", error);
    res.redirect("/register");
  }
};

exports.getLogin = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

// Memproses data login
exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Cari user berdasarkan username
    const user = await User.findOne({ username });
    if (!user) {
      // [TODO] Kirim flash message 'Username tidak ditemukan'
      return res.redirect("/auth/login");
    }

    // 2. Bandingkan password yang diinput dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // [TODO] Kirim flash message 'Password salah'
      return res.redirect("/auth/login");
    }

    // 3. Jika berhasil, simpan info user di session
    req.session.userId = user._id;
    req.session.role = user.role;
    console.log("Login berhasil, sesi dibuat.");
    res.redirect("/dashboard"); // Arahkan ke dashboard setelah login
  } catch (error) {
    console.error("Error saat login:", error);
    res.redirect("/auth/login");
  }
};

// Proses Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/dashboard"); // Jika gagal logout, tetap di dashboard
    }
    res.clearCookie("connect.sid"); // Hapus cookie sesi
    res.redirect("/auth/login");
  });
};

// Menampilkan halaman dashboard (Contoh halaman setelah login)
exports.getDashboard = (req, res) => {
  // Cek jika user belum login, tendang ke halaman login
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }
  res.render("dashboard", {
    title: "Dashboard",
  });
};
