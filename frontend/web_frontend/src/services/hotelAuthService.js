import axios from 'axios';

// Base URL for API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Axios instance for hotel admin API calls with JWT auth
const hotelApiClient = axios.create({
  baseURL: API_URL
});

// Request interceptor to add JWT token to requests
hotelApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hotelAuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
hotelApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 errors by redirecting to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('hotelAuthToken');
      localStorage.removeItem('hotelUserData');
      // Redirect to login if needed
      window.location.href = '/hotel/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Hotel authentication service
 */
const HotelAuthService = {
  /**
   * Login hotel admin
   * @param {string} username - Hotel admin username
   * @param {string} password - Hotel admin password
   * @returns {Promise} - Promise with auth response
   */
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/hotels/login`, { username, password });
      
      if (response.data && response.data.token) {
        // Save token to local storage
        localStorage.setItem('hotelAuthToken', response.data.token);
        
        // Extract and save hotel user data if needed
        const userData = {
          username,
          // Add any other user data needed
        };
        localStorage.setItem('hotelUserData', JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  /**
   * Register a new hotel admin
   * @param {Object} hotelData - Hotel registration data
   * @returns {Promise} - Promise with registration response
   */
  register: async (hotelData) => {
    try {
      const response = await axios.post(`${API_URL}/hotels/register`, hotelData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  /**
   * Logout hotel admin
   */
  logout: () => {
    localStorage.removeItem('hotelAuthToken');
    localStorage.removeItem('hotelUserData');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  /**
   * Check if hotel admin is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('hotelAuthToken');
  },
  
  /**
   * Get current hotel user data
   * @returns {Object|null} - Hotel user data or null
   */
  getCurrentUser: () => {
    const userData = localStorage.getItem('hotelUserData');
    return userData ? JSON.parse(userData) : null;
  },
  
  /**
   * Get JWT token
   * @returns {string|null} - JWT token or null
   */
  getToken: () => {
    return localStorage.getItem('hotelAuthToken');
  },
};

/**
 * Hotel room management service using authenticated API client
 */
const HotelRoomService = {
  /**
   * Get all rooms for the current hotel
   * @returns {Promise} - Promise with rooms data
   */
  getAllRooms: async () => {
    try {
      const response = await hotelApiClient.get('/hotel-rooms');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      throw error;
    }
  },
  
  /**
   * Add a new room
   * @param {Object} roomData - Room data
   * @returns {Promise} - Promise with created room data
   */
  addRoom: async (roomData) => {
    try {
      const response = await hotelApiClient.post('/hotel-rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Failed to add room:', error);
      throw error;
    }
  },
  
  /**
   * Update a room
   * @param {string} roomId - Room ID
   * @param {Object} roomData - Updated room data
   * @returns {Promise} - Promise with updated room data
   */
  updateRoom: async (roomId, roomData) => {
    try {
      const response = await hotelApiClient.put(`/hotel-rooms/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update room ${roomId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a room
   * @param {string} roomId - Room ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteRoom: async (roomId) => {
    try {
      const response = await hotelApiClient.delete(`/hotel-rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete room ${roomId}:`, error);
      throw error;
    }
  },
};

export { HotelAuthService, HotelRoomService, hotelApiClient };
