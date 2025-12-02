const express = require("express");
const multer = require("multer");
const { createAdmin, adminLogin, getAdminProfile, updateAdminProfile } = require("../controller/adminController");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/register", createAdmin);
router.post("/login", adminLogin);
router.get("/profile/public", getAdminProfile);
router.put("/profile/public", upload.single("avatar"), updateAdminProfile);

module.exports = router;
