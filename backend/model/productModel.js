const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  price: { type: Number, required: true },
  originalPrice: Number,
  sellingPrice: Number,
  prImg: String,
  status: { type: String, default: "available" },
  category: String,
  deleted: { type: Boolean, default: false },
  deletedAt: Date,
}, { timestamps: true });

// Auto status
productSchema.pre("save", function(next) {
  this.status = this.quantity > 0 ? "available" : "out of stock";
  next();
});

productSchema.pre("updateOne", function(next) {
  const update = this.getUpdate().$set || {};
  if (update.quantity !== undefined) update.status = update.quantity > 0 ? "available" : "out of stock";
  next();
});

module.exports = mongoose.model("Product", productSchema);
