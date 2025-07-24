import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';

const DetailedBookingChart = ({ chartType, getDetailedChartData, getDetailedChartOptions, onChartTypeChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
      <div className="flex justify-between mb-6 items-center">
        <h3 className="font-medium text-gray-700">Booking Details Analysis</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => onChartTypeChange('roomTypes')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              chartType === 'roomTypes'
                ? 'bg-yellow-300 text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Room Types
          </button>
          <button
            onClick={() => onChartTypeChange('stayLength')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              chartType === 'stayLength'
                ? 'bg-yellow-300 text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Stay Length
          </button>
        </div>
      </div>

      <div className="h-80">
        {chartType === 'roomTypes' ? (
          <Doughnut
            data={getDetailedChartData()}
            options={getDetailedChartOptions()}
          />
        ) : (
          <Bar
            data={getDetailedChartData()}
            options={getDetailedChartOptions()}
          />
        )}
      </div>
    </div>
  );
};

export default DetailedBookingChart;
