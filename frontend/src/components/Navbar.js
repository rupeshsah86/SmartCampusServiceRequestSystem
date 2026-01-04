import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="logo-icon">🎓</span>
            <span className="logo-text">Smart Campus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">Home</Link>
            <a href="#features" className="navbar-link">Features</a>
            <a href="#how-it-works" className="navbar-link">How It Works</a>
            <a href="#contact" className="navbar-link">Contact</a>
            <Link to="/login" className="navbar-link navbar-login">Login</Link>
            <Link to="/register" className="navbar-btn">Get Started</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`navbar-mobile ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-mobile-link" onClick={closeMenu}>
            Home
          </Link>
          <a href="#features" className="navbar-mobile-link" onClick={closeMenu}>
            Features
          </a>
          <a href="#how-it-works" className="navbar-mobile-link" onClick={closeMenu}>
            How It Works
          </a>
          <a href="#contact" className="navbar-mobile-link" onClick={closeMenu}>
            Contact
          </a>
          <Link to="/login" className="navbar-mobile-link" onClick={closeMenu}>
            Login
          </Link>
          <Link to="/register" className="navbar-mobile-btn" onClick={closeMenu}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;