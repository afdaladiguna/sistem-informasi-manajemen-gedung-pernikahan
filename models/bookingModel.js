const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    gedungId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gedung",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tanggalCheckIn: {
      type: Date,
      required: true,
    },
    tanggalCheckOut: {
      type: Date,
      required: true,
    },
    totalBiaya: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
