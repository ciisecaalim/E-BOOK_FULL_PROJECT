// controller/customerController.js
const customerModel = require("../model/cutomerModel");
const bcrypt = require("bcryptjs");

// Create Customer
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const checkEmail = await customerModel.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newCustomer = new customerModel({
      name,
      email,
      phone,
      address,
      password: hashPassword,
    });

    const savedCustomer = await newCustomer.save();
    return res.status(201).json(savedCustomer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Login
const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingCustomer = await customerModel.findOne({ email });
    if (!existingCustomer) return res.status(400).json({ error: "Invalid email" });

    const validPass = await bcrypt.compare(password, existingCustomer.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      customer: existingCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Read
const readCustomer = async (req, res) => {
  try {
    const customers = await customerModel.find().select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete
const deleteCustomer = async (req, res) => {
  try {
    await customerModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createCustomer, customerLogin, readCustomer, deleteCustomer };
