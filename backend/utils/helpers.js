// Generate unique request ID
const generateRequestId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 9000) + 1000; // 4-digit random
  return `REQ${timestamp}${random}`;
};

// Format response
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  generateRequestId,
  sendResponse,
  asyncHandler
};