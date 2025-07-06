const express = require("express");
const router = express.Router();
const kepalaGedungController = require("../controllers/kepalaGedungController");
const { isAuthenticated, isKepalaGedung } = require("../middleware/authMiddleware");

// Menampilkan dashboard dengan semua pesanan
router.get("/dashboard", isAuthenticated, isKepalaGedung, kepalaGedungController.getDashboard);

// Memproses update status pesanan (konfirmasi/batalkan)
router.post("/booking/update/:bookingId", isAuthenticated, isKepalaGedung, kepalaGedungController.updateBookingStatus);

module.exports = router;
