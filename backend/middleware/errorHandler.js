const { sendResponse } = require('../utils/helpers');

// Global error handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return sendResponse(res, 404, false, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return sendResponse(res, 400, false, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return sendResponse(res, 400, false, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return sendResponse(res, 401, false, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return sendResponse(res, 401, false, message);
  }

  // Default error
  sendResponse(res, error.statusCode || 500, false, 
    error.message || 'Server Error',
    process.env.NODE_ENV === 'development' ? error.stack : null
  );
};

// 404 handler
const notFound = (req, res, next) => {
  sendResponse(res, 404, false, `Route ${req.originalUrl} not found`);
};

module.exports = {
  errorHandler,
  notFound
};