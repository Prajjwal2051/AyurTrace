import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Theme Context
const ThemeContext = createContext();

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('green');

  // Available themes
  const themes = {
    light: {
      name: 'Light',
      primaryBg: '#ffffff',
      secondaryBg: '#f8f9fa',
      textPrimary: '#333333',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      shadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
      navbarBg: 'navbar-light bg-white',
      cardBg: 'bg-white'
    },
    dark: {
      name: 'Dark',
      primaryBg: '#212529',
      secondaryBg: '#343a40',
      textPrimary: '#ffffff',
      textSecondary: '#adb5bd',
      border: '#495057',
      shadow: '0 0.125rem 0.25rem rgba(255, 255, 255, 0.075)',
      navbarBg: 'navbar-dark bg-dark',
      cardBg: 'bg-dark text-white'
    }
  };

  // Available primary colors
  const primaryColors = {
    green: {
      name: 'Green (Default)',
      primary: '#28a745',
      secondary: '#20c997',
      gradient: 'linear-gradient(135deg, #28a745, #20c997)',
      btnClass: 'btn-success',
      badgeClass: 'badge-success',
      textClass: 'text-success'
    },
    blue: {
      name: 'Blue',
      primary: '#007bff',
      secondary: '#17a2b8',
      gradient: 'linear-gradient(135deg, #007bff, #17a2b8)',
      btnClass: 'btn-primary',
      badgeClass: 'badge-primary',
      textClass: 'text-primary'
    },
    purple: {
      name: 'Purple',
      primary: '#6f42c1',
      secondary: '#e83e8c',
      gradient: 'linear-gradient(135deg, #6f42c1, #e83e8c)',
      btnClass: 'btn-purple',
      badgeClass: 'badge-purple',
      textClass: 'text-purple'
    }
  };

  // Load saved preferences on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ayurTrace_theme');
    const savedColor = localStorage.getItem('ayurTrace_primaryColor');
    
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    }
    
    if (savedColor && primaryColors[savedColor]) {
      setPrimaryColor(savedColor);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme];
    const currentColor = primaryColors[primaryColor];

    // Apply CSS custom properties
    root.style.setProperty('--theme-primary-bg', currentTheme.primaryBg);
    root.style.setProperty('--theme-secondary-bg', currentTheme.secondaryBg);
    root.style.setProperty('--theme-text-primary', currentTheme.textPrimary);
    root.style.setProperty('--theme-text-secondary', currentTheme.textSecondary);
    root.style.setProperty('--theme-border', currentTheme.border);
    root.style.setProperty('--theme-shadow', currentTheme.shadow);
    
    root.style.setProperty('--primary-color', currentColor.primary);
    root.style.setProperty('--secondary-color', currentColor.secondary);
    root.style.setProperty('--primary-gradient', currentColor.gradient);

    // Apply theme class to body
    document.body.className = `theme-${theme} color-${primaryColor}`;
  }, [theme, primaryColor]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('ayurTrace_theme', newTheme);
  };

  // Change primary color
  const changePrimaryColor = (color) => {
    if (primaryColors[color]) {
      setPrimaryColor(color);
      localStorage.setItem('ayurTrace_primaryColor', color);
    }
  };

  // Get current theme configuration
  const getCurrentTheme = () => {
    return {
      ...themes[theme],
      ...primaryColors[primaryColor]
    };
  };

  // Get theme-aware CSS classes
  const getThemeClasses = () => {
    const currentTheme = themes[theme];
    const currentColor = primaryColors[primaryColor];

    return {
      // Navigation
      navbar: currentTheme.navbarBg,
      
      // Cards
      card: currentTheme.cardBg,
      
      // Buttons
      btnPrimary: currentColor.btnClass,
      
      // Badges
      badge: currentColor.badgeClass,
      
      // Text
      textPrimary: currentColor.textClass,
      
      // Background
      bgPrimary: theme === 'light' ? 'bg-light' : 'bg-dark',
      bgSecondary: theme === 'light' ? 'bg-white' : 'bg-secondary'
    };
  };

  // Context value
  const value = {
    theme,
    primaryColor,
    themes,
    primaryColors,
    toggleTheme,
    changePrimaryColor,
    getCurrentTheme,
    getThemeClasses
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
