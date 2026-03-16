const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ServiceRequest = sequelize.define('ServiceRequest', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  requestId: { type: DataTypes.STRING, unique: true, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
  title: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.ENUM('maintenance', 'it_support', 'facilities', 'security', 'other'), allowNull: false },
  priority: { type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'), defaultValue: 'medium' },
  status: { type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'closed', 'reopened'), defaultValue: 'pending' },
  location: { type: DataTypes.STRING(100), allowNull: false },
  attachments: { type: DataTypes.JSONB, defaultValue: [] },
  aiSuggestion: { type: DataTypes.JSONB, defaultValue: {} },
  urgencyLevel: { type: DataTypes.ENUM('normal', 'urgent', 'emergency'), defaultValue: 'normal' },
  assignedTo: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'id' } },
  workNotes: { type: DataTypes.JSONB, defaultValue: [] },
  proofOfWork: { type: DataTypes.JSONB, defaultValue: [] },
  adminRemarks: { type: DataTypes.STRING(300) },
  resolutionNotes: { type: DataTypes.TEXT },
  resolvedAt: { type: DataTypes.DATE },
  closedAt: { type: DataTypes.DATE },
  resolutionTime: { type: DataTypes.INTEGER }, // in minutes
  reopenedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  activityLogs: { type: DataTypes.JSONB, defaultValue: [] },
  isLocked: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

module.exports = ServiceRequest;
