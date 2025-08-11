import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hotel Room Inventory API Service
const roomService = {
  // Get all rooms
  getAllRooms: async () => {
    try {
      const response = await apiClient.get('/hotel-rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  // Get room by ID
  getRoomById: async (id) => {
    try {
      const response = await apiClient.get(`/hotel-rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room ${id}:`, error);
      throw error;
    }
  },

  // Create new room
  createRoom: async (roomData) => {
    try {
      const response = await apiClient.post('/hotel-rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // Update room
  updateRoom: async (id, roomData) => {
    try {
      const response = await apiClient.put(`/hotel-rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      console.error(`Error updating room ${id}:`, error);
      throw error;
    }
  },

  // Delete room
  deleteRoom: async (id) => {
    try {
      await apiClient.delete(`/hotel-rooms/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting room ${id}:`, error);
      throw error;
    }
  },

  // Get rooms by type
  getRoomsByType: async (type) => {
    try {
      const response = await apiClient.get(`/hotel-rooms/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms by type ${type}:`, error);
      throw error;
    }
  },

  // Get rooms by status
  getRoomsByStatus: async (status) => {
    try {
      const response = await apiClient.get(`/hotel-rooms/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms by status ${status}:`, error);
      throw error;
    }
  },

  // Get rooms by capacity
  getRoomsByCapacity: async (capacity) => {
    try {
      const response = await apiClient.get(`/hotel-rooms/capacity/${capacity}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms by capacity ${capacity}:`, error);
      throw error;
    }
  },
  
  // Get all room types
  getAllRoomTypes: async () => {
    try {
      const response = await apiClient.get('/hotel-rooms/types');
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
      // First find the room by type and number
      const rooms = await apiClient.get(`/hotel-rooms`);
      const room = rooms.data.find(
        (room) => room.type === roomType && room.number === roomNumber
      );
      
      if (!room) {
        console.error(`Room not found: ${roomType} ${roomNumber}`);
        throw new Error(`Room not found: ${roomType} ${roomNumber}`);
      }
      
      // Update the room status
      const response = await apiClient.put(`/hotel-rooms/${room.id}`, {
        ...room,
        status: status
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating room status for ${roomType} ${roomNumber}:`, error);
      throw error;
    }
  }
};

export default roomService;