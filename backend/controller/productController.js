const Product = require("../model/productModel");

// CREATE
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      prImg: req.file?.filename || null,
      originalPrice: req.body.originalPrice || req.body.price,
      sellingPrice: req.body.sellingPrice || req.body.price,
    });
    res.status(201).json(await product.save());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ
const readProduct = async (req, res) => res.json(await Product.find({ deleted: false }));
const readSingleData = async (req, res) => res.json(await Product.findById(req.params.id));

// UPDATE
const updateProduct = async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.prImg = req.file.filename;
  res.json(await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }));
};

// SOFT DELETE
const deletedata = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndUpdate(
      req.params.id,
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );
    res.json({ message: "Deleted successfully", product: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RESTORE
const restoreProduct = async (req, res) => {
  const restored = await Product.findByIdAndUpdate(
    req.params.id,
    { deleted: false, deletedAt: null },
    { new: true }
  );
  res.json(restored);
};

// PERMANENT DELETE
const permanentDelete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted permanently" });
};

// EXTRA
const deletedProducts = async (req, res) => res.json(await Product.find({ deleted: true }));
const readAllDocu = async (req, res) => res.json(await Product.find());
const getCategories = async (req, res) => res.json(await Product.distinct("category"));

module.exports = {
  createProduct,
  readProduct,
  readSingleData,
  updateProduct,
  deletedata,
  restoreProduct,
  permanentDelete,
  deletedProducts,
  readAllDocu,
  getCategories,
};
