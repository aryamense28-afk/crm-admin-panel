
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find({ createdBy: req.user.id })
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const lead = await Lead.create(req.body);
    
    res.status(201).json({
      success: true,
      lead
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
