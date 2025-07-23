/**
 * Custom color palette for TravelSri application
 * This centralizes our custom colors for consistent usage across the application
 */

// Primary brand colors
export const brandColors = {
  primary: {
    main: '#FEFA17', // Main brand yellow
    light: '#FEFB6C', // Lighter shade
    dark: '#E6E200', // Darker shade
    hover: '#F6F200', // Hover state
    background: 'rgba(254, 250, 23, 0.1)', // Very light background
    border: 'rgba(254, 250, 23, 0.5)', // Border color
  },
  secondary: {
    main: '#3B82F6', // Blue for secondary elements
    light: '#93C5FD',
    dark: '#2563EB',
  },
  accent: {
    main: '#10B981', // Green for success/accent elements
    light: '#6EE7B7',
    dark: '#059669',
  }
};

// Status colors
export const statusColors = {
  success: {
    background: '#ECFDF5',
    text: '#065F46',
    border: '#A7F3D0',
  },
  warning: {
    background: '#FFFBEB', 
    text: '#92400E',
    border: '#FDE68A',
  },
  error: {
    background: '#FEF2F2',
    text: '#991B1B',
    border: '#FECACA',
  },
  info: {
    background: '#EFF6FF',
    text: '#1E40AF',
    border: '#BFDBFE',
  }
};

/**
 * Helper function to generate CSS classes for brand colors
 * @param {string} element - The element type (bg, text, border)
 * @param {string} colorKey - The color key (primary, secondary, accent)
 * @param {string} shade - The shade (main, light, dark)
 * @returns {string} CSS class name
 */
export const getBrandColorClass = (element, colorKey = 'primary', shade = 'main') => {
  // This could be extended to generate tailwind classes dynamically
  // For now we'll return a sample implementation
  return `${element}-[${brandColors[colorKey][shade]}]`;
};

export default {
  brandColors,
  statusColors,
  getBrandColorClass
};