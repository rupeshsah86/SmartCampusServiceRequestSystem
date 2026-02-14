const ServiceRequest = require('../models/ServiceRequest');
const { createNotification } = require('./notificationController');
const { generateRequestId, sendResponse, asyncHandler } = require('../utils/helpers');
const { sendEmail, emailTemplates } = require('../utils/emailService');
const { categorizeIssue, determinePriority } = require('../utils/aiCategorization');
const { validationResult } = require('express-validator');

// Create service request
const createRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, false, 'Validation failed', errors.array());
  }

  const { title, description, category, priority, location } = req.body;

  // AI-based categorization
  const aiSuggestion = categorizeIssue(title, description);
  const aiPriority = determinePriority(title, description);

  const requestData = {
    requestId: generateRequestId(),
    userId: req.user._id,
    title,
    description,
    category: category || aiSuggestion.category,
    priority: priority || aiPriority,
    location,
    aiSuggestion: {
      category: aiSuggestion.category,
      confidence: aiSuggestion.confidence,
      priority: aiPriority
    }
  };

  // Handle file uploads
  if (req.files && req.files.length > 0) {
    requestData.attachments = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    }));
  }

  const serviceRequest = await ServiceRequest.create(requestData);
  await serviceRequest.populate('userId', 'name email department');

  // Send email notification
  await sendEmail(
    serviceRequest.userId.email,
    'Service Request Created',
    emailTemplates.requestCreated(serviceRequest.userId, serviceRequest)
  );

  sendResponse(res, 201, true, 'Service request created successfully', {
    request: serviceRequest,
    aiSuggestion: aiSuggestion
  });
});

// Get user's service requests
const getUserRequests = asyncHandler(async (req, res) => {
  const { status, category, page = 1, limit = 10 } = req.query;
  
  const filter = { userId: req.user._id };
  if (status) filter.status = status;
  if (category) filter.category = category;

  const skip = (page - 1) * limit;
  
  const requests = await ServiceRequest.find(filter)
    .populate('userId', 'name email department')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await ServiceRequest.countDocuments(filter);

  sendResponse(res, 200, true, 'Requests retrieved successfully', {
    requests,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      count: requests.length,
      totalRequests: total
    }
  });
});

// Get all service requests (Admin only)
const getAllRequests = asyncHandler(async (req, res) => {
  const { status, category, priority, page = 1, limit = 10, search } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { requestId: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  
  const requests = await ServiceRequest.find(filter)
    .populate('userId', 'name email department role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await ServiceRequest.countDocuments(filter);

  sendResponse(res, 200, true, 'All requests retrieved successfully', {
    requests,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      count: requests.length,
      totalRequests: total
    }
  });
});

// Get single service request
const getRequestById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, false, 'Invalid request ID');
  }

  const request = await ServiceRequest.findById(req.params.id)
    .populate('userId', 'name email department role phone');

  if (!request) {
    return sendResponse(res, 404, false, 'Service request not found');
  }

  // Check if user can access this request
  if (req.user.role !== 'admin' && request.userId._id.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Access denied');
  }

  sendResponse(res, 200, true, 'Request retrieved successfully', request);
});

// Update service request status (Admin only)
const updateRequestStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, false, 'Validation failed', errors.array());
  }

  const { status, adminRemarks, resolutionNotes, assignedTo } = req.body;

  const request = await ServiceRequest.findById(req.params.id);
  if (!request) {
    return sendResponse(res, 404, false, 'Service request not found');
  }

  // Validate status transition
  const validTransitions = {
    pending: ['in_progress', 'closed'],
    in_progress: ['resolved', 'pending'],
    resolved: ['closed', 'in_progress'],
    closed: []
  };

  if (!validTransitions[request.status].includes(status)) {
    return sendResponse(res, 400, false, `Cannot change status from ${request.status} to ${status}`);
  }

  // Update request
  request.status = status;
  if (adminRemarks) request.adminRemarks = adminRemarks;
  if (resolutionNotes) request.resolutionNotes = resolutionNotes;
  if (assignedTo) request.assignedTo = assignedTo;

  // Set timestamps
  if (status === 'resolved') {
    request.resolvedAt = new Date();
    // Create notification for feedback request
    await createNotification(
      request.userId,
      request._id,
      'feedback_request',
      'Request Resolved - Feedback Requested',
      `Your request "${request.title}" has been resolved. Please provide feedback.`
    );
  }
  if (status === 'closed') request.closedAt = new Date();

  // Create notification for status update
  if (request.status !== status) {
    await createNotification(
      request.userId,
      request._id,
      'status_update',
      'Request Status Updated',
      `Your request "${request.title}" status changed to ${status.replace('_', ' ')}.`
    );
  }

  await request.save();
  await request.populate('userId', 'name email department');

  sendResponse(res, 200, true, 'Request status updated successfully', request);
});

// Delete service request
const deleteRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, false, 'Invalid request ID');
  }

  const request = await ServiceRequest.findById(req.params.id);
  if (!request) {
    return sendResponse(res, 404, false, 'Service request not found');
  }

  // Only allow deletion of pending requests by the creator or admin
  if (request.status !== 'pending') {
    return sendResponse(res, 400, false, 'Only pending requests can be deleted');
  }

  if (req.user.role !== 'admin' && request.userId.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Access denied');
  }

  await ServiceRequest.findByIdAndDelete(req.params.id);
  sendResponse(res, 200, true, 'Service request deleted successfully');
});

module.exports = {
  createRequest,
  getUserRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest
};