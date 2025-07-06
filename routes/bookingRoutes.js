const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { isAuthenticated } = require("../middleware/authMiddleware");

// Menampilkan form booking untuk gedung tertentu
router.get("/new/:gedungId", isAuthenticated, bookingController.getBookingForm);

// Memproses data dari form booking
router.post("/create", isAuthenticated, bookingController.postBooking);

// Menampilkan riwayat pesanan pengguna
router.get("/history", isAuthenticated, bookingController.getBookingHistory);

module.exports = router;
