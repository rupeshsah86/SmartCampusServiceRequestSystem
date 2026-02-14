import React, { useState, useEffect } from 'react';
import '../styles/design-system.css';
import '../styles/theme-toggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('campus-blue');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to 'campus-blue'
    const savedTheme = localStorage.getItem('theme') || 'campus-blue';
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    setTheme(savedTheme);
    setDarkMode(savedDarkMode);
    
    // Apply theme to document
    applyTheme(savedTheme, savedDarkMode);
  }, []);

  const applyTheme = (selectedTheme, isDark) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.removeAttribute('data-theme');
    
    // Apply new theme
    if (selectedTheme !== 'campus-blue') {
      root.setAttribute('data-theme', selectedTheme);
    }
    
    // Apply dark mode
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme, darkMode);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    applyTheme(theme, newDarkMode);
  };

  return (
    <div className="theme-toggle-container">
      <div className="theme-toggle-dropdown">
        <button className="theme-toggle-btn">
          🎨 Theme
        </button>
        
        <div className="theme-dropdown-content">
          <div className="theme-section">
            <h4>Color Themes</h4>
            <div className="theme-options">
              <button
                className={`theme-option ${theme === 'campus-blue' ? 'active' : ''}`}
                onClick={() => handleThemeChange('campus-blue')}
              >
                <div className="theme-preview campus-blue"></div>
                Campus Blue
              </button>
              
              <button
                className={`theme-option ${theme === 'academic-purple' ? 'active' : ''}`}
                onClick={() => handleThemeChange('academic-purple')}
              >
                <div className="theme-preview academic-purple"></div>
                Academic Purple
              </button>
              
              <button
                className={`theme-option ${theme === 'modern-green' ? 'active' : ''}`}
                onClick={() => handleThemeChange('modern-green')}
              >
                <div className="theme-preview modern-green"></div>
                Modern Green
              </button>
            </div>
          </div>
          
          <div className="theme-section">
            <h4>Display Mode</h4>
            <button
              className={`dark-mode-toggle ${darkMode ? 'active' : ''}`}
              onClick={handleDarkModeToggle}
            >
              {darkMode ? '🌙' : '☀️'} {darkMode ? 'Dark' : 'Light'} Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;