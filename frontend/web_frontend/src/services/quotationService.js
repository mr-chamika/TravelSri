/**
 * Quotation Service
 * Handles API interactions for group travel quotation management
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
    };
  });
};

// Quotation Service
const quotationService = {
  // Get all quotations
  getAllQuotations: async () => {
    try {
      const response = await apiClient.get('/quotations');
      return response.data;
    } catch (error) {
      console.error('Error fetching quotations:', error);
      // Fallback to mock data if API call fails
      return generateMockQuotations();
    }
  },
  
  // Get quotation by ID
  getQuotationById: async (id) => {
    try {
      const response = await apiClient.get(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching quotation ${id}:`, error);
      // Fallback to mock data
      const quotations = generateMockQuotations();
      return quotations.find(q => q.id === id) || null;
    }
  },
  
  // Create a new quotation
  createQuotation: async (quotationData) => {
    try {
      // Format dates for Java LocalDate compatibility if needed
      const formattedData = {
        ...quotationData,
        // checkInDate and checkOutDate should already be in YYYY-MM-DD format
      };
      
      const response = await apiClient.post('/quotations', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating quotation:', error);
      // For development, return mock data as fallback
      return {
        ...quotationData,
        id: `qtn-${Date.now()}`,
        quoteNumber: `QTN-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        status: 'Pending',
        roomAvailability: 'Available',
      };
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
  
  // Delete a quotation
  deleteQuotation: async (id) => {
    try {
      await apiClient.delete(`/quotations/${id}`);
      return { success: true, id };
    } catch (error) {
      console.error(`Error deleting quotation ${id}:`, error);
      return { success: false, id, error: error.message };
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
