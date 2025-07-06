const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    namaLengkap: {
      type: String,
      required: [true, "Nama lengkap harus diisi"],
    },
    username: {
      type: String,
      required: [true, "Username harus diisi"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      minlength: [6, "Password minimal 6 karakter"],
    },
    role: {
      type: String,
      enum: ["admin", "kepala_gedung", "masyarakat"],
      default: "masyarakat",
    },
  },
  { timestamps: true }
);

// Middleware (pre-save hook) untuk hash password sebelum disimpan
userSchema.pre("save", async function (next) {
  // Hanya hash password jika ada modifikasi
  if (!this.isModified("password")) return next();

  // Generate salt dan hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
