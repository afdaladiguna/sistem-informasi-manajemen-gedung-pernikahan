const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// Rute Halaman Utama - Menampilkan semua gedung
router.get("/", userController.getAllGedung);

router.get("/dashboard", authController.getDashboard);
// Rute Halaman Detail Gedung
router.get("/gedung/:id", userController.getGedungDetail);

module.exports = router;
