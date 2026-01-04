import React from 'react';
import '../styles/features.css';

const Features = () => {
  const features = [
    {
      icon: '📱',
      title: 'Digital Request Submission',
      description: 'Submit service requests online with detailed descriptions, priority levels, and location information.'
    },
    {
      icon: '📊',
      title: 'Real-time Tracking',
      description: 'Track your request status in real-time from submission to resolution with instant notifications.'
    },
    {
      icon: '👥',
      title: 'Role-based Access',
      description: 'Separate interfaces for students, faculty, and administrators with appropriate permissions.'
    },
    {
      icon: '⚡',
      title: 'Quick Response',
      description: 'Automated assignment and prioritization ensure faster response times for urgent requests.'
    },
    {
      icon: '📈',
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics for administrators to monitor performance and identify trends.'
    },
    {
      icon: '⭐',
      title: 'Feedback System',
      description: 'Rate and review completed services to help improve campus maintenance quality.'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">Key Features</h2>
          <p className="section-subtitle">
            Everything you need to manage campus services efficiently
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;