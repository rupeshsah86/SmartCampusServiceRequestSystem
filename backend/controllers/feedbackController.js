const { Op, fn, col, literal } = require('sequelize');
const Feedback = require('../models/Feedback');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const { sendResponse, asyncHandler } = require('../utils/helpers');
const { validationResult } = require('express-validator');

const submitFeedback = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendResponse(res, 400, false, 'Validation failed', errors.array());

  const { requestId } = req.params;
  const { rating, comments, serviceQuality, responseTime, overallSatisfaction } = req.body;

  const request = await ServiceRequest.findByPk(requestId);
  if (!request) return sendResponse(res, 404, false, 'Service request not found');
  if (request.status !== 'resolved') return sendResponse(res, 400, false, 'Feedback can only be submitted for resolved requests');
  if (request.userId !== req.user.id) return sendResponse(res, 403, false, 'You can only provide feedback for your own requests');

  const existing = await Feedback.findOne({ where: { requestId } });
  if (existing) return sendResponse(res, 400, false, 'Feedback has already been submitted for this request');

  const feedback = await Feedback.create({ requestId, userId: req.user.id, rating, comments, serviceQuality, responseTime, overallSatisfaction });

  const populated = await Feedback.findByPk(feedback.id, {
    include: [
      { model: ServiceRequest, as: 'request', attributes: ['title', 'requestId', 'assignedTo'] },
      { model: User, as: 'user', attributes: ['name', 'email'] }
    ]
  });

  sendResponse(res, 201, true, 'Feedback submitted successfully', populated);
});

const getFeedbackByRequest = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findOne({
    where: { requestId: req.params.requestId },
    include: [
      { model: User, as: 'user', attributes: ['name', 'email', 'department'] },
      { model: ServiceRequest, as: 'request', attributes: ['title', 'requestId'] }
    ]
  });

  if (!feedback) return sendResponse(res, 404, false, 'No feedback found for this request');
  sendResponse(res, 200, true, 'Feedback retrieved successfully', feedback);
});

const getAllFeedback = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, rating } = req.query;
  const where = {};
  if (rating) where.rating = parseInt(rating);

  const offset = (page - 1) * limit;
  const { rows: feedback, count: total } = await Feedback.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['name', 'email', 'department'] },
      { model: ServiceRequest, as: 'request', attributes: ['title', 'requestId', 'category'] }
    ],
    order: [['createdAt', 'DESC']],
    offset,
    limit: parseInt(limit)
  });

  sendResponse(res, 200, true, 'Feedback retrieved successfully', {
    feedback,
    pagination: { current: parseInt(page), total: Math.ceil(total / limit), count: feedback.length, totalFeedback: total }
  });
});

const getFeedbackStats = asyncHandler(async (req, res) => {
  const { sequelize } = require('../config/database');
  const stats = await Feedback.findOne({
    attributes: [
      [fn('COUNT', col('id')), 'totalFeedback'],
      [fn('AVG', col('rating')), 'avgRating'],
      [fn('AVG', col('serviceQuality')), 'avgServiceQuality'],
      [fn('AVG', col('responseTime')), 'avgResponseTime'],
      [fn('AVG', col('overallSatisfaction')), 'avgSatisfaction']
    ],
    raw: true
  });

  const ratingDistribution = await Feedback.findAll({
    attributes: ['rating', [fn('COUNT', col('id')), 'count']],
    group: ['rating'],
    order: [['rating', 'ASC']],
    raw: true
  });

  sendResponse(res, 200, true, 'Feedback statistics retrieved successfully', {
    overview: stats || { totalFeedback: 0, avgRating: 0, avgServiceQuality: 0, avgResponseTime: 0, avgSatisfaction: 0 },
    ratingDistribution
  });
});

const getPublicFeedback = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  const feedback = await Feedback.findAll({
    where: { rating: { [Op.gte]: 4 } },
    include: [
      { model: User, as: 'user', attributes: ['name', 'department'] },
      { model: ServiceRequest, as: 'request', attributes: ['category'] }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit)
  });

  sendResponse(res, 200, true, 'Public feedback retrieved successfully', feedback);
});

module.exports = { submitFeedback, getFeedbackByRequest, getAllFeedback, getFeedbackStats, getPublicFeedback };
