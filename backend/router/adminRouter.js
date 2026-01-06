import express from "express";
import multer from "multer";
import { createAdmin, adminLogin, getAdminProfile, updateAdminProfile } from "../controller/adminController.js";

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

// ES Module export
export default router;
