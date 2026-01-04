const express = require('express');
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { notificationIdValidation } = require('../middleware/feedbackValidation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User notification routes
router.get('/', getUserNotifications);
router.put('/mark-all-read', markAllAsRead);
router.put('/:id/read', notificationIdValidation, markAsRead);
router.delete('/:id', notificationIdValidation, deleteNotification);

module.exports = router;