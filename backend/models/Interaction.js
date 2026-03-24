const mongoose = require('mongoose');

const interactionSchema = mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['call', 'email', 'meeting', 'note', 'task', 'followup'], 
    required: true 
  },
  subject: { type: String, required: true },
  notes: { type: String },
  duration: { type: Number },
  outcome: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Interaction', interactionSchema);