const Gedung = require("../models/gedungModel");
const fs = require("fs");
const path = require("path");

// Dashboard Admin
exports.getAdminDashboard = (req, res) => {
  res.render("admin/dashboard", {
    title: "Dashboard Admin",
  });
};

// CREATE - Tampilkan form
exports.getTambahGedung = (req, res) => {
  res.render("admin/tambah-gedung", { title: "Tambah Gedung Baru" });
};

// CREATE - Proses data
exports.postTambahGedung = async (req, res) => {
  try {
    const { namaGedung, alamat, deskripsi, fasilitas, hargaSewa } = req.body;
    if (!req.file) {
      return res.status(400).send("Gambar gedung wajib diunggah.");
    }
    const gedungBaru = new Gedung({
      namaGedung,
      alamat,
      deskripsi,
      fasilitas: fasilitas.split(",").map((item) => item.trim()),
      hargaSewa,
      gambarUrl: "/uploads/gedung/" + req.file.filename,
    });
    await gedungBaru.save();
    res.redirect("/admin/gedung");
  } catch (error) {
    console.error(error);
    res.redirect("/admin/gedung/tambah");
  }
};

// READ - Tampilkan semua gedung
exports.getAllGedung = async (req, res) => {
  try {
    const semuaGedung = await Gedung.find();
    res.render("admin/data-gedung", {
      title: "Data Gedung",
      gedung: semuaGedung,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/admin/dashboard");
  }
};

// UPDATE - Tampilkan form edit dengan data yang ada
exports.getEditGedung = async (req, res) => {
  try {
    const gedung = await Gedung.findById(req.params.id);
    if (!gedung) {
      return res.redirect("/admin/gedung");
    }
    res.render("admin/edit-gedung", {
      title: "Edit Data Gedung",
      gedung: gedung,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/admin/gedung");
  }
};

// UPDATE - Proses data edit
exports.postEditGedung = async (req, res) => {
  try {
    const { namaGedung, alamat, deskripsi, fasilitas, hargaSewa } = req.body;
    const gedung = await Gedung.findById(req.params.id);

    if (!gedung) {
      return res.redirect("/admin/gedung");
    }

    // Jika ada file gambar baru yang diunggah
    if (req.file) {
      // Hapus gambar lama dari server
      const oldImagePath = path.join(__dirname, "..", "public", gedung.gambarUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      // Update dengan path gambar baru
      gedung.gambarUrl = "/uploads/gedung/" + req.file.filename;
    }

    // Update field lainnya
    gedung.namaGedung = namaGedung;
    gedung.alamat = alamat;
    gedung.deskripsi = deskripsi;
    gedung.fasilitas = fasilitas.split(",").map((item) => item.trim());
    gedung.hargaSewa = hargaSewa;

    await gedung.save();
    res.redirect("/admin/gedung");
  } catch (error) {
    console.error(error);
    res.redirect("/admin/gedung");
  }
};

// DELETE - Hapus data
exports.deleteGedung = async (req, res) => {
  try {
    const gedung = await Gedung.findById(req.params.id);
    if (!gedung) {
      return res.status(404).send("Data tidak ditemukan");
    }

    // Hapus file gambar terkait dari server
    const imagePath = path.join(__dirname, "..", "public", gedung.gambarUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Hapus data dari database
    await Gedung.findByIdAndDelete(req.params.id);

    res.redirect("/admin/gedung");
  } catch (error) {
    console.error(error);
    res.redirect("/admin/gedung");
  }
};
