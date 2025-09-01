import axios from 'axios';
import { hotelApiClient } from './hotelAuthService';

// Define base URL from environment or use a default
// Using Vite's approach to environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// We'll use the hotelApiClient from hotelAuthService that already has token handling
// This ensures we're using the same authentication mechanism across services
const apiClient = hotelApiClient;

// Add response interceptor with retry mechanism
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If error is a CORS error or network error and we haven't retried yet
    if ((error.message === 'Network Error' || 
        (error.response && error.response.status === 0)) && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try again
      return apiClient(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Bookings API service
const bookingService = {
  // Get all bookings
  getAllBookings: async () => {
    try {
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('No user data found');
        return [];
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain hotel ID:', userObj);
        return [];
      }
      
      // Include hotel ID as query parameter to filter by hotel
      // Note: The path should include the /api prefix that the backend expects
      const response = await apiClient.get(`/api/admin-hotel-bookings?hotelId=${hotelId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.response) {
        console.error('Server error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received from server');
      } else {
        console.error('Error message:', error.message);
      }
      return []; // Return empty array for graceful degradation
    }
  },

  // Get booking by ID - Note: This endpoint might not be available in the backend yet
  getBookingById: async (id) => {
    try {
      // Note: The path should include the /api prefix that the backend expects
      const response = await apiClient.get(`/api/admin-hotel-bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      // Get the hotel ID from user data to include with the booking
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      console.log('User data:', userObj);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain hotel ID:', userObj);
        throw new Error('Hotel ID not found in user data.');
      }
      
      // Transform the frontend booking model to match the backend model
      const transformedData = {
        hotelId: hotelId, // Include the hotel ID with the booking
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        roomType: bookingData.roomType,
        // Ensure roomNumber is an integer, use default 0 if conversion fails
        roomNumber: bookingData.roomNumber ? parseInt(bookingData.roomNumber, 10) || 0 : 0,
        checkIn: bookingData.checkIn, // Will be converted to LocalDate in backend
        checkOut: bookingData.checkOut, // Will be converted to LocalDate in backend
        status: bookingData.status,
        totalCost: bookingData.totalAmount
      };
      
      console.log('Creating booking with data:', transformedData);
      
      // Get token directly from hotelAuthToken
      const token = localStorage.getItem('hotelAuthToken');
      
      if (!token) {
        console.error('No hotel auth token found');
        alert('Your session has expired. Please log in again.');
        // Redirect to login
        window.location.href = '/hotel/login';
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('Using hotel auth token:', token.substring(0, 20) + '...');
      
      // Send the request using the API client
      // Note: The path should include the /api prefix that the backend expects
      try {
        const response = await apiClient.post('/api/admin-hotel-bookings', transformedData);
        console.log('Booking creation successful:', response.data);
        
        // Update room status based on booking status
        try {
          // Import dynamically to avoid circular dependencies
          const { default: roomService } = await import('./roomService');
          
          // Determine appropriate room status based on booking status
          let newRoomStatus;
          if (transformedData.status === 'Confirmed') {
            newRoomStatus = 'Booked';
          } else if (transformedData.status === 'Cancelled') {
            newRoomStatus = 'Available';
          } else {
            newRoomStatus = 'Reserved';
          }
          
          console.log(`Updating room status after booking creation: ${transformedData.roomType} ${transformedData.roomNumber} -> ${newRoomStatus}`);
          await roomService.updateRoomStatus(
            transformedData.roomType,
            transformedData.roomNumber,
            newRoomStatus
          );
          console.log(`Room status updated successfully to ${newRoomStatus}`);
        } catch (roomError) {
          console.error('Failed to update room status after booking creation:', roomError);
          // Don't fail the booking creation if room status update fails
          // Just log the error and continue
        }
        
        return response.data;
      } catch (apiError) {
        console.error('API error during booking creation:', apiError);
        
        if (apiError.response) {
          console.error('Status:', apiError.response.status);
          console.error('Data:', apiError.response.data);
          console.error('Headers:', apiError.response.headers);
          
          if (apiError.response.status === 401) {
            // Token is invalid or expired
            alert('Your session has expired. Please log in again.');
            localStorage.removeItem('hotelAuthToken');
            localStorage.removeItem('user');
            // Redirect to login page
            window.location.href = '/hotel/login';
          }
        }
        throw apiError;
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.response) {
        console.error('Server error response:', error.response.status, error.response.data);
        
        // Check for specific error types
        if (error.response.status === 401) {
          console.error('Authentication error. Token might be invalid or expired.');
        } else if (error.response.status === 400) {
          console.error('Bad request. Check the data format:', error.response.data);
        }
      } else if (error.request) {
        console.error('No response received from server. Network issues or server might be down.');
      } else {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    try {
      // Get the hotel ID from user data to include with the booking
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain hotel ID:', userObj);
        throw new Error('Hotel ID not found in user data.');
      }

      // Save original booking data for comparison
      const originalBooking = await apiClient.get(`/api/admin-hotel-bookings/${id}`).then(res => res.data);
      console.log('Original booking before update:', originalBooking);

      // Transform the frontend booking model to match the backend model
      const transformedData = {
        id: bookingData.id,
        hotelId: hotelId, // Include hotel ID
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        roomType: bookingData.roomType,
        roomNumber: parseInt(bookingData.roomNumber, 10) || 0,
        checkIn: bookingData.checkIn, // Will be converted to LocalDate in backend
        checkOut: bookingData.checkOut, // Will be converted to LocalDate in backend
        status: bookingData.status,
        totalCost: bookingData.totalAmount
      };
      
      console.log('Sending update request for booking:', id, transformedData);
      // Note: The path should include the /api prefix that the backend expects
      const response = await apiClient.put(`/api/admin-hotel-bookings/${id}`, transformedData);
      console.log('Update response:', response);
      
      // Update room status based on booking status
      try {
        // Import dynamically to avoid circular dependencies
        const { default: roomService } = await import('./roomService');
        
        // If the room or status has changed, we need to update multiple rooms
        if (originalBooking && (
            originalBooking.roomType !== transformedData.roomType ||
            originalBooking.roomNumber !== transformedData.roomNumber ||
            originalBooking.status !== transformedData.status
          )) {
          
          // 1. If room changed, mark the old room as Available
          if (originalBooking.roomType !== transformedData.roomType || 
              originalBooking.roomNumber !== transformedData.roomNumber) {
            console.log(`Room changed from ${originalBooking.roomType} ${originalBooking.roomNumber} to ${transformedData.roomType} ${transformedData.roomNumber}`);
            console.log(`Marking old room as Available`);
            
            try {
              await roomService.updateRoomStatus(
                originalBooking.roomType,
                originalBooking.roomNumber,
                'Available'
              );
              console.log(`Old room marked as Available`);
            } catch (oldRoomError) {
              console.error('Error updating old room status:', oldRoomError);
            }
          }
          
          // 2. Update the new/current room status based on booking status
          let newRoomStatus;
          if (transformedData.status === 'Confirmed') {
            newRoomStatus = 'Booked';
          } else if (transformedData.status === 'Cancelled') {
            newRoomStatus = 'Available';
          } else {
            newRoomStatus = 'Reserved';
          }
          
          console.log(`Updating room status: ${transformedData.roomType} ${transformedData.roomNumber} -> ${newRoomStatus}`);
          await roomService.updateRoomStatus(
            transformedData.roomType,
            transformedData.roomNumber,
            newRoomStatus
          );
          console.log(`Room status updated to ${newRoomStatus}`);
        }
      } catch (roomError) {
        console.error('Failed to update room status after booking update:', roomError);
        // Don't fail the booking update if room status update fails
        // Just log the error and continue
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with error:', error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server. Check if server is running and CORS is configured correctly.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error details:', error.message);
      }
      throw error;
    }
  },

  // Delete booking
  deleteBooking: async (id) => {
    try {
      // Get the booking details before deletion to update room status later
      console.log('Getting booking details before deletion:', id);
      let bookingToDelete;
      try {
        const bookingResponse = await apiClient.get(`/api/admin-hotel-bookings/${id}`);
        bookingToDelete = bookingResponse.data;
        console.log('Booking to delete:', bookingToDelete);
      } catch (getError) {
        console.error('Error fetching booking before deletion:', getError);
        // Continue with deletion even if we couldn't fetch the booking details
      }
      
      // Delete the booking
      console.log('Sending delete request for booking:', id);
      // Note: The path should include the /api prefix that the backend expects
      const response = await apiClient.delete(`/api/admin-hotel-bookings/${id}`);
      console.log('Delete response:', response);
      
      // Update room status to Available after successful booking deletion
      if (bookingToDelete && bookingToDelete.roomType && bookingToDelete.roomNumber) {
        try {
          // Import dynamically to avoid circular dependencies
          const { default: roomService } = await import('./roomService');
          
          console.log(`Marking room as Available after booking deletion: ${bookingToDelete.roomType} ${bookingToDelete.roomNumber}`);
          await roomService.updateRoomStatus(
            bookingToDelete.roomType,
            bookingToDelete.roomNumber,
            'Available'
          );
          console.log('Room marked as Available after booking deletion');
        } catch (roomError) {
          console.error('Error updating room status after booking deletion:', roomError);
          // Don't fail the booking deletion if room status update fails
          // Just log the error and continue
        }
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with error:', error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server. Check if server is running and CORS is configured correctly.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error details:', error.message);
      }
      throw error;
    }
  },

  // Get available rooms (for a date range)
  getAvailableRooms: async (checkIn, checkOut, roomType = null) => {
    try {
      let url = `/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`;
      if (roomType) {
        url += `&roomType=${roomType}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  },

  // Test authentication
  testAuth: async () => {
    try {
      console.log('Testing authentication...');
      // Note: The path should include the /api prefix that the backend expects
      const response = await apiClient.get('/api/admin-hotel-bookings/test-auth');
      console.log('Authentication test successful:', response.data);
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Authentication test failed:', error);
      if (error.response) {
        console.error('Status:', error.response.status, 'Data:', error.response.data);
      }
      return { success: false, error: error.message, status: error.response?.status };
    }
  }
};

export default bookingService;