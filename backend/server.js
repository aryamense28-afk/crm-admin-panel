// server.js - Main Backend Server File
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================
// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static('uploads'));

// ==================== DATABASE CONNECTION ====================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// ==================== MODELS ====================
// User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

// Ticket Model
const TicketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  title: { type: String, required: true },
  customer: {
    name: String,
    email: String,
    phone: String,
    company: String
  },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'IN PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  category: String,
  description: String,
  assignedTo: {
    name: String,
    team: String
  },
  comments: [{
    user: String,
    text: String,
    date: Date
  }],
  timeSpent: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  dueDate: Date,
  tags: [String]
});

// Contact Model
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  company: String,
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

// Deal Model
const DealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: Number,
  stage: { type: String, enum: ['Lead', 'Contact Made', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'], default: 'Lead' },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  expectedCloseDate: Date,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Ticket = mongoose.model('Ticket', TicketSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Deal = mongoose.model('Deal', DealSchema);

// ==================== API ROUTES ====================

// Health Check / Status Route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'CRM API is running successfully',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root API route
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to CRM API',
    version: '1.0.0',
    endpoints: {
      status: 'GET /api/status',
      dashboard: 'GET /api/dashboard',
      tickets: 'GET /api/tickets',
      contacts: 'GET /api/contacts',
      deals: 'GET /api/deals',
      users: 'GET /api/users',
      analytics: 'GET /api/analytics'
    },
    documentation: '/api/docs'
  });
});

// Dashboard Stats API
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const totalDeals = await Deal.countDocuments();
    const totalRevenue = await Deal.aggregate([
      { $match: { stage: 'Closed Won' } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);
    
    const dealsByStage = await Deal.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$value' } } }
    ]);
    
    const recentActivities = await Ticket.find()
      .sort({ date: -1 })
      .limit(5)
      .populate('customer');
    
    res.json({
      success: true,
      data: {
        totalContacts,
        totalDeals,
        totalRevenue: totalRevenue[0]?.total || 0,
        dealsByStage,
        recentActivities
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tickets API
app.get('/api/tickets', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    const tickets = await Ticket.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Ticket.countDocuments(query);
    
    res.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create Ticket
app.post('/api/tickets', async (req, res) => {
  try {
    const ticketCount = await Ticket.countDocuments();
    const ticketId = `TKT-${String(ticketCount + 1).padStart(4, '0')}`;
    
    const ticket = new Ticket({
      ...req.body,
      ticketId,
      date: new Date(),
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days SLA
    });
    
    await ticket.save();
    
    res.json({
      success: true,
      data: ticket,
      message: 'Ticket created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Ticket
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    
    res.json({
      success: true,
      data: ticket,
      message: 'Ticket updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Ticket
app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    
    res.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Contacts API
app.get('/api/contacts', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create Contact
app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    
    res.json({
      success: true,
      data: contact,
      message: 'Contact created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deals API
app.get('/api/deals', async (req, res) => {
  try {
    const deals = await Deal.find().populate('contactId');
    
    res.json({
      success: true,
      data: deals
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Deal Stage
app.put('/api/deals/:id/stage', async (req, res) => {
  try {
    const { stage } = req.body;
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { stage },
      { new: true }
    );
    
    res.json({
      success: true,
      data: deal,
      message: 'Deal stage updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics API
app.get('/api/analytics', async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'OPEN' });
    const highPriorityTickets = await Ticket.countDocuments({ priority: 'HIGH' });
    
    const avgResolutionTime = await Ticket.aggregate([
      { $match: { status: { $in: ['RESOLVED', 'CLOSED'] } } },
      { $group: { _id: null, avg: { $avg: '$timeSpent' } } }
    ]);
    
    const ticketsByCategory = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalTickets,
        openTickets,
        highPriorityTickets,
        avgResolutionTime: avgResolutionTime[0]?.avg || 0,
        ticketsByCategory
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User Authentication (Simple version)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Demo authentication - replace with actual auth logic
    const user = await User.findOne({ email });
    
    if (!user) {
      // Demo user for testing
      const demoUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@crm.com',
        role: 'admin'
      };
      
      return res.json({
        success: true,
        data: demoUser,
        token: 'demo-token-12345',
        message: 'Login successful'
      });
    }
    
    res.json({
      success: true,
      data: user,
      token: 'jwt-token-here'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ERROR HANDLING ====================
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
      🚀 Server is running!
      📡 API URL: http://localhost:${PORT}/api
      ✅ Status: http://localhost:${PORT}/api/status
      🌍 Environment: ${process.env.NODE_ENV || 'development'}
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();

module.exports = app;