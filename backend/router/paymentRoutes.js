const express = require("express");
const { stripeCheckout } = require("../controller/paymentController");
const router = express.Router();

router.post("/stripe", stripeCheckout);

module.exports = router;
