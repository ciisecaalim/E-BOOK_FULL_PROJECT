const express = require("express");
const productController = require("../controller/productController");
const uploadImg = require("../middleware/uploadImg");

const Router = express.Router();

Router.post("/create/product", uploadImg.single("img"), productController.createProduct);
Router.put("/update/product/:id", uploadImg.single("img"), productController.updateProduct);
Router.post("/read/product", productController.readProduct);
Router.get("/read/singleproduct/:id", productController.readSingleData);
Router.delete("/delete/product/:id", productController.deletedata); // soft delete
Router.get("/deleted/products", productController.deletedProducts); // Recycle Bin
Router.put("/restore/product/:id", productController.restoreProduct); // restore
Router.delete("/permanent/product/:id", productController.permanentDelete); // permanent delete
Router.get("/readAllDoc", productController.readAllDocu);
Router.get("/categories", productController.getCategories);

module.exports = Router;
