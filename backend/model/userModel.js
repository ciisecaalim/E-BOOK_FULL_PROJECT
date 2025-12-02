const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  userName: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
