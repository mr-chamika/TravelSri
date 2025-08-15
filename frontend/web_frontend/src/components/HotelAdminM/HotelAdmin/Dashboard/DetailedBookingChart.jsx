import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

const DetailedBookingChart = ({ 
  chartType, 
  getDetailedChartData, 
  getDetailedChartOptions, 
  onChartTypeChange 
}) => {
  const renderChart = () => {
    const data = getDetailedChartData();
    const options = getDetailedChartOptions();

    // Determine chart component based on the data type
    if (chartType === 'roomTypes') {
      return <Doughnut data={data} options={options} />;
    } else {
      // Default to Bar chart for other types like stayLength
      return <Bar data={data} options={options} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-medium">Detailed Analytics</h3>
        
        {/* Chart Type Selector */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              chartType === 'roomTypes' 
                ? 'bg-yellow-300 text-black' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => onChartTypeChange('roomTypes')}
          >
            Room Types
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              chartType === 'stayLength' 
                ? 'bg-yellow-300 text-black' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => onChartTypeChange('stayLength')}
          >
            Stay Length
          </button>
        </div>
      </div>
      
      <div className="h-[400px] w-full flex items-center justify-center">
        {renderChart()}
      </div>
    </div>
  );
};

export default DetailedBookingChart;
