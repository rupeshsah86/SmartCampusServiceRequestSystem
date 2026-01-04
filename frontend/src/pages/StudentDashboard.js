import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestAPI } from '../services/api';
import { formatDate, formatStatus, formatPriority, getStatusColor, getPriorityColor, handleApiError } from '../utils/helpers';
import '../styles/dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    page: 1,
    limit: 10
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });

  useEffect(() => {
    fetchRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getMyRequests(filters);
      const { requests: requestsData, pagination } = response.data.data;
      
      setRequests(requestsData);
      
      // Calculate stats
      const newStats = {
        total: pagination.totalRequests,
        pending: requestsData.filter(r => r.status === 'pending').length,
        inProgress: requestsData.filter(r => r.status === 'in_progress').length,
        resolved: requestsData.filter(r => r.status === 'resolved').length,
        closed: requestsData.filter(r => r.status === 'closed').length
      };
      setStats(newStats);
      
      setError('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRequestClick = (requestId) => {
    navigate(`/request/${requestId}`);
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    
    try {
      await requestAPI.delete(requestId);
      fetchRequests(); // Refresh the list
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-nav">
            <h1 className="dashboard-title">Smart Campus System</h1>
            <div className="dashboard-user">
              <div className="user-info">
                <p className="user-name">{user?.name}</p>
                <p className="user-role">{user?.department} • {user?.role}</p>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {/* Stats Section */}
          <div className="dashboard-stats">
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-header">
                  <span className="stat-title">Total Requests</span>
                  <div className="stat-icon primary">📋</div>
                </div>
                <p className="stat-value">{stats.total}</p>
              </div>
              
              <div className="stat-card warning">
                <div className="stat-header">
                  <span className="stat-title">Pending</span>
                  <div className="stat-icon warning">⏳</div>
                </div>
                <p className="stat-value">{stats.pending}</p>
              </div>
              
              <div className="stat-card primary">
                <div className="stat-header">
                  <span className="stat-title">In Progress</span>
                  <div className="stat-icon primary">🔄</div>
                </div>
                <p className="stat-value">{stats.inProgress}</p>
              </div>
              
              <div className="stat-card success">
                <div className="stat-header">
                  <span className="stat-title">Resolved</span>
                  <div className="stat-icon success">✅</div>
                </div>
                <p className="stat-value">{stats.resolved}</p>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="dashboard-actions">
            <div className="action-buttons">
              <Link to="/create-request" className="action-btn btn-primary">
                ➕ New Request
              </Link>
            </div>
          </div>

          {/* Requests Section */}
          <div className="requests-section">
            <div className="section-header">
              <h2 className="section-title">My Service Requests</h2>
              <div className="filters">
                <div className="filter-group">
                  <label className="filter-label">Status</label>
                  <select
                    className="filter-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Category</label>
                  <select
                    className="filter-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="it_support">IT Support</option>
                    <option value="facilities">Facilities</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="requests-list">
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner"></div>
                  Loading requests...
                </div>
              ) : requests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <h3>No requests found</h3>
                  <p>You haven't submitted any service requests yet.</p>
                  <Link to="/create-request" className="btn btn-primary mt-3">
                    Create Your First Request
                  </Link>
                </div>
              ) : (
                requests.map((request) => (
                  <div
                    key={request._id}
                    className="request-item"
                    onClick={() => handleRequestClick(request._id)}
                  >
                    <div className="request-header">
                      <h3 className="request-title">{request.title}</h3>
                      <div className="request-meta">
                        <span
                          className="badge"
                          style={{ backgroundColor: getStatusColor(request.status), color: 'white' }}
                        >
                          {formatStatus(request.status)}
                        </span>
                        <span
                          className="badge"
                          style={{ backgroundColor: getPriorityColor(request.priority), color: 'white' }}
                        >
                          {formatPriority(request.priority)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="request-body">
                      <p className="request-description">
                        {request.description.length > 150
                          ? `${request.description.substring(0, 150)}...`
                          : request.description
                        }
                      </p>
                      
                      <div className="request-details">
                        <span>📍 {request.location}</span>
                        <span>🏷️ {request.category.replace('_', ' ')}</span>
                        <span>📅 {formatDate(request.createdAt)}</span>
                        <span>🆔 {request.requestId}</span>
                      </div>
                    </div>
                    
                    <div className="request-footer">
                      <div className="request-actions">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRequestClick(request._id);
                          }}
                        >
                          View Details
                        </button>
                        {request.status === 'pending' && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRequest(request._id);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      
                      {request.assignedTo && (
                        <div className="text-sm text-muted">
                          Assigned to: {request.assignedTo}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;