exports.isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    // Jika ada sesi userId, berarti pengguna sudah login
    return next();
  }
  // Jika tidak, alihkan ke halaman login
  res.redirect("/login");
};

exports.isAdmin = (req, res, next) => {
  // Middleware ini harus dijalankan SETELAH isAuthenticated
  if (req.session.role === "admin") {
    // Jika rolenya adalah admin, izinkan akses
    return next();
  }
  // Jika bukan admin, kirim status Forbidden (Akses Dilarang)
  res.status(403).send("Akses Dilarang: Anda bukan Admin.");
};

// [Opsional] Middleware untuk peran lain jika dibutuhkan nanti
exports.isKepalaGedung = (req, res, next) => {
  if (req.session.role === "kepala_gedung") {
    return next();
  }
  res.status(403).send("Akses Dilarang");
};
