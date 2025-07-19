// This script restores the chart components in the application files
// after chart.js dependencies have been installed
const fs = require('fs');
const path = require('path');

// Paths to the files that need to be updated
const dashboardPath = path.join(__dirname, '..', 'src', 'pages', 'HotelAdmin', 'HotelDashboard', 'HotelDashboard.jsx');
const earningsPath = path.join(__dirname, '..', 'src', 'pages', 'HotelAdmin', 'EarningsPage', 'EarningsPage.jsx');

// Dashboard component updates
const dashboardImports = `import React, { useState, useRef, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { chartColors, barChartOptions, getGradient } from '../../../utils/chartUtils';`;

const dashboardRegister = `// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend
);`;

const dashboardChart = `          <div className="h-64">
            <Bar
              ref={chartRef}
              data={getChartData()}
              options={getChartOptions()}
            />
          </div>`;

// Earnings component updates
const earningsImports = `import React, { useState, useRef, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { chartColors, barChartOptions, lineChartOptions, getGradient } from '../../../utils/chartUtils';`;

const earningsRegister = `// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);`;

const earningsBarChart = `          <div className="h-80">
            <Bar
              ref={barChartRef}
              data={getMonthlyChartData()}
              options={getBarChartOptions()}
            />
          </div>`;

const earningsDoughnutChart = `          <div className="h-64">
            <Doughnut
              ref={doughnutChartRef}
              data={getBreakdownChartData()}
              options={getDoughnutOptions()}
            />
          </div>`;

const earningsLineChart = `        <div className="h-80">
          <Line
            ref={lineChartRef}
            data={getTrendsChartData()}
            options={getLineChartOptions()}
          />
        </div>`;

// Function to update a file
function updateFile(filePath, searchPatterns, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    searchPatterns.forEach((pattern, index) => {
      if (typeof pattern === 'string') {
        content = content.replace(pattern, replacements[index]);
      } else {
        content = content.replace(pattern, replacements[index]);
      }
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Update Dashboard component
updateFile(dashboardPath, [
  /import React.*from 'react';[\s\S]*?from '\.\.\/\.\.\/\.\.\/utils\/chartUtils';/,
  /\/\/ ChartJS registration will be added after installing the dependencies/,
  /{\/* Temporarily show custom chart visualization[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/
], [
  dashboardImports,
  dashboardRegister,
  dashboardChart
]);

// Update Earnings component
updateFile(earningsPath, [
  /import React.*from 'react';[\s\S]*?from '\.\.\/\.\.\/\.\.\/utils\/chartUtils';/,
  /\/\/ Register ChartJS components - will be added back after installing dependencies/,
  /<div className="h-80 flex items-center justify-center bg-gray-50">[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  /<div className="h-64 flex items-center justify-center bg-gray-50">[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  /<div className="h-80 flex items-center justify-center bg-gray-50">[\s\S]*?<\/div>[\s\S]*?<\/div>/
], [
  earningsImports,
  earningsRegister,
  earningsBarChart,
  earningsDoughnutChart,
  earningsLineChart
]);

console.log('Chart components have been restored successfully.');
console.log('Please restart your development server if it was running.');