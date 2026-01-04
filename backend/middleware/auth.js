const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResponse } = require('../utils/helpers');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendResponse(res, 401, false, 'Access denied. No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return sendResponse(res, 401, false, 'Invalid token or user not found');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Invalid token');
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, 403, false, 'Access denied. Insufficient permissions');
    }
    next();
  };
};

module.exports = { generateToken, protect, authorize };