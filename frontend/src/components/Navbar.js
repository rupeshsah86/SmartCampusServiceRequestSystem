import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeMenu();
  };

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={handleHomeClick}>
            <span className="logo-icon">🎓</span>
            <span className="logo-text">Smart Campus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-menu">
            <a href="/" className="navbar-link" onClick={handleHomeClick}>Home</a>
            <a href="#features" className="navbar-link" onClick={(e) => handleSectionClick(e, 'features')}>Features</a>
            <a href="#how-it-works" className="navbar-link" onClick={(e) => handleSectionClick(e, 'how-it-works')}>How It Works</a>
            <a href="#contact" className="navbar-link" onClick={(e) => handleSectionClick(e, 'contact')}>Contact</a>
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
          <a href="/" className="navbar-mobile-link" onClick={handleHomeClick}>
            Home
          </a>
          <a href="#features" className="navbar-mobile-link" onClick={(e) => handleSectionClick(e, 'features')}>
            Features
          </a>
          <a href="#how-it-works" className="navbar-mobile-link" onClick={(e) => handleSectionClick(e, 'how-it-works')}>
            How It Works
          </a>
          <a href="#contact" className="navbar-mobile-link" onClick={(e) => handleSectionClick(e, 'contact')}>
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