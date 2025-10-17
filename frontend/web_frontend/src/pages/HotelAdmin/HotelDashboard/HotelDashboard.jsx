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
import { HotelAuthService } from '../../../services/hotelAuthService';

// Import components
import StatsCards from '../../../components/HotelAdminM/HotelAdmin/Dashboard/StatsCards';
import BookingChart from '../../../components/HotelAdminM/HotelAdmin/Dashboard/BookingChart';
import DetailedBookingChart from '../../../components/HotelAdminM/HotelAdmin/Dashboard/DetailedBookingChart';
import Calendar from '../../../components/HotelAdminM/HotelAdmin/Dashboard/Calendar';
import RecentBookings from '../../../components/HotelAdminM/HotelAdmin/Dashboard/RecentBookings';
import ConnectionTest from '../../../components/ConnectionTest';

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
  
  // Hotel availability state
  const [hotelAvailability, setHotelAvailability] = useState(new Set()); // Set of available dates (YYYY-MM-DD format)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedDateForAvailability, setSelectedDateForAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  // Get current user helper function
  const getCurrentUserId = () => {
    const user = HotelAuthService.getCurrentUser();
    return user ? user.username : 'default'; // Use username as unique identifier
  };

  // Generate user-specific storage key for availability
  const getUserAvailabilityKey = () => {
    return `hotelUnavailability_${getCurrentUserId()}`;
  };

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

  // Fetch hotel availability data (user-specific - in real app this would come from API)
  const fetchHotelAvailability = async () => {
    try {
      setAvailabilityLoading(true);
      
      // Load saved unavailable dates for current user
      const userKey = getUserAvailabilityKey();
      const savedUnavailability = localStorage.getItem(userKey);
      let unavailableDates = savedUnavailability ? new Set(JSON.parse(savedUnavailability)) : new Set();
      
      const today = new Date();
      const todayString = format(today, 'yyyy-MM-dd');
      
      // Clean up any past unavailable dates (no longer needed)
      const pastDatesToRemove = [];
      unavailableDates.forEach(dateString => {
        if (dateString < todayString) {
          pastDatesToRemove.push(dateString);
        }
      });
      
      if (pastDatesToRemove.length > 0) {
        pastDatesToRemove.forEach(dateString => {
          unavailableDates.delete(dateString);
        });
        
        // Save cleaned unavailable dates for current user
        const unavailabilityArray = Array.from(unavailableDates);
        localStorage.setItem(userKey, JSON.stringify(unavailabilityArray));
        console.log('Cleaned past unavailable dates');
      }
      
      // Store unavailable dates (all future dates are available by default)
      setHotelAvailability(unavailableDates);
      
    } catch (err) {
      console.error('Failed to fetch hotel availability:', err);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Save hotel availability (user-specific - in real app this would save to backend)
  const saveHotelAvailability = async (newUnavailability) => {
    try {
      // Save unavailable dates for current user
      const userKey = getUserAvailabilityKey();
      const unavailabilityArray = Array.from(newUnavailability);
      localStorage.setItem(userKey, JSON.stringify(unavailabilityArray));
      setHotelAvailability(newUnavailability);
      return true;
    } catch (err) {
      console.error('Failed to save hotel availability:', err);
      return false;
    }
  };

  // Toggle availability for a specific date
  const toggleDateAvailability = async (dateString) => {
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    
    // Only allow changes for today and future dates
    if (dateString < todayString) {
      return;
    }
    
    const newUnavailability = new Set(hotelAvailability);
    const unavailableKey = `unavailable_${dateString}`;
    
    // Toggle between available and unavailable
    if (newUnavailability.has(unavailableKey)) {
      // Currently unavailable, make it available
      newUnavailability.delete(unavailableKey);
    } else {
      // Currently available, make it unavailable
      newUnavailability.add(unavailableKey);
    }
    
    const success = await saveHotelAvailability(newUnavailability);
    if (success) {
      console.log(`Hotel availability updated for ${dateString}`);
    }
  };

  // Ensure future dates are always available by default (called periodically)
  const ensureFutureDatesAvailable = async () => {
    // With the new logic, all future dates are available by default
    // We only need to clean up past unavailable dates
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    const currentUnavailability = new Set(hotelAvailability);
    let hasUpdates = false;
    
    // Remove any past unavailable dates
    const pastDatesToRemove = [];
    currentUnavailability.forEach(dateString => {
      if (dateString < todayString) {
        pastDatesToRemove.push(dateString);
      }
    });
    
    if (pastDatesToRemove.length > 0) {
      pastDatesToRemove.forEach(dateString => {
        currentUnavailability.delete(dateString);
      });
      hasUpdates = true;
    }
    
    if (hasUpdates) {
      await saveHotelAvailability(currentUnavailability);
      console.log('Auto-cleaned past unavailable dates');
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
    
    // Fetch hotel availability data
    fetchHotelAvailability();
    
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
    const intervalId = setInterval(() => {
      fetchAvailableRooms();
      // Also ensure future dates remain available
      ensureFutureDatesAvailable();
    }, 60000);
    
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

  // Helper function to check if a date has bookings
  const hasBookingsOnDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return bookings.some(booking => {
      const checkIn = format(new Date(booking.checkIn), 'yyyy-MM-dd');
      const checkOut = format(new Date(booking.checkOut), 'yyyy-MM-dd');
      return dateString >= checkIn && dateString < checkOut;
    });
  };

  // Helper function to check if hotel is available on a date
  const isHotelAvailable = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const todayString = format(today, 'yyyy-MM-dd');
    
    // All future dates (including today) are available by default
    if (dateString >= todayString) {
      // Check if it's explicitly marked as unavailable
      return !hotelAvailability.has(`unavailable_${dateString}`);
    }
    
    // Past dates are unavailable by default
    return false;
  };

  // Helper function to get calendar day status
  const getCalendarDayStatus = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return 'other-month';
    
    const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    const dateString = format(date, 'yyyy-MM-dd');
    const todayString = format(today, 'yyyy-MM-dd');
    
    const hasBookings = hasBookingsOnDate(date);
    const isAvailable = isHotelAvailable(date);
    const isToday = dateString === todayString;
    const isPastDate = dateString < todayString;
    
    if (isToday) return 'today';
    if (isPastDate && !hasBookings) return 'past-unavailable'; // Past dates without bookings
    if (isPastDate && hasBookings) return 'past-booked'; // Past dates with bookings
    if (!isAvailable) return 'unavailable';
    if (hasBookings) return 'booked';
    return 'available';
  };

  // Handle calendar day click for availability management
  const handleCalendarDayClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    
    const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    const dateString = format(date, 'yyyy-MM-dd');
    const todayString = format(today, 'yyyy-MM-dd');
    
    // Prevent clicking on past dates
    if (dateString < todayString) {
      return;
    }
    
    setSelectedDateForAvailability(date);
    setShowAvailabilityModal(true);
  };

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
  /* 4. AVAILABILITY MODAL COMPONENT                                    */
  /* ------------------------------------------------------------------ */
  const AvailabilityModal = () => {
    if (!showAvailabilityModal || !selectedDateForAvailability) return null;

    const dateString = format(selectedDateForAvailability, 'yyyy-MM-dd');
    const isAvailable = isHotelAvailable(selectedDateForAvailability);
    const hasBookings = hasBookingsOnDate(selectedDateForAvailability);
    const formattedDate = format(selectedDateForAvailability, 'MMMM dd, yyyy');

    const handleToggleAvailability = async () => {
      await toggleDateAvailability(dateString);
      setShowAvailabilityModal(false);
    };

    const handleBulkAvailability = async (days, available) => {
      const newUnavailability = new Set(hotelAvailability);
      const today = new Date();
      const todayString = format(today, 'yyyy-MM-dd');
      
      for (let i = 0; i < days; i++) {
        const date = new Date(selectedDateForAvailability);
        date.setDate(date.getDate() + i);
        const dayString = format(date, 'yyyy-MM-dd');
        
        // Only modify current and future dates
        if (dayString >= todayString) {
          if (available) {
            // Make available by removing from unavailable set
            newUnavailability.delete(dayString);
          } else {
            // Make unavailable by adding to unavailable set
            newUnavailability.add(dayString);
          }
        }
      }
      
      await saveHotelAvailability(newUnavailability);
      setShowAvailabilityModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Manage Hotel Availability</h3>
            <button
              onClick={() => setShowAvailabilityModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          <div className="mb-6">
            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold">{formattedDate}</h4>
              <div className="flex items-center justify-center mt-2">
                <div className={`w-4 h-4 rounded-full mr-2 ${
                  isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`font-medium ${
                  isAvailable ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              {hasBookings && (
                <div className="flex items-center justify-center mt-1">
                  <span className="material-icons text-yellow-500 text-sm mr-1">event</span>
                  <span className="text-sm text-yellow-600">Has existing bookings</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleToggleAvailability}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isAvailable
                    ? 'bg-red-100 hover:bg-red-200 text-red-700'
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
                disabled={hasBookings && isAvailable}
              >
                {hasBookings && isAvailable 
                  ? 'Cannot make unavailable (has bookings)'
                  : isAvailable 
                    ? 'Mark as Unavailable' 
                    : 'Mark as Available'
                }
              </button>

              <div className="border-t pt-3">
                <h5 className="font-medium mb-2">Bulk Actions:</h5>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBulkAvailability(7, true)}
                    className="py-2 px-3 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm"
                  >
                    Next 7 Days Available
                  </button>
                  <button
                    onClick={() => handleBulkAvailability(7, false)}
                    className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
                  >
                    Next 7 Days Unavailable
                  </button>
                  <button
                    onClick={() => handleBulkAvailability(30, true)}
                    className="py-2 px-3 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm"
                  >
                    Next 30 Days Available
                  </button>
                  <button
                    onClick={() => handleBulkAvailability(30, false)}
                    className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
                  >
                    Next 30 Days Unavailable
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Unavailable</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>Has Bookings</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ------------------------------------------------------------------ */
  /* 5. RENDER                                                          */
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
      
      {/* Backend Connection Test */}
      <ConnectionTest />

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
          getCalendarDayStatus={getCalendarDayStatus}
          handleCalendarDayClick={handleCalendarDayClick}
          availabilityLoading={availabilityLoading}
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

      {/* ---- Availability Management Modal ---- */}
      <AvailabilityModal />
    </div>
  );
};

export default HotelDashboard;