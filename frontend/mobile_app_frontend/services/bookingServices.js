const API_BASE_URL = 'http://your-spring-boot-api.com/api';

class BookingService {
  async getBookingRequests() {
    try {
      const response = await fetch(`${API_BASE_URL}/guide/booking-requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking requests');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching booking requests:', error);
      // Return mock data for development
      return this.getMockBookingRequests();
    }
  }

  async getAcceptedBookings() {
    try {
      const response = await fetch(`${API_BASE_URL}/guide/accepted-bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch accepted bookings');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching accepted bookings:', error);
      // Return mock data for development
      return this.getMockAcceptedBookings();
    }
  }

  async respondToRequest(requestId, action) {
    try {
      const response = await fetch(`${API_BASE_URL}/booking-requests/${requestId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} booking request`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error ${action}ing booking request:`, error);
      throw error;
    }
  }

  async getAuthToken() {
    // Implement your authentication token retrieval logic
    // This could be from AsyncStorage, Keychain, etc.
    return 'your-auth-token';
  }

  // Mock data for development/testing
  getMockBookingRequests() {
    return [
      {
        id: 1,
        clientName: 'John Smith',
        clientImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        destination: 'Kandy Cultural Tour',
        date: '2025-06-25',
        time: '09:00 AM',
        duration: '6 hours',
        groupSize: 4,
        price: 150,
        status: 'pending',
        hasConflict: false,
        requestDate: '2025-06-20',
        specialRequests: 'Need wheelchair accessible transport',
        contactNumber: '+94 71 234 5678',
      },
      // Add more mock data as needed
    ];
  }

  getMockAcceptedBookings() {
    return [
      { date: '2025-06-24', title: 'City Tour' },
      { date: '2025-06-26', title: 'City Heritage Walk' },
      { date: '2025-06-30', title: 'Mountain Hike' },
    ];
  }
}

export const bookingService = new BookingService();
