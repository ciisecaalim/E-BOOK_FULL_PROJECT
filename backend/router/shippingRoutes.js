import express from "express";
import {
  readShipping,
  createShipping,
  updateShipping,
  deleteShipping
} from "../controller/shippingController.js";
import { authMiddleware, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/read", readShipping);

// Admin routes
router.post("/create", authMiddleware, isAdmin, createShipping);
router.put("/update/:id", authMiddleware, isAdmin, updateShipping);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteShipping);

export default router;
