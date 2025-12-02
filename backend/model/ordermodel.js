const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  price: Number,
  total: Number
});

const orderSchema = new mongoose.Schema({
  customer: String,
  products: [productSchema],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
