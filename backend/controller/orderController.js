const Order = require("../model/orderModel");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { customer, email, phone, address, products, totalAmount } = req.body;

    if (!customer || !products || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = new Order({
      customer,
      email,
      phone,
      address,
      products,
      totalAmount,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err });
  }
};

// READ ORDERS
const readOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
};

// UPDATE PAYMENT
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating payment", error: err });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", error: err });
  }
};

module.exports = { createOrder, readOrders, updatePaymentStatus, deleteOrder };
