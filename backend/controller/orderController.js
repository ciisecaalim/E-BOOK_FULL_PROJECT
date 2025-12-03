const Order = require("../model/orderModel");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { customer, email, phone, address, products, totalAmount } = req.body;
    if (!customer || !products || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new Order({ customer, email, phone, address, products, totalAmount });
    await newOrder.save();
    res.status(201).json({ success: true, message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error(err);
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

// UPDATE PAYMENT STATUS
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) return res.status(400).json({ success: false, message: "paymentStatus is required" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({ success: true, message: "Payment status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// TOTAL INCOME
const getTotalIncome = async (req, res) => {
  try {
    const income = await Order.aggregate([{ $group: { _id: null, totalIncome: { $sum: "$totalAmount" } } }]);
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

module.exports = {
  createOrder,
  readOrder,
  updatePaymentStatus,
  getTotalIncome,
  getTopCustomer
};
