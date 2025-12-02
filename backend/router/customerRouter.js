// routes/customerRouter.js
const express = require("express");
const customerController = require("../controller/customerController");
const router = express.Router();

// CREATE customer
router.post("/create", customerController.createCustomer);

// LOGIN customer
router.post("/login", customerController.customerLogin);

// READ all customers (admin)
router.get("/read", customerController.readCustomer);

// DELETE customer
router.delete("/delete/:id", customerController.deleteCustomer);

module.exports = router;
