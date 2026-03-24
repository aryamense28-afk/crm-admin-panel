const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Get all contacts
router.get("/", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

// Add contact
router.post("/", async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.status(201).json(contact);
});

// Update contact
router.put("/:id", async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(contact);
});

// Delete contact
router.delete("/:id", async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: "Contact deleted" });
});

module.exports = router;