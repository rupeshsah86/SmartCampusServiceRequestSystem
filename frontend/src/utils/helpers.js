// Format date for display
export const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format status for display
export const formatStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    reopened: 'Reopened',
  };
  return statusMap[status] || status;
};

// Get status color
export const getStatusColor = (status) => {
  const colorMap = {
    pending: '#ffc107',
    in_progress: '#17a2b8',
    resolved: '#28a745',
    closed: '#6c757d',
    reopened: '#dc3545',
  };
  return colorMap[status] || '#6c757d';
};

// Format priority
export const formatPriority = (priority) => {
  const priorityMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };
  return priorityMap[priority] || priority;
};

// Get priority color
export const getPriorityColor = (priority) => {
  const colorMap = {
    low: '#28a745',
    medium: '#ffc107',
    high: '#fd7e14',
    urgent: '#dc3545',
  };
  return colorMap[priority] || '#6c757d';
};

// Format category
export const formatCategory = (category) => {
  const categoryMap = {
    maintenance: 'Maintenance',
    it_support: 'IT Support',
    facilities: 'Facilities',
    security: 'Security',
    other: 'Other',
  };
  return categoryMap[category] || category;
};

// Validate form data
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

// Handle API errors
export const handleApiError = (error) => {
  // Network errors (backend not running)
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Cannot connect to server. Please ensure the backend is running.';
  }
  
  // Server response errors
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Validation errors
  if (error.response?.data?.data && Array.isArray(error.response.data.data)) {
    return error.response.data.data.map(err => err.msg).join(', ');
  }
  
  // Generic error
  return error.message || 'An unexpected error occurred';
};

// Format resolution time
export const formatResolutionTime = (minutes) => {
  if (!minutes) return 'N/A';
  if (minutes < 60) return `${Math.round(minutes)} mins`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} hours`;
  return `${Math.round(minutes / 1440)} days`;
};