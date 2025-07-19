# Installation Instructions

## Chart Library Dependencies

You're seeing this error because the chart.js and react-chartjs-2 libraries are not installed in your project.

```bash
npm install chart.js@^4.4.0 react-chartjs-2@^5.2.0
```

## HTTP Request Library

For making API calls to your Spring Boot backend, you'll also need to install axios (recommended) or use the native fetch API:

```bash
npm install axios
```

## Complete Installation

You can install all required dependencies at once:

```bash
npm install chart.js@^4.4.0 react-chartjs-2@^5.2.0 axios
```

After installation, restart your development server.

## Configuration

After installing the dependencies:

1. Make sure your Spring Boot backend has proper CORS configuration to accept requests from your frontend
2. Verify that the API endpoints match the ones used in your chartService.js
3. Check the data structure returned by your Spring Boot API matches what your charts expect

See the docs/SpringBootChartIntegration.md file for detailed integration instructions.

2. After installing, you'll need to uncomment the chart import statements in these files:
   - `src/pages/HotelAdmin/HotelDashboard/HotelDashboard.jsx`
   - `src/pages/HotelAdmin/EarningsPage/EarningsPage.jsx`

## Required Changes After Installation

Once you've installed the dependencies, update these files:

### For HotelDashboard.jsx:
```jsx
// Replace the commented import
import React, { useState, useRef, useEffect } from 'react';
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
import { chartColors, barChartOptions, getGradient } from '../../../utils/chartUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend
);
```

### For EarningsPage.jsx:
```jsx
// Replace the commented import
import React, { useState, useRef, useEffect } from 'react';
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
import { chartColors, barChartOptions, lineChartOptions, getGradient } from '../../../utils/chartUtils';

// Register ChartJS components
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
);
```

## Troubleshooting

If you continue to see import errors after installation:
- Make sure you've restarted your development server
- Check that the package versions match in your package.json
- Verify that node_modules/.bin/vite is correctly resolving the imports