const Notification = require('../models/Notification');
const ServiceRequest = require('../models/ServiceRequest');
const { sendResponse, asyncHandler } = require('../utils/helpers');
const { emitNotification } = require('../utils/socketHelper');
const { Op } = require('sequelize');

const createNotification = async (userId, requestId, type, title, message, req = null) => {
  try {
    const notification = await Notification.create({ userId, requestId, type, title, message });

    if (req) {
      emitNotification(req, userId, {
        id: notification.id,
        type, title, message,
        createdAt: notification.createdAt
      });
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const getUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isRead } = req.query;
  const where = { userId: req.user.id };
  if (isRead !== undefined) where.isRead = isRead === 'true';

  const offset = (page - 1) * limit;

  const { rows: notifications, count: total } = await Notification.findAndCountAll({
    where,
    include: [{ model: ServiceRequest, as: 'request', attributes: ['title', 'requestId'] }],
    order: [['createdAt', 'DESC']],
    offset,
    limit: parseInt(limit)
  });

  const unreadCount = await Notification.count({ where: { userId: req.user.id, isRead: false } });

  sendResponse(res, 200, true, 'Notifications retrieved successfully', {
    notifications,
    unreadCount,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      count: notifications.length,
      totalNotifications: total
    }
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);
  if (!notification) return sendResponse(res, 404, false, 'Notification not found');
  if (notification.userId !== req.user.id) return sendResponse(res, 403, false, 'Access denied');

  await notification.update({ isRead: true });
  sendResponse(res, 200, true, 'Notification marked as read');
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
  sendResponse(res, 200, true, 'All notifications marked as read');
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);
  if (!notification) return sendResponse(res, 404, false, 'Notification not found');
  if (notification.userId !== req.user.id) return sendResponse(res, 403, false, 'Access denied');

  await notification.destroy();
  sendResponse(res, 200, true, 'Notification deleted successfully');
});

module.exports = { createNotification, getUserNotifications, markAsRead, markAllAsRead, deleteNotification };
