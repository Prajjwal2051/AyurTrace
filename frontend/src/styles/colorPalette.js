// AyurTrace Professional Color Palette
// Inspired by natural herbs and modern healthcare design

export const colorPalette = {
  // Primary Colors - Herb Green Theme
  primary: {
    50: '#f0f9f5',   // Lightest green
    100: '#dcf4e6',  // Very light green
    200: '#bce8d1',  // Light green
    300: '#86d5b0',  // Medium light green
    400: '#4ade80',  // Bright green
    500: '#22c55e',  // Main green
    600: '#16a34a',  // Dark green
    700: '#15803d',  // Darker green
    800: '#166534',  // Very dark green
    900: '#14532d'   // Darkest green
  },

  // Secondary Colors - Earth Tones
  secondary: {
    50: '#fefbf3',   // Cream white
    100: '#fef7e0',  // Light cream
    200: '#feecb3',  // Soft yellow
    300: '#fddc80',  // Light gold
    400: '#fbbf24',  // Gold
    500: '#f59e0b',  // Amber
    600: '#d97706',  // Dark amber
    700: '#b45309',  // Brown gold
    800: '#92400e',  // Dark brown
    900: '#78350f'   // Deep brown
  },

  // Neutral Colors - Clean Grays
  neutral: {
    50: '#fafafa',   // Almost white
    100: '#f4f4f5',  // Light gray
    200: '#e4e4e7',  // Gray
    300: '#d4d4d8',  // Medium gray
    400: '#a1a1aa',  // Dark gray
    500: '#71717a',  // Darker gray
    600: '#52525b',  // Very dark gray
    700: '#3f3f46',  // Almost black
    800: '#27272a',  // Dark black
    900: '#18181b'   // Pure black
  },

  // Status Colors - Professional
  success: {
    light: '#dcfdf7',  // Light success bg
    main: '#10b981',   // Success green
    dark: '#047857'    // Dark success
  },

  warning: {
    light: '#fefbf3',  // Light warning bg
    main: '#f59e0b',   // Warning amber
    dark: '#d97706'    // Dark warning
  },

  error: {
    light: '#fef2f2',  // Light error bg
    main: '#ef4444',   // Error red
    dark: '#dc2626'    // Dark error
  },

  info: {
    light: '#f0f9ff',  // Light info bg
    main: '#3b82f6',   // Info blue
    dark: '#1d4ed8'    // Dark info
  },

  // Glassmorphism Colors
  glass: {
    white: 'rgba(255, 255, 255, 0.95)',
    light: 'rgba(255, 255, 255, 0.8)',
    medium: 'rgba(255, 255, 255, 0.6)',
    dark: 'rgba(255, 255, 255, 0.4)',
    overlay: 'rgba(0, 0, 0, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)'
  },

  // Gradients - Professional
  gradients: {
    primary: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    secondary: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    hero: 'linear-gradient(135deg, #0f766e 0%, #22c55e 50%, #16a34a 100%)',
    card: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    button: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
    accent: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)'
  }
};

// Helper functions for easy color access
export const getColor = (category, shade = 500) => {
  return colorPalette[category]?.[shade] || colorPalette.primary[500];
};

export const getGradient = (type = 'primary') => {
  return colorPalette.gradients[type] || colorPalette.gradients.primary;
};

// Shadow presets
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  glow: '0 0 20px rgba(34, 197, 94, 0.3)'
};

export default colorPalette;
