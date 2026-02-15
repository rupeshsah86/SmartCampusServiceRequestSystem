import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/theme-toggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleDarkMode}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;