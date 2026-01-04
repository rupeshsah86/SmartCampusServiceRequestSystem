const { body, param } = require('express-validator');

const submitFeedbackValidation = [
  param('requestId')
    .isMongoId()
    .withMessage('Invalid request ID'),

  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Overall rating must be between 1 and 5'),

  body('serviceQuality')
    .isInt({ min: 1, max: 5 })
    .withMessage('Service quality rating must be between 1 and 5'),

  body('responseTime')
    .isInt({ min: 1, max: 5 })
    .withMessage('Response time rating must be between 1 and 5'),

  body('overallSatisfaction')
    .isInt({ min: 1, max: 5 })
    .withMessage('Overall satisfaction rating must be between 1 and 5'),

  body('comments')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Comments cannot exceed 300 characters')
];

const notificationIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid notification ID')
];

module.exports = {
  submitFeedbackValidation,
  notificationIdValidation
};