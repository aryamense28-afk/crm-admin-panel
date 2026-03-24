const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  address: { type: String },
  status: { 
    type: String, 
    enum: ['lead', 'active', 'inactive', 'lost'], 
    default: 'lead' 
  },
  source: { 
    type: String, 
    enum: ['website', 'referral', 'social', 'email', 'call', 'other'],
    default: 'other'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  lastContact: { type: Date },
  nextFollowUp: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);