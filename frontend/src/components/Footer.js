import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🎓</span>
              <span className="logo-text">Smart Campus</span>
            </div>
            <p className="footer-description">
              Streamlining campus services through intelligent digital solutions.
              Making campus life better, one request at a time.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Contact Information</h4>
            <div className="contact-info">
              <p>📧 support@smartcampus.edu</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 Campus IT Department</p>
              <p>🕒 Mon-Fri: 9:00 AM - 5:00 PM</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Academic Project</h4>
            <p className="academic-note">
              This is a student project developed for academic purposes as part of 
              Full Stack Development coursework. Designed to demonstrate modern 
              web development practices and technologies.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Smart Campus Service Request System. All rights reserved.</p>
            <p className="project-note">Academic Project - Full Stack Development</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;