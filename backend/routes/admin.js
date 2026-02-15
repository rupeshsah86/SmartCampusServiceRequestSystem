const express = require('express');
const {
  getDashboardStats,
  getFilteredRequests,
  bulkUpdateRequests,
  getUserManagement,
  toggleUserStatus,
  getTechnicians,
  getTechnicianPerformance
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const {
  bulkUpdateValidation,
  userIdValidation,
  dateRangeValidation
} = require('../middleware/adminValidation');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard and analytics
router.get('/dashboard/stats', getDashboardStats);
router.get('/requests/filtered', dateRangeValidation, getFilteredRequests);

// Bulk operations
router.put('/requests/bulk-update', bulkUpdateValidation, bulkUpdateRequests);

// User management
router.get('/users', getUserManagement);
router.put('/users/:userId/toggle-status', userIdValidation, toggleUserStatus);
router.get('/technicians', getTechnicians);
router.get('/technicians/performance', getTechnicianPerformance);

module.exports = router;