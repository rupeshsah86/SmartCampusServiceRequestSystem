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
    enum: ['pending', 'in_progress', 'resolved', 'closed'],
    default: 'pending'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  assignedTo: {
    type: String,
    trim: true
  },
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
  }
}, {
  timestamps: true
});

// Index for better query performance
serviceRequestSchema.index({ userId: 1, status: 1 });
serviceRequestSchema.index({ status: 1, createdAt: -1 });
serviceRequestSchema.index({ category: 1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);