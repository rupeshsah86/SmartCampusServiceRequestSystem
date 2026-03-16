const { Op } = require('sequelize');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const { createNotification } = require('./notificationController');
const { generateRequestId, sendResponse, asyncHandler } = require('../utils/helpers');
const { sendEmail, emailTemplates } = require('../utils/emailService');
const { categorizeIssue, determinePriority } = require('../utils/aiCategorization');
const { validationResult } = require('express-validator');

const userAttrs = ['id', 'name', 'email', 'department'];

const createRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendResponse(res, 400, false, 'Validation failed', errors.array());

  const { title, description, category, priority, location } = req.body;
  const aiSuggestion = categorizeIssue(title, description);
  const aiPriority = determinePriority(title, description);

  const requestData = {
    requestId: generateRequestId(),
    userId: req.user.id,
    title, description,
    category: category || aiSuggestion.category,
    priority: priority || aiPriority,
    location,
    aiSuggestion: { category: aiSuggestion.category, confidence: aiSuggestion.confidence, priority: aiPriority },
    attachments: req.files ? req.files.map(f => ({ filename: f.filename, originalName: f.originalname, mimetype: f.mimetype, size: f.size, path: f.path })) : []
  };

  const serviceRequest = await ServiceRequest.create(requestData);
  const populated = await ServiceRequest.findByPk(serviceRequest.id, {
    include: [{ model: User, as: 'user', attributes: userAttrs }]
  });

  await sendEmail(populated.user.email, 'Service Request Created', emailTemplates.requestCreated(populated.user, populated));

  sendResponse(res, 201, true, 'Service request created successfully', { request: populated, aiSuggestion });
});

const getUserRequests = asyncHandler(async (req, res) => {
  const { status, category, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

  const where = { userId: req.user.id };
  if (status) where.status = status;
  if (category) where.category = category;
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { requestId: { [Op.iLike]: `%${search}%` } },
      { location: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;
  const { rows: requests, count: total } = await ServiceRequest.findAndCountAll({
    where,
    include: [{ model: User, as: 'user', attributes: userAttrs }],
    order: [[sortBy, sortOrder.toUpperCase()]],
    offset,
    limit: parseInt(limit)
  });

  sendResponse(res, 200, true, 'Requests retrieved successfully', {
    requests,
    pagination: { current: parseInt(page), total: Math.ceil(total / limit), count: requests.length, totalRequests: total }
  });
});

const getAllRequests = asyncHandler(async (req, res) => {
  const { status, category, priority, page = 1, limit = 10, search, assignedTo } = req.query;

  const where = {};
  if (req.user.role === 'technician') where.assignedTo = req.user.id;
  if (assignedTo) where.assignedTo = assignedTo;
  if (status) where.status = status;
  if (category) where.category = category;
  if (priority) where.priority = priority;
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { requestId: { [Op.iLike]: `%${search}%` } },
      { location: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;
  const { rows: requests, count: total } = await ServiceRequest.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: [...userAttrs, 'role'] },
      { model: User, as: 'technician', attributes: userAttrs }
    ],
    order: [['createdAt', 'DESC']],
    offset,
    limit: parseInt(limit)
  });

  sendResponse(res, 200, true, 'Requests retrieved successfully', {
    requests,
    pagination: { current: parseInt(page), total: Math.ceil(total / limit), count: requests.length, totalRequests: total }
  });
});

const getRequestById = asyncHandler(async (req, res) => {
  const request = await ServiceRequest.findByPk(req.params.id, {
    include: [
      { model: User, as: 'user', attributes: [...userAttrs, 'role', 'phone'] },
      { model: User, as: 'technician', attributes: userAttrs }
    ]
  });

  if (!request) return sendResponse(res, 404, false, 'Service request not found');
  if (req.user.role !== 'admin' && request.userId !== req.user.id) return sendResponse(res, 403, false, 'Access denied');

  sendResponse(res, 200, true, 'Request retrieved successfully', request);
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendResponse(res, 400, false, 'Validation failed', errors.array());

  const { status, adminRemarks, resolutionNotes, assignedTo, workNote } = req.body;

  const request = await ServiceRequest.findByPk(req.params.id);
  if (!request) return sendResponse(res, 404, false, 'Service request not found');

  if (req.user.role === 'technician') {
    if (!request.assignedTo || request.assignedTo !== req.user.id) return sendResponse(res, 403, false, 'You can only update requests assigned to you');
    if (assignedTo) return sendResponse(res, 403, false, 'Technicians cannot assign requests');
  }

  const validTransitions = {
    pending: ['in_progress', 'closed'],
    in_progress: ['resolved', 'pending'],
    resolved: ['closed', 'reopened'],
    reopened: ['in_progress'],
    closed: []
  };

  if (!validTransitions[request.status].includes(status)) return sendResponse(res, 400, false, `Cannot change status from ${request.status} to ${status}`);
  if (request.isLocked) return sendResponse(res, 400, false, 'Cannot modify closed ticket');

  const workNotes = request.workNotes || [];
  if (workNote && workNote.trim()) {
    workNotes.push({ note: workNote, addedBy: req.user.id, addedByName: req.user.name, addedAt: new Date() });
  }

  const proofOfWork = request.proofOfWork || [];
  if (req.files && req.files.length > 0) {
    req.files.forEach(f => proofOfWork.push({ filename: f.filename, originalName: f.originalname, mimetype: f.mimetype, size: f.size, path: f.path, uploadedBy: req.user.id, uploadedAt: new Date() }));
  }

  const activityLogs = request.activityLogs || [];
  activityLogs.push({
    action: `Status changed from ${request.status} to ${status}`,
    performedBy: req.user.id,
    performedByName: req.user.name,
    timestamp: new Date(),
    details: workNote || resolutionNotes || `Status updated by ${req.user.role}`
  });

  const updates = { status, workNotes, proofOfWork, activityLogs };
  if (adminRemarks) updates.adminRemarks = adminRemarks;
  if (resolutionNotes) updates.resolutionNotes = resolutionNotes;
  if (assignedTo && req.user.role === 'admin') updates.assignedTo = assignedTo;
  if (status === 'resolved') updates.resolvedAt = new Date();
  if (status === 'closed') updates.closedAt = new Date();
  if (status === 'reopened') { updates.reopenedCount = (request.reopenedCount || 0) + 1; updates.resolvedAt = null; }

  await request.update(updates);

  if (status === 'resolved') {
    await createNotification(request.userId, request.id, 'resolution_pending', 'Request Resolved - Please Confirm', `Your request "${request.title}" has been resolved. Please review and confirm.`, req);
  }

  const updated = await ServiceRequest.findByPk(request.id, {
    include: [
      { model: User, as: 'user', attributes: userAttrs },
      { model: User, as: 'technician', attributes: userAttrs }
    ]
  });

  sendResponse(res, 200, true, 'Request status updated successfully', updated);
});

const deleteRequest = asyncHandler(async (req, res) => {
  const request = await ServiceRequest.findByPk(req.params.id);
  if (!request) return sendResponse(res, 404, false, 'Service request not found');
  if (request.status !== 'pending') return sendResponse(res, 400, false, 'Only pending requests can be deleted');
  if (req.user.role !== 'admin' && request.userId !== req.user.id) return sendResponse(res, 403, false, 'Access denied');

  await request.destroy();
  sendResponse(res, 200, true, 'Service request deleted successfully');
});

const confirmResolution = asyncHandler(async (req, res) => {
  const { action } = req.body;

  const request = await ServiceRequest.findByPk(req.params.id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'technician', attributes: ['id', 'name', 'email'] }
    ]
  });

  if (!request) return sendResponse(res, 404, false, 'Service request not found');
  if (request.userId !== req.user.id) return sendResponse(res, 403, false, 'Only request creator can confirm resolution');
  if (request.status !== 'resolved') return sendResponse(res, 400, false, 'Request must be in resolved status');

  const activityLogs = request.activityLogs || [];

  if (action === 'accept') {
    const resolutionTime = request.resolvedAt && request.createdAt
      ? Math.round((new Date(request.resolvedAt) - new Date(request.createdAt)) / (1000 * 60))
      : null;

    activityLogs.push({ action: 'Resolution Accepted', performedBy: req.user.id, performedByName: req.user.name, timestamp: new Date(), details: 'User confirmed resolution and closed ticket' });

    await request.update({ status: 'closed', closedAt: new Date(), isLocked: true, resolutionTime, activityLogs });

    if (request.assignedTo) {
      await createNotification(request.assignedTo, request.id, 'resolution_accepted', 'Resolution Accepted', `User accepted your resolution for "${request.title}"`, req);
    }

    const updated = await ServiceRequest.findByPk(request.id);
    return sendResponse(res, 200, true, 'Resolution accepted. Ticket closed successfully', updated);

  } else if (action === 'reject') {
    activityLogs.push({ action: 'Resolution Rejected', performedBy: req.user.id, performedByName: req.user.name, timestamp: new Date(), details: 'User rejected resolution and reopened ticket' });

    await request.update({ status: 'reopened', reopenedCount: (request.reopenedCount || 0) + 1, resolvedAt: null, activityLogs });

    if (request.assignedTo) {
      await createNotification(request.assignedTo, request.id, 'resolution_rejected', 'Resolution Rejected - Ticket Reopened', `User rejected your resolution for "${request.title}". Please review.`, req);
    }

    const updated = await ServiceRequest.findByPk(request.id);
    return sendResponse(res, 200, true, 'Resolution rejected. Ticket reopened', updated);

  } else {
    return sendResponse(res, 400, false, 'Invalid action. Use "accept" or "reject"');
  }
});

module.exports = { createRequest, getUserRequests, getAllRequests, getRequestById, updateRequestStatus, deleteRequest, confirmResolution };
