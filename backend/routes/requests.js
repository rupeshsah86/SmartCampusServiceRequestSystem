const express = require('express');
const {
  createRequest,
  getUserRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
  confirmResolution
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createRequestValidation,
  updateStatusValidation,
  requestIdValidation
} = require('../middleware/requestValidation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes (students, faculty, admin)
router.post('/', upload.array('attachments', 5), createRequestValidation, createRequest);
router.get('/my-requests', getUserRequests);
router.get('/:id', requestIdValidation, getRequestById);
router.delete('/:id', requestIdValidation, deleteRequest);
router.put('/:id/confirm', requestIdValidation, confirmResolution); // User confirms resolution

// Admin and Technician routes
router.get('/', authorize('admin', 'technician'), getAllRequests);
router.put('/:id/status', authorize('admin', 'technician'), upload.array('proofOfWork', 3), updateStatusValidation, updateRequestStatus);

module.exports = router;