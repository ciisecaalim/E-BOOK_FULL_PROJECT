const productModel = require("../model/productModel");

// CREATE
const createProduct = async (req, res) => {
  try {
    const newData = new productModel({
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      category: req.body.category,
      prImg: req.file.filename,
    });
    const saveData = await newData.save();
    res.status(200).send(saveData);
  } catch (error) {
    res.status(500).send({ message: "Error creating product", error });
  }
};

// READ (Filter by category or return all, excluding deleted)
const readProduct = async (req, res) => {
  try {
    const { category } = req.body || {};
    let filterData = { deleted: false }; // ignore deleted products

    if (category && category.trim() !== "") {
      filterData.category = category;
    }

    const getData = await productModel.find(filterData);
    res.status(200).send(getData);
  } catch (error) {
    res.status(500).send({ message: "Error reading products", error });
  }
};

// UPDATE
const updateProduct = async (req, res) => {
  try {
    const putPro = await productModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          quantity: req.body.quantity,
          price: req.body.price,
          category: req.body.category,
          prImg: req.file ? req.file.filename : undefined,
        },
      }
    );
    res.status(200).send(putPro);
  } catch (error) {
    res.status(500).send({ message: "Error updating product", error });
  }
};

// READ SINGLE
const readSingleData = async (req, res) => {
  try {
    const getdata = await productModel.findById(req.params.id);
    res.status(200).send(getdata);
  } catch (error) {
    res.status(500).send({ message: "Error reading single product", error });
  }
};

// SOFT DELETE (move to Recycle Bin)
const deletedata = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product moved to Recycle Bin", product });
  } catch (error) {
    res.status(500).send({ message: "Error deleting product", error });
  }
};

// GET DELETED PRODUCTS
const deletedProducts = async (req, res) => {
  try {
    const books = await productModel.find({ deleted: true });
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send({ message: "Error fetching deleted products", error });
  }
};

// RESTORE PRODUCT
const restoreProduct = async (req, res) => {
  try {
    const book = await productModel.findByIdAndUpdate(
      req.params.id,
      { deleted: false, deletedAt: null },
      { new: true }
    );
    if (!book) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product restored", book });
  } catch (error) {
    res.status(500).send({ message: "Error restoring product", error });
  }
};

// PERMANENT DELETE
const permanentDelete = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Product permanently deleted" });
  } catch (error) {
    res.status(500).send({ message: "Error permanently deleting product", error });
  }
};

// READ ALL
const readAllDocu = async (req, res) => {
  try {
    const getData = await productModel.find();
    res.status(200).send(getData);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving documents", error });
  }
};

// READ DISTINCT CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await productModel.distinct("category");
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: "Error getting categories", error });
  }
};

module.exports = {
  createProduct,
  readProduct,
  updateProduct,
  readSingleData,
  deletedata,
  deletedProducts,
  restoreProduct,
  permanentDelete,
  readAllDocu,
  getCategories,
};
