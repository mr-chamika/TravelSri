# Chart Components in TravelSri

This directory contains reusable chart components for the TravelSri application.

## Dependencies

These components rely on:
- [Chart.js](https://www.chartjs.org/) - A popular JavaScript charting library
- [React-Chartjs-2](https://react-chartjs-2.js.org/) - React wrapper for Chart.js

## Installation

Please follow the instructions in `INSTALL_INSTRUCTIONS.md` in the project root to install the required dependencies.

## Usage

After installing the dependencies, you can use the chart components in your React components:

```jsx
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { chartColors } from '../../utils/chartUtils';

// Create your chart data
const data = {
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [{
    label: 'Dataset Label',
    data: [10, 20, 30],
    backgroundColor: chartColors.yellow.primary
  }]
};

// Render your chart
<Bar data={data} options={options} />
```

## Available Utils

In the `src/utils/chartUtils.js` file, you'll find:

- `chartColors` - A collection of predefined colors for consistent styling
- `barChartOptions` - Default options for bar charts
- `lineChartOptions` - Default options for line charts
- `getGradient` - Helper function for creating gradient backgrounds

## Chart Types

The following chart types are used in the application:

1. **Bar Charts** - Used for showing monthly bookings and revenue
2. **Line Charts** - Used for displaying trends over time
3. **Doughnut Charts** - Used for showing proportional data (e.g., revenue breakdown)

## Implementation Examples

Check these files for implementation examples:

- `src/pages/HotelAdmin/HotelDashboard/HotelDashboard.jsx`
- `src/pages/HotelAdmin/EarningsPage/EarningsPage.jsx`