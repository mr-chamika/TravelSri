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
   * Get a hotel by username
   * @param {string} username - Hotel username
   * @returns {Promise<Object>} - Promise with hotel data
   */
  getHotelByUsername: async (username) => {
    try {
      const response = await hotelApiClient.get(`/hotels/username/${username}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch hotel with username ${username}:`, error);
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
  },

  /**
   * Manually update hotel availability based on room counts
   * @param {string} hotelId - Hotel ID
   * @param {number} totalStandardRooms - Total standard rooms
   * @param {number} totalDeluxeRooms - Total deluxe rooms
   * @param {number} availableStandardRooms - Available standard rooms
   * @param {number} availableDeluxeRooms - Available deluxe rooms
   * @returns {Promise<Object>} - Promise with updated hotel data
   */
  updateHotelAvailability: async (hotelId, totalStandardRooms, totalDeluxeRooms, availableStandardRooms, availableDeluxeRooms) => {
    try {
      const response = await hotelApiClient.patch(
        `/hotels/${hotelId}/sync-availability?totalStandardRooms=${totalStandardRooms}&totalDeluxeRooms=${totalDeluxeRooms}&availableStandardRooms=${availableStandardRooms}&availableDeluxeRooms=${availableDeluxeRooms}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update hotel availability for hotel ${hotelId}:`, error);
      throw error;
    }
  },

  /**
   * Automatically sync hotel availability from hotelRooms collection
   * @param {string} hotelId - Hotel ID
   * @returns {Promise<Object>} - Promise with updated hotel data
   */
  syncHotelAvailabilityFromRooms: async (hotelId) => {
    try {
      const response = await hotelApiClient.patch(`/hotels/${hotelId}/sync-availability-auto`);
      return response.data;
    } catch (error) {
      console.error(`Failed to sync hotel availability from rooms for hotel ${hotelId}:`, error);
      throw error;
    }
  },

  /**
   * Sync availability for all hotels from their room collections
   * @returns {Promise<Object>} - Promise with success message
   */
  syncAllHotelsAvailability: async () => {
    try {
      const response = await hotelApiClient.patch('/hotels/sync-all-availability');
      return response.data;
    } catch (error) {
      console.error('Failed to sync all hotels availability:', error);
      throw error;
    }
  }
};

export default hotelService;
