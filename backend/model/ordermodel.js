const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  quantity: Number,
  total: Number,
});

const orderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    products: [orderProductSchema],
    totalAmount: { type: Number, required: true },

    status: { type: String, default: "Processing" }, // Processing | Completed
    paymentStatus: { type: String, default: "Unpaid" }, // Unpaid | Paid
    paymentMethod: { type: String }, // Stripe | PayPal | Cash
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
