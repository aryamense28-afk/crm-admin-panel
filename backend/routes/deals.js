const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find({ createdBy: req.user.id })
      .populate('contact', 'firstName lastName email')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: deals.length,
      deals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const deal = await Deal.create(req.body);
    
    res.status(201).json({
      success: true,
      deal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
