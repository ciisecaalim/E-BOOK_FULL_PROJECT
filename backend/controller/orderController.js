const Order = require("../model/orderModel");

/* ================= CREATE ORDER ================= */
const createOrder = async (req, res) => {
  try {
    const { customer, email, phone, address, products, totalAmount } = req.body;

    if (!customer || !email || !products || !totalAmount) {
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
    res.status(500).json({ message: "Error creating order" });
  }
};

/* ================= READ ALL (ADMIN) ================= */
const readOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

/* ================= USER ORDER HISTORY ================= */
const readUserOrders = async (req, res) => {
  const orders = await Order.find({ email: req.params.email })
    .sort({ createdAt: -1 });
  res.json(orders);
};

/* ================= UPDATE PAYMENT ================= */
const updatePaymentStatus = async (req, res) => {
  const { paymentStatus, paymentMethod } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      paymentStatus,
      paymentMethod,
      status: paymentStatus === "Paid" ? "Completed" : "Processing",
    },
    { new: true }
  );

  res.json(order);
};

/* ================= DELETE ================= */
const deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted" });
};

module.exports = {
  createOrder,
  readOrders,
  readUserOrders,
  updatePaymentStatus,
  deleteOrder,
};
