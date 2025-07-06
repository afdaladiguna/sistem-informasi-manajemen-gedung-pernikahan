const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/authMiddleware");

// Rute Halaman Utama - Menampilkan semua gedung
router.get("/", isAuthenticated, userController.getAllGedung);

router.get("/dashboard", isAuthenticated, authController.getDashboard);
// Rute Halaman Detail Gedung
router.get("/gedung/:id", isAuthenticated, userController.getGedungDetail);

module.exports = router;
