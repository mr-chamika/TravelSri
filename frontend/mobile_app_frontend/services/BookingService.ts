const API_BASE_URL = 'http://localhost:8080';
// For iOS Simulator:
// const API_BASE_URL = 'http://localhost:8080';
// For Physical Device (replace with your computer's IP):
// const API_BASE_URL = 'http://192.168.1.XXX:8080';

interface BookingRequest {
  travelerId: string;
  providerId: string;
  providerType: "guide";
  serviceName: string;
  serviceDescription: string;
  serviceStartDate: string;
  serviceEndDate: string;
  totalAmount: number;
}

interface BookingResponse {
  id: string;
  status: string;
  // Add other booking fields as needed
}

interface PaymentCheckoutRequest {
  bookingId: string;
}

interface PaymentCheckoutResponse {
  success: boolean;
  orderId: string;
  paymentData: {
    merchant_id: string;
    order_id: string;
    amount: string;
    currency: string;
    hash: string;
    // Add other payment fields as needed
  };
}

class BookingService {
  static async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
    try {
      console.log('BookingService: Creating booking with data:', bookingData);
      console.log('API URL:', `${API_BASE_URL}/api/bookings/create`);
      
      const response = await fetch(`${API_BASE_URL}/api/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      console.log('BookingService: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('BookingService: Error response:', errorText);
        throw new Error(`Failed to create booking: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('BookingService: Booking created successfully:', result);
      return result;
    } catch (error) {
      console.error('BookingService: createBooking error:', error);
      throw error;
    }
  }

  static async createPaymentCheckout(bookingId: string): Promise<PaymentCheckoutResponse> {
    try {
      console.log('BookingService: Creating payment checkout for booking:', bookingId);
      console.log('API URL:', `${API_BASE_URL}/api/payments/payhere/create-checkout`);
      
      const requestBody = { bookingId };
      console.log('Request body:', JSON.stringify(requestBody));
      
      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log('BookingService: Payment response status:', response.status);
      console.log('BookingService: Payment response headers:', JSON.stringify([...response.headers.entries()]));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('BookingService: Payment error response:', errorText);
        throw new Error(`Failed to create payment checkout: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('BookingService: Payment checkout created successfully:', result);
      return result;
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError') {
        console.error('BookingService: Request timeout after 30 seconds');
        throw new Error('Request timeout - please check your network connection');
      }
      console.error('BookingService: createPaymentCheckout error:', error);
      console.error('Error type:', error && typeof error === 'object' && 'constructor' in error ? (error as any).constructor.name : typeof error);
      console.error('Error message:', error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error));
      throw error;
    }
  }

  // Test method to verify API connectivity
  static async testConnection(): Promise<any> {
    try {
      console.log('BookingService: Testing API connection...');
      console.log('API URL:', `${API_BASE_URL}/api/payments/payhere/simple-health`);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/simple-health`);
      
      if (!response.ok) {
        throw new Error(`API test failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('BookingService: API connection test successful:', result);
      return result;
    } catch (error) {
      console.error('BookingService: Connection test failed:', error);
      throw error;
    }
  }

  // Test payment with known booking ID
  static async testPaymentWithKnownId(bookingId: string = "6898d0831552c34db6ee4b30"): Promise<PaymentCheckoutResponse> {
    try {
      console.log('BookingService: Testing payment with known booking ID:', bookingId);
      return await this.createPaymentCheckout(bookingId);
    } catch (error) {
      console.error('BookingService: Payment test failed:', error);
      throw error;
    }
  }

  // Get payment status by order ID
  static async getPaymentStatus(orderId: string): Promise<PaymentResponse> {
    try {
      console.log('BookingService: Getting payment status for order:', orderId);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/status/${orderId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get payment status: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('BookingService: Payment status retrieved:', result);
      return result;
    } catch (error) {
      console.error('BookingService: getPaymentStatus error:', error);
      throw error;
    }
  }

  // Cancel booking
  static async cancelBooking(bookingId: string): Promise<any> {
    try {
      console.log('BookingService: Cancelling booking:', bookingId);
      
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Cancelled by user' }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to cancel booking: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('BookingService: Booking cancelled successfully:', result);
      return result;
    } catch (error) {
      console.error('BookingService: cancelBooking error:', error);
      throw error;
    }
  }

  static async getBookingInfo(bookingId: string): Promise<BookingResponse> {
    try {
      console.log('BookingService: Getting booking info for:', bookingId);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/test/booking-info/${bookingId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get booking info: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('BookingService: Booking info retrieved:', result);
      return result;
    } catch (error) {
      console.error('BookingService: getBookingInfo error:', error);
      throw error;
    }
  }

   static async validateMoneyFlow(bookingId: string): Promise<any> {
    try {
      console.log('BookingService: Validating money flow for booking:', bookingId);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/test/validate-money-flow/${bookingId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to validate money flow: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('BookingService: Money flow validation result:', result);
      return result;
    } catch (error) {
      console.error('BookingService: validateMoneyFlow error:', error);
      throw error;
    }
  }

  // Get all bookings status summary
  static async getAllBookingsStatus(): Promise<any> {
    try {
      console.log('BookingService: Getting all bookings status...');
      
      const response = await fetch(`${API_BASE_URL}/api/payments/admin/all-bookings-status`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get bookings status: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('BookingService: All bookings status retrieved:', result);
      return result;
    } catch (error) {
      console.error('BookingService: getAllBookingsStatus error:', error);
      throw error;
    }
  }

  // Get recent bookings
  static async getRecentBookings(limit: number = 10): Promise<any> {
    try {
      console.log('BookingService: Getting recent bookings with limit:', limit);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/admin/recent-bookings?limit=${limit}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get recent bookings: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('BookingService: Recent bookings retrieved:', result);
      return result;
    } catch (error) {
      console.error('BookingService: getRecentBookings error:', error);
      throw error;
    }
  }
}

export default BookingService;