/**
 * Quotation Service
 * Handles API interactions for group travel quotation management
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    // In a real app, this would call the API
    // return fetch(`${API_URL}/quotations`).then(res => res.json());
    
    // For demo, generate mock data
    return Promise.resolve(generateMockQuotations());
  },
  
  // Get quotation by ID
  getQuotationById: async (id) => {
    // In a real app, this would call the API
    // return fetch(`${API_URL}/quotations/${id}`).then(res => res.json());
    
    // For demo, generate mock data and find the one with the requested ID
    const quotations = generateMockQuotations();
    const quotation = quotations.find(q => q.id === id);
    return Promise.resolve(quotation || null);
  },
  
  // Create a new quotation
  createQuotation: async (quotationData) => {
    // In a real app, this would call the API
    // return fetch(`${API_URL}/quotations`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(quotationData)
    // }).then(res => res.json());
    
    // For demo, just return the data with an ID added
    return Promise.resolve({
      ...quotationData,
      id: `qtn-${Date.now()}`,
      quoteNumber: `QTN-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      roomAvailability: 'Available',
      discountOffered: 0
    });
  },
  
  // Update an existing quotation
  updateQuotation: async (id, quotationData) => {
    // In a real app, this would call the API
    // return fetch(`${API_URL}/quotations/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(quotationData)
    // }).then(res => res.json());
    
    // For demo, just return the updated data
    return Promise.resolve({
      ...quotationData,
      id,
      updatedAt: new Date().toISOString()
    });
  },
  
  // Delete a quotation
  deleteQuotation: async (id) => {
    // In a real app, this would call the API
    // return fetch(`${API_URL}/quotations/${id}`, {
    //   method: 'DELETE'
    // }).then(res => res.json());
    
    // For demo, just resolve successfully
    return Promise.resolve({ success: true, id });
  },
  
  // Change quotation status
  updateQuotationStatus: async (id, status, notes = '') => {
    // In a real app, this would call the API
    // return fetch(`${API_URL}/quotations/${id}/status`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status, notes })
    // }).then(res => res.json());
    
    // For demo, just resolve successfully
    return Promise.resolve({ 
      success: true, 
      id, 
      status,
      adminNotes: notes,
      updatedAt: new Date().toISOString()
    });
  }
};

export default quotationService;
