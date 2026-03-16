const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { sendResponse, asyncHandler } = require('../utils/helpers');
const { validationResult } = require('express-validator');

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendResponse(res, 400, false, 'Validation failed', errors.array());

  const { name, email, password, role, department, phone, studentId, employeeId } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return sendResponse(res, 400, false, 'User already exists with this email');

  const userData = { name, email, password, role, department, phone };
  if (role === 'student' && studentId) userData.studentId = studentId;
  if ((role === 'faculty' || role === 'technician') && employeeId) userData.employeeId = employeeId;

  const user = await User.create(userData);
  const token = generateToken(user.id);

  sendResponse(res, 201, true, 'User registered successfully', {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
    token
  });
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendResponse(res, 400, false, 'Validation failed', errors.array());

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, isActive: true } });
  if (!user) return sendResponse(res, 401, false, 'Invalid credentials');

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) return sendResponse(res, 401, false, 'Invalid credentials');

  const token = generateToken(user.id);

  sendResponse(res, 200, true, 'Login successful', {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
    token
  });
});

const getProfile = asyncHandler(async (req, res) => {
  sendResponse(res, 200, true, 'Profile retrieved successfully', {
    user: {
      id: req.user.id,
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

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, department } = req.body;

  const user = await User.findByPk(req.user.id);
  if (!user) return sendResponse(res, 404, false, 'User not found');

  if (email !== user.email) {
    const existing = await User.findOne({ where: { email } });
    if (existing) return sendResponse(res, 400, false, 'Email already in use');
  }

  await user.update({
    name: name || user.name,
    email: email || user.email,
    phone: phone || user.phone,
    department: department || user.department
  });

  sendResponse(res, 200, true, 'Profile updated successfully', {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, phone: user.phone }
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user.id);
  if (!user) return sendResponse(res, 404, false, 'User not found');

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) return sendResponse(res, 401, false, 'Current password is incorrect');

  await user.update({ password: newPassword });

  sendResponse(res, 200, true, 'Password changed successfully');
});

module.exports = { register, login, getProfile, updateProfile, changePassword };
