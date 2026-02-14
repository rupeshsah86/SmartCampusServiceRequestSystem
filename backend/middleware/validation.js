const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .isIn(['student', 'faculty', 'admin', 'technician'])
    .withMessage('Role must be student, faculty, admin, or technician'),
  
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required'),
  
  body('phone')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be 10 digits')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = { registerValidation, loginValidation };