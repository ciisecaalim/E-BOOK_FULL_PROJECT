const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const uploadImg = require("../middleware/uploadImg");
const { authMiddleware, isAdmin } = require("../middleware/auth");

// Public routes
router.get("/read", productController.readProduct);
router.get("/single/:id", productController.readSingleData);
router.get("/categories/read", productController.getCategories);

// Protected routes (admin)
router.post("/create", authMiddleware, isAdmin, uploadImg.single("img"), productController.createProduct);
router.put("/update/:id", authMiddleware, isAdmin, uploadImg.single("img"), productController.updateProduct);
router.delete("/delete/:id", authMiddleware, isAdmin, productController.deletedata);
router.put("/restore/:id", authMiddleware, isAdmin, productController.restoreProduct);
router.delete("/permanent/:id", authMiddleware, isAdmin, productController.permanentDelete);
router.get("/deleted", authMiddleware, isAdmin, productController.deletedProducts);
router.get("/readAll", authMiddleware, isAdmin, productController.readAllDocu);

module.exports = router;
