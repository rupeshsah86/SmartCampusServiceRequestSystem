const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'faculty', 'admin', 'technician'), defaultValue: 'student' },
  department: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING(10), allowNull: false },
  profilePicture: { type: DataTypes.STRING, defaultValue: '' },
  lastLogin: { type: DataTypes.DATE },
  studentId: { type: DataTypes.STRING },
  employeeId: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

// Hash password before save
User.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
