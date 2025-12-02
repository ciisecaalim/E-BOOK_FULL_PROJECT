const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Ensure default user exists
const ensureDefaultUser = async () => {
  const existing = await User.findOne({ email: process.env.DEFAULT_USER_EMAIL });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_USER_PASSWORD, 10);
    await User.create({
      name: process.env.DEFAULT_USER_NAME,
      email: process.env.DEFAULT_USER_EMAIL,
      password: hashedPassword,
      role: "user",
      userName: `user_default_${Date.now()}`,
    });
    console.log("✅ Default user created");
  } else {
    console.log("ℹ️ Default user already exists");
  }
};

// Register user
const createUser = async (req, res) => {
  try {
    const { name, email, password, adminSecret, userName } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    let role = "user";
    if (adminSecret && adminSecret === process.env.ADMIN_SECRET) role = "admin";

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      userName: userName || `user_${Date.now()}`,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Login user
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = { ensureDefaultUser, createUser, userLogin };
