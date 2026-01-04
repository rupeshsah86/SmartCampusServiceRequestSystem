import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestAPI } from '../services/api';
import { formatDate, formatStatus, formatPriority, getStatusColor, getPriorityColor, handleApiError } from '../utils/helpers';
import '../styles/forms.css';

const RequestDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getById(id);
      setRequest(response.data.data);
      setError('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    
    try {
      await requestAPI.delete(id);
      navigate('/dashboard');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="container">
          <div className="text-center p-5">
            <div className="spinner"></div>
            <p>Loading request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-container">
        <div className="container">
          <div className="form-card">
            <div className="alert alert-error">
              {error}
            </div>
            <div className="text-center">
              <Link to="/dashboard" className="btn btn-primary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="form-container">
        <div className="container">
          <div className="form-card">
            <div className="text-center">
              <h2>Request Not Found</h2>
              <p>The requested service request could not be found.</p>
              <Link to="/dashboard" className="btn btn-primary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <div className="container">
          <h1>Request Details</h1>
          <div className="form-breadcrumb">
            <Link to="/dashboard">Dashboard</Link> / Request #{request.requestId}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="form-card">
          <div className="form-section">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="form-section-title">{request.title}</h2>
                <p className="text-muted">Request ID: {request.requestId}</p>
              </div>
              <div className="d-flex gap-2">
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

            <div className="row mb-4">
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                    {request.category.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                    📍 {request.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <div className="form-control form-textarea" style={{ backgroundColor: '#f8f9fa', minHeight: '120px' }}>
                {request.description}
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">Submitted By</label>
                  <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                    {request.userId.name} ({request.userId.email})
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                    {request.userId.department}
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">Created Date</label>
                  <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                    📅 {formatDate(request.createdAt)}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">Last Updated</label>
                  <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                    🔄 {formatDate(request.updatedAt)}
                  </div>
                </div>
              </div>
            </div>

            {request.assignedTo && (
              <div className="form-group">
                <label className="form-label">Assigned To</label>
                <div className="form-control" style={{ backgroundColor: '#e3f2fd' }}>
                  👤 {request.assignedTo}
                </div>
              </div>
            )}

            {request.adminRemarks && (
              <div className="form-group">
                <label className="form-label">Admin Remarks</label>
                <div className="form-control form-textarea" style={{ backgroundColor: '#fff3cd', minHeight: '80px' }}>
                  {request.adminRemarks}
                </div>
              </div>
            )}

            {request.resolutionNotes && (
              <div className="form-group">
                <label className="form-label">Resolution Notes</label>
                <div className="form-control form-textarea" style={{ backgroundColor: '#d4edda', minHeight: '80px' }}>
                  {request.resolutionNotes}
                </div>
              </div>
            )}

            {request.resolvedAt && (
              <div className="form-group">
                <label className="form-label">Resolved Date</label>
                <div className="form-control" style={{ backgroundColor: '#d4edda' }}>
                  ✅ {formatDate(request.resolvedAt)}
                </div>
              </div>
            )}

            {request.closedAt && (
              <div className="form-group">
                <label className="form-label">Closed Date</label>
                <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                  🔒 {formatDate(request.closedAt)}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <Link to="/dashboard" className="btn btn-secondary">
              Back to Dashboard
            </Link>
            
            {request.status === 'pending' && user?.role !== 'admin' && (
              <button
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete Request
              </button>
            )}

            {request.status === 'resolved' && (
              <Link
                to={`/feedback/${request._id}`}
                className="btn btn-success"
              >
                Provide Feedback
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;