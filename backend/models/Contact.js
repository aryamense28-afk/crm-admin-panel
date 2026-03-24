
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
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
    lowercase: true,
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number']
  },
  company: String,
  position: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'lead'],
    default: 'active'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social', 'email', 'call', 'converted_lead'],
    default: 'other'
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
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  notes: String,
  birthday: Date
}, {
  timestamps: true
});

