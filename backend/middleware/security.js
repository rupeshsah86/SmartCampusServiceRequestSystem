const xss = require('xss');

// Sanitize input data
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') req.body[key] = xss(req.body[key].trim());
    });
  }
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') req.query[key] = xss(req.query[key].trim());
    });
  }
  next();
};

// Dummy mongoSanitize for compatibility (no-op since we use PostgreSQL)
const mongoSanitize = () => (req, res, next) => next();

// Rate limiting configuration
const createRateLimit = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = {
  sanitizeInput,
  createRateLimit,
  mongoSanitize
};