const express = require('express');
const {
  submitFeedback,
  getFeedbackByRequest,
  getAllFeedback,
  getFeedbackStats,
  getPublicFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');
const { submitFeedbackValidation } = require('../middleware/feedbackValidation');

const router = express.Router();

// Public route - no authentication required
router.get('/public', getPublicFeedback);

// All routes below require authentication
router.use(protect);

// User routes
router.post('/:requestId', submitFeedbackValidation, submitFeedback);

// Admin routes
router.get('/', authorize('admin'), getAllFeedback);
router.get('/stats', authorize('admin'), getFeedbackStats);
router.get('/:requestId/details', authorize('admin'), getFeedbackByRequest);

module.exports = router;