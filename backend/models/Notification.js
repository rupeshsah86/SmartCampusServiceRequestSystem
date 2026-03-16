const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
  requestId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'ServiceRequests', key: 'id' } },
  type: {
    type: DataTypes.ENUM('status_update', 'assignment', 'resolution', 'feedback_request', 'resolution_pending', 'resolution_accepted', 'resolution_rejected'),
    allowNull: false
  },
  title: { type: DataTypes.STRING(100), allowNull: false },
  message: { type: DataTypes.STRING(200), allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

// Add _id alias so frontend code works without changes
Notification.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  return values;
};

module.exports = Notification;
