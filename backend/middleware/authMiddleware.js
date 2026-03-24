const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware - check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin - Admin access required' });
  }
};

// Manager middleware - check if user is manager or admin
const manager = (req, res, next) => {
  if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized - Manager or Admin access required' });
  }
};

// Optional auth - for public routes that optionally require auth
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token failed, but continue as unauthenticated
      req.user = null;
    }
  }
  next();
};

// Check if user owns resource or is admin
const checkOwnership = (resourceUserId) => {
  return (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user._id.toString() === resourceUserId.toString())) {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized to access this resource' });
    }
  };
};

module.exports = { 
  protect, 
  admin, 
  manager, 
  optionalAuth, 
  checkOwnership 
};