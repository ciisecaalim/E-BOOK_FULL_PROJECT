const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: "unread" },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }, // Soft delete
});

module.exports = mongoose.model("Contact", contactSchema);
