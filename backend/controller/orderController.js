const Order = require("../model/orderModel");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    console.log("Incoming order:", req.body);
    const { customer, products, totalAmount } = req.body;

    if (!customer || !products || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new Order({ customer, products, totalAmount });
    await newOrder.save();

    res.status(201).json({ success: true, message: "Order created successfully" });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// READ ALL ORDERS
const readOrder = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// TOTAL INCOME
const getTotalIncome = async (req, res) => {
  try {
    const income = await Order.aggregate([
      { $group: { _id: null, totalIncome: { $sum: "$totalAmount" } } }
    ]);
    res.status(200).json({ success: true, totalIncome: income[0]?.totalIncome || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// TOP CUSTOMERS
const getTopCustomer = async (req, res) => {
  try {
    const top = await Order.aggregate([
      { $group: { _id: "$customer", totalSpent: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);
    res.status(200).json({ success: true, topCustomers: top });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createOrder, readOrder, getTotalIncome, getTopCustomer };
