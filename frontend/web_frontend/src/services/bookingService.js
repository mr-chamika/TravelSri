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

// Bookings API service
const bookingService = {
  // Get all bookings
  getAllBookings: async () => {
    try {
      const response = await apiClient.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (id) => {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    try {
      const response = await apiClient.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  },

  // Delete booking
  deleteBooking: async (id) => {
    try {
      const response = await apiClient.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
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
