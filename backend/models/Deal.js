
const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add deal name'],
    trim: true
  },
  value: {
    type: Number,
    required: [true, 'Please add deal value'],
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  stage: {
    type: String,
    enum: ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
    default: 'lead'
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  },
  expectedCloseDate: Date,
  actualCloseDate: Date,
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String,
  tags: [String]
}, {
  timestamps: true
});

