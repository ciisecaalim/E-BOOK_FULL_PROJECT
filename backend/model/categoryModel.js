// categoryModel.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false }, // ✅ soft delete flag
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
