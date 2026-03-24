
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please add last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number']
  },
  company: String,
  source: {
    type: String,
    enum: ['website', 'referral', 'social', 'email', 'call', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
    default: 'new'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: [{
    note: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  nextFollowUp: Date,
  convertedToContact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  }
}, {
  timestamps: true
});

