const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  quantity: Number,
  total: Number,
});

const orderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    email: String,
    phone: String,
    address: String,
    products: [productSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Processing" },
    paymentStatus: { type: String, default: "Unpaid" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
