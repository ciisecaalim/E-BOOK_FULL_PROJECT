const Contact = require("../model/Contact");

// Create new contact
const submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newContact = new Contact({ firstName, lastName, email, subject, message });
    await newContact.save();
    res.status(201).json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all non-deleted contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Soft delete contact (Recycle Bin)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndUpdate(id, { deletedAt: new Date() });
    res.json({ message: "Moved to Recycle Bin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle read/unread status
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    contact.status = contact.status === "unread" ? "read" : "unread";
    await contact.save();
    res.json({ message: "Status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Recycle Bin contacts
const getRecycleBin = async (req, res) => {
  try {
    const contacts = await Contact.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Restore contact from Recycle Bin
const restoreContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndUpdate(id, { deletedAt: null });
    res.json({ message: "Restored successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitContact,
  getContacts,
  deleteContact,
  toggleStatus,
  getRecycleBin,
  restoreContact,
};
