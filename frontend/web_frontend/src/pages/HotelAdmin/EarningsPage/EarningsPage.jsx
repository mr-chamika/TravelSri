import React, { useState, useRef } from 'react';
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
import {
  chartColors,
  barChartOptions,
  lineChartOptions,
  getGradient
} from '../../../utils/chartUtils';

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

const EarningsPage = () => {
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const lineChartRef = useRef(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const earningsData = {
    totalEarnings: 250526,
    monthlyEarnings: 56254,
    pendingPayouts: 24890,
    platformCommission: 12600
  };

  const monthlyData = [
    { month: 'Feb', percentage: 80, earnings: 42500, bookings: 14 },
    { month: 'Mar', percentage: 65, earnings: 35400, bookings: 12 },
    { month: 'Apr', percentage: 90, earnings: 48200, bookings: 16 },
    { month: 'May', percentage: 45, earnings: 25350, bookings: 8 },
    { month: 'Jun', percentage: 85, earnings: 45700, bookings: 15 },
    { month: 'Jul', percentage: 82, earnings: 44300, bookings: 14 },
    { month: 'Aug', percentage: 79, earnings: 42800, bookings: 14 },
    { month: 'Sep', percentage: 85, earnings: 46200, bookings: 15 },
    { month: 'Jan', percentage: 88, earnings: 47500, bookings: 16 },
    { month: 'Oct', percentage: 75, earnings: 39800, bookings: 13 },
    { month: 'Nov', percentage: 68, earnings: 36400, bookings: 12 },
    { month: 'Dec', percentage: 60, earnings: 32000, bookings: 11 },
    { month: 'Jan', percentage: 40, earnings: 24000, bookings: 7 },
    { month: 'Feb', percentage: 70, earnings: 37200, bookings: 12 },
    { month: 'Mar', percentage: 80, earnings: 42500, bookings: 14 },
    { month: 'Apr', percentage: 90, earnings: 48000, bookings: 16 },
    { month: 'May', percentage: 95, earnings: 51000, bookings: 17 },
    { month: 'Jun', percentage: 85, earnings: 45700, bookings: 15 }
  ];

  const revenueBreakdown = [
    { category: 'Room Bookings', amount: 45200, percentage: 80 },
    { category: 'Additional Services', amount: 8450, percentage: 15 },
    { category: 'Special Packages', amount: 2604, percentage: 5 }
  ];

  const [timeRange, setTimeRange] = useState('1year');

  const getMonthlyChartData = () => {
    let filteredData = monthlyData;
    if (timeRange === '6months') filteredData = monthlyData.slice(-6);
    else if (timeRange === '1year') filteredData = monthlyData.slice(-12);

    const labels = filteredData.map(item => item.month);

    return {
      labels,
      datasets: [
        {
          label: 'Monthly Earnings',
          data: filteredData.map(item => item.earnings),
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return chartColors.yellow.primary;
            return getGradient(ctx, chartArea, chartColors.yellow);
          },
          hoverBackgroundColor: chartColors.yellow.hover,
          borderRadius: 4,
          barThickness: 16
        }
      ]
    };
  };

  const getBreakdownChartData = () => {
    return {
      labels: revenueBreakdown.map(item => item.category),
      datasets: [
        {
          data: revenueBreakdown.map(item => item.percentage),
          backgroundColor: [
            chartColors.yellow.primary,
            chartColors.blue.primary,
            chartColors.green.primary
          ],
          hoverBackgroundColor: [
            chartColors.yellow.hover,
            chartColors.blue.secondary,
            chartColors.green.secondary
          ],
          borderWidth: 0
        }
      ]
    };
  };

  const getTrendsChartData = () => {
    const trendsData = monthlyData.slice(-12);
    const labels = trendsData.map(item => item.month);

    return {
      labels,
      datasets: [
        {
          label: 'Earnings',
          data: trendsData.map(item => item.earnings),
          borderColor: chartColors.yellow.primary,
          backgroundColor: chartColors.yellow.background,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Bookings',
          data: trendsData.map(item => item.bookings * 1000),
          borderColor: chartColors.blue.primary,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4
        }
      ]
    };
  };

  const getBarChartOptions = () => ({
    ...barChartOptions,
    plugins: {
      ...barChartOptions.plugins,
      tooltip: {
        ...barChartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => `LKR ${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      ...barChartOptions.scales,
      y: {
        ...barChartOptions.scales.y,
        ticks: {
          callback: (value) => `LKR ${value / 1000}K`
        }
      }
    }
  });

  const getDoughnutOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = revenueBreakdown[context.dataIndex];
            return [
              `${item.category}: ${item.percentage}%`,
              `LKR ${item.amount.toLocaleString()}`
            ];
          }
        }
      }
    }
  });

  const getLineChartOptions = () => ({
    ...lineChartOptions,
    plugins: {
      ...lineChartOptions.plugins,
      legend: { position: 'top' },
      tooltip: {
        ...lineChartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return context.datasetIndex === 0
              ? `Earnings: LKR ${value.toLocaleString()}`
              : `Bookings: ${(value / 1000).toFixed(0)}`;
          }
        }
      }
    },
    scales: {
      ...lineChartOptions.scales,
      y: {
        ...lineChartOptions.scales.y,
        ticks: { callback: (value) => `LKR ${value / 1000}K` },
        type: 'linear',
        position: 'left'
      }
    }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-gray-500">{currentDate}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.entries(earningsData).map(([key, value]) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 font-medium mb-2">
              {key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())}
            </h3>
            <p className="text-3xl font-bold">LKR {value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Monthly Earnings</h3>
          <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
            {['6months', '1year', 'all'].map(range => (
              <button
                key={range}
                className={`px-4 py-1.5 text-sm ${
                  timeRange === range
                    ? 'bg-yellow-300 text-black'
                    : 'bg-white text-gray-700'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range === '6months'
                  ? '6 Months'
                  : range === '1year'
                  ? '1 Year'
                  : 'All'}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <Bar
            ref={barChartRef}
            data={getMonthlyChartData()}
            options={getBarChartOptions()}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Earnings Breakdown</h3>
          <div className="h-64">
            <Doughnut
              ref={doughnutChartRef}
              data={getBreakdownChartData()}
              options={getDoughnutOptions()}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Revenue Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Average Daily Rate</p>
              <p className="text-xl font-bold">LKR 12,500</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Average Occupancy</p>
              <p className="text-xl font-bold">78%</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">RevPAR</p>
              <p className="text-xl font-bold">LKR 9,750</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Total Room Nights</p>
              <p className="text-xl font-bold">450</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Earnings Trends</h3>
        <div className="h-80">
          <Line
            ref={lineChartRef}
            data={getTrendsChartData()}
            options={getLineChartOptions()}
          />
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
