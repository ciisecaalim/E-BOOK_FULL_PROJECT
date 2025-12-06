const express = require("express");
const {
  submitContact,
  getContacts,
  deleteContact,
  toggleStatus,
  getRecycleBin,
  restoreContact,
} = require("../controller/contactController");

const router = express.Router();

// Normal CRUD
router.post("/", submitContact);
router.get("/all", getContacts);
router.delete("/:id", deleteContact);
router.put("/status/:id", toggleStatus);

// Recycle Bin
router.get("/recyclebin", getRecycleBin);
router.put("/restore/:id", restoreContact);

module.exports = router;
