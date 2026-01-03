const express = require("express");
const router = express.Router();

const productController = require("../controller/productController");
const uploadImg = require("../middleware/uploadImg");
const { authMiddleware, isAdmin } = require("../middleware/auth");

/* ================= PUBLIC ROUTES ================= */
// Anyone can see products & categories
router.get("/read", productController.readProduct);
router.get("/single/:id", productController.readSingleData);
router.get("/categories/read", productController.getCategories);

/* ================= PROTECTED ROUTES ================= */
router.use(authMiddleware);

// Admin only
router.post(
  "/create",
  isAdmin,
  uploadImg.single("img"),
  productController.createProduct
);

router.put(
  "/update/:id",
  isAdmin,
  uploadImg.single("img"),
  productController.updateProduct
);

router.delete("/delete/:id", isAdmin, productController.deletedata);
router.put("/restore/:id", isAdmin, productController.restoreProduct);
router.delete("/permanent/:id", isAdmin, productController.permanentDelete);
router.get("/deleted", isAdmin, productController.deletedProducts);
router.get("/readAll", isAdmin, productController.readAllDocu);

module.exports = router;
