const { body, param, query } = require('express-validator');

const bulkUpdateValidation = [
  body('requestIds')
    .isArray({ min: 1 })
    .withMessage('Request IDs must be a non-empty array'),
  
  body('requestIds.*')
    .isMongoId()
    .withMessage('Invalid request ID format'),
  
  body('updates')
    .isObject()
    .withMessage('Updates must be an object'),
  
  body('updates.status')
    .optional()
    .isIn(['pending', 'in_progress', 'resolved', 'closed'])
    .withMessage('Invalid status'),
  
  body('updates.priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  
  body('updates.assignedTo')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assigned to cannot exceed 100 characters'),
  
  body('updates.adminRemarks')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Admin remarks cannot exceed 300 characters')
];

const userIdValidation = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID')
];

const dateRangeValidation = [
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for dateFrom'),
  
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for dateTo')
];

module.exports = {
  bulkUpdateValidation,
  userIdValidation,
  dateRangeValidation
};