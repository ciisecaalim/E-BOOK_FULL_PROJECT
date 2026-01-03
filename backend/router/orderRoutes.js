const express = require("express");
const { createOrder, readOrders, updatePaymentStatus, deleteOrder } = require("../controller/orderController");
const router = express.Router();

router.post("/create", createOrder);
router.get("/read", readOrders);
router.put("/update-payment/:id", updatePaymentStatus);
router.delete("/delete/:id", deleteOrder);

module.exports = router;
