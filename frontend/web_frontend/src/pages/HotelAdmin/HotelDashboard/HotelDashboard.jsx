import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Import services
import bookingService from '../../../services/bookingService';
import roomService from '../../../services/roomService';

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
  const [bookings, setBookings] = useState([]);
  const [availableRoomsCount, setAvailableRoomsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bookings data from the real database
  // Fetch available rooms count from the real database
  const fetchAvailableRooms = async () => {
    try {
      const roomsData = await roomService.getRoomsByStatus('Available');
      setAvailableRoomsCount(roomsData.length);
    } catch (err) {
      console.error('Failed to fetch available rooms:', err);
      setAvailableRoomsCount(0); // Default to 0 if fetch fails
    }
  };

  useEffect(() => {
    // Fetch available rooms when component mounts
    fetchAvailableRooms();

    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch real data from the AdminHotelBooking collection
        const data = await bookingService.getAllBookings();
        
        // Transform data to match frontend model and add display IDs and created date
        const transformedData = data.map((booking, index) => ({
          id: booking.id,
          displayId: index + 1,
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          guestPhone: booking.phone || '',
          roomType: booking.roomType,
          roomNumber: String(booking.roomNumber),
          adults: booking.adults || 1,
          children: booking.children || 0,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          status: booking.status,
          paymentStatus: booking.paymentStatus || (booking.status === 'Confirmed' ? 'Fully Paid' : 'Partially Paid'),
          totalAmount: booking.totalCost || booking.totalAmount,
          specialRequests: booking.specialRequests || '',
          paymentMethod: booking.paymentMethod || 'Credit Card',
          // Use createdAt from API or fallback to booking date
          createdAt: booking.createdAt || booking.bookingDate || new Date().toISOString(),
        }));
        
        // Sort bookings by creation date (newest first)
        const sortedBookings = transformedData.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setBookings(sortedBookings);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load bookings. Please try again later.');
        // If the API call fails, set empty bookings array
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
    
    // Refresh available rooms count every minute to keep the dashboard updated
    const intervalId = setInterval(fetchAvailableRooms, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Update dashboard stats based on bookings data and available rooms data
  const dashboardData = {
    availableRooms: availableRoomsCount,
    totalBookings: bookings.length || 0,
    earnings: bookings.reduce((total, booking) => total + booking.totalAmount, 0),
    checkInsToday: bookings.filter(booking => 
      new Date(booking.checkIn).toDateString() === new Date().toDateString()
    ).length,
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
  
  // Format bookings data for recent bookings component - show only 4 in descending order by ID
  const recentBookings = [...bookings]
    .sort((a, b) => b.displayId - a.displayId) // Sort by displayId in descending order
    .slice(0, 4) // Take only 4 bookings
    .map(booking => ({
      id: booking.id,
      name: booking.guestName,
      room: booking.roomType,
      in: format(new Date(booking.checkIn), 'MMM dd, yyyy'),
      out: format(new Date(booking.checkOut), 'MMM dd, yyyy'),
      status: booking.status
  }));
  
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
