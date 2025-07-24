import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

// Import services
import bookingService from '../../../services/bookingService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EarningsPage = () => {
  // State variables
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('year'); // 'year', 'month', 'week'
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    weeklyEarnings: 0,
    dailyEarnings: 0,
    totalBookings: 0,
    averageBookingValue: 0,
    platformCommission: 0,
    topPerformingRoom: { type: '', revenue: 0 },
    occupancyRate: 0,
    earningsByRoomType: {},
    earningsByMonth: {},
    earningsByDayOfWeek: {},
    earningsTrend: []
  });

  // Fetch booking data from API
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await bookingService.getAllBookings();
        setBookings(data);
        processEarningsData(data);
      } catch (err) {
        console.error('Failed to fetch bookings for earnings page:', err);
        setError('Failed to load earnings data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Process bookings to calculate earnings statistics
  const processEarningsData = (bookingsData) => {
    // Skip processing if no data
    if (!bookingsData || bookingsData.length === 0) {
      return;
    }

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    
    // Initialize data structures
    let totalEarnings = 0;
    let monthlyEarnings = 0;
    let weeklyEarnings = 0;
    let dailyEarnings = 0;
    const earningsByRoomType = {};
    const roomTypeBookingCounts = {};
    const earningsByMonth = {};
    const earningsByDayOfWeek = { 
      'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 
      'Thursday': 0, 'Friday': 0, 'Saturday': 0 
    };
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize monthly data
    monthNames.forEach(month => {
      earningsByMonth[month] = 0;
    });
    
    // Process each booking
    bookingsData.forEach(booking => {
      const amount = booking.totalCost || booking.totalAmount || 0;
      const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
      const roomType = booking.roomType || 'Unknown';
      
      // Total earnings
      totalEarnings += amount;
      
      // Monthly earnings (current month)
      if (bookingDate >= startOfCurrentMonth) {
        monthlyEarnings += amount;
      }
      
      // Weekly earnings (current week)
      if (bookingDate >= startOfCurrentWeek) {
        weeklyEarnings += amount;
      }
      
      // Daily earnings (today)
      if (isSameDay(bookingDate, now)) {
        dailyEarnings += amount;
      }
      
      // Earnings by room type
      if (!earningsByRoomType[roomType]) {
        earningsByRoomType[roomType] = 0;
        roomTypeBookingCounts[roomType] = 0;
      }
      earningsByRoomType[roomType] += amount;
      roomTypeBookingCounts[roomType]++;
      
      // Earnings by month
      const monthIndex = bookingDate.getMonth();
      const monthName = monthNames[monthIndex];
      earningsByMonth[monthName] += amount;
      
      // Earnings by day of week
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][bookingDate.getDay()];
      earningsByDayOfWeek[dayOfWeek] += amount;
    });

    // Calculate new metrics
    const totalBookings = bookingsData.length;
    const averageBookingValue = totalBookings > 0 ? totalEarnings / totalBookings : 0;

    // Find top performing room type
    let topPerformingRoom = { type: 'None', revenue: 0 };
    Object.entries(earningsByRoomType).forEach(([roomType, revenue]) => {
      if (revenue > topPerformingRoom.revenue) {
        topPerformingRoom = { type: roomType, revenue };
      }
    });

    // Calculate occupancy rate (simplified estimate based on booked rooms)
    // Assuming total capacity of 50 rooms (adjust this based on your actual capacity)
    const totalRooms = 50;
    const bookedRooms = new Set(); // Use Set to avoid counting the same room multiple times
    bookingsData.forEach(booking => {
      if (booking.roomNumber) {
        bookedRooms.add(booking.roomNumber.toString());
      }
    });
    const occupancyRate = Math.min(100, (bookedRooms.size / totalRooms) * 100);
    
    // Generate earnings trend data (last 12 months)
    const earningsTrend = [];
    const today = new Date();
    
    // Go back 12 months from current month
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = format(monthDate, 'MMM');
      const monthYear = format(monthDate, 'MMM yyyy');
      
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);
      
      // Filter bookings for this month
      let monthlyTotal = 0;
      bookingsData.forEach(booking => {
        const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
        if (bookingDate >= startDate && bookingDate <= endDate) {
          monthlyTotal += (booking.totalCost || booking.totalAmount || 0);
        }
      });
      
      earningsTrend.push({
        month: monthName,
        monthYear,
        amount: monthlyTotal
      });
    }
    
    // Calculate platform commission (10% of total revenue)
    const platformCommission = totalEarnings * 0.1;
    
    setEarningsData({
      totalEarnings,
      monthlyEarnings,
      weeklyEarnings,
      dailyEarnings,
      totalBookings,
      averageBookingValue,
      platformCommission,
      topPerformingRoom,
      occupancyRate,
      earningsByRoomType,
      earningsByMonth,
      earningsByDayOfWeek,
      earningsTrend
    });
  };

  // Get filtered data based on date range
  const getFilteredBookings = () => {
    if (!bookings || bookings.length === 0) {
      return [];
    }

    const now = new Date();
    let startDate;
    
    // Filter based on selected date range
    switch(dateRange) {
      case 'week':
        // Get bookings from last 7 days
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        // Get bookings from last 30 days
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
        break;
      case 'year':
      default:
        // Get bookings from last 12 months
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
    }
    
    return bookings.filter(booking => {
      const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
      return bookingDate >= startDate && bookingDate <= now;
    });
  };

  // Get filtered data
  const filteredBookings = getFilteredBookings();
  
  // Process filtered data for room type
  const getFilteredRoomTypeData = () => {
    const roomTypeData = {};
    
    filteredBookings.forEach(booking => {
      const amount = booking.totalCost || booking.totalAmount || 0;
      const roomType = booking.roomType || 'Unknown';
      
      if (!roomTypeData[roomType]) {
        roomTypeData[roomType] = 0;
      }
      roomTypeData[roomType] += amount;
    });
    
    return roomTypeData;
  };
  
  // Process filtered data for day of week
  const getFilteredDayOfWeekData = () => {
    const dayOfWeekData = { 
      'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 
      'Thursday': 0, 'Friday': 0, 'Saturday': 0 
    };
    
    filteredBookings.forEach(booking => {
      const amount = booking.totalCost || booking.totalAmount || 0;
      const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][bookingDate.getDay()];
      
      dayOfWeekData[dayOfWeek] += amount;
    });
    
    return dayOfWeekData;
  };
  
  // Get total revenue from filtered data
  const getFilteredTotalRevenue = () => {
    return filteredBookings.reduce((total, booking) => {
      return total + (booking.totalCost || booking.totalAmount || 0);
    }, 0);
  };
  
  // Chart title suffix based on filter
  const getFilterTitle = () => {
    switch(dateRange) {
      case 'week': return '(Last 7 Days)';
      case 'month': return '(Last 30 Days)';
      case 'year': return '(Last 12 Months)';
      default: return '';
    }
  };
  
  // Chart data for monthly earnings trend
  const monthlyEarningsTrendData = {
    labels: earningsData.earningsTrend.map(item => item.month),
    datasets: [
      {
        label: `Revenue ${getFilterTitle()} (LKR)`,
        data: earningsData.earningsTrend.map(item => item.amount),
        borderColor: 'rgba(255, 198, 0, 1)',
        backgroundColor: 'rgba(255, 198, 0, 0.5)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart data for earnings by room type
  const filteredRoomTypeData = getFilteredRoomTypeData();
  const roomTypeLabels = Object.keys(filteredRoomTypeData);
  const roomTypeEarningsData = {
    labels: roomTypeLabels,
    datasets: [
      {
        label: `Revenue by Room Type ${getFilterTitle()}`,
        data: roomTypeLabels.map(type => filteredRoomTypeData[type]),
        backgroundColor: [
          'rgba(255, 198, 0, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for earnings by day of week
  const filteredDayOfWeekData = getFilteredDayOfWeekData();
  const dayOfWeekLabels = Object.keys(filteredDayOfWeekData);
  const dayOfWeekData = {
    labels: dayOfWeekLabels,
    datasets: [
      {
        label: `Revenue by Day of Week ${getFilterTitle()}`,
        data: dayOfWeekLabels.map(day => filteredDayOfWeekData[day]),
        backgroundColor: 'rgba(255, 198, 0, 0.8)',
        borderColor: 'rgba(255, 198, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'LKR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Revenue Analytics</h2>
        <p className="text-gray-600">Track your hotel's financial performance</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title={`${dateRange === 'week' ? 'Weekly' : dateRange === 'month' ? 'Monthly' : 'Annual'} Revenue`}
              value={formatCurrency(getFilteredTotalRevenue())}
              icon="attach_money"
              color="bg-yellow-100 text-yellow-800"
              subtext={dateRange === 'week' ? 'Last 7 days' : dateRange === 'month' ? 'Last 30 days' : 'Last 12 months'}
            />
            <StatCard
              title={`${dateRange === 'week' ? 'Weekly' : dateRange === 'month' ? 'Monthly' : 'Annual'} Bookings`}
              value={filteredBookings.length}
              icon="book_online"
              color="bg-blue-100 text-blue-800"
              subtext={dateRange === 'week' ? 'Last 7 days' : dateRange === 'month' ? 'Last 30 days' : 'Last 12 months'}
            />
            <StatCard
              title="Top Room Type"
              value={earningsData.topPerformingRoom.type || "None"}
              icon="star"
              color="bg-green-100 text-green-800"
              subtext={earningsData.topPerformingRoom.revenue ? formatCurrency(earningsData.topPerformingRoom.revenue) : "No data"}
            />
            <StatCard
              title="Platform Commission"
              value={formatCurrency(getFilteredTotalRevenue() * 0.1)}
              icon="percent"
              color="bg-purple-100 text-purple-800"
              subtext="10% of filtered revenue"
            />
          </div>

          {/* Date Range Filter */}
          <div className="flex mb-6 gap-2">
            <button
              className={`px-4 py-2 rounded-md ${
                dateRange === 'year' ? 'bg-yellow-300 text-black' : 'bg-gray-200'
              }`}
              onClick={() => setDateRange('year')}
            >
              Year
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                dateRange === 'month' ? 'bg-yellow-300 text-black' : 'bg-gray-200'
              }`}
              onClick={() => setDateRange('month')}
            >
              Month
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                dateRange === 'week' ? 'bg-yellow-300 text-black' : 'bg-gray-200'
              }`}
              onClick={() => setDateRange('week')}
            >
              Week
            </button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Earnings Trend Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
              <div className="h-80">
                <Line data={monthlyEarningsTrendData} options={chartOptions} />
              </div>
            </div>

            {/* Revenue by Room Type */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue by Room Type</h3>
              <div className="h-80">
                <Pie data={roomTypeEarningsData} options={chartOptions} />
              </div>
            </div>

            {/* Revenue by Day of Week */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue by Day of Week</h3>
              <div className="h-80">
                <Bar data={dayOfWeekData} options={chartOptions} />
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                Revenue Summary {getFilterTitle()}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {dateRange === 'week' ? '(Last 7 Days)' : 
                   dateRange === 'month' ? '(Last 30 Days)' : 
                   '(Last 12 Months)'}
                </span>
              </h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left">Room Type</th>
                    <th className="py-2 text-right">Revenue</th>
                    <th className="py-2 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(filteredRoomTypeData).map(([type, amount]) => {
                    const filteredTotal = getFilteredTotalRevenue();
                    const percentage = filteredTotal > 0 ? (amount / filteredTotal) * 100 : 0;
                    
                    return (
                      <tr key={type} className="border-b border-gray-100">
                        <td className="py-3">{type}</td>
                        <td className="py-3 text-right font-medium">{formatCurrency(amount)}</td>
                        <td className="py-3 text-right font-medium">{percentage.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50">
                    <td className="py-3 font-bold">Total</td>
                    <td className="py-3 text-right font-bold">{formatCurrency(getFilteredTotalRevenue())}</td>
                    <td className="py-3 text-right font-bold">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Monthly Revenue Distribution {getFilterTitle()}
            </h3>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                Total filtered revenue: {formatCurrency(getFilteredTotalRevenue())}
              </p>
              <div className="text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
                {dateRange === 'week' ? 'Weekly View' : 
                 dateRange === 'month' ? 'Monthly View' : 
                 'Yearly View'}
              </div>
            </div>
            <div className="h-80">
              <Bar
                data={{
                  labels: Object.keys(earningsData.earningsByMonth),
                  datasets: [
                    {
                      label: `Revenue ${getFilterTitle()}`,
                      data: Object.values(earningsData.earningsByMonth),
                      backgroundColor: 'rgba(255, 198, 0, 0.8)',
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
          
          {/* Revenue Breakdown After Commission */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Revenue Breakdown & Financial Analysis</h3>
            <div className="flex flex-col md:flex-row items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mr-5">
                <span className="material-icons text-purple-500 text-3xl">account_balance</span>
              </div>
              <div>
                <h4 className="text-xl font-bold">Platform Commission & Net Earnings</h4>
                <p className="text-gray-500">
                  Comprehensive financial breakdown of your hotel revenue
                </p>
              </div>
              <div className="ml-auto mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <span className="material-icons text-sm mr-1">payments</span>
                  Financial Summary
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-1">{dateRange === 'week' ? 'Weekly' : dateRange === 'month' ? 'Monthly' : 'Annual'} Revenue</h5>
                <p className="text-xl font-bold">
                  {formatCurrency(getFilteredTotalRevenue())}
                </p>
                <p className="text-xs text-gray-500">
                  gross bookings value ({dateRange === 'week' ? 'last 7 days' : dateRange === 'month' ? 'last 30 days' : 'last 12 months'})
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-1">Platform Commission</h5>
                <p className="text-xl font-bold text-red-600">
                  - {formatCurrency(getFilteredTotalRevenue() * 0.1)}
                </p>
                <p className="text-xs text-gray-500">10% service fee</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-1">Net Revenue</h5>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(getFilteredTotalRevenue() * 0.9)}
                </p>
                <p className="text-xs text-gray-500">after platform fees</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-medium text-gray-700 mb-4">Revenue Distribution by Category</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Earning Room Type */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center mb-3">
                    <span className="material-icons text-yellow-500 mr-2">hotel</span>
                    <h5 className="font-medium">Top Performing Room Type</h5>
                    <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Top Earner
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold">{earningsData.topPerformingRoom.type || 'None'}</p>
                      <p className="text-sm text-gray-500">
                        {earningsData.totalEarnings > 0 
                          ? `${Math.round((earningsData.topPerformingRoom.revenue / earningsData.totalEarnings) * 100)}% of revenue`
                          : 'No revenue data'
                        }
                      </p>
                    </div>
                    <p className="text-lg font-bold">
                      {formatCurrency(earningsData.topPerformingRoom.revenue)}
                    </p>
                  </div>
                </div>
                
                {/* Revenue By Period */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center mb-3">
                    <span className="material-icons text-blue-500 mr-2">calendar_today</span>
                    <h5 className="font-medium">Revenue By Period</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Current Month</p>
                      <p className="font-medium">{formatCurrency(earningsData.monthlyEarnings)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Current Week</p>
                      <p className="font-medium">{formatCurrency(earningsData.weeklyEarnings)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Today</p>
                      <p className="font-medium">{formatCurrency(earningsData.dailyEarnings)}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                      <p className="text-sm font-medium">{dateRange === 'week' ? 'Last 7 Days' : dateRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'}</p>
                      <p className="font-medium text-yellow-600">{formatCurrency(getFilteredTotalRevenue())}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Financial Metrics and Insights */}
            <div className="mt-6 p-5 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                <span className="material-icons text-blue-600 mr-2">insights</span>
                Financial Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-blue-800 font-medium">Average Booking Value</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(filteredBookings.length > 0 
                      ? getFilteredTotalRevenue() / filteredBookings.length 
                      : 0)}
                  </p>
                  <p className="text-xs text-blue-600">{dateRange === 'week' ? 'Last 7 days' : dateRange === 'month' ? 'Last 30 days' : 'Last 12 months'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Room Occupancy</p>
                  <p className="text-lg font-bold">{Math.round(earningsData.occupancyRate)}%</p>
                  <p className="text-xs text-blue-600">Current rate</p>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Revenue per Available Room</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(earningsData.occupancyRate > 0 
                      ? getFilteredTotalRevenue() / (earningsData.occupancyRate / 100 * 50) 
                      : 0)}
                  </p>
                  <p className="text-xs text-blue-600">{dateRange === 'week' ? 'Weekly' : dateRange === 'month' ? 'Monthly' : 'Annual'} calculation</p>
                </div>
              </div>
            </div>
          </div>
          

        </>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, subtext }) => {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-xs font-medium tracking-wider">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtext && <p className="text-sm text-gray-600 mt-1">{subtext}</p>}
        </div>
        <div className="p-2 rounded-full bg-white bg-opacity-80 shadow-sm">
          <span className={`material-icons text-3xl text-yellow-500`}>
            {icon}
          </span>
        </div>
      </div>
      <div className="h-1 w-full bg-yellow-400 mt-3"></div>
    </div>
  );
};

export default EarningsPage;
