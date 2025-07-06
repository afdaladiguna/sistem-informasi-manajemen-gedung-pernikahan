const Booking = require("../models/bookingModel");

// Menampilkan dashboard dengan daftar semua pesanan
exports.getDashboard = async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate("gedungId", "namaGedung") // Ambil nama gedung
      .populate("userId", "namaLengkap") // Ambil nama pemesan
      .sort({ status: 1, createdAt: -1 }); // Urutkan pending dulu, lalu yang terbaru

    res.render("kepala-gedung/dashboard", {
      title: "Dashboard Kepala Gedung",
      bookings: allBookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan server");
  }
};

// Mengubah status pesanan
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { newStatus } = req.body; // 'confirmed' atau 'cancelled'

    if (!["confirmed", "cancelled"].includes(newStatus)) {
      return res.status(400).send("Status tidak valid.");
    }

    await Booking.findByIdAndUpdate(bookingId, { status: newStatus });

    res.redirect("/kepala-gedung/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan server");
  }
};
