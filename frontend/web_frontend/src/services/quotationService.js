/**
 * Quotation Service
 * Handles API interactions for group travel quotation management
 */
import axios from 'axios';

// Make sure the API URL ends with /api
let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
// Remove trailing slash if present
if (baseUrl.endsWith('/')) {
  baseUrl = baseUrl.slice(0, -1);
}
// Add /api if not already present
const API_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

// Create axios instance with authentication
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authentication to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hotelAuthToken') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to generate demo data
const generateMockQuotations = (count = 15) => {
  const statuses = ['Pending', 'Approved', 'Rejected'];
  const packageTypes = ['Cultural Tour', 'Adventure Package', 'Beach Getaway', 'Wildlife Safari', 'City Explorer'];
  const customerNames = [
    'John Smith', 'Maria Garcia', 'Li Wei', 'Aisha Khan', 
    'Carlos Rodriguez', 'Sarah Johnson', 'Raj Patel', 'Emma Wilson',
    'Takashi Yamamoto', 'Olivia Martinez', 'Omar Hassan', 'Sophia Chen',
    'Michael Brown', 'Fatima Ali', 'David Kim'
  ];
  const emails = [
    'john.smith@example.com', 'maria.garcia@example.com', 'li.wei@example.net',
    'aisha.khan@example.org', 'carlos.rodriguez@example.com', 'sarah.j@example.net',
    'raj.patel@example.org', 'emma.wilson@example.com', 'takashi.y@example.jp',
    'olivia.m@example.com', 'omar.hassan@example.net', 'sophia.chen@example.org',
    'michael.b@example.com', 'fatima.ali@example.org', 'david.kim@example.net'
  ];
  const requirements = [
    'Need transportation for 20 people',
    'Require group dining arrangements',
    'Request multiple tour guides who speak English',
    'Need assistance with visa processing for group',
    'Require wheelchair accessibility for 2 members',
    'Group has dietary restrictions (5 vegetarians, 3 gluten-free)',
    'Corporate retreat with 15 team members, need meeting facilities',
    'School group of 25 students, need educational tours',
    'Family reunion with 30 members spanning three generations',
    'Special rates requested for group of 40 tourists',
    'Need coordination for multiple arrival/departure times',
    'Request private tour arrangements for VIP group',
    'Need photographer to document group activities',
    'Require group travel insurance options',
    'Multiple languages spoken, need multilingual guides'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    // Generate check-in date between now and 3 months from now
    const today = new Date();
    const checkInDate = new Date(
      today.getFullYear(),
      today.getMonth() + Math.floor(Math.random() * 3),
      1 + Math.floor(Math.random() * 28)
    );
    
    // Generate check-out date 1-7 days after check-in
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 1 + Math.floor(Math.random() * 7));
    
    // Calculate total amount based on room type and stay duration
    const packagePrices = {
      'Cultural Tour': 250,
      'Adventure Package': 350,
      'Beach Getaway': 300,
      'Wildlife Safari': 400,
      'City Explorer': 200,
    };
    
    const packageType = packageTypes[Math.floor(Math.random() * packageTypes.length)];
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const groupSize = 10 + Math.floor(Math.random() * 40); // Group size between 10-50
    const baseAmount = days * packagePrices[packageType] * groupSize;
    const discountOffered = Math.floor(Math.random() * 15); // 0-15% discount for groups
    
    // Create date 1-30 days ago for quotation creation date
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30) - 1);
    
    return {
      id: `qtn-${i + 1}`,
      quoteNumber: `GRP-${2023001 + i}`,
      organizationName: customerNames[i % customerNames.length] + (Math.random() > 0.5 ? ' Group' : ' Travel Club'),
      contactPersonName: customerNames[i % customerNames.length],
      contactEmail: emails[i % emails.length],
      contactPhone: `+94 7${Math.floor(10000000 + Math.random() * 90000000)}`,
      packageType,
      departureDate: checkInDate.toISOString().split('T')[0],
      returnDate: checkOutDate.toISOString().split('T')[0],
      groupSize,
      requirements: requirements[i % requirements.length],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      totalAmount: baseAmount,
      perPersonCost: Math.round(baseAmount / groupSize),
      createdAt: createdDate.toISOString(),
      discountOffered,
      adminNotes: Math.random() > 0.7 ? 'Returning group customer. Offer premium services.' : '',
      accommodationType: ['Hotel', 'Resort', 'Mixed'][Math.floor(Math.random() * 3)],
      transportationNeeded: Math.random() > 0.2,
      guidesRequired: 1 + Math.floor(Math.random() * 3), // 1-4 guides
      
      // Add the new per-person pricing fields for mock data
      accommodationPricePerPerson: Math.round((baseAmount * 0.7) / groupSize), // 70% for accommodation
      mealPricePerPerson: Math.round((baseAmount * 0.2) / groupSize), // 20% for meals  
      mealPlanPricePerPerson: Math.round((baseAmount * 0.2) / groupSize), // Alternative field name for compatibility
      totalPricePerPerson: Math.round(baseAmount / groupSize),
      
      // Add meal plan information for mock data
      mealPlan: ['Breakfast Only', 'Half Board', 'Full Board', 'All Inclusive'][Math.floor(Math.random() * 4)],
      
      // Add hotel user information for filtering
      hotelUsername: 'mock_hotel_user',
      createdBy: 'mock_hotel_user'
    };
  });
};

// Quotation Service
const quotationService = {
  // Get all quotations
  getAllQuotations: async () => {
    try {
      // Check for token
      const token = localStorage.getItem('hotelAuthToken') || localStorage.getItem('authToken');
      if (!token) {
        console.error('Authentication token not found. Please login again.');
        return []; // Return empty array instead of throwing error
      }
      
      console.log('QuotationService - Making API request to fetch quotations...');
      
      // Make request with explicit token
      const response = await apiClient.get('/quotations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('QuotationService - API Response:', response.data);
      console.log('QuotationService - First quotation from API:', response.data?.[0]);
      
      return response.data || [];
    } catch (error) {
      console.error('QuotationService - Error fetching quotations:', error);
      console.error('QuotationService - Error response:', error.response?.data);
      console.error('QuotationService - Error status:', error.response?.status);
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        console.error('Authentication failed. Please login again.');
      }
      
      // Check if we should fall back to mock data for development
      console.warn('QuotationService - API failed, returning empty array (not using mock data)');
      return [];
    }
  },
  
  // Get quotation by ID
  getQuotationById: async (id) => {
    try {
      console.log(`QuotationService - Fetching quotation by ID: ${id}`);
      
      // Check for authentication token
      const token = localStorage.getItem('hotelAuthToken') || localStorage.getItem('authToken');
      if (!token) {
        console.warn('QuotationService - No authentication token found');
      }
      
      const response = await apiClient.get(`/quotations/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      console.log(`QuotationService - API Response for quotation ${id}:`, response.data);
      console.log(`QuotationService - mealPricePerPerson value:`, response.data?.mealPricePerPerson);
      console.log(`QuotationService - mealPlanPricePerPerson value:`, response.data?.mealPlanPricePerPerson);
      
      return response.data;
    } catch (error) {
      console.error(`QuotationService - Error fetching quotation ${id}:`, error);
      console.error(`QuotationService - Error status:`, error.response?.status);
      console.error(`QuotationService - Error data:`, error.response?.data);
      
      // Fallback to mock data
      console.warn(`QuotationService - Falling back to mock data for quotation ${id}`);
      const quotations = generateMockQuotations();
      const mockQuotation = quotations.find(q => q.id === id) || null;
      console.log(`QuotationService - Mock quotation:`, mockQuotation);
      return mockQuotation;
    }
  },
  
  // Create a new quotation
  createQuotation: async (quotationData) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('hotelAuthToken') || localStorage.getItem('authToken');
      if (!token) {
        console.error('Authentication token not found. Please login again.');
        throw new Error('Authentication token not found. Please login again.');
      }
      
      // Format dates for Java LocalDate compatibility if needed
      const formattedData = {
        ...quotationData,
        // checkInDate and checkOutDate should already be in YYYY-MM-DD format
      };
      
      console.log('Sending formatted quotation data to API:', formattedData);
      
      // Log request configuration for debugging
      const requestConfig = {
        method: 'POST',
        url: `${API_URL}/quotations`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: formattedData
      };
      console.log('API request configuration:', requestConfig);
      
      // Make sure we're explicitly including the token in this critical request
      const response = await apiClient.post('/quotations', formattedData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('API response:', response);
      
      // Return the created quotation data
      return response.data || {
        ...quotationData,
        id: `qtn-${Date.now()}`,
        quoteNumber: `QTN-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        status: 'Pending',
      };
    } catch (error) {
      console.error('Error creating quotation:', error);
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        console.error('Authentication failed. Please login again.');
        throw new Error('Your session has expired. Please login again.');
      }
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      // Throw the error to be handled by the calling function
      throw error;
    }
  },
  
  // Update an existing quotation
  updateQuotation: async (id, quotationData) => {
    try {
      const response = await apiClient.put(`/quotations/${id}`, quotationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating quotation ${id}:`, error);
      // Fallback for development
      return {
        ...quotationData,
        id,
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  // Delete a quotation by ID
  deleteQuotation: async (id) => {
    try {
      // Check for token
      const token = localStorage.getItem('hotelAuthToken') || localStorage.getItem('authToken');
      if (!token) {
        console.error('Authentication token not found. Please login again.');
        return { 
          success: false, 
          id, 
          error: 'Authentication token not found. Please login to delete quotations.',
          authError: true 
        };
      }
      
      // Make request with explicit token
      const response = await apiClient.delete(`/quotations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return { 
        success: true, 
        id,
        response 
      };
    } catch (error) {
      console.error(`Error deleting quotation ${id}:`, error);
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        console.error('Authentication failed. Please login again.');
        return { 
          success: false, 
          id, 
          error: 'Your session has expired. Please login again.',
          authError: true 
        };
      }
      
      return { 
        success: false, 
        id, 
        error: error.message || 'Error deleting quotation' 
      };
    }
  },
  
  // Delete a quotation by quote number
  deleteQuotationByQuoteNumber: async (quoteNumber) => {
    try {
      // Check for token
      const token = localStorage.getItem('hotelAuthToken') || localStorage.getItem('authToken');
      if (!token) {
        console.error('Authentication token not found. Please login again.');
        return { 
          success: false, 
          quoteNumber, 
          error: 'Authentication token not found. Please login to delete quotations.',
          authError: true 
        };
      }
      
      // Make request with explicit token
      const response = await apiClient.delete(`/quotations/by-number/${quoteNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return { 
        success: true, 
        quoteNumber,
        response 
      };
    } catch (error) {
      console.error(`Error deleting quotation with quote number ${quoteNumber}:`, error);
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        console.error('Authentication failed. Please login again.');
        return { 
          success: false, 
          quoteNumber, 
          error: 'Your session has expired. Please login again.',
          authError: true 
        };
      }
      
      return { 
        success: false, 
        quoteNumber, 
        error: error.message || 'Error deleting quotation' 
      };
    }
  },
  
  // Change quotation status
  updateQuotationStatus: async (id, status, notes = '') => {
    try {
      const response = await apiClient.put(`/quotations/${id}/status`, { status, notes });
      return response.data;
    } catch (error) {
      console.error(`Error updating quotation status ${id}:`, error);
      // Fallback for development
      return { 
        success: false, 
        id, 
        status,
        adminNotes: notes,
        updatedAt: new Date().toISOString(),
        error: error.message
      };
    }
  }
};

export default quotationService;