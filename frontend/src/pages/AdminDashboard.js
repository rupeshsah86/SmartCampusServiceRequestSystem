import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, requestAPI } from '../services/api';
import { formatDate, formatStatus, formatPriority, getStatusColor, getPriorityColor, handleApiError } from '../utils/helpers';
import '../styles/admin.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchDashboardStats();
    } else if (activeTab === 'requests') {
      fetchRequests();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filters]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
      setError('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getAllRequests(filters);
      setRequests(response.data.data.requests);
      setError('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(filters);
      setUsers(response.data.data.users);
      setError('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await requestAPI.updateStatus(requestId, { status: newStatus });
      fetchRequests(); // Refresh the list
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleBulkUpdate = async (updates) => {
    if (selectedRequests.length === 0) return;
    
    try {
      await adminAPI.bulkUpdate({
        requestIds: selectedRequests,
        updates
      });
      setSelectedRequests([]);
      fetchRequests();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleRequestSelect = (requestId) => {
    setSelectedRequests(prev => 
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === requests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests.map(r => r._id));
    }
  };

  const renderOverview = () => (
    <div className="tab-content">
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner"></div>
          <p>Loading dashboard statistics...</p>
        </div>
      ) : stats ? (
        <>
          <div className="analytics-grid">
            <div className="analytics-card requests">
              <div className="analytics-header">
                <h3 className="analytics-title">Total Requests</h3>
                <div className="analytics-icon" style={{ backgroundColor: '#007bff' }}>📋</div>
              </div>
              <div className="analytics-value">{stats.overview.totalRequests}</div>
            </div>

            <div className="analytics-card users">
              <div className="analytics-header">
                <h3 className="analytics-title">Active Users</h3>
                <div className="analytics-icon" style={{ backgroundColor: '#28a745' }}>👥</div>
              </div>
              <div className="analytics-value">{stats.overview.totalUsers}</div>
            </div>

            <div className="analytics-card resolution">
              <div className="analytics-header">
                <h3 className="analytics-title">Avg Resolution Time</h3>
                <div className="analytics-icon" style={{ backgroundColor: '#ffc107' }}>⏱️</div>
              </div>
              <div className="analytics-value">{stats.overview.avgResolutionTime.toFixed(1)} days</div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="chart-container">
                <div className="chart-header">
                  <h3 className="chart-title">Status Distribution</h3>
                </div>
                <div className="p-3">
                  {stats.statusDistribution.map(item => (
                    <div key={item._id} className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge" style={{ backgroundColor: getStatusColor(item._id), color: 'white' }}>
                        {formatStatus(item._id)}
                      </span>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="chart-container">
                <div className="chart-header">
                  <h3 className="chart-title">Category Distribution</h3>
                </div>
                <div className="p-3">
                  {stats.categoryDistribution.map(item => (
                    <div key={item._id} className="d-flex justify-content-between align-items-center mb-2">
                      <span>{item._id.replace('_', ' ').toUpperCase()}</span>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );

  const renderRequests = () => (
    <div className="tab-content">
      <div className="admin-filters">
        <div className="filters-header">
          <h3 className="filters-title">Filter Requests</h3>
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              className="filter-input"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
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
              className="filter-input"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              <option value="maintenance">Maintenance</option>
              <option value="it_support">IT Support</option>
              <option value="facilities">Facilities</option>
              <option value="security">Security</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Priority</label>
            <select
              className="filter-input"
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {selectedRequests.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-header">
            <h3 className="bulk-title">Bulk Actions</h3>
            <span className="selected-count">{selectedRequests.length} selected</span>
          </div>
          <div className="bulk-controls">
            <select
              className="bulk-select"
              onChange={(e) => e.target.value && handleBulkUpdate({ status: e.target.value })}
              defaultValue=""
            >
              <option value="">Update Status</option>
              <option value="in_progress">Mark In Progress</option>
              <option value="resolved">Mark Resolved</option>
              <option value="closed">Mark Closed</option>
            </select>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedRequests([])}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      <div className="requests-table">
        <div className="table-header">
          <h3 className="table-title">Service Requests</h3>
        </div>
        
        {loading ? (
          <div className="text-center p-5">
            <div className="spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    checked={selectedRequests.length === requests.length && requests.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Request ID</th>
                <th>Title</th>
                <th>User</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request._id}>
                  <td>
                    <input
                      type="checkbox"
                      className="table-checkbox"
                      checked={selectedRequests.includes(request._id)}
                      onChange={() => handleRequestSelect(request._id)}
                    />
                  </td>
                  <td>
                    <span className="request-id">{request.requestId}</span>
                  </td>
                  <td>{request.title}</td>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-name">{request.userId.name}</div>
                      <div className="user-email">{request.userId.email}</div>
                      <div className="user-dept">{request.userId.department}</div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{ backgroundColor: getStatusColor(request.status), color: 'white' }}
                    >
                      {formatStatus(request.status)}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{ backgroundColor: getPriorityColor(request.priority), color: 'white' }}
                    >
                      {formatPriority(request.priority)}
                    </span>
                  </td>
                  <td>{request.category.replace('_', ' ')}</td>
                  <td>{formatDate(request.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view">View</button>
                      <select
                        className="action-btn edit"
                        value={request.status}
                        onChange={(e) => handleStatusUpdate(request._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="tab-content">
      <div className="requests-table">
        <div className="table-header">
          <h3 className="table-title">User Management</h3>
        </div>
        
        {loading ? (
          <div className="text-center p-5">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Requests</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge badge-primary">
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{user.department}</td>
                  <td>{user.requestCount}</td>
                  <td>
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <div className="admin-nav">
            <h1 className="admin-title">Admin Dashboard</h1>
            <div className="dashboard-user">
              <div className="user-info">
                <p className="user-name">{user?.name}</p>
                <p className="user-role">Administrator</p>
              </div>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          {error && (
            <div className="alert alert-error mb-4">
              {error}
            </div>
          )}

          <div className="admin-tabs">
            <div className="tab-nav">
              <button
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📊 Overview
              </button>
              <button
                className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('requests')}
              >
                📋 Requests
              </button>
              <button
                className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                👥 Users
              </button>
            </div>

            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'requests' && renderRequests()}
            {activeTab === 'users' && renderUsers()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;