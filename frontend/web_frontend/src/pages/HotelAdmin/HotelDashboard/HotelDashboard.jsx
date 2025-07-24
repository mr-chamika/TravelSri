import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Import services
import bookingService from '../../../services/bookingService';
import roomService from '../../../services/roomService';

// Import components
import StatsCards from '../../../components/HotelAdminM/HotelAdmin/Dashboard/StatsCards';
import BookingChart from '../../../components/HotelAdminM/HotelAdmin/Dashboard/BookingChart';
import DetailedBookingChart from '../../../components/HotelAdminM/HotelAdmin/Dashboard/DetailedBookingChart';
import Calendar from '../../../components/HotelAdminM/HotelAdmin/Dashboard/Calendar';
import RecentBookings from '../../../components/HotelAdminM/HotelAdmin/Dashboard/RecentBookings';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const HotelDashboard = () => {
  /* ------------------------------------------------------------------ */
  /* 1. STATE & CONSTANTS                                               */
  /* ------------------------------------------------------------------ */
  const [chartView, setChartView] = useState('monthly');
  const [detailedChartType, setDetailedChartType] = useState('roomTypes');
  const chartRef = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [availableRoomsCount, setAvailableRoomsCount] = useState(0);
  const [totalRoomsCount, setTotalRoomsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [stayLengthData, setStayLengthData] = useState([]);
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
  
  // Fetch total room count for occupancy calculations
  const fetchTotalRooms = async () => {
    try {
      const allRooms = await roomService.getAllRooms();
      setTotalRoomsCount(allRooms.length);
      return allRooms.length;
    } catch (err) {
      console.error('Failed to fetch total rooms:', err);
      setTotalRoomsCount(0);
      return 0;
    }
  };

  useEffect(() => {
    // Fetch available rooms when component mounts
    fetchAvailableRooms();
    
    // Initialize data fetching
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First get the total room count for occupancy calculations
        const totalRooms = await fetchTotalRooms();
        
        // Then fetch bookings data
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
        
        // Calculate monthly data for charts based on bookings
        const calculatedMonthlyData = calculateMonthlyData(transformedData, totalRooms);
        setMonthlyData(calculatedMonthlyData);
        
        // Calculate detailed chart data
        const roomTypes = calculateRoomTypeData(transformedData);
        const stayLengths = calculateStayLengthData(transformedData);
        setRoomTypeData(roomTypes);
        setStayLengthData(stayLengths);
        
        console.log('Monthly data calculated:', calculatedMonthlyData);
        console.log('Room type data:', roomTypes);
        console.log('Stay length data:', stayLengths);
        
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        // If the API call fails, set empty arrays
        setBookings([]);
        setMonthlyData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Call the initialization function
    initializeData();
    
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

  // State for monthly data calculated from real bookings
  const [monthlyData, setMonthlyData] = useState([]);
  
  // Calculate room type distribution data for the detailed chart
  const calculateRoomTypeData = (bookingsData) => {
    // Group bookings by room type
    const roomTypeCounts = {};
    
    bookingsData.forEach(booking => {
      if (!roomTypeCounts[booking.roomType]) {
        roomTypeCounts[booking.roomType] = 0;
      }
      roomTypeCounts[booking.roomType]++;
    });
    
    // Convert to format needed for charts
    return {
      labels: Object.keys(roomTypeCounts),
      counts: Object.values(roomTypeCounts),
    };
  };
  
  // Calculate stay length distribution
  const calculateStayLengthData = (bookingsData) => {
    // Define stay length categories
    const stayLengths = {
      '1 Night': 0,
      '2-3 Nights': 0,
      '4-7 Nights': 0,
      '1-2 Weeks': 0,
      '2+ Weeks': 0
    };
    
    bookingsData.forEach(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      
      if (nights === 1) {
        stayLengths['1 Night']++;
      } else if (nights <= 3) {
        stayLengths['2-3 Nights']++;
      } else if (nights <= 7) {
        stayLengths['4-7 Nights']++;
      } else if (nights <= 14) {
        stayLengths['1-2 Weeks']++;
      } else {
        stayLengths['2+ Weeks']++;
      }
    });
    
    return {
      labels: Object.keys(stayLengths),
      counts: Object.values(stayLengths),
    };
  };

  // Function to calculate monthly data from bookings
  const calculateMonthlyData = (bookingsData, totalRoomsCount) => {
    // Get the last 10 months (including current month)
    const months = [];
    const today = new Date();
    for (let i = 9; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        month: format(month, 'MMM'),
        fullMonth: month,
        year: month.getFullYear(),
        monthIndex: month.getMonth()
      });
    }
    
    // Group bookings by month and calculate metrics
    return months.map(monthData => {
      // Filter bookings for this month
      const monthBookings = bookingsData.filter(booking => {
        const bookingDate = new Date(booking.checkIn);
        return bookingDate.getMonth() === monthData.monthIndex && 
               bookingDate.getFullYear() === monthData.year;
      });
      
      // Calculate revenue for the month
      const revenue = monthBookings.reduce((total, booking) => total + booking.totalAmount, 0);
      
      // Calculate total booking nights for occupancy calculation
      let totalBookingNights = 0;
      monthBookings.forEach(booking => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        totalBookingNights += nights;
      });
      
      // Calculate days in the month for occupancy calculation
      const daysInMonth = new Date(monthData.year, monthData.monthIndex + 1, 0).getDate();
      
      // Calculate occupancy rate (booking nights / total possible room nights)
      // Total possible room nights = total rooms * days in month
      const occupancyRate = totalRoomsCount > 0 
        ? Math.round((totalBookingNights / (totalRoomsCount * daysInMonth)) * 100) 
        : 0;
      
      // Calculate booking rate (percentage of rooms booked at least once in the month)
      // Collect unique rooms booked in this month to avoid double counting
      const uniqueRoomsBooked = new Set();
      monthBookings.forEach(booking => {
        const roomIdentifier = `${booking.roomType}-${booking.roomNumber}`;
        uniqueRoomsBooked.add(roomIdentifier);
      });
      
      const bookingRate = totalRoomsCount > 0
        ? Math.round((uniqueRoomsBooked.size / totalRoomsCount) * 100)
        : 0;
      
      return {
        month: monthData.month,
        bookings: monthBookings.length,
        revenue: revenue,
        occupancyRate: occupancyRate,
        bookingRate: bookingRate
      };
    });
  };

  /* ------------------------------------------------------------------ */
  /* 2. CHART CONFIG                                                    */
  /* ------------------------------------------------------------------ */
  const getChartData = () => {
    // Handle empty data case
    if (!monthlyData || monthlyData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            label: 'No data available',
            data: [0],
            backgroundColor: '#FEFA17',
            borderRadius: 6,
            barThickness: 20,
          },
        ],
      };
    }
    
    const labels = monthlyData.map((d) => d.month);
    const points =
      chartView === 'monthly'
        ? monthlyData.map((d) => d.bookingRate) // Changed from occupancyRate to bookingRate
        : monthlyData.map((d) => d.revenue);

    return {
      labels,
      datasets: [
        {
          label: chartView === 'monthly' ? 'Booking Rate (%)' : 'Revenue (LKR)', // Updated label
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
            // Handle empty data case
            if (!monthlyData || monthlyData.length === 0 || !monthlyData[dataIndex]) {
              return ['No data available'];
            }
            
            const d = monthlyData[dataIndex];
            return chartView === 'monthly'
              ? [
                  `Booking Rate: ${d.bookingRate}%`,
                  `Bookings: ${d.bookings}`,
                  `Occupancy: ${d.occupancyRate}%`,
                  `Revenue: LKR ${d.revenue.toLocaleString()}`,
                ]
              : [
                  `Revenue: LKR ${d.revenue.toLocaleString()}`,
                  `Bookings: ${d.bookings}`,
                  `Booking Rate: ${d.bookingRate}%`,
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
          callback: (v) => {
            if (chartView === 'monthly') {
              return `${v}%`;
            } else {
              // Format revenue in a more readable way based on size
              if (v >= 1000000) {
                return `LKR ${(v / 1000000).toFixed(1)}M`;
              } else if (v >= 1000) {
                return `LKR ${(v / 1000).toFixed(1)}K`;
              } else {
                return `LKR ${v}`;
              }
            }
          }
        },
      },
    },
  });

  /* ------------------------------------------------------------------ */
  /* 3. DETAILED CHART CONFIG                                           */
  /* ------------------------------------------------------------------ */
  const getDetailedChartData = () => {
    if (detailedChartType === 'roomTypes') {
      // For room types we use a doughnut chart
      return {
        labels: roomTypeData.labels || [],
        datasets: [
          {
            label: 'Bookings by Room Type',
            data: roomTypeData.counts || [],
            backgroundColor: [
              '#FEFA17', // Yellow (primary)
              '#FFC107', // Amber
              '#FF9800', // Orange
              '#FFD54F', // Light Amber
              '#FFE082', // Very Light Amber
              '#FFECB3', // Pale Amber
            ],
            borderWidth: 1,
          },
        ],
      };
    } else {
      // For stay length we use a bar chart
      return {
        labels: stayLengthData.labels || [],
        datasets: [
          {
            label: 'Stay Length Distribution',
            data: stayLengthData.counts || [],
            backgroundColor: '#FEFA17',
            borderRadius: 6,
            barThickness: 30,
          },
        ],
      };
    }
  };

  const getDetailedChartOptions = () => {
    if (detailedChartType === 'roomTypes') {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const dataset = tooltipItem.dataset;
                const total = dataset.data.reduce((acc, data) => acc + data, 0);
                const currentValue = dataset.data[tooltipItem.dataIndex];
                const percentage = ((currentValue / total) * 100).toFixed(1);
                return ` ${tooltipItem.label}: ${currentValue} (${percentage}%)`;
              },
            },
          },
        },
      };
    } else {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw;
                return `Bookings: ${value}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Bookings',
            },
          },
        },
      };
    }
  };

  /* ------------------------------------------------------------------ */
  /* 4. RENDER                                                          */
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

      {/* ---- Charts Row 1 ---- */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Booking Trends Chart */}
        {isLoading ? (
          <div className="bg-white p-6 rounded-lg shadow-sm flex-1 flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-600">Loading chart data...</p>
          </div>
        ) : (
          <BookingChart 
            chartView={chartView}
            setChartView={setChartView}
            getChartData={getChartData}
            getChartOptions={getChartOptions}
            chartRef={chartRef}
          />
        )}

        {/* Calendar */}
        <Calendar 
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          today={today}
        />
      </div>
      
      {/* ---- Charts Row 2 ---- */}
      <div className="mb-4">
        {/* Detailed Booking Analysis Chart */}
        {isLoading ? (
          <div className="bg-white p-6 rounded-lg shadow-sm flex-1 flex flex-col items-center justify-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-600">Loading detailed analytics...</p>
          </div>
        ) : (
          <DetailedBookingChart
            chartType={detailedChartType}
            getDetailedChartData={getDetailedChartData}
            getDetailedChartOptions={getDetailedChartOptions}
            onChartTypeChange={setDetailedChartType}
          />
        )}
      </div>

      {/* ---- Recent Bookings Table ---- */}
      <div>
        <RecentBookings bookings={recentBookings} />
      </div>
    </div>
  );
};

export default HotelDashboard;
