const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rute untuk menampilkan halaman registrasi
router.get("/register", authController.getRegister);

// Rute untuk memproses data registrasi
router.post("/register", authController.postRegister);

// Rute untuk menampilkan halaman login
router.get("/login", authController.getLogin);

// Rute untuk memproses data login
router.post("/login", authController.postLogin);

// Rute untuk logout
router.get("/logout", authController.logout);

module.exports = router;
