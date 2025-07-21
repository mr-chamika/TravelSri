// Base URL for API calls - adjust to match your Spring Boot backend URL
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Service for fetching chart data from Spring Boot backend
 * Using native fetch API instead of axios
 */
export const ChartService = {
  /**
   * Fetch monthly booking statistics
   * @returns {Promise} Promise that resolves to booking statistics
   */
  getMonthlyBookingStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/charts/monthly-bookings`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching monthly booking stats:', error);
      throw error;
    }
  },
  
  /**
   * Fetch earnings statistics 
   * @returns {Promise} Promise that resolves to earnings statistics
   */
  getEarningStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/charts/earnings`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching earnings stats:', error);
      throw error;
    }
  },

  /**
   * Fetch occupancy rate statistics
   * @returns {Promise} Promise that resolves to occupancy statistics
   */
  getOccupancyStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/charts/occupancy`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching occupancy stats:', error);
      throw error;
    }
  },

  /**
   * Fetch earnings breakdown data
   * @returns {Promise} Promise that resolves to earnings breakdown data
   */
  getEarningsBreakdown: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/charts/earnings-breakdown`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching earnings breakdown:', error);
      throw error;
    }
  },

  /**
   * Mock function for development when backend is not available
   * Remove this in production and use the actual API calls
   */
  getMockMonthlyBookingStats: () => {
    // This mock data should match the structure of your Spring Boot API response
    return Promise.resolve([
      { month: 'May', bookings: 132, revenue: 19750, occupancyRate: 78 },
      { month: 'Jun', bookings: 98, revenue: 15200, occupancyRate: 62 },
      { month: 'Jul', bookings: 121, revenue: 18300, occupancyRate: 75 },
      { month: 'Aug', bookings: 78, revenue: 12450, occupancyRate: 42 },
      { month: 'Sep', bookings: 145, revenue: 22800, occupancyRate: 88 },
      { month: 'Oct', bookings: 135, revenue: 19850, occupancyRate: 79 },
      { month: 'Nov', bookings: 137, revenue: 20200, occupancyRate: 80 },
      { month: 'Dec', bookings: 139, revenue: 22450, occupancyRate: 82 },
      { month: 'Jan', bookings: 148, revenue: 24890, occupancyRate: 90 },
      { month: 'Feb', bookings: 143, revenue: 23700, occupancyRate: 85 }
    ]);
  },

  /**
   * Mock function for earnings statistics
   */
  getMockEarningStats: () => {
    return Promise.resolve([
      { month: 'May', amount: 42500, bookingCount: 14 },
      { month: 'Jun', amount: 35400, bookingCount: 12 },
      { month: 'Jul', amount: 48200, bookingCount: 16 },
      { month: 'Aug', amount: 25350, bookingCount: 8 },
      { month: 'Sep', amount: 45700, bookingCount: 15 },
      { month: 'Oct', amount: 44300, bookingCount: 14 },
      { month: 'Nov', amount: 42800, bookingCount: 14 },
      { month: 'Dec', amount: 46200, bookingCount: 15 },
      { month: 'Jan', amount: 47500, bookingCount: 16 },
      { month: 'Feb', amount: 39800, bookingCount: 13 },
      { month: 'Mar', amount: 36400, bookingCount: 12 },
      { month: 'Apr', amount: 32000, bookingCount: 11 }
    ]);
  },

  /**
   * Mock function for earnings breakdown
   */
  getMockEarningsBreakdown: () => {
    return Promise.resolve([
      { category: 'Room Bookings', amount: 45200, percentage: 80 },
      { category: 'Additional Services', amount: 8450, percentage: 15 },
      { category: 'Special Packages', amount: 2604, percentage: 5 }
    ]);
  }
};

export default ChartService;