import axios from 'axios';

// Define base URL from environment or use a default
// Using Vite's approach to environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout for slow connections
  timeout: 10000,
});

// Add authorization interceptor (you can expand this later)
apiClient.interceptors.request.use(
  (config) => {
    // Get token from local storage with safety check for SSR or testing environments
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Local storage not accessible');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
      const response = await apiClient.get('/admin-hotel-bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking by ID - Note: This endpoint might not be available in the backend yet
  getBookingById: async (id) => {
    try {
      const response = await apiClient.get(`/admin-hotel-bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      // Transform the frontend booking model to match the backend model
      const transformedData = {
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        roomType: bookingData.roomType,
        roomNumber: parseInt(bookingData.roomNumber, 10),
        checkIn: bookingData.checkIn, // Will be converted to LocalDate in backend
        checkOut: bookingData.checkOut, // Will be converted to LocalDate in backend
        status: bookingData.status,
        totalCost: bookingData.totalAmount
      };
      
      const response = await apiClient.post('/admin-hotel-bookings', transformedData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    try {
      // Transform the frontend booking model to match the backend model
      const transformedData = {
        id: bookingData.id,
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        roomType: bookingData.roomType,
        roomNumber: parseInt(bookingData.roomNumber, 10),
        checkIn: bookingData.checkIn, // Will be converted to LocalDate in backend
        checkOut: bookingData.checkOut, // Will be converted to LocalDate in backend
        status: bookingData.status,
        totalCost: bookingData.totalAmount
      };
      
      console.log('Sending update request for booking:', id, transformedData);
      const response = await apiClient.put(`/admin-hotel-bookings/${id}`, transformedData);
      console.log('Update response:', response);
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
      console.log('Sending delete request for booking:', id);
      const response = await apiClient.delete(`/admin-hotel-bookings/${id}`);
      console.log('Delete response:', response);
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
  }
};

export default bookingService;