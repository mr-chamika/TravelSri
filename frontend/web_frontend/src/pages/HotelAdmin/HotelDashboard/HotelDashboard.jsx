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
import { HotelAuthService, HotelAvailabilityService } from '../../../services/hotelAuthService';

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
  const [unavailabilityReasons, setUnavailabilityReasons] = useState({}); // Object mapping dates to reasons
  const [availabilityStatus, setAvailabilityStatus] = useState({}); // Object mapping dates to their status (available/unavailable/booked)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedDateForAvailability, setSelectedDateForAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [reasonText, setReasonText] = useState(''); // State for reason input
  const [selectedStatus, setSelectedStatus] = useState('available'); // available, unavailable, or booked

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
      
      // Fetch availability from backend
      const availabilityData = await HotelAvailabilityService.getAvailability();
      
      // Process the availability data
      const unavailableDates = new Set();
      const reasons = {};
      const statusMap = {};
      
      if (availabilityData && availabilityData.availability) {
        availabilityData.availability.forEach(item => {
          const dateString = item.date;
          
          if (item.status !== 'available') {
            unavailableDates.add(`unavailable_${dateString}`);
            statusMap[dateString] = item.status; // 'booked' or 'unavailable'
            
            if (item.reason) {
              reasons[dateString] = item.reason;
            }
          }
        });
      }
      
      // Store availability data
      setHotelAvailability(unavailableDates);
      setUnavailabilityReasons(reasons);
      setAvailabilityStatus(statusMap);
      
    } catch (err) {
      console.error('Failed to fetch hotel availability:', err);
      // Fallback to localStorage if API fails
      const userKey = getUserAvailabilityKey();
      const savedUnavailability = localStorage.getItem(userKey);
      let unavailableDates = savedUnavailability ? new Set(JSON.parse(savedUnavailability)) : new Set();
      
      const userReasonsKey = `hotelUnavailabilityReasons_${getCurrentUserId()}`;
      const savedReasons = localStorage.getItem(userReasonsKey);
      let reasons = savedReasons ? JSON.parse(savedReasons) : {};
      
      const userStatusKey = `hotelAvailabilityStatus_${getCurrentUserId()}`;
      const savedStatus = localStorage.getItem(userStatusKey);
      let statusMap = savedStatus ? JSON.parse(savedStatus) : {};
      
      setHotelAvailability(unavailableDates);
      setUnavailabilityReasons(reasons);
      setAvailabilityStatus(statusMap);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Save hotel availability (user-specific - in real app this would save to backend)
  const saveHotelAvailability = async (newUnavailability, newReasons = null, newStatus = null) => {
    try {
      // Prepare availability data for backend
      const availabilityArray = [];
      const today = new Date();
      const todayString = format(today, 'yyyy-MM-dd');
      
      // Build availability entries from the sets and maps
      newUnavailability.forEach(key => {
        const dateString = key.replace('unavailable_', '');
        
        // Only include current and future dates
        if (dateString >= todayString) {
          availabilityArray.push({
            date: dateString,
            status: newStatus?.[dateString] || 'unavailable',
            reason: newReasons?.[dateString] || ''
          });
        }
      });
      
      // Save to backend
      await HotelAvailabilityService.updateAvailability(availabilityArray);
      
      // Update local state
      setHotelAvailability(newUnavailability);
      
      if (newReasons !== null) {
        setUnavailabilityReasons(newReasons);
      }
      
      if (newStatus !== null) {
        setAvailabilityStatus(newStatus);
      }
      
      // Also save to localStorage as backup
      const userKey = getUserAvailabilityKey();
      const unavailabilityArray = Array.from(newUnavailability);
      localStorage.setItem(userKey, JSON.stringify(unavailabilityArray));
      
      if (newReasons !== null) {
        const userReasonsKey = `hotelUnavailabilityReasons_${getCurrentUserId()}`;
        localStorage.setItem(userReasonsKey, JSON.stringify(newReasons));
      }
      
      if (newStatus !== null) {
        const userStatusKey = `hotelAvailabilityStatus_${getCurrentUserId()}`;
        localStorage.setItem(userStatusKey, JSON.stringify(newStatus));
      }
      
      return true;
    } catch (err) {
      console.error('Failed to save hotel availability:', err);
      alert('Failed to save availability. Please try again.');
      return false;
    }
  };

  // Toggle availability for a specific date
  const toggleDateAvailability = async (dateString, status, reason = '') => {
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    
    // Only allow changes for today and future dates
    if (dateString < todayString) {
      return;
    }
    
    const newUnavailability = new Set(hotelAvailability);
    const newReasons = { ...unavailabilityReasons };
    const newStatus = { ...availabilityStatus };
    const unavailableKey = `unavailable_${dateString}`;
    
    if (status === 'available') {
      // Make available by removing from unavailable set
      newUnavailability.delete(unavailableKey);
      delete newReasons[dateString];
      delete newStatus[dateString];
    } else {
      // Make unavailable or booked
      newUnavailability.add(unavailableKey);
      newStatus[dateString] = status; // 'unavailable' or 'booked'
      if (reason.trim()) {
        newReasons[dateString] = reason.trim();
      }
    }
    
    const success = await saveHotelAvailability(newUnavailability, newReasons, newStatus);
    if (success) {
      console.log(`Hotel availability updated for ${dateString}`, status, reason ? `with reason: ${reason}` : '');
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

  // Auto-update availability based on room capacity when bookings or rooms change
  useEffect(() => {
    if (bookings.length > 0 && totalRoomsCount > 0) {
      autoUpdateAvailabilityBasedOnCapacity();
    }
  }, [bookings, totalRoomsCount]);

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

  // Helper function to count booked rooms on a specific date
  const getBookedRoomsOnDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const bookedRooms = bookings.filter(booking => {
      const checkIn = format(new Date(booking.checkIn), 'yyyy-MM-dd');
      const checkOut = format(new Date(booking.checkOut), 'yyyy-MM-dd');
      return dateString >= checkIn && dateString < checkOut;
    });
    return bookedRooms.length;
  };

  // Helper function to get available rooms on a specific date
  const getAvailableRoomsOnDate = (date) => {
    const bookedCount = getBookedRoomsOnDate(date);
    const available = totalRoomsCount - bookedCount;
    return Math.max(0, available); // Never return negative
  };

  // Function to automatically mark dates as unavailable when capacity is reached
  const autoUpdateAvailabilityBasedOnCapacity = async () => {
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    const newStatus = { ...availabilityStatus };
    const newReasons = { ...unavailabilityReasons };
    let hasChanges = false;

    // Check next 365 days (1 year ahead)
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() + i);
      const dateString = format(checkDate, 'yyyy-MM-dd');
      
      // Skip if already manually set to unavailable
      if (newStatus[dateString] === 'unavailable' && newReasons[dateString] && !newReasons[dateString].includes('(Auto)')) {
        continue;
      }

      const availableRooms = getAvailableRoomsOnDate(checkDate);
      
      // If no rooms available (capacity reached), mark as unavailable
      if (availableRooms === 0 && totalRoomsCount > 0) {
        if (newStatus[dateString] !== 'unavailable' || !newReasons[dateString]?.includes('(Auto)')) {
          newStatus[dateString] = 'unavailable';
          newReasons[dateString] = '(Auto) Fully booked - No rooms available';
          hasChanges = true;
        }
      } 
      // If rooms become available again and it was auto-marked, revert to available
      else if (availableRooms > 0 && newReasons[dateString]?.includes('(Auto)')) {
        newStatus[dateString] = 'available';
        delete newReasons[dateString];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      setAvailabilityStatus(newStatus);
      setUnavailabilityReasons(newReasons);
      
      // Save to backend
      const availabilityArray = Object.keys(newStatus)
        .filter(date => date >= todayString && newStatus[date] !== 'available')
        .map(date => ({
          date,
          status: newStatus[date],
          reason: newReasons[date] || ''
        }));
      
      try {
        await HotelAvailabilityService.updateAvailability({ availability: availabilityArray });
        console.log('Auto-updated availability based on room capacity');
      } catch (error) {
        console.error('Failed to auto-update availability:', error);
      }
    }
  };

  // Helper function to check if hotel is available on a date
  const isHotelAvailable = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const todayString = format(today, 'yyyy-MM-dd');
    
    // Past dates are unavailable by default
    if (dateString < todayString) {
      return false;
    }
    
    // Check the availability status
    const status = availabilityStatus[dateString];
    
    // If explicitly marked as unavailable, not available for booking
    if (status === 'unavailable') {
      return false;
    }
    
    // If marked as booked, check if there are still rooms available
    if (status === 'booked') {
      const availableRooms = getAvailableRoomsOnDate(date);
      // Available for booking only if there are rooms left
      return availableRooms > 0;
    }
    
    // If marked as available or no status, available for booking
    return true;
  };

  // Helper function to get calendar day status
  const getCalendarDayStatus = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return 'other-month';
    
    const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    const dateString = format(date, 'yyyy-MM-dd');
    const todayString = format(today, 'yyyy-MM-dd');
    
    const hasBookings = hasBookingsOnDate(date);
    const isToday = dateString === todayString;
    const isPastDate = dateString < todayString;
    
    // Check the availability status from the availabilityStatus object
    const status = availabilityStatus[dateString];
    
    if (isToday) return 'today';
    if (isPastDate && !hasBookings) return 'past-unavailable'; // Past dates without bookings
    if (isPastDate && hasBookings) return 'past-booked'; // Past dates with bookings
    
    // If explicitly marked as unavailable, show as unavailable (no bookings allowed)
    if (status === 'unavailable') return 'unavailable';
    
    // If marked as booked or has bookings, check room availability
    if (status === 'booked' || hasBookings) {
      const availableRooms = getAvailableRoomsOnDate(date);
      if (availableRooms === 0) {
        // No rooms available - cannot book (show as unavailable)
        return 'unavailable';
      } else {
        // Has bookings but still has rooms available (show as booked/partial)
        return 'booked';
      }
    }
    
    // If marked as available or no status, show as available
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
    
    // Load existing reason and status when opening modal
    const existingReason = unavailabilityReasons[dateString] || '';
    const existingStatus = availabilityStatus[dateString] || 'available';
    
    setSelectedDateForAvailability(date);
    setReasonText(existingReason);
    setSelectedStatus(existingStatus);
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
    const existingReason = unavailabilityReasons[dateString] || '';
    const currentStatus = availabilityStatus[dateString] || 'available';
    
    // Use ref for textarea to avoid re-render issues
    const reasonInputRef = useRef(null);

    const handleSaveAvailability = async () => {
      // Get the current value from the textarea ref
      const currentReasonText = reasonInputRef.current?.value || '';
      
      // Validate that reason is provided for unavailable or booked status
      if ((selectedStatus === 'unavailable' || selectedStatus === 'booked') && !currentReasonText.trim()) {
        alert('Please provide a reason for marking this date as ' + selectedStatus);
        return;
      }

      await toggleDateAvailability(dateString, selectedStatus, currentReasonText);
      setShowAvailabilityModal(false);
      setReasonText(''); // Clear the reason text after closing
      setSelectedStatus('available'); // Reset status
    };

    const handleBulkAvailability = async (days, status) => {
      // Get the current value from the textarea ref
      const currentReasonText = reasonInputRef.current?.value || '';
      
      // Validate reason for bulk unavailable/booked
      if ((status === 'unavailable' || status === 'booked') && !currentReasonText.trim()) {
        alert('Please provide a reason for marking dates as ' + status);
        return;
      }

      const newUnavailability = new Set(hotelAvailability);
      const newReasons = { ...unavailabilityReasons };
      const newStatus = { ...availabilityStatus };
      const today = new Date();
      const todayString = format(today, 'yyyy-MM-dd');
      
      for (let i = 0; i < days; i++) {
        const date = new Date(selectedDateForAvailability);
        date.setDate(date.getDate() + i);
        const dayString = format(date, 'yyyy-MM-dd');
        
        // Only modify current and future dates
        if (dayString >= todayString) {
          if (status === 'available') {
            // Make available by removing from unavailable set
            newUnavailability.delete(`unavailable_${dayString}`);
            delete newReasons[dayString];
            delete newStatus[dayString];
          } else {
            // Make unavailable or booked
            newUnavailability.add(`unavailable_${dayString}`);
            newStatus[dayString] = status;
            if (currentReasonText.trim()) {
              newReasons[dayString] = currentReasonText.trim();
            }
          }
        }
      }
      
      await saveHotelAvailability(newUnavailability, newReasons, newStatus);
      setShowAvailabilityModal(false);
      setReasonText(''); // Clear the reason text after closing
      setSelectedStatus('available'); // Reset status
    };

    const handleModalClose = () => {
      setShowAvailabilityModal(false);
      setReasonText('');
      setSelectedStatus('available');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Manage Availability</h3>
            <button
              onClick={handleModalClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="material-icons text-xl">close</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Date Display */}
            <div className="text-center pb-3 border-b">
              <h4 className="text-base font-semibold text-gray-700">{formattedDate}</h4>
              <div className="flex items-center justify-center mt-2 text-sm">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  currentStatus === 'available' ? 'bg-green-500' : 
                  currentStatus === 'booked' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className={`font-medium ${
                  currentStatus === 'available' ? 'text-green-600' : 
                  currentStatus === 'booked' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  Current: {currentStatus === 'available' ? 'Available' : 
                   currentStatus === 'booked' ? 'Booked' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Room Availability Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className="material-icons text-blue-600 text-lg mr-2">bed</span>
                  <span className="font-medium text-gray-700">Room Availability:</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div>
                    <span className={`font-bold text-lg ${
                      getAvailableRoomsOnDate(selectedDateForAvailability) === 0 
                        ? 'text-red-600' 
                        : getAvailableRoomsOnDate(selectedDateForAvailability) < totalRoomsCount / 2
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {getAvailableRoomsOnDate(selectedDateForAvailability)}
                    </span>
                    <span className="text-gray-600 text-xs ml-1">/ {totalRoomsCount}</span>
                  </div>
                  <span className="text-xs text-gray-500">available</span>
                </div>
              </div>
              {getAvailableRoomsOnDate(selectedDateForAvailability) === 0 && totalRoomsCount > 0 && (
                <div className="mt-2 text-xs text-red-600 flex items-start">
                  <span className="material-icons text-sm mr-1">block</span>
                  <span><strong>Fully Booked:</strong> All rooms are occupied. No new bookings can be accepted.</span>
                </div>
              )}
              {hasBookings && getAvailableRoomsOnDate(selectedDateForAvailability) > 0 && (
                <div className="mt-2 text-xs text-green-700 flex items-start">
                  <span className="material-icons text-sm mr-1">check_circle</span>
                  <span><strong>Partially Booked:</strong> {getBookedRoomsOnDate(selectedDateForAvailability)} room(s) booked, {getAvailableRoomsOnDate(selectedDateForAvailability)} room(s) still available for new bookings.</span>
                </div>
              )}
              {!hasBookings && getAvailableRoomsOnDate(selectedDateForAvailability) > 0 && (
                <div className="mt-2 text-xs text-gray-600 flex items-start">
                  <span className="material-icons text-sm mr-1">event_available</span>
                  <span>No bookings yet. All {totalRoomsCount} rooms available for booking.</span>
                </div>
              )}
              {currentStatus === 'unavailable' && !unavailabilityReasons[dateString]?.includes('(Auto)') && (
                <div className="mt-2 text-xs text-orange-700 flex items-start">
                  <span className="material-icons text-sm mr-1">warning</span>
                  <span><strong>Manually Unavailable:</strong> This date is marked unavailable by admin. Users cannot make bookings regardless of room availability.</span>
                </div>
              )}
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Status:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStatus('available')}
                  className={`py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === 'available'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                  }`}
                  title="Open for all bookings"
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('booked')}
                  className={`py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === 'booked'
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                  }`}
                  title="Has bookings, but users can still book if rooms available"
                >
                  Booked
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('unavailable')}
                  className={`py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === 'unavailable'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                  }`}
                  title="Closed for bookings - users cannot book this date"
                >
                  Unavailable
                </button>
              </div>
              
              {/* Status explanation */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1"><strong>Status Guide:</strong></p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><span className="text-green-600 font-medium">● Available:</span> Open for all bookings</li>
                  <li><span className="text-yellow-600 font-medium">● Booked:</span> Has bookings, but users can still book if rooms are available</li>
                  <li><span className="text-red-600 font-medium">● Unavailable:</span> Closed - users cannot make any bookings (e.g., maintenance, renovation)</li>
                </ul>
              </div>
            </div>

            {/* Reason Input */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason {(selectedStatus === 'booked' || selectedStatus === 'unavailable') && 
                  <span className="text-red-500">*</span>}
              </label>
              <textarea
                ref={reasonInputRef}
                id="reason"
                name="reason"
                defaultValue={reasonText}
                placeholder={
                  selectedStatus === 'booked' 
                    ? 'Private booking, Wedding, etc.' 
                    : selectedStatus === 'unavailable'
                    ? 'Maintenance, Renovation, etc.'
                    : 'Optional notes...'
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                rows="2"
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400">Max 200 characters</p>
                {(selectedStatus === 'booked' || selectedStatus === 'unavailable') && (
                  <p className="text-xs text-red-500 font-medium">Required</p>
                )}
              </div>
            </div>

            {/* Existing Reason Display */}
            {existingReason && (
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 mb-0.5">Previous Reason:</p>
                <p className="text-xs text-blue-600">{existingReason}</p>
              </div>
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveAvailability}
              className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors bg-yellow-400 hover:bg-yellow-500 text-gray-800 shadow-sm"
              disabled={hasBookings && selectedStatus !== 'available'}
            >
              {hasBookings && selectedStatus !== 'available'
                ? 'Cannot change (has bookings)'
                : 'Save Changes'
              }
            </button>

            {/* Bulk Actions - Collapsible */}
            <details className="border-t pt-3">
              <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 flex items-center justify-between">
                <span>Bulk Actions</span>
                <span className="material-icons text-sm">expand_more</span>
              </summary>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => handleBulkAvailability(7, 'available')}
                  className="py-1.5 px-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded text-xs font-medium"
                >
                  7 Days Available
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAvailability(7, 'booked')}
                  className="py-1.5 px-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded text-xs font-medium"
                >
                  7 Days Booked
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAvailability(7, 'unavailable')}
                  className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-medium"
                >
                  7 Days Unavailable
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAvailability(30, 'available')}
                  className="py-1.5 px-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded text-xs font-medium"
                >
                  30 Days Available
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAvailability(30, 'booked')}
                  className="py-1.5 px-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded text-xs font-medium"
                >
                  30 Days Booked
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAvailability(30, 'unavailable')}
                  className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-medium"
                >
                  30 Days Unavailable
                </button>
              </div>
            </details>

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1.5"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full mr-1.5"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-1.5"></div>
                  <span>Unavailable</span>
                </div>
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