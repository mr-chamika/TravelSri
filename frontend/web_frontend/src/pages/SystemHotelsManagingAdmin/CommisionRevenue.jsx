import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CommisionRevenue = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 24500 },
    { month: 'Feb', revenue: 22300 },
    { month: 'Mar', revenue: 28900 },
    { month: 'Apr', revenue: 31200 },
    { month: 'May', revenue: 29500 },
    { month: 'Jun', revenue: 35800 },
    { month: 'Jul', revenue: 38200 },
    { month: 'Aug', revenue: 32700 },
    { month: 'Sep', revenue: 36400 },
    { month: 'Oct', revenue: 42300 },
    { month: 'Nov', revenue: 38900 },
    { month: 'Dec', revenue: 45600 }
  ];

  const weekData = [
    { day: 'Mon', revenue: 3200 },
    { day: 'Tue', revenue: 2800 },
    { day: 'Wed', revenue: 3400 },
    { day: 'Thu', revenue: 3100 },
    { day: 'Fri', revenue: 4000 },
    { day: 'Sat', revenue: 3900 },
    { day: 'Sun', revenue: 4200 }
  ];

  const yearData = [
    { year: '2020', revenue: 254000 },
    { year: '2021', revenue: 278000 },
    { year: '2022', revenue: 303000 },
    { year: '2023', revenue: 326000 },
    { year: '2024', revenue: 344000 }
  ];

  const chartData = useMemo(() => {
    let labels = [];
    let data = [];

    if (selectedPeriod === 'week') {
      labels = weekData.map(item => item.day);
      data = weekData.map(item => item.revenue);
    } else if (selectedPeriod === 'year') {
      labels = yearData.map(item => item.year);
      data = yearData.map(item => item.revenue);
    } else {
      labels = monthlyRevenueData.map(item => item.month);
      data = monthlyRevenueData.map(item => item.revenue);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Revenue (LKR)',
          data,
          backgroundColor: '#facc15',
          borderRadius: 6
        }
      ]
    };
  }, [selectedPeriod]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: context => `LKR ${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `LKR ${value.toLocaleString()}`
        }
      }
    }
  };

  const recentTransactions = [
    {
      id: 'TR-001',
      hotelName: 'Shangri-La Hotel',
      date: '2023-07-15',
      amount: 2450,
      status: 'Completed'
    },
    {
      id: 'TR-002',
      hotelName: 'Cinnamon Grand',
      date: '2023-07-14',
      amount: 1850,
      status: 'Completed'
    },
    {
      id: 'TR-003',
      hotelName: 'Hilton Colombo',
      date: '2023-07-13',
      amount: 3200,
      status: 'Processing'
    },
    {
      id: 'TR-004',
      hotelName: 'Jetwing Blue',
      date: '2023-07-12',
      amount: 1950,
      status: 'Completed'
    },
    {
      id: 'TR-005',
      hotelName: 'Heritance Kandalama',
      date: '2023-07-11',
      amount: 2780,
      status: 'Completed'
    }
  ];

  const totalRevenue = monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = totalRevenue / monthlyRevenueData.length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Commission Revenue</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold">LKR {totalRevenue.toLocaleString()}</h2>
          <p className="text-gray-500">Total Commission</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold">LKR {averageRevenue.toLocaleString()}</h2>
          <p className="text-gray-500">Average Monthly</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold">3.5%</h2>
          <p className="text-gray-500">Commission Rate</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold">548</h2>
          <p className="text-gray-500">Total Transactions</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Revenue Overview</h2>
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-md text-sm capitalize ${
                  selectedPeriod === period
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <Bar data={chartData} options={chartOptions} height={100} />
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Recent Transactions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hotel Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.hotelName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    LKR {transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-yellow-500 hover:text-yellow-600">
                      <span className="material-icons text-sm">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <button className="text-yellow-500 hover:text-yellow-600 text-sm flex items-center">
            View All Transactions{' '}
            <span className="material-icons text-sm ml-1">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommisionRevenue;
