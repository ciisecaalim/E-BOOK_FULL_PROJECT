const Category = require("../model/categoryModel");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL ACTIVE CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET DELETED CATEGORIES (Recycle Bin)
exports.getDeletedCategories = async (req, res) => {
  try {
    const deleted = await Category.find({ isDeleted: true }).sort({ name: 1 });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SOFT DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.isDeleted = true;
    await category.save();
    res.json({ message: "Category moved to Recycle Bin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESTORE CATEGORY
exports.restoreCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.isDeleted = false;
    await category.save();
    res.json({ message: "Category restored" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
