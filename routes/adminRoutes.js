const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // Impor multer
const adminController = require("../controllers/adminController");

// Dashboard
router.get("/dashboard", isAuthenticated, isAdmin, adminController.getAdminDashboard);

// CREATE - Menampilkan form tambah gedung
router.get("/gedung/tambah", isAuthenticated, isAdmin, adminController.getTambahGedung);
// CREATE - Memproses data form
router.post("/gedung/tambah", isAuthenticated, isAdmin, upload.single("gambarGedung"), adminController.postTambahGedung);

// READ - Menampilkan semua data gedung
router.get("/gedung", isAuthenticated, isAdmin, adminController.getAllGedung);

// UPDATE - Menampilkan form edit gedung
router.get("/gedung/edit/:id", isAuthenticated, isAdmin, adminController.getEditGedung);
// UPDATE - Memproses data form edit
router.post("/gedung/edit/:id", isAuthenticated, isAdmin, upload.single("gambarGedung"), adminController.postEditGedung);

// DELETE - Menghapus data gedung
router.post("/gedung/delete/:id", isAuthenticated, isAdmin, adminController.deleteGedung);

module.exports = router;
