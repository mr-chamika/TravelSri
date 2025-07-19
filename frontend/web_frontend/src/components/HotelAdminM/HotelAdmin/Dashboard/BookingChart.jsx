import React from 'react';
import { Bar } from 'react-chartjs-2';

const BookingChart = ({ chartView, setChartView, getChartData, getChartOptions, chartRef }) => {
  return (
    <div className="flex-1 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Monthly Booking Trends</h3>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-1.5 rounded-md ${
              chartView === 'monthly' ? 'bg-yellow-300' : 'bg-white'
            }`}
            onClick={() => setChartView('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-1.5 rounded-md ${
              chartView === 'revenue' ? 'bg-yellow-300' : 'bg-white'
            }`}
            onClick={() => setChartView('revenue')}
          >
            Revenue
          </button>
        </div>
      </div>
      <div className="h-[400px] w-full">
        <Bar data={getChartData()} options={getChartOptions()} ref={chartRef} />
      </div>
    </div>
  );
};

export default BookingChart;
