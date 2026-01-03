const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");

// Create a category
router.post("/create", categoryController.createCategory);

// ✅ Get all active categories (this will match your frontend)
router.get("/read", categoryController.getCategories);

// Get deleted categories
router.get("/deleted", categoryController.getDeletedCategories);

// Restore category
router.put("/restore/:id", categoryController.restoreCategory);

// Soft delete category
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
