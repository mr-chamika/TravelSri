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
import {
  MdAttachMoney,   // Total Commission
  MdTrendingUp,    // Average Monthly
  MdPercent,       // Commission Rate
  MdReceipt        // Total Transactions
} from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CommisionRevenue = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [chartView, setChartView] = useState('time'); // 'time' or 'hotel'
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

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

  // New data for hotel-wise commission
  const hotelWiseRevenueData = [
    { hotel: 'Shangri-La Hotel', revenue: 58500 },
    { hotel: 'Cinnamon Grand', revenue: 45200 },
    { hotel: 'Hilton Colombo', revenue: 52800 },
    { hotel: 'Jetwing Blue', revenue: 38700 },
    { hotel: 'Heritance Kandalama', revenue: 42300 },
    { hotel: 'Taj Samudra', revenue: 36500 },
    { hotel: 'Amari Galle', revenue: 29800 }
  ].sort((a, b) => b.revenue - a.revenue); // Sort by revenue in descending order

  const chartData = useMemo(() => {
    // If hotel view is selected
    if (chartView === 'hotel') {
      return {
        labels: hotelWiseRevenueData.map(item => item.hotel),
        datasets: [
          {
            label: 'Commission Revenue (LKR)',
            data: hotelWiseRevenueData.map(item => item.revenue),
            backgroundColor: '#facc15',
            borderRadius: 6
          }
        ]
      };
    }
    
    // If time-based view is selected
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
  }, [selectedPeriod, chartView]);

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

  // Handle view transaction
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowTransactionModal(false);
  };

  // Extended transaction data (simulating additional details we might fetch)
  const getTransactionDetails = (transaction) => {
    // In a real app, you would fetch this data from an API
    return {
      ...transaction,
      transactionType: 'Booking Commission',
      bookingReference: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: 'Credit Card',
      commissionRate: '3.5%',
      baseAmount: Math.floor(transaction.amount / 0.035),
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      processedBy: 'System',
      notes: 'Standard commission for hotel booking',
      receipt: 'https://example.com/receipt'
    };
  };

  // Stats data for the revenue cards
  const statCards = [
    {
      label: 'TOTAL COMMISSION',
      value: `LKR ${totalRevenue.toLocaleString()}`,
      Icon: MdAttachMoney,
    },
    {
      label: 'AVERAGE MONTHLY',
      value: `LKR ${averageRevenue.toLocaleString()}`,
      Icon: MdTrendingUp,
    },
    {
      label: 'COMMISSION RATE',
      value: '3.5%',
      Icon: MdPercent,
    },
    {
      label: 'TOTAL TRANSACTIONS',
      value: '548',
      Icon: MdReceipt,
    },
  ];
  
  // Stats cards data format matching SystemAdminDashboard style
  const stats = [
    { 
      label: 'Total Commission', 
      value: `LKR ${totalRevenue.toLocaleString()}`, 
      icon: <MdAttachMoney className="text-3xl text-yellow-500" />,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
    },
    { 
      label: 'Average Monthly', 
      value: `LKR ${averageRevenue.toLocaleString()}`, 
      icon: <MdTrendingUp className="text-3xl text-yellow-500" />,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
    },
    { 
      label: 'Commission Rate', 
      value: '3.5%', 
      icon: <MdPercent className="text-3xl text-yellow-500" />,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
    },
    { 
      label: 'Total Transactions', 
      value: '548',
      icon: <MdReceipt className="text-3xl text-yellow-500" />,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Commission Revenue</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`rounded-lg shadow overflow-hidden ${stat.bgColor}`}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-600 text-sm font-medium">{stat.label}</h2>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="p-2 rounded-full bg-white bg-opacity-80 shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-yellow-400"></div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-lg font-medium">Revenue Overview</h2>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* View toggle buttons */}
            <div className="flex space-x-2 items-center">
              <button
                onClick={() => setChartView('time')}
                className={`px-3 py-1 rounded-md text-sm ${
                  chartView === 'time'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Time-based
              </button>

              {/* Period selector (only show if time-based view) */}
              {chartView === 'time' && (
                <div className="flex space-x-2 mx-2">
                  {['week', 'month', 'year'].map(period => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded-md text-sm capitalize ${
                        selectedPeriod === period
                          ? 'bg-yellow-300 text-black'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setChartView('hotel')}
                className={`px-3 py-1 rounded-md text-sm ${
                  chartView === 'hotel'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Hotel-wise
              </button>
            </div>
          </div>
        </div>

        <Bar data={chartData} options={chartOptions} height={100} />
        
        {/* Chart description */}
        <div className="mt-4 text-sm text-gray-500">
          {chartView === 'hotel' 
            ? 'Commission revenue breakdown by hotel, sorted by highest to lowest amount.' 
            : `Commission revenue over ${selectedPeriod === 'week' ? 'the last week' : selectedPeriod === 'year' ? 'the last 5 years' : 'the last 12 months'}.`}
        </div>
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
                    <button 
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md text-xs"
                      onClick={() => handleViewTransaction(transaction)}
                    >
                      View
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

      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                Transaction #{selectedTransaction.id}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Transaction Details - More compact layout */}
            <div className="p-4">
              {(() => {
                const details = getTransactionDetails(selectedTransaction);
                return (
                  <>
                    {/* Status Badge - At the top to save space */}
                    <div className="mb-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          details.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {details.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {details.date}
                      </div>
                    </div>
                    
                    {/* Main Details */}
                    <div className="mb-3 border-b border-gray-200 pb-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{details.hotelName}</p>
                          <p className="text-sm text-gray-500">{details.transactionType}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">LKR {details.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Commission Amount</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Details - Essential info in compact rows */}
                    <div className="mb-3 text-sm space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-gray-500">Booking Ref</p>
                          <p className="font-medium">{details.bookingReference}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Base Amount</p>
                          <p className="font-medium">LKR {details.baseAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Commission</p>
                          <p className="font-medium">{details.commissionRate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Payment Method</p>
                          <p className="font-medium">{details.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Customer Info - Toggle section */}
                    <div className="mb-3 border-t border-gray-200 pt-3">
                      <details>
                        <summary className="font-medium text-gray-700 cursor-pointer">Customer Information</summary>
                        <div className="mt-2 pl-2 text-sm grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-gray-500">Name</p>
                            <p className="font-medium">{details.customerName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium text-xs md:text-sm">{details.customerEmail}</p>
                          </div>
                        </div>
                      </details>
                    </div>
                    
                    {/* Notes - Toggle section */}
                    <div className="border-t border-gray-200 pt-3">
                      <details>
                        <summary className="font-medium text-gray-700 cursor-pointer">Additional Notes</summary>
                        <div className="mt-2 pl-2 text-sm">
                          <p>{details.notes}</p>
                          <p className="mt-1 text-xs text-gray-500">Processed by: {details.processedBy}</p>
                        </div>
                      </details>
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
              <button 
                onClick={handleCloseModal}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm mr-2"
              >
                Close
              </button>
              <button 
                className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommisionRevenue;
