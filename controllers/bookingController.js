const Gedung = require("../models/gedungModel");
const Booking = require("../models/bookingModel");

// Menampilkan form booking
exports.getBookingForm = async (req, res) => {
  try {
    const gedung = await Gedung.findById(req.params.gedungId);
    if (!gedung) {
      return res.status(404).send("Gedung tidak ditemukan");
    }
    res.render("booking/form", {
      title: `Pesan ${gedung.namaGedung}`,
      gedung: gedung,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan");
  }
};

// Memproses dan menyimpan data booking
exports.postBooking = async (req, res) => {
  try {
    const { gedungId, tanggalCheckIn, tanggalCheckOut } = req.body;

    const gedung = await Gedung.findById(gedungId);
    if (!gedung) {
      return res.status(404).send("Gedung tidak ditemukan");
    }

    const checkIn = new Date(tanggalCheckIn);
    const checkOut = new Date(tanggalCheckOut);

    // Hitung selisih hari
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (dayDiff <= 0) {
      // [TODO] Kirim flash message error
      return res.redirect(`/booking/new/${gedungId}`);
    }

    const totalBiaya = dayDiff * gedung.hargaSewa;

    const newBooking = new Booking({
      gedungId: gedungId,
      userId: req.session.userId,
      tanggalCheckIn: checkIn,
      tanggalCheckOut: checkOut,
      totalBiaya: totalBiaya,
      status: "pending",
    });

    await newBooking.save();
    res.redirect("/booking/history");
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat membuat pesanan");
  }
};

// Menampilkan riwayat pesanan pengguna
exports.getBookingHistory = async (req, res) => {
  try {
    const userBookings = await Booking.find({ userId: req.session.userId })
      .populate("gedungId") // Mengambil data detail gedung terkait
      .sort({ createdAt: -1 }); // Urutkan dari yang terbaru

    res.render("booking/history", {
      title: "Riwayat Pesanan Saya",
      bookings: userBookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan");
  }
};
