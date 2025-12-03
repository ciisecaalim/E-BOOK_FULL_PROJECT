const express = require("express");
const { createOrder, readOrder, updatePaymentStatus, getTotalIncome, getTopCustomer } = require("../controller/orderController");

const router = express.Router();

router.post("/create", createOrder);
router.get("/read", readOrder);
router.put("/update-payment/:id", updatePaymentStatus);
router.get("/getIncome", getTotalIncome);
router.get("/getTopCustomer", getTopCustomer);

module.exports = router;
