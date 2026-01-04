import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Smart Campus Service Request System
            </h1>
            <p className="hero-tagline">
              Streamline campus maintenance and support services with our digital solution
            </p>
            <p className="hero-problem">
              Eliminate paperwork, reduce response times, and improve campus service quality through intelligent request management.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="hero-btn primary">
                Get Started
              </Link>
              <Link to="/login" className="hero-btn secondary">
                Login
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-illustration">
              <div className="illustration-card">
                <div className="card-icon">📋</div>
                <div className="card-title">Submit Request</div>
              </div>
              <div className="illustration-arrow">→</div>
              <div className="illustration-card">
                <div className="card-icon">🔄</div>
                <div className="card-title">Track Progress</div>
              </div>
              <div className="illustration-arrow">→</div>
              <div className="illustration-card">
                <div className="card-icon">✅</div>
                <div className="card-title">Get Resolved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;