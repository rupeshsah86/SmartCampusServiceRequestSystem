const User = require('./User');
const ServiceRequest = require('./ServiceRequest');
const Notification = require('./Notification');
const Feedback = require('./Feedback');

// User → ServiceRequest (creator)
User.hasMany(ServiceRequest, { foreignKey: 'userId', as: 'requests' });
ServiceRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User → ServiceRequest (assigned technician)
User.hasMany(ServiceRequest, { foreignKey: 'assignedTo', as: 'assignedRequests' });
ServiceRequest.belongsTo(User, { foreignKey: 'assignedTo', as: 'technician' });

// User → Notification
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ServiceRequest → Notification
ServiceRequest.hasMany(Notification, { foreignKey: 'requestId', as: 'notifications' });
Notification.belongsTo(ServiceRequest, { foreignKey: 'requestId', as: 'request' });

// ServiceRequest → Feedback
ServiceRequest.hasOne(Feedback, { foreignKey: 'requestId', as: 'feedback' });
Feedback.belongsTo(ServiceRequest, { foreignKey: 'requestId', as: 'request' });

// User → Feedback
User.hasMany(Feedback, { foreignKey: 'userId', as: 'feedbacks' });
Feedback.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { User, ServiceRequest, Notification, Feedback };
