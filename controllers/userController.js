const Gedung = require("../models/gedungModel");

// Menampilkan semua gedung di halaman utama
exports.getAllGedung = async (req, res) => {
  try {
    const semuaGedung = await Gedung.find();
    res.render("index", {
      title: "Selamat Datang",
      gedung: semuaGedung,
    });
  } catch (error) {
    console.error(error);
    // [TODO] Render halaman error
    res.status(500).send("Terjadi error saat mengambil data.");
  }
};

// Menampilkan halaman detail untuk satu gedung
exports.getGedungDetail = async (req, res) => {
  try {
    const gedung = await Gedung.findById(req.params.id);
    if (!gedung) {
      return res.status(404).send("Gedung tidak ditemukan");
    }
    res.render("detail-gedung", {
      title: gedung.namaGedung,
      gedung: gedung,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi error saat mengambil data.");
  }
};
