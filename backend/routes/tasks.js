const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .sort('-dueDate');
    
    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    if (!req.body.assignedTo) {
      req.body.assignedTo = req.user.id;
    }
    
    const task = await Task.create(req.body);
    
    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
