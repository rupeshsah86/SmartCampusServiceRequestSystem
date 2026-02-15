const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['maintenance', 'it_support', 'facilities', 'security', 'other']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed', 'reopened'],
    default: 'pending'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  aiSuggestion: {
    category: String,
    confidence: Number,
    priority: String
  },
  urgencyLevel: {
    type: String,
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  workNotes: [{
    note: { type: String, required: true, maxlength: 500 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  proofOfWork: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  adminRemarks: {
    type: String,
    trim: true,
    maxlength: [300, 'Admin remarks cannot exceed 300 characters']
  },
  resolutionNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Resolution notes cannot exceed 500 characters']
  },
  resolvedAt: {
    type: Date
  },
  closedAt: {
    type: Date
  },
  resolutionTime: {
    type: Number // in minutes
  },
  reopenedCount: {
    type: Number,
    default: 0
  },
  activityLogs: [{
    action: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    details: String
  }],
  isLocked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
serviceRequestSchema.index({ userId: 1, status: 1 });
serviceRequestSchema.index({ assignedTo: 1, status: 1 });
serviceRequestSchema.index({ status: 1, createdAt: -1 });
serviceRequestSchema.index({ category: 1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);