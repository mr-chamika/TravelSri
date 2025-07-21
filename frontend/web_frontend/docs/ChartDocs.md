# Chart.js Integration for TravelSri

This document provides information on how to use Chart.js in the TravelSri application.

## Installation

First, install the necessary dependencies:

```bash
npm install chart.js react-chartjs-2
```

## Chart Components

We have integrated three types of charts in our application:

1. **Bar Charts** - Used for monthly earnings and booking data
2. **Doughnut Charts** - Used for earnings breakdown by category
3. **Line Charts** - Used for tracking trends over time

## Chart Utilities

We have created utility functions in `chartUtils.js` to help with common chart configurations:

- `chartColors` - Predefined color schemes for consistency
- `barChartOptions` - Default options for bar charts
- `lineChartOptions` - Default options for line charts
- `getGradient` - Helper function to create gradient backgrounds

## Example Usage

### Basic Bar Chart

```jsx
import { Bar } from 'react-chartjs-2';
import { chartColors, barChartOptions } from '../../../utils/chartUtils';

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Sales',
    data: [12, 19, 3, 5, 2],
    backgroundColor: chartColors.yellow.primary
  }]
};

return (
  <div className="h-64">
    <Bar data={data} options={barChartOptions} />
  </div>
);
```

### Doughnut Chart

```jsx
import { Doughnut } from 'react-chartjs-2';
import { chartColors } from '../../../utils/chartUtils';

const data = {
  labels: ['Category 1', 'Category 2', 'Category 3'],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      chartColors.yellow.primary,
      chartColors.blue.primary,
      chartColors.green.primary
    ]
  }]
};

return (
  <div className="h-64">
    <Doughnut data={data} />
  </div>
);
```

### Line Chart

```jsx
import { Line } from 'react-chartjs-2';
import { chartColors, lineChartOptions } from '../../../utils/chartUtils';

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Revenue',
    data: [12000, 19000, 3000, 5000, 2000],
    borderColor: chartColors.yellow.primary,
    backgroundColor: chartColors.yellow.background,
    fill: true
  }]
};

return (
  <div className="h-64">
    <Line data={data} options={lineChartOptions} />
  </div>
);
```

## Customizing Charts

You can customize charts by extending the default options:

```jsx
const customOptions = {
  ...barChartOptions,
  plugins: {
    ...barChartOptions.plugins,
    title: {
      display: true,
      text: 'Custom Chart Title'
    }
  }
};
```

## Responsive Charts

All charts are responsive by default. Make sure to wrap them in a container with a defined height:

```jsx
<div className="h-64">
  <Bar data={data} options={options} />
</div>
```

## Chart References

You can access the chart instance using refs:

```jsx
const chartRef = useRef(null);

// Later in your code
const chartInstance = chartRef.current;

// For example, to download the chart as an image
const downloadChart = () => {
  const link = document.createElement('a');
  link.download = 'chart.png';
  link.href = chartRef.current.toBase64Image();
  link.click();
};

// In your render method
<Bar ref={chartRef} data={data} options={options} />
```

## More Resources

- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [React-Chartjs-2 Documentation](https://react-chartjs-2.js.org/)