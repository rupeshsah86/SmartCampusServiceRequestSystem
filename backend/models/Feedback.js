const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  requestId: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: 'ServiceRequests', key: 'id' } },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comments: { type: DataTypes.STRING(300) },
  serviceQuality: { type: DataTypes.INTEGER, allowNull: false },
  responseTime: { type: DataTypes.INTEGER, allowNull: false },
  overallSatisfaction: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true });

// Add _id alias so frontend code works without changes
Feedback.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  return values;
};

module.exports = Feedback;
