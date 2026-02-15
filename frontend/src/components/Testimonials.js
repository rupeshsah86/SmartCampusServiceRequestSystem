import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/api';
import '../styles/testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await feedbackAPI.getPublicFeedback(6);
      setTestimonials(response.data.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  if (loading) {
    return (
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="text-center">
            <div className="spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Our Users Say</h2>
          <p className="testimonials-subtitle">
            Real feedback from our campus community
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                {renderStars(testimonial.rating)}
              </div>
              
              {testimonial.comments && (
                <p className="testimonial-comment">
                  "{testimonial.comments}"
                </p>
              )}

              <div className="testimonial-metrics">
                <div className="metric">
                  <span className="metric-label">Service Quality</span>
                  <span className="metric-value">{testimonial.serviceQuality}/5</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Response Time</span>
                  <span className="metric-value">{testimonial.responseTime}/5</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Satisfaction</span>
                  <span className="metric-value">{testimonial.overallSatisfaction}/5</span>
                </div>
              </div>

              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.userId?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="author-info">
                  <div className="author-name">{testimonial.userId?.name}</div>
                  <div className="author-dept">{testimonial.userId?.department}</div>
                </div>
              </div>

              {testimonial.requestId?.category && (
                <div className="testimonial-category">
                  {testimonial.requestId.category.replace('_', ' ').toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
