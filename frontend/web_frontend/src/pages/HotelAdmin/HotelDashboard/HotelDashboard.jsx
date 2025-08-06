import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Import components
import StatsCards from '../../../components/HotelAdminM/HotelAdmin/Dashboard/StatsCards';
import BookingChart from '../../../components/HotelAdminM/HotelAdmin/Dashboard/BookingChart';
import Calendar from '../../../components/HotelAdminM/HotelAdmin/Dashboard/Calendar';
import RecentBookings from '../../../components/HotelAdminM/HotelAdmin/Dashboard/RecentBookings';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const HotelDashboard = () => {
  /* ------------------------------------------------------------------ */
  /* 1. STATE & CONSTANTS                                               */
  /* ------------------------------------------------------------------ */
  const [chartView, setChartView] = useState('monthly');
  const chartRef = useRef(null);

  const dashboardData = {
    availableRooms: 24,
    totalBookings: 156,
    earnings: 24890,
    checkInsToday: 12,
  };

  const [calendarDate, setCalendarDate] = useState(new Date());
  const today = new Date();

  // Calendar helpers
  const selectedMonthYear = format(calendarDate, 'MMMM yyyy');
  const daysInMonth = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayIndex = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    1
  ).getDay();
  const prevMonthDays = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    0
  ).getDate();

  const days = [];

  // Previous month trailing days
  for (let i = firstDayIndex; i > 0; i--) {
    days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }
  // Fill 6 weeks (42 cells)
  while (days.length < 42) {
    days.push({
      day: days.length - daysInMonth - firstDayIndex + 1,
      isCurrentMonth: false,
    });
  }

  const handlePrevMonth = () =>
    setCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const handleNextMonth = () =>
    setCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  // Dummy monthly dataset
  const [monthlyData] = useState([
    { month: 'Sep', percentage: 85, bookings: 132, revenue: 19750, occupancyRate: 78 },
    { month: 'Oct', percentage: 65, bookings: 98,  revenue: 15200, occupancyRate: 62 },
    { month: 'Nov', percentage: 80, bookings: 121, revenue: 18300, occupancyRate: 75 },
    { month: 'Dec', percentage: 45, bookings: 78,  revenue: 12450, occupancyRate: 42 },
    { month: 'Jan', percentage: 95, bookings: 145, revenue: 22800, occupancyRate: 88 },
    { month: 'Feb', percentage: 85, bookings: 135, revenue: 19850, occupancyRate: 79 },
    { month: 'Mar', percentage: 85, bookings: 137, revenue: 20200, occupancyRate: 80 },
    { month: 'Apr', percentage: 85, bookings: 139, revenue: 22450, occupancyRate: 82 },
    { month: 'May', percentage: 95, bookings: 148, revenue: 24890, occupancyRate: 90 },
    { month: 'Jun', percentage: 90, bookings: 143, revenue: 23700, occupancyRate: 85 },
  ]);

  /* ------------------------------------------------------------------ */
  /* 2. CHART CONFIG                                                    */
  /* ------------------------------------------------------------------ */
  const getChartData = () => {
    const labels = monthlyData.map((d) => d.month);
    const points =
      chartView === 'monthly'
        ? monthlyData.map((d) => d.occupancyRate)
        : monthlyData.map((d) => d.revenue);

    return {
      labels,
      datasets: [
        {
          label: chartView === 'monthly' ? 'Occupancy Rate (%)' : 'Revenue (LKR)',
          data: points,
          backgroundColor: '#FEFA17',
          borderRadius: 6,
          barThickness: 20,
        },
      ],
    };
  };

  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: ({ dataIndex }) => {
            const d = monthlyData[dataIndex];
            return chartView === 'monthly'
              ? [
                  `Occupancy: ${d.occupancyRate}%`,
                  `Bookings: ${d.bookings}`,
                  `Revenue: LKR ${d.revenue}`,
                ]
              : [
                  `Revenue: LKR ${d.revenue}`,
                  `Bookings: ${d.bookings}`,
                  `Occupancy: ${d.occupancyRate}%`,
                ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback:
            chartView === 'monthly'
              ? (v) => `${v}%`
              : (v) => `LKR ${v / 1000}K`,
        },
      },
    },
  });

  /* ------------------------------------------------------------------ */
  /* 3. RENDER                                                          */
  /* ------------------------------------------------------------------ */
  
  // Sample booking data
  const recentBookings = [
    { name: 'Theekshana Thathsara', room: 'Deluxe Room', in: 'Jun 12, 2025', out: 'Jun 15, 2025', status: 'Confirmed' },
    { name: 'Tharusha Samarawickrama', room: 'Suite', in: 'Jun 23, 2025', out: 'Jun 26, 2025', status: 'Pending' },
    { name: 'Hasith Chamika', room: 'Standard', in: 'Oct 17, 2025', out: 'Oct 19, 2025', status: 'Confirmed' },
  ];
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* ---- Stats Cards ---- */}
      <StatsCards dashboardData={dashboardData} />

      {/* ---- Chart & Calendar ---- */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Chart */}
        <BookingChart 
          chartView={chartView}
          setChartView={setChartView}
          getChartData={getChartData}
          getChartOptions={getChartOptions}
          chartRef={chartRef}
        />

        {/* Calendar */}
        <Calendar 
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          today={today}
        />
      </div>

      {/* ---- Recent Bookings Table ---- */}
      <div className="mt-6">
        <RecentBookings bookings={recentBookings} />
      </div>
    </div>
  );
};

export default HotelDashboard;
