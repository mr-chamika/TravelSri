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
import ChartService from '../../../services/chartService';

// Register chart components
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

  const currentDate = new Date();
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const [selectedMonth] = useState(`${currentMonth} ${currentYear}`);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const [monthlyData] = useState([
    { month: 'May', percentage: 85, bookings: 132, revenue: 19750, occupancyRate: 78 },
    { month: 'Jun', percentage: 65, bookings: 98, revenue: 15200, occupancyRate: 62 },
    { month: 'Jul', percentage: 80, bookings: 121, revenue: 18300, occupancyRate: 75 },
    { month: 'Aug', percentage: 45, bookings: 78, revenue: 12450, occupancyRate: 42 },
    { month: 'Sep', percentage: 95, bookings: 145, revenue: 22800, occupancyRate: 88 },
    { month: 'Oct', percentage: 85, bookings: 135, revenue: 19850, occupancyRate: 79 },
    { month: 'Nov', percentage: 85, bookings: 137, revenue: 20200, occupancyRate: 80 },
    { month: 'Dec', percentage: 85, bookings: 139, revenue: 22450, occupancyRate: 82 },
    { month: 'Jan', percentage: 95, bookings: 148, revenue: 24890, occupancyRate: 90 },
    { month: 'Feb', percentage: 90, bookings: 143, revenue: 23700, occupancyRate: 85 }
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
    maintainAspectRatio: false, // allows the chart to stretch fully
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
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'AVAILABLE ROOMS', value: dashboardData.availableRooms },
          { label: 'TOTAL BOOKINGS', value: dashboardData.totalBookings },
          { label: 'Earnings', value: dashboardData.earnings },
          { label: 'CHECK-INS TODAY', value: dashboardData.checkInsToday }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 font-medium mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart and Calendar */}
      <div className="flex gap-4">
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
        <div className="w-80 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{selectedMonth}</h3>
            <div className="flex">
              <button className="p-1"><span className="material-icons text-gray-500">chevron_left</span></button>
              <button className="p-1"><span className="material-icons text-gray-500">chevron_right</span></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-sm text-gray-500">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: adjustedFirstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => (
              <div
                key={day}
                className={`h-8 w-8 flex items-center justify-center text-sm rounded-full cursor-pointer
                  ${day === selectedDay ? 'bg-yellow-300 text-black' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
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
