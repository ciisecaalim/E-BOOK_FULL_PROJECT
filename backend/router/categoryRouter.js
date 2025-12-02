const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");

router.post("/create", categoryController.createCategory);
router.get("/all", categoryController.getCategories);
router.get("/deleted", categoryController.getDeletedCategories);
router.put("/restore/:id", categoryController.restoreCategory);
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
