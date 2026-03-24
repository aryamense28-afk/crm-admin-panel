
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({ createdBy: req.user.id })
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create contact
router.post('/', async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const contact = await Contact.create(req.body);
    
    res.status(201).json({
      success: true,
      contact
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
