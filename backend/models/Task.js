
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add task title'],
    trim: true
  },
  description: String,
  type: {
    type: String,
    enum: ['call', 'email', 'meeting', 'followup', 'task', 'other'],
    default: 'task'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add due date']
  },
  completedDate: Date,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedTo: {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    deal: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

