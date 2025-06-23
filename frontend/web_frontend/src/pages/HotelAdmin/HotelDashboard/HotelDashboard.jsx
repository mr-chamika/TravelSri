import React, { useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const HotelDashboard = () => {
  const [chartView, setChartView] = useState('monthly');
  const chartRef = useRef(null);

  const dashboardData = {
    availableRooms: 24,
    totalBookings: 156,
    earnings: 24890,
    checkInsToday: 12
  };

  const [calendarDate, setCalendarDate] = useState(new Date());
  const today = new Date();

  const selectedMonthYear = format(calendarDate, 'MMMM yyyy');
  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
  const prevMonthDays = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0).getDate();

  const days = [];

  // Previous month's trailing days
  for (let i = firstDayIndex; i > 0; i--) {
    days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }

  // Fill up to 42 total days (6 weeks)
  while (days.length < 42) {
    days.push({ day: days.length - daysInMonth - firstDayIndex + 1, isCurrentMonth: false });
  }

  const handlePrevMonth = () => {
    setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const [monthlyData] = useState([
    { month: 'Sep', percentage: 85, bookings: 132, revenue: 19750, occupancyRate: 78 },
    { month: 'Oct', percentage: 65, bookings: 98, revenue: 15200, occupancyRate: 62 },
    { month: 'Nov', percentage: 80, bookings: 121, revenue: 18300, occupancyRate: 75 },
    { month: 'Dec', percentage: 45, bookings: 78, revenue: 12450, occupancyRate: 42 },
    { month: 'Jan', percentage: 95, bookings: 145, revenue: 22800, occupancyRate: 88 },
    { month: 'Feb', percentage: 85, bookings: 135, revenue: 19850, occupancyRate: 79 },
    { month: 'Mar', percentage: 85, bookings: 137, revenue: 20200, occupancyRate: 80 },
    { month: 'Apr', percentage: 85, bookings: 139, revenue: 22450, occupancyRate: 82 },
    { month: 'May', percentage: 95, bookings: 148, revenue: 24890, occupancyRate: 90 },
    { month: 'Jun', percentage: 90, bookings: 143, revenue: 23700, occupancyRate: 85 }
  ]);

  const getChartData = () => {
    const labels = monthlyData.map(item => item.month);
    const dataPoints = chartView === 'monthly'
      ? monthlyData.map(item => item.occupancyRate)
      : monthlyData.map(item => item.revenue);

    return {
      labels,
      datasets: [
        {
          label: chartView === 'monthly' ? 'Occupancy Rate (%)' : 'Revenue (LKR)',
          data: dataPoints,
          backgroundColor: '#FEFA17',
          borderRadius: 6,
          barThickness: 20,
        }
      ]
    };
  };

  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (context) => {
            const index = context.dataIndex;
            const data = monthlyData[index];
            return chartView === 'monthly'
              ? [`Occupancy Rate: ${data.occupancyRate}%`, `Bookings: ${data.bookings}`, `Revenue: LKR ${data.revenue}`]
              : [`Revenue: LKR ${data.revenue}`, `Bookings: ${data.bookings}`, `Occupancy: ${data.occupancyRate}%`];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: chartView === 'monthly'
            ? (val) => `${val}%`
            : (val) => `LKR ${val / 1000}K`
        }
      }
    }
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'AVAILABLE ROOMS', value: dashboardData.availableRooms },
          { label: 'TOTAL BOOKINGS', value: dashboardData.totalBookings },
          { label: 'EARNINGS', value: `LKR ${dashboardData.earnings.toLocaleString()}` },
          { label: 'CHECK-INS TODAY', value: dashboardData.checkInsToday }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 font-medium mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart and Calendar */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Chart */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Monthly Booking Trends</h3>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-1.5 rounded-md ${chartView === 'monthly' ? 'bg-yellow-300' : 'bg-white'}`}
                onClick={() => setChartView('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-1.5 rounded-md ${chartView === 'revenue' ? 'bg-yellow-300' : 'bg-white'}`}
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

        {/* Calendar */}
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{selectedMonthYear}</h3>
            <div className="flex space-x-1">
              <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-gray-200">
                <span className="material-icons text-gray-500">chevron_left</span>
              </button>
              <button onClick={handleNextMonth} className="p-1 rounded hover:bg-gray-200">
                <span className="material-icons text-gray-500">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm text-gray-500 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 min-h-[252px]">
            {days.map((date, index) => (
              <div
                key={index}
                className={`
                  aspect-square w-full flex items-center justify-center text-sm rounded-full cursor-pointer
                  ${date.isCurrentMonth
                    ? date.day === today.getDate()
                        && calendarDate.getMonth() === today.getMonth()
                        && calendarDate.getFullYear() === today.getFullYear()
                        ? 'bg-yellow-300 text-black font-semibold'
                        : 'hover:bg-gray-100 text-gray-800'
                    : 'text-gray-400'}
                `}
              >
                {date.day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Table */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Recent Bookings</h3>
          <button className="text-yellow-500 hover:text-yellow-600 text-sm flex items-center">
            View All <span className="material-icons text-sm ml-1">arrow_forward</span>
          </button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              {['Guest Name', 'Room Type', 'Check In', 'Check Out', 'Status'].map((th, i) => (
                <th key={i} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'John Smith', room: 'Deluxe Room', in: 'Oct 12, 2024', out: 'Oct 15, 2024', status: 'Confirmed' },
              { name: 'Sarah Johnson', room: 'Suite', in: 'Oct 13, 2024', out: 'Oct 16, 2024', status: 'Pending' },
              { name: 'Michael Brown', room: 'Standard Room', in: 'Oct 17, 2024', out: 'Oct 19, 2024', status: 'Confirmed' }
            ].map((b, i) => (
              <tr key={i}>
                <td className="py-3 px-4">{b.name}</td>
                <td className="py-3 px-4">{b.room}</td>
                <td className="py-3 px-4">{b.in}</td>
                <td className="py-3 px-4">{b.out}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                    b.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelDashboard;
