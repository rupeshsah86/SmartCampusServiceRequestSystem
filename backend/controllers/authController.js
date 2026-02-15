const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { sendResponse, asyncHandler } = require('../utils/helpers');
const { validationResult } = require('express-validator');

// Register user
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, false, 'Validation failed', errors.array());
  }

  const { name, email, password, role, department, phone, studentId, employeeId } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendResponse(res, 400, false, 'User already exists with this email');
  }

  // Create user
  const userData = { name, email, password, role, department, phone };
  if (role === 'student' && studentId) userData.studentId = studentId;
  if ((role === 'faculty' || role === 'technician') && employeeId) userData.employeeId = employeeId;

  const user = await User.create(userData);
  const token = generateToken(user._id);

  sendResponse(res, 201, true, 'User registered successfully', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    },
    token
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, false, 'Validation failed', errors.array());
  }

  const { email, password } = req.body;

  // Check if user exists and is active
  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    return sendResponse(res, 401, false, 'Invalid credentials');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return sendResponse(res, 401, false, 'Invalid credentials');
  }

  const token = generateToken(user._id);

  sendResponse(res, 200, true, 'Login successful', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    },
    token
  });
});

// Get current user profile
const getProfile = asyncHandler(async (req, res) => {
  sendResponse(res, 200, true, 'Profile retrieved successfully', {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      department: req.user.department,
      phone: req.user.phone,
      studentId: req.user.studentId,
      employeeId: req.user.employeeId
    }
  });
});

module.exports = { register, login, getProfile };