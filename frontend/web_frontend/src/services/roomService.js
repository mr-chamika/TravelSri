import axios from 'axios';
import { hotelApiClient } from './hotelAuthService';

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance with default config (using the same instance as hotelAuthService)
const apiClient = hotelApiClient;

// Hotel Room Inventory API Service
const roomService = {
  // Get all rooms
  getAllRooms: async () => {
    try {
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain ID:', userObj);
        throw new Error('Hotel ID not found in user data.');
      }
      
      // Get rooms for the specific hotel
      const response = await apiClient.get(`/hotels/${hotelId}/rooms`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      // Return empty array on error for graceful degradation
      return [];
    }
  },

  // Get room by ID
  getRoomById: async (id) => {
    try {
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain ID:', userObj);
        throw new Error('Hotel ID not found in user data.');
      }
      
      const response = await apiClient.get(`/hotels/${hotelId}/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room ${id}:`, error);
      throw error;
    }
  },

  // Create new room
  createRoom: async (roomData) => {
    try {
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain ID:', userObj);
        throw new Error('Hotel ID not found in user data.');
      }
      
      // Ensure roomNumber is a string
      const dataToSend = {
        ...roomData,
        roomNumber: roomData.roomNumber ? String(roomData.roomNumber) : null
      };
      
      console.log('Creating room for hotel ID:', hotelId, 'with data:', dataToSend);
      
      try {
        const response = await apiClient.post(`/hotels/${hotelId}/rooms`, dataToSend);
        console.log('Room created successfully, received data:', response.data);
        return response.data;
      } catch (apiError) {
        console.error('API error response:', apiError.response?.data);
        console.error('API error status:', apiError.response?.status);
        throw apiError;
      }
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // Update room
  updateRoom: async (id, roomData) => {
    try {
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain ID:', userObj);
        throw new Error('Hotel ID not found in user data.');
      }
      
      // Update room using the hotel ID and room ID
      const response = await apiClient.put(`/hotels/${hotelId}/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      console.error(`Error updating room ${id}:`, error);
      throw error;
    }
  },

  // Delete room
  deleteRoom: async (id) => {
    try {
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain ID:', userObj);
        throw new Error('Hotel ID not found in user data.');
      }
      
      await apiClient.delete(`/hotels/${hotelId}/rooms/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting room ${id}:`, error);
      throw error;
    }
  },

  // Get rooms by type
  getRoomsByType: async (type) => {
    try {
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain ID:', userObj);
        throw new Error('Hotel ID not found in user data.');
      }
      
      const response = await apiClient.get(`/hotels/${hotelId}/rooms/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms by type ${type}:`, error);
      throw error;
    }
  },

  // Get rooms by status
  getRoomsByStatus: async (status) => {
    try {
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain ID:', userObj);
        throw new Error('Hotel ID not found in user data.');
      }
      
      console.log(`Fetching rooms with status '${status}' for hotel ID: ${hotelId}`);
      const response = await apiClient.get(`/hotels/${hotelId}/rooms/status/${status}`);
      
      // Debug the response
      console.log(`Received rooms with status '${status}':`, response.data);
      
      // Ensure all room numbers are properly formatted
      const formattedRooms = response.data.map(room => {
        // Make sure all rooms have roomNumber property as string
        if (room.roomNumber === undefined || room.roomNumber === null) {
          console.warn('Room missing roomNumber property:', room);
          return { ...room, roomNumber: String(room.id || 'unknown') };
        }
        return { ...room, roomNumber: String(room.roomNumber) };
      });
      
      console.log('Formatted rooms:', formattedRooms);
      return formattedRooms;
    } catch (error) {
      console.error(`Error fetching rooms by status ${status}:`, error);
      // Return empty array for graceful degradation
      return [];
    }
  },

  // Get rooms by capacity
  getRoomsByCapacity: async (capacity) => {
    try {
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      const { id: hotelId } = JSON.parse(userData);
      if (!hotelId) {
        throw new Error('Hotel ID not found in user data.');
      }
      
      const response = await apiClient.get(`/hotels/${hotelId}/rooms/capacity/${capacity}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms by capacity ${capacity}:`, error);
      throw error;
    }
  },
  
  // Get all room types
  getAllRoomTypes: async () => {
    try {
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      const { id: hotelId } = JSON.parse(userData);
      if (!hotelId) {
        throw new Error('Hotel ID not found in user data.');
      }
      
      const response = await apiClient.get(`/hotels/${hotelId}/rooms/types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room types:', error);
      // Return default room types if API call fails
      return [
        'Standard Room',
        'Deluxe Room',
        'Suite',
        'Family Room',
        'Executive Suite',
        'Presidential Suite',
      ];
    }
  },

  // Update room status
  updateRoomStatus: async (roomType, roomNumber, status) => {
    try {
      console.log(`Updating room status: ${roomType} ${roomNumber} -> ${status}`);
      
      // Get the hotel ID from user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      // Parse the user data
      const userObj = JSON.parse(userData);
      
      // Try to get ID in different formats (with or without underscore)
      const hotelId = userObj.id || userObj._id;
      if (!hotelId) {
        console.error('User data does not contain ID:', userObj);
        throw new Error('Hotel ID not found in user data.');
      }
      
      // First find the room by type and number - make sure to use roomNumber not number
      const response = await apiClient.get(`/hotels/${hotelId}/rooms`);
      console.log('Looking for room among:', response.data);
      
      // Try to match by roomNumber as string or number
      const roomNumberStr = String(roomNumber);
      const room = response.data.find(
        (room) => room.type === roomType && 
                 (String(room.roomNumber) === roomNumberStr || 
                  (room.number && String(room.number) === roomNumberStr))
      );
      
      if (!room) {
        console.error(`Room not found: ${roomType} ${roomNumber}`);
        throw new Error(`Room not found: ${roomType} ${roomNumber}`);
      }
      
      console.log('Found room to update:', room);
      
      // Update the room status
      const updateResponse = await apiClient.put(`/hotels/${hotelId}/rooms/${room.id}`, {
        ...room,
        status: status
      });
      
      console.log('Room status updated successfully:', updateResponse.data);
      return updateResponse.data;
    } catch (error) {
      console.error(`Error updating room status for ${roomType} ${roomNumber}:`, error);
      throw error;
    }
  }
};

export default roomService;