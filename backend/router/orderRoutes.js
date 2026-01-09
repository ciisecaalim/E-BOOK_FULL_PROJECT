const express = require("express");
const router = express.Router();
const {
  createOrder,
  readOrders,
  readUserOrders,
  updatePaymentStatus,
  deleteOrder,
} = require("../controller/orderController");

router.post("/create", createOrder);
router.get("/read", readOrders);

// USER HISTORY
router.get("/user/:email", readUserOrders);

// PAYMENT UPDATE
router.put("/update-payment/:id", updatePaymentStatus);

// DELETE
router.delete("/delete/:id", deleteOrder);

module.exports = router;
