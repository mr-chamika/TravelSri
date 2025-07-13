import React from 'react';

const Dashboard = () => {
  // Sample data for the monthly booking trends
  const monthlyData = [
    { month: 'Jan', value: 85 },
    { month: 'Feb', value: 65 },
    { month: 'Mar', value: 45 },
    { month: 'Apr', value: 95 },
    { month: 'May', value: 75 },
    { month: 'Jun', value: 80 },
    { month: 'Jul', value: 78 },
    { month: 'Aug', value: 90 },
    { month: 'Sep', value: 88 },
    { month: 'Oct', value: 92 },
    { month: 'Nov', value: 85 },
    { month: 'Dec', value: 95 }
  ];

  const maxValue = Math.max(...monthlyData.map(item => item.value));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Vehicles */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-sm text-gray-600 mb-2">Total Vehicles</div>
          <div className="text-3xl font-bold text-gray-900">89</div>
        </div>

        {/* Vehicle Providers */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-sm text-gray-600 mb-2">Vehicle Providers</div>
          <div className="text-3xl font-bold text-gray-900">24</div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-sm text-gray-600 mb-2">Bookings</div>
          <div className="text-3xl font-bold text-gray-900">342</div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-sm text-gray-600 mb-2">Revenue</div>
          <div className="text-3xl font-bold text-gray-900">Rs.2,850,000</div>
        </div>
      </div>

      {/* Monthly Booking Trends */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Monthly Booking Trends</h2>
        
        <div className="flex items-end justify-between h-64 space-x-2">
          {monthlyData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Bar */}
              <div className="w-full flex justify-center mb-2">
                <div 
                  className="bg-yellow-400 rounded-t-sm transition-all duration-300 hover:bg-yellow-500"
                  style={{
                    height: `${(item.value / maxValue) * 200}px`,
                    width: '32px'
                  }}
                />
              </div>
              
              {/* Month Label */}
              <div className="text-xs text-gray-600 font-medium">
                {item.month}
              </div>
            </div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-48 absolute left-2 top-16 text-xs text-gray-500">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;