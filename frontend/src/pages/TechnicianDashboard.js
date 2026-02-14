import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestAPI } from '../services/api';
import { formatDate, formatStatus, getStatusColor, formatPriority, getPriorityColor, formatCategory } from '../utils/helpers';
import Loading from '../components/Loading';
import '../styles/dashboard.css';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    resolutionNotes: ''
  });

  useEffect(() => {
    fetchAssignedRequests();
  }, [filter]);

  const fetchAssignedRequests = useCallback(async () => {
    try {
      setLoading(true);
      const params = { assignedTo: user.id };
      if (filter !== 'all') params.status = filter;
      
      const response = await requestAPI.getAllRequests(params);
      const requestsData = response.data.data.requests || [];
      
      setRequests(requestsData);
      calculateStats(requestsData);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id, filter]);

  const calculateStats = (requestsData) => {
    const stats = {
      total: requestsData.length,
      pending: requestsData.filter(r => r.status === 'pending').length,
      inProgress: requestsData.filter(r => r.status === 'in_progress').length,
      resolved: requestsData.filter(r => r.status === 'resolved').length
    };
    setStats(stats);
  };

  const handleUpdateRequest = async () => {
    try {
      await requestAPI.updateStatus(selectedRequest._id, updateData);
      setUpdateModal(false);
      setSelectedRequest(null);
      setUpdateData({ status: '', resolutionNotes: '' });
      fetchAssignedRequests();
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const openUpdateModal = (request) => {
    setSelectedRequest(request);
    setUpdateData({
      status: request.status,
      resolutionNotes: request.resolutionNotes || ''
    });
    setUpdateModal(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Technician Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Assigned</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="requests-section">
        <h2>My Assigned Requests</h2>
        {requests.length === 0 ? (
          <div className="empty-state">
            <p>No requests assigned to you yet.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div className="request-id">#{request.requestId}</div>
                  <div className="request-status">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {formatStatus(request.status)}
                    </span>
                  </div>
                </div>
                
                <h3 className="request-title">{request.title}</h3>
                <p className="request-description">{request.description}</p>
                
                <div className="request-meta">
                  <div className="meta-item">
                    <strong>Category:</strong> {formatCategory(request.category)}
                  </div>
                  <div className="meta-item">
                    <strong>Priority:</strong> 
                    <span 
                      className="priority-badge"
                      style={{ color: getPriorityColor(request.priority) }}
                    >
                      {formatPriority(request.priority)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <strong>Location:</strong> {request.location}
                  </div>
                  <div className="meta-item">
                    <strong>Created:</strong> {formatDate(request.createdAt)}
                  </div>
                </div>

                <div className="request-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => openUpdateModal(request)}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {updateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Request Status</h3>
              <button 
                className="modal-close"
                onClick={() => setUpdateModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Status</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                  className="form-control"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Resolution Notes</label>
                <textarea
                  value={updateData.resolutionNotes}
                  onChange={(e) => setUpdateData({...updateData, resolutionNotes: e.target.value})}
                  className="form-control"
                  rows="4"
                  placeholder="Add notes about the resolution..."
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setUpdateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUpdateRequest}
              >
                Update Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;