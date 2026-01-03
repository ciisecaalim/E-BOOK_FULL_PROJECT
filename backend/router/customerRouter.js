const express = require("express");
const customerController = require("../controller/customerController");
const router = express.Router();

router.post("/create", customerController.createCustomer);
router.post("/login", customerController.customerLogin);
router.get("/read", customerController.readCustomer);
router.get("/get/:email", customerController.getCustomerByEmail);
router.delete("/delete/:id", customerController.deleteCustomer);

module.exports = router;
