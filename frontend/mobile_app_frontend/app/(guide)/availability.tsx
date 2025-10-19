import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import BackButton from '../../components/ui/backButton';

import Topbar from '../../components/ui/guideTopbar';

// Define types for the data structures
interface MarkingProps {
  marked?: boolean;
  selected?: boolean;
  selectedColor?: string;
  dotColor?: string;
  textColor?: string;
  selectedTextColor?: string;
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  recurring?: boolean;
  recurrencePattern?: string;
  booking?: any;
  disableTouchEvent?: boolean;
}

interface UnavailabilityItem {
  _id?: string;
  dateRange: string;
  duration: string;
  id: string;
  reason?: string;
  notes?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  dayOfWeek?: number;
}

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string;
}

// Main Screen Component for Availability
export default function AvailabilityScreen() {
  // State to track selected dates with proper typing
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: MarkingProps }>({});

  // State for the animated menu
  const [show, setShow] = useState(false);
  const translateX = useSharedValue(-1000);
  const opacity = useSharedValue(0);
  const [notify, setNotify] = useState(false);

  // State for add unavailability modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('');

  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // State for add confirmation
  const [showAddConfirm, setShowAddConfirm] = useState(false);

  // State for date details modal
  const [showDateDetailsModal, setShowDateDetailsModal] = useState(false);
  const [selectedDateDetails, setSelectedDateDetails] = useState<UnavailabilityItem | null>(null);

  // State for unavailability items
  const [currentUnavailability, setCurrentUnavailability] = useState<UnavailabilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userToken, setUserToken] = useState<MyToken | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  // Load JWT token on component mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        console.log('🔐 [INIT] Starting token load');
        const token = await AsyncStorage.getItem('token');
        console.log('🔐 [INIT] Token retrieved:', token ? `Yes (${token.length} chars)` : 'No');
        
        if (token) {
          try {
            const decoded = jwtDecode<MyToken>(token);
            console.log('🔐 [INIT] Token decoded successfully');
            console.log('🔐 [INIT] User ID:', decoded.id);
            console.log('🔐 [INIT] User email:', decoded.email);
            
            setUserToken(decoded);
            console.log('🔐 [INIT] User token set in state');
            
            console.log('🔐 [INIT] Calling fetchUnavailability with userId:', decoded.id);
            fetchUnavailability(decoded.id);
            
            console.log('🔐 [INIT] Calling fetchBookingsFromBackend with userId:', decoded.id);
            // Fetch bookings from the API
            fetchBookingsFromBackend(decoded.id);
          } catch (decodeError) {
            console.error('❌ [INIT] Error decoding token:', decodeError);
          }
        } else {
          console.warn('⚠️ [INIT] No token found in AsyncStorage');
        }
      } catch (error) {
        console.error('❌ [INIT] Error loading token from storage:', error);
      }
    };
    
    console.log('🔐 [INIT] useEffect triggered - component mounted');
    loadToken();
  }, []);

  // Function to handle date selection with correct types
  const handleDateSelection = (day: DateData) => {
    const dateString = day.dateString;
    
    // Check if this date is a pending or accepted booking date
    const isBookingDate = bookings.some((booking: any) => {
      if (booking.status === 'PENDING' || booking.status === 'ACCEPTED') {
        return booking.bookingDates.some((bookingDate: string) => {
          // Extract just the date part (YYYY-MM-DD format)
          const datePart = bookingDate.split('T')[0];
          return datePart === dateString;
        });
      }
      return false;
    });

    if (isBookingDate) {
      Alert.alert(
        'Cannot Select This Date',
        'You cannot mark pending or accepted booking dates as unavailable. Please cancel or complete the booking first.'
      );
      return;
    }
    
    // Check if this date has an unavailability item
    const dateDetails = currentUnavailability.find((item) => {
      // Parse the dateRange to get start and end dates in YYYY-MM-DD format
      const dateRangeParts = item.dateRange.split(' - ');
      let itemStartDate = dateRangeParts[0];
      let itemEndDate = dateRangeParts[dateRangeParts.length - 1];
      
      // Convert format from "2025 Oct 18" to "2025-10-18"
      const parseDate = (dateStr: string): string => {
        const parts = dateStr.trim().split(' ');
        const year = parts[0];
        const monthStr = parts[1];
        const day = parts[2];
        
        const months: { [key: string]: string } = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
          'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
          'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        
        const month = months[monthStr] || '01';
        return `${year}-${month}-${day.padStart(2, '0')}`;
      };
      
      itemStartDate = parseDate(itemStartDate);
      itemEndDate = parseDate(itemEndDate);
      
      // Check if the selected date falls within this item's range
      return dateString >= itemStartDate && dateString <= itemEndDate;
    });
    
    if (dateDetails) {
      // Show the details modal
      console.log('📅 Date details found:', dateDetails);
      setSelectedDateDetails(dateDetails);
      setShowDateDetailsModal(true);
    }
  };

  // Handle date selection in the add modal
  const handleModalDateSelection = (day: DateData) => {
    const dateString = day.dateString;

    // Allow selecting any date - users can mark scheduled or unscheduled dates as unavailable
    if (isSelectingStartDate) {
      setStartDate(dateString);
      setIsSelectingStartDate(false);
    } else {
      setEndDate(dateString);
    }
  };

  // Function to calculate duration between two dates
  const calculateDuration = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} Days`;
  };

  // Fetch unavailability from backend
  const fetchUnavailability = async (providerId: string) => {
    try {
      setLoading(true);
      console.log('🔄 Fetching unavailability for providerId:', providerId);
      
      const response = await fetch(`http://localhost:8080/api/availability/user-schedules/${providerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('📡 API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Raw fetched data:', data);
        console.log('📋 Data length:', data.length);
        
        // Convert backend data to UI format
        const formattedData = data.map((item: any) => {
          console.log('🔄 Raw item from backend:', item);
          console.log('🔄 Item isRecurring:', item.isRecurring, 'Type:', typeof item.isRecurring);
          console.log('🔄 Item recurrencePattern:', item.recurrencePattern, 'Type:', typeof item.recurrencePattern);
          
          // Convert isRecurring to boolean in case it comes as string
          let isRecurringBoolean = false;
          if (typeof item.isRecurring === 'string') {
            isRecurringBoolean = item.isRecurring.toLowerCase() === 'true';
          } else if (typeof item.isRecurring === 'boolean') {
            isRecurringBoolean = item.isRecurring;
          }
          
          const formatted = {
            _id: item._id || item.id,
            id: item._id || item.id,
            dateRange: formatDateRange(item.unavailableFromDate, item.unavailableToDate),
            duration: calculateDuration(item.unavailableFromDate, item.unavailableToDate),
            reason: item.unavailabilityReason,
            notes: item.notes,
            isRecurring: isRecurringBoolean,
            recurrencePattern: item.recurrencePattern ? item.recurrencePattern.toLowerCase() : '',
            dayOfWeek: item.dayOfWeek,
          };
          console.log('🔄 Formatted item:', formatted);
          console.log('🔄 isRecurring in formatted:', formatted.isRecurring, 'Type:', typeof formatted.isRecurring);
          console.log('🔄 recurrencePattern in formatted:', formatted.recurrencePattern, 'Type:', typeof formatted.recurrencePattern);
          return formatted;
        });
        
        console.log('📦 Final formatted data:', formattedData);
        setCurrentUnavailability(formattedData);
        updateCalendarMarking(formattedData);
      } else {
        console.error('❌ Failed to fetch unavailability:', response.status);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ Error fetching unavailability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings from the backend API
  const fetchBookingsFromBackend = async (userId: string) => {
    try {
      const apiUrl = `http://localhost:8080/api/bookings/provider/${userId}?providerId=${userId}`;
      console.log('🔍 [BOOKINGS] START - Fetching bookings from URL:', apiUrl);
      console.log('🔍 [BOOKINGS] Using userId:', userId);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('🔍 [BOOKINGS] Response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ [BOOKINGS] HTTP error! status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 [BOOKINGS] Raw API response:', JSON.stringify(data, null, 2));
      console.log('📦 [BOOKINGS] Response type:', typeof data);
      console.log('📦 [BOOKINGS] Is array?', Array.isArray(data));
      
      let bookingsArray: any[] = [];
      
      if (data && Array.isArray(data)) {
        console.log('📦 [BOOKINGS] Data is array, length:', data.length);
        bookingsArray = data;
      } else if (data && data.content && Array.isArray(data.content)) {
        console.log('📦 [BOOKINGS] Data has content array, length:', data.content.length);
        bookingsArray = data.content;
      } else {
        console.warn('⚠️ [BOOKINGS] Unexpected data structure');
      }
      
      console.log('📦 [BOOKINGS] Total bookings to process:', bookingsArray.length);
      
      // Filter and format bookings
      const formattedBookings = bookingsArray
        .map((dto: any, index: number) => {
          console.log(`📌 [BOOKINGS] Processing booking #${index}`);
          console.log(`📌 [BOOKINGS] Available fields:`, Object.keys(dto));
          console.log(`📌 [BOOKINGS] Full booking object:`, JSON.stringify(dto, null, 2));
          
          // Extract booking ID from various possible fields
          let bookingId = dto._id || dto.id || dto.bookingId || 'unknown';
          console.log(`📌 [BOOKINGS] Booking ID: ${bookingId}`);
          console.log(`📌 [BOOKINGS] Status: ${dto.status || 'PENDING'}`);
          console.log(`📌 [BOOKINGS] Booking dates: ${JSON.stringify(dto.bookingDates)}`);
          
          return {
            _id: bookingId,
            price: dto.price || 0,
            bookingDates: dto.bookingDates || [],
            location: dto.location || '',
            userId: dto.userId || '',
            mobileNumber: dto.mobileNumber || '',
            username: dto.username || '',
            status: (dto.status || 'PENDING').toUpperCase(),
          };
        })
        .filter((booking: any) => {
          // Show all booking statuses: PENDING, ACTIVE/CONFIRMED, ACCEPTED, COMPLETED
          const isValid = ['PENDING', 'CONFIRMED', 'COMPLETED', 'ACTIVE', 'ACCEPTED'].includes(booking.status);
          console.log(`🔍 [BOOKINGS] Filtering ${booking._id}: status=${booking.status}, pass=${isValid}`);
          return isValid;
        });
      
      console.log('📋 [BOOKINGS] Formatted and filtered bookings count:', formattedBookings.length);
      console.log('📋 [BOOKINGS] Formatted bookings:', JSON.stringify(formattedBookings, null, 2));
      
      setBookings(formattedBookings);
      
      if (formattedBookings.length > 0) {
        console.log('✅ [BOOKINGS] Found bookings, adding to calendar');
        // Add bookings with confirmed/completed status to calendar
        addBookingsToCalendar(formattedBookings);
      } else {
        console.warn('⚠️ [BOOKINGS] No confirmed/completed bookings found');
      }
    } catch (error) {
      console.error('❌ [BOOKINGS] Error fetching bookings:', error);
      console.error('❌ [BOOKINGS] Error stack:', error instanceof Error ? error.stack : 'N/A');
    }
  };

  // Add bookings to calendar marking based on status
  const addBookingsToCalendar = (bookingsData: any[]) => {
    console.log('📅 [CALENDAR] START - Adding bookings to calendar');
    console.log('📅 [CALENDAR] Bookings to add:', bookingsData.length);
    
    setSelectedDates(prevMarkedDates => {
      const newMarkedDates = { ...prevMarkedDates };
      
      console.log('📅 [CALENDAR] Previous marked dates count:', Object.keys(prevMarkedDates).length);
      console.log('📅 [CALENDAR] Previous marked dates:', Object.keys(prevMarkedDates).slice(0, 5), '...');
      
      bookingsData.forEach((booking: any, bookingIndex: number) => {
        try {
          console.log(`📅 [CALENDAR] Processing booking #${bookingIndex}:`, booking._id);
          console.log(`📅 [CALENDAR] Booking status:`, booking.status);
          console.log(`📅 [CALENDAR] Booking dates array:`, booking.bookingDates);
          
          if (!booking.bookingDates || booking.bookingDates.length === 0) {
            console.warn(`⚠️ [CALENDAR] No booking dates found for booking:`, booking._id);
            return;
          }
          
          console.log(`📅 [CALENDAR] Dates to mark: ${booking.bookingDates.length}`);
          
          // Process all dates in the bookingDates array
          booking.bookingDates.forEach((dateEntry: any, dateIndex: number) => {
            try {
              console.log(`📅 [CALENDAR] Processing date #${dateIndex} from booking ${booking._id}`);
              console.log(`📅 [CALENDAR] Raw date entry:`, dateEntry, 'Type:', typeof dateEntry);
              
              let dateString = dateEntry;
              
              // Handle date object or date string
              if (typeof dateEntry === 'object' && dateEntry.date) {
                console.log(`📅 [CALENDAR] Extracting date from object.date`);
                dateString = dateEntry.date;
              } else if (typeof dateEntry === 'object') {
                console.log(`📅 [CALENDAR] Converting object to string`);
                dateString = dateEntry.toString ? dateEntry.toString().split('T')[0] : '';
              }
              
              if (!dateString) {
                console.warn(`⚠️ [CALENDAR] Could not extract date string from:`, dateEntry);
                return;
              }
              
              // Ensure date string is in YYYY-MM-DD format
              if (dateString.length > 10) {
                dateString = dateString.split('T')[0];
              }
              
              console.log(`📅 [CALENDAR] Final date string: ${dateString}, Status: ${booking.status}`);
              
              // Determine color based on status
              let displayColor = '#ffe600ff';   // Green for PENDING (default)
              let dotColor = '#ffee00ff';
              let disableTouchEvent = false;  // By default allow selection
              
              if (booking.status === 'COMPLETED') {
                displayColor = '#1565C0';     // Blue for COMPLETED
                dotColor = '#1565C0';
                console.log(`📅 [CALENDAR] Using COMPLETED color: Blue #1565C0`);
              } else if (booking.status === 'CONFIRMED' || booking.status === 'ACTIVE' || booking.status === 'ACCEPTED') {
                displayColor = '#4CAF50';     // Bright Green for CONFIRMED/ACCEPTED
                dotColor = '#4CAF50';
                disableTouchEvent = true;     // Disable selection for ACCEPTED bookings
                console.log(`📅 [CALENDAR] Using CONFIRMED/ACCEPTED color: Bright Green #4CAF50 - DISABLED`);
              } else if (booking.status === 'PENDING') {
                displayColor = '#2E7D32';     // Dark Green for PENDING
                dotColor = '#2E7D32';
                disableTouchEvent = true;     // Disable selection for PENDING bookings
                console.log(`📅 [CALENDAR] Using PENDING color: Dark Green #2E7D32 - DISABLED`);
              }
              
              newMarkedDates[dateString] = {
                marked: true,
                selected: true,
                selectedColor: displayColor,
                dotColor: dotColor,
                textColor: '#ffffff',
                disableTouchEvent: disableTouchEvent,
                booking: booking, // Store booking reference
              };
              
              console.log(`✅ [CALENDAR] Marked date: ${dateString} with color: ${displayColor}`);
            } catch (dateError) {
              console.error(`❌ [CALENDAR] Error processing date entry:`, dateEntry, dateError);
            }
          });
        } catch (error) {
          console.error(`❌ [CALENDAR] Error processing booking:`, booking, error);
        }
      });
      
      console.log('📅 [CALENDAR] Final marked dates count:', Object.keys(newMarkedDates).length);
      console.log('📅 [CALENDAR] New marked dates (first 10):', Object.keys(newMarkedDates).slice(0, 10));
      console.log('📅 [CALENDAR] Complete marked dates object:', JSON.stringify(newMarkedDates, null, 2).substring(0, 500) + '...');
      
      return newMarkedDates;
    });
  };

  // Update calendar with unavailable dates
  const updateCalendarMarking = (unavailabilityList: UnavailabilityItem[]) => {
    const marked: { [key: string]: any } = {};
    
    console.log('🔍 updateCalendarMarking called with:', unavailabilityList);
    
    // Helper function to get all dates between two dates
    const getDatesBetween = (startStr: string, endStr: string): string[] => {
      const dates: string[] = [];
      const start = new Date(startStr);
      const end = new Date(endStr);
      
      const current = new Date(start);
      while (current <= end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${day}`);
        current.setDate(current.getDate() + 1);
      }
      console.log(`📅 Generated dates from ${startStr} to ${endStr}:`, dates);
      return dates;
    };

    // Helper function to generate recurring dates
    const getRecurringDates = (startStr: string, endStr: string, pattern: string, dayOfWeek?: number): string[] => {
      const dates: string[] = [];
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      
      // Get the duration of one occurrence
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
      
      console.log(`📅 [RECURRING] Pattern: ${pattern}, Duration: ${durationDays} days, StartDay: ${dayOfWeek}`);
      
      // Generate recurring instances for the next 12 months
      const today = new Date();
      const oneYearLater = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
      
      let currentStart = new Date(startDate);
      
      if (pattern === 'weekly' && dayOfWeek !== undefined) {
        // Weekly recurrence
        const startDay = startDate.getDay();
        console.log(`📅 [WEEKLY] Start day of week: ${startDay}, Target day: ${dayOfWeek}`);
        
        // Find first occurrence on the target day
        while (currentStart.getDay() !== dayOfWeek && currentStart < oneYearLater) {
          currentStart.setDate(currentStart.getDate() + 1);
        }
        
        // Generate weekly occurrences
        while (currentStart < oneYearLater) {
          const currentEnd = new Date(currentStart.getTime() + durationMs);
          const datesInRange = getDatesBetween(
            currentStart.toISOString().split('T')[0],
            currentEnd.toISOString().split('T')[0]
          );
          dates.push(...datesInRange);
          currentStart.setDate(currentStart.getDate() + 7); // Next week
        }
      } else if (pattern === 'monthly') {
        // Monthly recurrence - same day each month
        const dayOfMonth = startDate.getDate();
        console.log(`📅 [MONTHLY] Day of month: ${dayOfMonth}`);
        
        while (currentStart < oneYearLater) {
          const currentEnd = new Date(currentStart.getTime() + durationMs);
          const datesInRange = getDatesBetween(
            currentStart.toISOString().split('T')[0],
            currentEnd.toISOString().split('T')[0]
          );
          dates.push(...datesInRange);
          
          // Move to same day next month
          currentStart.setMonth(currentStart.getMonth() + 1);
        }
      }
      
      console.log(`📅 [RECURRING] Generated ${dates.length} dates for pattern ${pattern}`);
      return dates;
    };
    
    // Mark each unavailability date range on the calendar
    unavailabilityList.forEach((item) => {
      console.log('📍 Processing item:', item);
      
      // Get dates to display
      let datesInRange: string[] = [];
      
      if (item.isRecurring && item.recurrencePattern) {
        console.log('📍 Item is recurring:', item.recurrencePattern);
        // Parse the dateRange to get start and end dates
        const dateRangeParts = item.dateRange.split(' - ');
        let startDate = dateRangeParts[0];
        let endDate = dateRangeParts[dateRangeParts.length - 1];
        
        // Convert date format from "2025 Oct 18" to "2025-10-18"
        const parseDate = (dateStr: string): string => {
          const parts = dateStr.trim().split(' ');
          const year = parts[0];
          const monthStr = parts[1];
          const day = parts[2];
          
          const months: { [key: string]: string } = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
            'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
            'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
          };
          
          const month = months[monthStr] || '01';
          return `${year}-${month}-${day.padStart(2, '0')}`;
        };
        
        startDate = parseDate(startDate);
        endDate = parseDate(endDate);
        
        datesInRange = getRecurringDates(startDate, endDate, item.recurrencePattern, item.dayOfWeek);
      } else {
        // Non-recurring - just get the single range
        const dateRangeParts = item.dateRange.split(' - ');
        let startDate = dateRangeParts[0];
        let endDate = dateRangeParts[dateRangeParts.length - 1];
        
        const parseDate = (dateStr: string): string => {
          const parts = dateStr.trim().split(' ');
          const year = parts[0];
          const monthStr = parts[1];
          const day = parts[2];
          
          const months: { [key: string]: string } = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
            'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
            'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
          };
          
          const month = months[monthStr] || '01';
          return `${year}-${month}-${day.padStart(2, '0')}`;
        };
        
        startDate = parseDate(startDate);
        endDate = parseDate(endDate);
        
        datesInRange = getDatesBetween(startDate, endDate);
      }
      
      // Determine color based on recurrence
      console.log('🎨 [COLOR] Item:', item);
      console.log('🎨 [COLOR] isRecurring:', item.isRecurring, 'Type:', typeof item.isRecurring);
      console.log('🎨 [COLOR] recurrencePattern:', item.recurrencePattern, 'Type:', typeof item.recurrencePattern);
      
      let displayColor = '#FFC107'; // Default yellow for normal schedules
      let displayDotColor = '#FFC107';
      
      console.log('🎨 [COLOR] Checking: item.isRecurring =', item.isRecurring);
      console.log('🎨 [COLOR] Checking: item.recurrencePattern =', item.recurrencePattern);
      
      if (item.isRecurring && item.recurrencePattern === 'weekly') {
        console.log('🎨 [COLOR] Setting to WEEKLY (Amber/Orange)');
        displayColor = '#FF9800'; // Amber/Orange for weekly recurring
        displayDotColor = '#FF9800';
      } else if (item.isRecurring && item.recurrencePattern === 'monthly') {
        console.log('🎨 [COLOR] Setting to MONTHLY (Deep Orange)');
        displayColor = '#FF6F00'; // Deep orange for monthly recurring
        displayDotColor = '#FF6F00';
      } else {
        console.log('🎨 [COLOR] Setting to DEFAULT (Yellow)');
      }
      
      // Mark each date with filled circle styling and connecting line
      datesInRange.forEach((date, index) => {
        // For recurring, don't use startingDay/endingDay styling
        const isRecurring = item.isRecurring;
        
        marked[date] = {
          marked: true,
          startingDay: !isRecurring && index === 0,
          endingDay: !isRecurring && index === datesInRange.length - 1,
          color: displayColor,
          textColor: '#ffffff',
          selected: true,
          selectedColor: displayColor,
          selectedTextColor: '#ffffff',
          dotColor: displayDotColor,
          recurring: item.isRecurring,
          recurrencePattern: item.recurrencePattern,
        };
      });
    });
    
    console.log('✨ Final marked dates:', marked);
    setSelectedDates(marked);
  };

  // Function to format date range
  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      return `${year} ${month} ${day}`;
    };

    if (start === end) {
      return formatDate(startDate);
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Function to add new unavailability
  const handleAddUnavailability = () => {
    if (!startDate || !userToken) {
      Alert.alert('Error', 'Please select a start date');
      return;
    }

    // Validate that start date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedStartDate = new Date(startDate);
    selectedStartDate.setHours(0, 0, 0, 0);

    if (selectedStartDate < today) {
      Alert.alert('Error', 'You cannot create schedules for past dates. Please select a date from today onwards.');
      return;
    }

    // Validate that end date is not before start date
    if (endDate) {
      const selectedEndDate = new Date(endDate);
      selectedEndDate.setHours(0, 0, 0, 0);
      if (selectedEndDate < selectedStartDate) {
        Alert.alert('Error', 'End date cannot be before start date');
        return;
      }
    }

    // Show confirmation dialog
    setShowAddConfirm(true);
  };

  // Confirm add unavailability
  const confirmAddUnavailability = async () => {
    try {
      // Validate recurring settings
      if (isRecurring && !recurrencePattern) {
        Alert.alert('Error', 'Please select a recurrence pattern (Weekly or Monthly)');
        setShowAddConfirm(false);
        return;
      }

      setUpdating(true);
      console.log('📤 Confirmed - Saving unavailability');
      
      // Format dates as yyyy-MM-dd for the API
      const formatDateForAPI = (dateString: string): string => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const fromDate = formatDateForAPI(startDate);
      const toDate = formatDateForAPI(endDate || startDate);

      const params = new URLSearchParams({
        userId: userToken!.id,
        providerId: userToken!.id,
        providerType: 'guide',
        fromDate: fromDate,
        toDate: toDate,
        reason: reason || '',
        notes: notes || '',
        isRecurring: isRecurring ? 'true' : 'false',
        recurrencePattern: recurrencePattern || '',
      });

      console.log('📤 Saving unavailability with params:', params.toString());
      
      const response = await fetch(`http://localhost:8080/api/availability/create-unavailability?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.text();
        console.log('✅ Response:', data);
        
        // Close modals and reset form FIRST
        setShowAddModal(false);
        setShowAddConfirm(false);
        resetAddModal();
        
        // THEN fetch the updated unavailability list
        if (userToken) {
          await fetchUnavailability(userToken.id);
        }
        
        // Show success alert AFTER data is loaded
        Alert.alert('Success', 'Unavailability added successfully');
      } else {
        try {
          const errorData = await response.json();
          Alert.alert('Error', errorData.message || `Failed to add unavailability (${response.status})`);
        } catch {
          const errorText = await response.text();
          Alert.alert('Error', errorText || `Failed to add unavailability (${response.status})`);
        }
      }
    } catch (error) {
      console.error('Error adding unavailability:', error);
      Alert.alert('Error', 'Failed to add unavailability');
    } finally {
      setUpdating(false);
    }
  };

  // Cancel add confirmation
  const cancelAddConfirm = () => {
    console.log('Cancel add confirmation');
    setShowAddConfirm(false);
  };



  // Function to delete unavailability
  const handleRemoveUnavailability = (id: string) => {
    console.warn('🗑️ [DELETE] Show delete confirmation for ID:', id);
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      console.warn('🗑️ [DELETE] Confirmed delete for:', itemToDelete);
      setUpdating(true);
      
      const token = await AsyncStorage.getItem('token');
      console.warn('🗑️ [DELETE] Token:', token ? '✓' : '✗');
      
      if (!token) {
        Alert.alert('Error', 'No authentication token');
        setUpdating(false);
        return;
      }
      
      if (!userToken?.id) {
        Alert.alert('Error', 'No user ID');
        setUpdating(false);
        return;
      }
      
      const userId = userToken.id;
      const url = `http://localhost:8080/api/availability/delete-user-unavailability?userId=${userId}&unavailabilityId=${itemToDelete}`;
      
      console.warn('🗑️ [DELETE] Calling URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.warn('🗑️ [DELETE] Response status:', response.status);
      
      if (response.ok) {
        console.warn('✅ [DELETE] Success!');
        Alert.alert('Success', 'Unavailability removed successfully');
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        fetchUnavailability(userId);
      } else {
        console.warn('❌ [DELETE] Error status:', response.status);
        const errorText = await response.text();
        console.warn('❌ [DELETE] Error:', errorText);
        Alert.alert('Error', `Failed (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.warn('❌ [DELETE] Exception:', error);
      Alert.alert('Error', String(error));
    } finally {
      setUpdating(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    console.warn('🗑️ [DELETE] Delete cancelled');
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  // Helper function to reset modal
  const resetAddModal = () => {
    setStartDate('');
    setEndDate('');
    setReason('');
    setNotes('');
    setIsRecurring(false);
    setRecurrencePattern('');
    setIsSelectingStartDate(true);
  };



  // Create marked dates for the modal calendar
  const getModalMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    // Helper function to parse date format
    const parseDate = (dateStr: string): string => {
      const parts = dateStr.trim().split(' ');
      const year = parts[0];
      const monthStr = parts[1];
      const day = parts[2];
      
      const months: { [key: string]: string } = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
      
      const month = months[monthStr] || '01';
      return `${year}-${month}-${day.padStart(2, '0')}`;
    };

    // Helper function to get all dates between two dates
    const getDatesBetween = (startStr: string, endStr: string): string[] => {
      const dates: string[] = [];
      const start = new Date(startStr);
      const end = new Date(endStr);
      
      const current = new Date(start);
      while (current <= end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${day}`);
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };

    // Helper function to generate recurring dates (same as in updateCalendarMarking)
    const getRecurringDates = (startStr: string, endStr: string, pattern: string, dayOfWeek?: number): string[] => {
      const dates: string[] = [];
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      
      // Get the duration of one occurrence
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
      
      // Generate recurring instances for the next 12 months
      const today = new Date();
      const oneYearLater = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
      
      let currentStart = new Date(startDate);
      
      if (pattern === 'weekly' && dayOfWeek !== undefined) {
        // Weekly recurrence
        while (currentStart.getDay() !== dayOfWeek && currentStart < oneYearLater) {
          currentStart.setDate(currentStart.getDate() + 1);
        }
        
        // Generate weekly occurrences
        while (currentStart < oneYearLater) {
          const currentEnd = new Date(currentStart.getTime() + durationMs);
          const datesInRange = getDatesBetween(
            currentStart.toISOString().split('T')[0],
            currentEnd.toISOString().split('T')[0]
          );
          dates.push(...datesInRange);
          currentStart.setDate(currentStart.getDate() + 7); // Next week
        }
      } else if (pattern === 'monthly') {
        // Monthly recurrence - same day each month
        const dayOfMonth = startDate.getDate();
        
        while (currentStart < oneYearLater) {
          const currentEnd = new Date(currentStart.getTime() + durationMs);
          const datesInRange = getDatesBetween(
            currentStart.toISOString().split('T')[0],
            currentEnd.toISOString().split('T')[0]
          );
          dates.push(...datesInRange);
          
          // Move to same day next month
          currentStart.setMonth(currentStart.getMonth() + 1);
        }
      }
      
      return dates;
    };

    // Mark all existing unavailable dates with recurring patterns
    currentUnavailability.forEach((item) => {
      const dateRangeParts = item.dateRange.split(' - ');
      let itemStartDate = dateRangeParts[0];
      let itemEndDate = dateRangeParts[dateRangeParts.length - 1];
      
      itemStartDate = parseDate(itemStartDate);
      itemEndDate = parseDate(itemEndDate);
      
      let datesInRange: string[] = [];
      let displayColor = '#FFC107'; // Default yellow for normal schedules
      
      // Determine color and dates based on recurrence
      if (item.isRecurring && item.recurrencePattern) {
        if (item.recurrencePattern === 'weekly') {
          displayColor = '#FF9800'; // Amber/Orange for weekly recurring
          datesInRange = getRecurringDates(itemStartDate, itemEndDate, item.recurrencePattern, item.dayOfWeek);
        } else if (item.recurrencePattern === 'monthly') {
          displayColor = '#FF6F00'; // Deep orange for monthly recurring
          datesInRange = getRecurringDates(itemStartDate, itemEndDate, item.recurrencePattern, item.dayOfWeek);
        }
      } else {
        // Normal schedule - yellow color
        displayColor = '#FFC107';
        datesInRange = getDatesBetween(itemStartDate, itemEndDate);
      }
      
      datesInRange.forEach((date) => {
        // Mark all existing unavailable dates with appropriate color
        marked[date] = {
          marked: true,
          color: displayColor,
          textColor: '#ffffff',
          selected: true,
          selectedColor: displayColor,
          selectedTextColor: '#ffffff',
          disableTouchEvent: true,
        };
      });
    });

    // Mark selected start date (has priority over existing dates)
    if (startDate && showAddModal) {
      marked[startDate] = {
        selected: true,
        selectedColor: '#4CAF50',
        marked: true
      };
    }

    // Mark selected end date (has priority over existing dates)
    if (endDate && showAddModal) {
      marked[endDate] = {
        selected: true,
        selectedColor: '#ff9800',
        marked: true
      };
    }

    return marked;
  };

  // Animation styles and toggle function for the menu
  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const toggleMenu = () => {
    setShow(!show);
    if (!show) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      translateX.value = withTiming(-1000, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(0, { duration: 300 });
    }
  };


  const toggling = () => {
    setNotify(!notify);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Topbar pressing={toggleMenu} notifying={toggling} on={notify} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton />
        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            minDate={new Date().toISOString().split('T')[0]}
            onDayPress={handleDateSelection}
            markedDates={selectedDates}
            theme={{
              selectedDayBackgroundColor: '#ff9800',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#ff9800',
              arrowColor: '#ff9800',
              monthTextColor: '#2d4150',
              indicatorColor: 'blue',
              disabledArrowColor: '#d9e1e8',
              textDisabledColor: '#d9e1e8',
            }}
          />
        </View>

        {/* Color Legend for Bookings */}
        <View style={styles.colorLegendSection}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: '#fbff00ff' }]} />
              <Text style={styles.legendText}>Pending </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Accepted</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: '#1565C0' }]} />
              <Text style={styles.legendText}>Completed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: '#ff0f07ff' }]} />
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
          </View>
        </View>

        {/* Current Unavailability Section */}
        <View style={styles.unavailabilitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.title}>Current Unavailability</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                resetAddModal();
                setShowAddModal(true);
              }}
              disabled={loading}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ff9800" />
              <Text style={styles.loadingText}>Loading unavailability...</Text>
            </View>
          ) : currentUnavailability.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-clear-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No unavailability scheduled</Text>
              <Text style={styles.emptySubtext}>Add dates when you're not available</Text>
            </View>
          ) : (
            currentUnavailability.map((unavailability: UnavailabilityItem, index: number) => (
              <Animated.View 
                key={unavailability.id} 
                entering={FadeInDown.delay(index * 100)}
                style={styles.unavailabilityItem}
              >
                <View style={styles.unavailabilityHeader}>
                  <View style={styles.dateIconContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#ff9800" />
                  </View>
                  <View style={styles.dateInfoContainer}>
                    <Text style={styles.unavailabilityDate}>{unavailability.dateRange}</Text>
                    <View style={styles.durationContainer}>
                      <Ionicons name="time-outline" size={12} color="#999" />
                      <Text style={styles.unavailabilityDuration}>{unavailability.duration}</Text>
                    </View>
                    {unavailability.reason && (
                      <Text style={styles.reasonText}>Reason: {unavailability.reason}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveUnavailability(unavailability.id)}
                    disabled={updating}
                  >
                    <Ionicons name="trash-outline" size={14} color="#e74c3c" style={{ marginRight: 4 }} />
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Unavailability Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddModal(false);
          resetAddModal();
        }}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Unavailability</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowAddModal(false);
                  resetAddModal();
                }}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateSelectionInfo}>
              <Text style={styles.instructionText}>
                {isSelectingStartDate ? 'Select start date' : 'Select end date'}
              </Text>
              <View style={styles.dateTableContainer}>
                <View style={styles.dateTableRow}>
                  <View style={styles.dateTableCell}>
                    <Text style={styles.dateTableLabel}>Start Date</Text>
                    <Text style={styles.dateTableValue}>
                      {startDate ? new Date(startDate).toLocaleDateString() : '—'}
                    </Text>
                  </View>
                  <View style={styles.dateTableCell}>
                    <Text style={styles.dateTableLabel}>End Date</Text>
                    <Text style={styles.dateTableValue}>
                      {endDate ? new Date(endDate).toLocaleDateString() : '—'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Calendar
              current={startDate || new Date().toISOString().split('T')[0]}
              minDate={new Date().toISOString().split('T')[0]}
              onDayPress={handleModalDateSelection}
              markedDates={getModalMarkedDates()}
              theme={{
                selectedDayBackgroundColor: isSelectingStartDate ? '#4CAF50' : '#ff9800',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#ff9800',
                arrowColor: '#ff9800',
                monthTextColor: '#2d4150',
                disabledArrowColor: '#d9e1e8',
                textDisabledColor: '#d9e1e8',
              }}
            />

            {/* Reason Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Reason (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Personal Leave, Medical"
                value={reason}
                onChangeText={setReason}
                placeholderTextColor="#999"
              />
            </View>

            {/* Notes Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                placeholder="Add any additional details..."
                value={notes}
                onChangeText={setNotes}
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Recurring Section */}
            <View style={styles.recurringContainer}>
              <TouchableOpacity
                style={styles.recurringToggle}
                onPress={() => setIsRecurring(!isRecurring)}
              >
                <View style={[styles.checkbox, isRecurring && styles.checkboxChecked]}>
                  {isRecurring && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
                <Text style={styles.recurringLabel}>Is this recurring?</Text>
              </TouchableOpacity>

              {isRecurring && (
                <View style={styles.recurringOptions}>
                  <TouchableOpacity
                    style={[styles.recurringOption, recurrencePattern === 'weekly' && styles.recurringOptionActive]}
                    onPress={() => setRecurrencePattern('weekly')}
                  >
                    <Text style={[styles.recurringOptionText, recurrencePattern === 'weekly' && styles.recurringOptionTextActive]}>Weekly</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.recurringOption, recurrencePattern === 'monthly' && styles.recurringOptionActive]}
                    onPress={() => setRecurrencePattern('monthly')}
                  >
                    <Text style={[styles.recurringOptionText, recurrencePattern === 'monthly' && styles.recurringOptionTextActive]}>Monthly</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  resetAddModal();
                }}
                disabled={updating}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, !startDate && styles.saveButtonDisabled]}
                onPress={handleAddUnavailability}
                disabled={!startDate || updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Add Confirmation Modal */}
      <Modal
        visible={showAddConfirm}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelAddConfirm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addConfirmContainer}>
            <Ionicons name="warning-outline" size={48} color="#ff9800" style={{ marginBottom: 16 }} />
            <Text style={styles.addConfirmTitle}>Mark as Unavailable?</Text>
            <Text style={styles.addConfirmMessage}>
              During this period, you <Text style={styles.addConfirmHighlight}>won't receive any booking requests</Text> from customers.
            </Text>
            
            {isRecurring && (
              <View style={styles.recurringInfoBox}>
                <Ionicons name="repeat" size={18} color="#FF9800" style={{ marginRight: 8 }} />
                <Text style={styles.recurringInfoText}>
                  Recurring: <Text style={styles.recurringInfoBold}>{recurrencePattern?.toUpperCase()}</Text>
                </Text>
              </View>
            )}
            
            <Text style={styles.addConfirmSubMessage}>
              Please make sure this is the correct period before confirming.
            </Text>

            <View style={styles.addConfirmButtonContainer}>
              <TouchableOpacity
                style={styles.addConfirmCancelButton}
                onPress={cancelAddConfirm}
                disabled={updating}
              >
                <Text style={styles.addConfirmCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addConfirmConfirmButton, updating && styles.addConfirmConfirmButtonDisabled]}
                onPress={confirmAddUnavailability}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.addConfirmConfirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Details Modal */}
      <Modal
        visible={showDateDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDateDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dateDetailsContainer}>
            <View style={styles.dateDetailsHeader}>
              <TouchableOpacity
                onPress={() => setShowDateDetailsModal(false)}
                style={styles.dateDetailsCloseButton}
              >
                <Ionicons name="close" size={28} color="#2d4150" />
              </TouchableOpacity>
              <Text style={styles.dateDetailsTitle}>Schedule Details</Text>
              <View style={{ width: 28 }} />
            </View>

            {selectedDateDetails && (
              <ScrollView style={styles.dateDetailsContent}>
                {/* Date Range */}
                <View style={styles.dateDetailsSection}>
                  <View style={styles.dateDetailsSectionHeader}>
                    <Ionicons name="calendar-outline" size={20} color="#FF9800" />
                    <Text style={styles.dateDetailsSectionTitle}>Date Range</Text>
                  </View>
                  <Text style={styles.dateDetailsValue}>{selectedDateDetails.dateRange}</Text>
                </View>

                {/* Duration */}
                <View style={styles.dateDetailsSection}>
                  <View style={styles.dateDetailsSectionHeader}>
                    <Ionicons name="time-outline" size={20} color="#FF9800" />
                    <Text style={styles.dateDetailsSectionTitle}>Duration</Text>
                  </View>
                  <Text style={styles.dateDetailsValue}>{selectedDateDetails.duration}</Text>
                </View>

                {/* Recurrence Info */}
                {selectedDateDetails.isRecurring && selectedDateDetails.recurrencePattern && (
                  <View style={styles.dateDetailsSection}>
                    <View style={styles.dateDetailsSectionHeader}>
                      <Ionicons name="repeat-outline" size={20} color="#FF9800" />
                      <Text style={styles.dateDetailsSectionTitle}>Recurrence</Text>
                    </View>
                    <Text style={styles.dateDetailsValue}>
                      {selectedDateDetails.recurrencePattern.charAt(0).toUpperCase() + selectedDateDetails.recurrencePattern.slice(1)} Recurring
                    </Text>
                  </View>
                )}

                {/* Reason */}
                {selectedDateDetails.reason && (
                  <View style={styles.dateDetailsSection}>
                    <View style={styles.dateDetailsSectionHeader}>
                      <Ionicons name="document-text-outline" size={20} color="#FF9800" />
                      <Text style={styles.dateDetailsSectionTitle}>Reason</Text>
                    </View>
                    <Text style={styles.dateDetailsValue}>{selectedDateDetails.reason}</Text>
                  </View>
                )}

                {/* Notes */}
                {selectedDateDetails.notes && (
                  <View style={styles.dateDetailsSection}>
                    <View style={styles.dateDetailsSectionHeader}>
                      <Ionicons name="chatbox-outline" size={20} color="#FF9800" />
                      <Text style={styles.dateDetailsSectionTitle}>Notes</Text>
                    </View>
                    <Text style={styles.dateDetailsValue}>{selectedDateDetails.notes}</Text>
                  </View>
                )}

                {/* No additional info message */}
                {!selectedDateDetails.reason && !selectedDateDetails.notes && (
                  <View style={styles.dateDetailsEmptySection}>
                    <Ionicons name="information-circle-outline" size={32} color="#ccc" />
                    <Text style={styles.dateDetailsEmptyText}>No additional details provided</Text>
                  </View>
                )}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.dateDetailsCloseActionButton}
              onPress={() => setShowDateDetailsModal(false)}
            >
              <Text style={styles.dateDetailsCloseActionButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteConfirmContainer}>
            <Ionicons name="trash-outline" size={48} color="#e74c3c" style={{ marginBottom: 16 }} />
            <Text style={styles.deleteConfirmTitle}>Delete Unavailability?</Text>
            <Text style={styles.deleteConfirmMessage}>
              Are you sure you want to remove this unavailability? This action cannot be undone.
            </Text>

            <View style={styles.deleteConfirmButtonContainer}>
              <TouchableOpacity
                style={styles.deleteConfirmCancelButton}
                onPress={cancelDelete}
                disabled={updating}
              >
                <Text style={styles.deleteConfirmCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteConfirmDeleteButton, updating && styles.deleteConfirmDeleteButtonDisabled]}
                onPress={confirmDelete}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.deleteConfirmDeleteButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 16,
  },
  topbar: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  calendarSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 50,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  unavailabilitySection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d4150',
    letterSpacing: 0.3,
  },
  addButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  unavailabilityItem: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EEF5',
    borderRadius: 12,
    backgroundColor: '#FAFBFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  unavailabilityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  dateIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateInfoContainer: {
    flex: 1,
  },
  unavailabilityDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d4150',
    letterSpacing: 0.2,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  unavailabilityDuration: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  updateButton: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  updateButtonText: {
    color: '#E67E22',
    fontSize: 13,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  removeButtonText: {
    color: '#e74c3c',
    fontSize: 13,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d4150',
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    color: '#999',
    fontWeight: 'bold',
  },
  dateSelectionInfo: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d4150',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  selectedDateText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '500',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#F5F7FA',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Loading and empty states
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 13,
    color: '#999',
  },
  reasonText: {
    fontSize: 12,
    color: '#E67E22',
    marginTop: 4,
    fontWeight: '500',
  },
  // Input fields
  inputContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#2d4150',
    backgroundColor: '#F5F7FA',
  },
  textAreaInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  // Recurring options
  recurringContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF5',
  },
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  recurringLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
  },
  recurringOptions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  recurringOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  recurringOptionActive: {
    backgroundColor: '#FFE0B2',
    borderColor: '#ff9800',
  },
  recurringOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  recurringOptionTextActive: {
    color: '#E67E22',
    fontWeight: '600',
  },
  // Date table styles
  dateTableContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  dateTableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  dateTableCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  dateTableLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateTableValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  // Add confirmation modal styles
  addConfirmContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 28,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  addConfirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d4150',
    marginBottom: 12,
    textAlign: 'center',
  },
  addConfirmMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  addConfirmHighlight: {
    fontWeight: '700',
    color: '#e74c3c',
  },
  addConfirmSubMessage: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  addConfirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  addConfirmCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addConfirmCancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addConfirmConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addConfirmConfirmButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
  },
  addConfirmConfirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  recurringInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  recurringInfoText: {
    fontSize: 13,
    color: '#E65100',
    fontWeight: '500',
  },
  recurringInfoBold: {
    fontWeight: '700',
    color: '#BF360C',
  },
  // Delete confirmation modal styles
  deleteConfirmContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 28,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  deleteConfirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d4150',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteConfirmMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  deleteConfirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  deleteConfirmCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteConfirmCancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteConfirmDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteConfirmDeleteButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
  },
  deleteConfirmDeleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Date Details Modal Styles
  dateDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  dateDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateDetailsCloseButton: {
    padding: 8,
  },
  dateDetailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d4150',
  },
  dateDetailsContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dateDetailsSection: {
    marginBottom: 20,
  },
  dateDetailsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateDetailsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginLeft: 8,
  },
  dateDetailsValue: {
    fontSize: 16,
    color: '#4a5f6f',
    fontWeight: '500',
    paddingLeft: 28,
  },
  dateDetailsEmptySection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  dateDetailsEmptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  dateDetailsCloseActionButton: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  dateDetailsCloseActionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Color Legend Styles
  colorLegendSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
  },
});