const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ createdBy: req.user.id })
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: companies.length,
      companies
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const company = await Company.create(req.body);
    
    res.status(201).json({
      success: true,
      company
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
