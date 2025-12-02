const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  prImg: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "out of stock"],
    default: "available"
  },
  category: { type: String, required: true },
  deleted: { type: Boolean, default: false }, // soft delete flag
  deletedAt: { type: Date } // optional: track deletion date
});

// Middleware: update status based on quantity
productSchema.pre("save", function(next){
  this.status = this.quantity > 0 ? "available" : "out of stock";
  next();
});

productSchema.pre("updateOne", function(next) {
  const update = this.getUpdate();
  const quantity = update.$set?.quantity;

  if (quantity !== undefined) {
    update.$set.status = quantity > 0 ? "available" : "out of stock";
    this.setUpdate(update);
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
