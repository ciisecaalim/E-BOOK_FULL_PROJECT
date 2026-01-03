const Customer = require("../model/cutomerModel");
const bcrypt = require("bcryptjs");

// CREATE CUSTOMER
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    const exists = await Customer.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const customer = new Customer({
      name,
      email,
      phone,
      address,
      password: hashed,
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN
const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ error: "Invalid email" });

    const match = await bcrypt.compare(password, customer.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    res.status(200).json({ message: "Login successful", customer });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// READ ALL
const readCustomer = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password");
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET BY EMAIL
const getCustomerByEmail = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.params.email }).select("-password");

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE CUSTOMER
const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createCustomer,
  customerLogin,
  readCustomer,
  getCustomerByEmail,
  deleteCustomer,
};
