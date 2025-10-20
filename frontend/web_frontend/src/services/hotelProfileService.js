import axios from 'axios';
import { hotelApiClient } from './hotelAuthService';

// Base URL for API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Service for managing hotel profiles
 */
const hotelProfileService = {
  /**
   * Get the current hotel's profile
   * @returns {Promise} - Promise with hotel profile data
   */
  getProfile: async () => {
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
      
      const { username, id, email } = parsedUserData;
      
      // First try to get profile by ID if available
      if (id) {
        try {
          // Don't include API_URL when using hotelApiClient as baseURL is already set
          const response = await hotelApiClient.get(`/hotels/profile/${id}`);
          if (response.data && response.data.hotel) {
            return response.data.hotel;
          }
        } catch (idError) {
          console.warn(`Failed to fetch hotel profile by ID ${id}:`, idError);
          // Continue to next fallback
        }
      }
      
      // Try to get profile by username/email
      const emailToUse = email || username;
      if (emailToUse) {
        try {
          // Don't include API_URL when using hotelApiClient as baseURL is already set
          const response = await hotelApiClient.get(`/hotels/profile?email=${emailToUse}`);
          if (response.data && response.data.hotel) {
            return response.data.hotel;
          }
        } catch (emailError) {
          console.warn(`Failed to fetch hotel profile by email ${emailToUse}:`, emailError);
        }
      }
      
      // If all API calls fail, return basic profile from localStorage
      return {
        hotelName: parsedUserData.hotelName || username || 'Hotel',
        email: email || username || '',
        // Add other fields that might be available in userData
      };
    } catch (error) {
      console.error('Failed to fetch hotel profile:', error);
      // Don't throw, return null instead
      return null;
    }
  },
  
  /**
   * Update the hotel profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Promise with updated profile data
   */
  updateProfile: async (profileData) => {
    try {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        throw new Error('No user data found');
      }
      
      const { id } = JSON.parse(userData);
      
      if (!id) {
        throw new Error('No hotel ID found in user data');
      }
      
      // Don't include API_URL when using hotelApiClient as baseURL is already set
      const response = await hotelApiClient.put(`/hotels/${id}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Failed to update hotel profile:', error);
      throw error;
    }
  },
  
  /**
   * Get hotel by username
   * @param {string} username - Hotel username
   * @returns {Promise} - Promise with hotel data
   */
  getHotelByUsername: async (username) => {
    try {
      // Since we don't have a direct endpoint for this, we'll search through all hotels
      const response = await axios.get(`${API_URL}/hotels/search?keyword=${username}`);
      const hotels = response.data;
      
      // Find the hotel with matching username
      const hotel = hotels.find(h => h.username === username);
      return hotel || null;
    } catch (error) {
      console.error(`Failed to fetch hotel by username ${username}:`, error);
      throw error;
    }
  },
  
  /**
   * Get hotel profile picture URL
   * @returns {string} - URL to hotel profile picture
   */
  getProfilePictureUrl: () => {
    // This is a placeholder - in a real application, you'd get this from the API
    // or from local storage if it was cached there
    return '/hotel-logo.svg';
  }
};

export default hotelProfileService;
