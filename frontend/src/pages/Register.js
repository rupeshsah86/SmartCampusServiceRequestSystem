import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleApiError, validateEmail, validatePhone } from '../utils/helpers';
import '../styles/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    phone: '',
    studentId: '',
    employeeId: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role,
      studentId: '',
      employeeId: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (formData.role === 'student' && !formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }

    if ((formData.role === 'faculty' || formData.role === 'technician') && !formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: handleApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Smart Campus System</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="alert alert-error">
              {errors.submit}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Account Type</label>
            <div className="role-selector">
              <div
                className={`role-option ${formData.role === 'student' ? 'active' : ''}`}
                onClick={() => handleRoleChange('student')}
              >
                <input type="radio" name="role" value="student" checked={formData.role === 'student'} readOnly />
                Student
              </div>
              <div
                className={`role-option ${formData.role === 'faculty' ? 'active' : ''}`}
                onClick={() => handleRoleChange('faculty')}
              >
                <input type="radio" name="role" value="faculty" checked={formData.role === 'faculty'} readOnly />
                Faculty
              </div>
              <div
                className={`role-option ${formData.role === 'technician' ? 'active' : ''}`}
                onClick={() => handleRoleChange('technician')}
              >
                <input type="radio" name="role" value="technician" checked={formData.role === 'technician'} readOnly />
                Technician
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label required">Email Address</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label required">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              disabled={loading}
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label required">Department</label>
            <input
              type="text"
              name="department"
              className={`form-control ${errors.department ? 'error' : ''}`}
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter your department"
              disabled={loading}
            />
            {errors.department && <div className="form-error">{errors.department}</div>}
          </div>

          <div className="form-group">
            <label className="form-label required">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className={`form-control ${errors.phone ? 'error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              disabled={loading}
              maxLength="10"
            />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>

          {formData.role === 'student' && (
            <div className="form-group">
              <label className="form-label required">Student ID</label>
              <input
                type="text"
                name="studentId"
                className={`form-control ${errors.studentId ? 'error' : ''}`}
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter your student ID"
                disabled={loading}
              />
              {errors.studentId && <div className="form-error">{errors.studentId}</div>}
            </div>
          )}

          {(formData.role === 'faculty' || formData.role === 'technician') && (
            <div className="form-group">
              <label className="form-label required">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                className={`form-control ${errors.employeeId ? 'error' : ''}`}
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="Enter your employee ID"
                disabled={loading}
              />
              {errors.employeeId && <div className="form-error">{errors.employeeId}</div>}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;