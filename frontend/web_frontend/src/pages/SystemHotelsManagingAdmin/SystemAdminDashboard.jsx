import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  MdChevronLeft,
  MdChevronRight,
  MdArrowForward,
  MdEdit,
  MdDelete,
} from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SystemAdminDashboard = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const stats = [
    { label: 'Total Hotels', value: 240 },
    { label: 'Active Users', value: 1800 },
    { label: 'Revenue', value: '$75,000' },
    { label: 'Bookings', value: 1200 },
  ];

  const hotelData = [
    {
      id: 1,
      name: 'The Grand Hotel',
      location: 'New York, USA',
      status: 'Active',
      manager: 'John Doe',
    },
    {
      id: 2,
      name: 'Seaside Resort',
      location: 'California, USA',
      status: 'Pending',
      manager: 'Jane Smith',
    },
  ];

  // Chart Data
  const chartData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: [78, 62, 75, 42, 89, 78, 80, 82, 90, 85],
        backgroundColor: 'yellow',
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'gray',
          font: { weight: 'bold' },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const paddedDays = Array.from({ length: firstDayOfMonth }, () => null);
  const days = [...paddedDays, ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">System Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-gray-600 text-sm">{stat.label}</h2>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Calendar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Monthly Booking Trends</h2>
            <div className="flex gap-4">
              <button className="bg-yellow-400 text-black font-medium px-4 py-1 rounded">Monthly</button>
              <button className="text-blue-700 font-medium">Revenue</button>
            </div>
          </div>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow-sm w-full lg:w-80">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth}>
              <MdChevronLeft className="text-2xl text-gray-600 hover:text-gray-800" />
            </button>
            <h2 className="text-lg font-medium text-gray-800">
              {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
            </h2>
            <button onClick={handleNextMonth}>
              <MdChevronRight className="text-2xl text-gray-600 hover:text-gray-800" />
            </button>
          </div>
          <div className="grid grid-cols-7 text-sm text-center text-gray-700 gap-y-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="font-semibold">{day}</div>
            ))}
            {days.map((day, index) => {
              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();
              return (
                <div
                  key={index}
                  className={`h-8 w-8 mx-auto mb-1 flex items-center justify-center rounded-full text-sm
                    ${isToday ? 'bg-yellow-400 text-black font-bold' : 'text-gray-800'}
                    ${day === null ? '' : 'hover:bg-gray-200 cursor-pointer'}
                  `}
                >
                  {day !== null ? day : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Hotels */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Recent Hotels</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Manager</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotelData.map((hotel) => (
                <tr key={hotel.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{hotel.name}</td>
                  <td className="px-4 py-2">{hotel.location}</td>
                  <td className="px-4 py-2">{hotel.status}</td>
                  <td className="px-4 py-2">{hotel.manager}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button className="text-blue-500 hover:text-blue-700"><MdEdit /></button>
                    <button className="text-red-500 hover:text-red-700"><MdDelete /></button>
                    <button className="text-green-500 hover:text-green-700"><MdArrowForward /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;
