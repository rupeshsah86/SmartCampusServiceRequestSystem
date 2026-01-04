const express = require('express');
const {
  createRequest,
  getUserRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');
const {
  createRequestValidation,
  updateStatusValidation,
  requestIdValidation
} = require('../middleware/requestValidation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes (students, faculty, admin)
router.post('/', createRequestValidation, createRequest);
router.get('/my-requests', getUserRequests);
router.get('/:id', requestIdValidation, getRequestById);
router.delete('/:id', requestIdValidation, deleteRequest);

// Admin only routes
router.get('/', authorize('admin'), getAllRequests);
router.put('/:id/status', authorize('admin'), updateStatusValidation, updateRequestStatus);

module.exports = router;