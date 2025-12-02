const express = require("express");
const { createUser, userLogin } = require("../controller/useControll");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", userLogin);

module.exports = router;
