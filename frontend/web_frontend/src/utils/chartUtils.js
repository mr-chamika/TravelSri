// Import brand colors from colorUtils
import { brandColors } from './colorUtils';

// Common chart options and configurations
export const chartColors = {
  yellow: {
    primary: 'rgba(254, 250, 23, 1)', // FEFA17 - brand yellow
    secondary: 'rgba(254, 250, 23, 0.8)',
    background: 'rgba(254, 250, 23, 0.2)',
    hover: 'rgba(246, 242, 0, 1)', // Slightly darker for hover
  },
  blue: {
    primary: 'rgba(59, 130, 246, 1)', // blue-500
    secondary: 'rgba(59, 130, 246, 0.8)',
    background: 'rgba(59, 130, 246, 0.2)',
  },
  green: {
    primary: 'rgba(16, 185, 129, 1)', // green-500
    secondary: 'rgba(16, 185, 129, 0.8)',
    background: 'rgba(16, 185, 129, 0.2)',
  },
};

// Common options for bar charts
export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      cornerRadius: 4,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
    y: {
      grid: {
        borderDash: [2, 2],
        drawBorder: false,
      },
      ticks: {
        color: '#9CA3AF',
      },
      beginAtZero: true,
    },
  },
};

// Common options for line charts
export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        boxWidth: 6,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      cornerRadius: 4,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
    y: {
      grid: {
        borderDash: [2, 2],
        drawBorder: false,
      },
      ticks: {
        color: '#9CA3AF',
      },
      beginAtZero: true,
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 3,
      hoverRadius: 5,
    },
  },
};

// Formatter for currency values
export const formatCurrency = (value, currency = 'LKR') => {
  return `${currency} ${value.toLocaleString()}`;
};

// Helper function to create gradient for chart backgrounds
export const getGradient = (ctx, chartArea, colors) => {
  if (!chartArea) {
    return colors.primary;
  }
  
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(1, colors.secondary);
  
  return gradient;
};

// Update chart colors to use our brandColors when available
export const getBrandChartColors = (colorType = 'primary') => {
  const color = brandColors[colorType];
  return {
    primary: color.main,
    secondary: color.light,
    background: color.background,
    hover: color.hover
  };
};