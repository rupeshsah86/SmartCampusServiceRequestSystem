const { Op, fn, col, literal } = require('sequelize');
const { sequelize } = require('../config/database');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const { statsCache, getPagination } = require('../utils/performance');
const { sendResponse, asyncHandler } = require('../utils/helpers');

const getDashboardStats = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const cacheKey = `dashboard_stats_${period}`;

  const cachedStats = statsCache.get(cacheKey);
  if (cachedStats) return sendResponse(res, 200, true, 'Dashboard statistics retrieved successfully (cached)', cachedStats);

  // Status counts
  const statusCounts = await ServiceRequest.findAll({
    attributes: ['status', [fn('COUNT', col('id')), 'count']],
    group: ['status'],
    raw: true
  });
  const statusMap = {};
  statusCounts.forEach(s => { statusMap[s.status] = parseInt(s.count); });

  // Category breakdown
  const categoryCounts = await ServiceRequest.findAll({
    attributes: ['category', [fn('COUNT', col('id')), 'count']],
    group: ['category'],
    raw: true
  });
  const categoryBreakdown = {};
  categoryCounts.forEach(s => { categoryBreakdown[s.category] = parseInt(s.count); });

  // Priority breakdown
  const priorityCounts = await ServiceRequest.findAll({
    attributes: ['priority', [fn('COUNT', col('id')), 'count']],
    group: ['priority'],
    raw: true
  });
  const priorityBreakdown = {};
  priorityCounts.forEach(s => { priorityBreakdown[s.priority] = parseInt(s.count); });

  // 30-day trend
  const trendStats = await ServiceRequest.findAll({
    attributes: [
      [fn('DATE', col('createdAt')), 'date'],
      [fn('COUNT', col('id')), 'count'],
      [fn('SUM', literal(`CASE WHEN status = 'resolved' THEN 1 ELSE 0 END`)), 'resolved'],
      [fn('SUM', literal(`CASE WHEN status = 'pending' THEN 1 ELSE 0 END`)), 'pending']
    ],
    where: { createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    group: [fn('DATE', col('createdAt'))],
    order: [[fn('DATE', col('createdAt')), 'ASC']],
    raw: true
  });

  const totalRequests = await ServiceRequest.count();
  const totalUsers = await User.count({ where: { isActive: true } });
  const totalTechnicians = await User.count({ where: { role: 'technician', isActive: true } });

  const avgResolutionResult = await ServiceRequest.findOne({
    attributes: [[fn('AVG', col('resolutionTime')), 'avgTime']],
    where: { resolutionTime: { [Op.ne]: null } },
    raw: true
  });
  const avgResolutionTime = parseFloat(avgResolutionResult?.avgTime || 0);

  const dashboardData = {
    overview: {
      totalRequests,
      pendingRequests: statusMap.pending || 0,
      inProgressRequests: statusMap.in_progress || 0,
      resolvedRequests: statusMap.resolved || 0,
      closedRequests: statusMap.closed || 0,
      reopenedRequests: statusMap.reopened || 0,
      totalUsers,
      totalTechnicians,
      avgResolutionTime
    },
    categoryBreakdown,
    priorityBreakdown,
    trends: {
      daily: trendStats.map(s => ({ date: s.date, count: parseInt(s.count), resolved: parseInt(s.resolved), pending: parseInt(s.pending) }))
    }
  };

  statsCache.set(cacheKey, dashboardData);
  sendResponse(res, 200, true, 'Dashboard statistics retrieved successfully', dashboardData);
});

const getFilteredRequests = asyncHandler(async (req, res) => {
  const { status, category, priority, assignedTo, dateFrom, dateTo, department, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const { page, limit, skip: offset } = getPagination(req.query.page, req.query.limit);

  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (priority) where.priority = priority;
  if (assignedTo) where.assignedTo = assignedTo;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt[Op.gte] = new Date(dateFrom);
    if (dateTo) where.createdAt[Op.lte] = new Date(dateTo);
  }

  const userWhere = department ? { department: { [Op.iLike]: `%${department}%` } } : {};

  const { rows: requests, count: total } = await ServiceRequest.findAndCountAll({
    where,
    include: [{ model: User, as: 'user', attributes: ['name', 'email', 'department', 'role', 'phone'], where: userWhere }],
    order: [[sortBy, sortOrder.toUpperCase()]],
    offset,
    limit
  });

  sendResponse(res, 200, true, 'Filtered requests retrieved successfully', {
    requests,
    pagination: { current: page, total: Math.ceil(total / limit), count: requests.length, totalRequests: total },
    filters: { status, category, priority, assignedTo, dateFrom, dateTo, department }
  });
});

const bulkUpdateRequests = asyncHandler(async (req, res) => {
  const { requestIds, updates } = req.body;

  if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) return sendResponse(res, 400, false, 'Request IDs array is required');
  if (!updates || Object.keys(updates).length === 0) return sendResponse(res, 400, false, 'Updates object is required');

  const allowedFields = ['status', 'priority', 'assignedTo', 'adminRemarks'];
  const invalidFields = Object.keys(updates).filter(f => !allowedFields.includes(f));
  if (invalidFields.length > 0) return sendResponse(res, 400, false, `Invalid update fields: ${invalidFields.join(', ')}`);

  const updateData = { ...updates };
  if (updates.status === 'resolved') updateData.resolvedAt = new Date();
  if (updates.status === 'closed') updateData.closedAt = new Date();

  const [modifiedCount] = await ServiceRequest.update(updateData, { where: { id: { [Op.in]: requestIds } } });

  sendResponse(res, 200, true, `${modifiedCount} requests updated successfully`, { modifiedCount });
});

const getUserManagement = asyncHandler(async (req, res) => {
  const { role, department, isActive, page = 1, limit = 10 } = req.query;
  const where = {};
  if (role) where.role = role;
  if (department) where.department = { [Op.iLike]: `%${department}%` };
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const offset = (page - 1) * limit;
  const { rows: users, count: total } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
    offset,
    limit: parseInt(limit)
  });

  const usersWithStats = await Promise.all(users.map(async (user) => {
    const requestCount = await ServiceRequest.count({ where: { userId: user.id } });
    return { ...user.toJSON(), requestCount };
  }));

  sendResponse(res, 200, true, 'Users retrieved successfully', {
    users: usersWithStats,
    pagination: { current: parseInt(page), total: Math.ceil(total / limit), count: users.length, totalUsers: total }
  });
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.userId);
  if (!user) return sendResponse(res, 404, false, 'User not found');

  await user.update({ isActive: !user.isActive });
  sendResponse(res, 200, true, `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, {
    user: { id: user.id, name: user.name, email: user.email, isActive: user.isActive }
  });
});

const getTechnicians = asyncHandler(async (req, res) => {
  const technicians = await User.findAll({
    where: { role: 'technician', isActive: true },
    attributes: ['id', 'name', 'email', 'department']
  });
  sendResponse(res, 200, true, 'Technicians retrieved successfully', { technicians });
});

const getTechnicianPerformance = asyncHandler(async (req, res) => {
  const technicians = await User.findAll({
    where: { role: 'technician', isActive: true },
    attributes: ['id', 'name', 'email', 'department']
  });

  const performanceData = await Promise.all(technicians.map(async (tech) => {
    const totalResolved = await ServiceRequest.count({ where: { assignedTo: tech.id, status: { [Op.in]: ['resolved', 'closed'] } } });
    const reopenedCount = await ServiceRequest.count({ where: { assignedTo: tech.id, reopenedCount: { [Op.gt]: 0 } } });
    const avgResult = await ServiceRequest.findOne({
      attributes: [[fn('AVG', col('resolutionTime')), 'avgTime']],
      where: { assignedTo: tech.id, resolutionTime: { [Op.ne]: null } },
      raw: true
    });

    return {
      technician: { id: tech.id, name: tech.name, email: tech.email, department: tech.department },
      stats: {
        totalResolved,
        reopenedCount,
        avgResolutionTime: parseFloat(avgResult?.avgTime || 0).toFixed(2),
        successRate: totalResolved > 0 ? ((totalResolved - reopenedCount) / totalResolved * 100).toFixed(2) : 0
      }
    };
  }));

  sendResponse(res, 200, true, 'Technician performance retrieved successfully', { performanceData });
});

module.exports = { getDashboardStats, getFilteredRequests, bulkUpdateRequests, getUserManagement, toggleUserStatus, getTechnicians, getTechnicianPerformance };
