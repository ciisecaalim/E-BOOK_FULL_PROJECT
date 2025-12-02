const express = require("express");
const { createOrder, readOrder, getTotalIncome, getTopCustomer } = require("../controller/orderController");

const router = express.Router();

router.post("/create", createOrder);
router.get("/read", readOrder);
router.get("/getIncome", getTotalIncome);
router.get("/getTopCustomer", getTopCustomer);

module.exports = router;
