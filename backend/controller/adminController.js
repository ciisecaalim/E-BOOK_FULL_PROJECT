const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create default admin if none exists
const createDefaultAdmin = async () => {
  const exists = await Admin.findOne({ role: "admin" });
  if (!exists) {
    const hashed = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASS, 10);
    await Admin.create({
      name: "Default Admin",
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: hashed,
      role: "admin",
    });
    console.log("✅ Default admin created");
  }
};

// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const role = adminSecret === process.env.ADMIN_SECRET ? "admin" : "user";
    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, password: hashed, role });
    res.status(201).json({ user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, avatar: admin.avatar },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Get Admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne({ role: "admin" });
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Update Admin profile
const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, removeAvatar } = req.body;
    const admin = await Admin.findOne({ role: "admin" });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    if (req.file) admin.avatar = `/uploads/${req.file.filename}`;
    else if (removeAvatar === "true") admin.avatar = "";

    await admin.save();
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile", details: err.message });
  }
};

module.exports = { createAdmin, adminLogin, getAdminProfile, updateAdminProfile, createDefaultAdmin };
