import axios from 'axios';
import { hotelApiClient } from './hotelAuthService';

// Base URL for API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Service for fetching hotel data
 */
const hotelService = {
  /**
   * Get a hotel by ID
   * @param {string} id - Hotel ID
   * @returns {Promise<Object>} - Promise with hotel data
   */
  getHotelById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch hotel with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get the currently logged-in hotel
   * @returns {Promise<Object>} - Promise with hotel data
   */
  getCurrentHotel: async () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        console.warn('No user data found in localStorage');
        return null;
      }
      
      let parsedUserData;
      try {
        parsedUserData = JSON.parse(userData);
      } catch (parseError) {
        console.error('Failed to parse user data:', parseError);
        return null;
      }
      
      const { id } = parsedUserData;
      
      if (!id) {
        console.warn('No hotel ID found in user data');
        return parsedUserData; // Return what we have from localStorage as fallback
      }
      
      // Try to get hotel data from API
      try {
        const response = await hotelApiClient.get(`/hotels/${id}`);
        if (response.data) {
          return {
            ...response.data,
            // Add any missing fields from localStorage if needed
            email: response.data.email || parsedUserData.email,
            hotelName: response.data.hotelName || parsedUserData.hotelName || parsedUserData.name || 'Hotel'
          };
        }
      } catch (apiError) {
        console.warn(`Failed to fetch hotel data from API:`, apiError);
        // Continue to fallback
      }
      
      // Fallback to basic data from localStorage
      return {
        id: parsedUserData.id,
        hotelName: parsedUserData.hotelName || parsedUserData.name || 'Hotel',
        email: parsedUserData.email || '',
        phone: parsedUserData.phone || '',
        address: parsedUserData.address || '',
        managerName: parsedUserData.managerName || '',
        website: parsedUserData.website || ''
      };
    } catch (error) {
      console.error('Failed to get current hotel:', error);
      return null;
    }
  },
  
  /**
   * Search hotels by name or location
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Promise with array of hotels
   */
  searchHotels: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/api/hotels/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to search hotels:`, error);
      throw error;
    }
  }
};

export default hotelService;
