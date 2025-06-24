import React, { useState } from 'react';

const QuatationRequests = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Enhanced mock data for quotation requests with group travel information
  const quotationRequests = [
    {
      id: 'QR-005',
      hotelName: 'Shangri-La Hotel',
      requestDate: '2025-06-15',
      checkIn: '2023-07-01',
      checkOut: '2023-07-05',
      guestCount: 25,
      groupType: 'Corporate',
      roomType: 'Deluxe',
      specialRequirements: 'Conference room for 30 people, Projector, Welcome drinks',
      status: 'Pending',
      contactPerson: 'Michael Johnson',
      contactEmail: 'michael@company.com',
      contactPhone: '+94 77 123 4567',
      budget: 'LKR 750,000',
      mealsIncluded: 'Breakfast, Lunch',
      activities: ['City Tour', 'Team Building', 'Gala Dinner'],
      transportNeeded: true
    },
    {
      id: 'QR-004',
      hotelName: 'Cinnamon Grand',
      requestDate: '2025-06-14',
      checkIn: '2025-07-10',
      checkOut: '2025-07-15',
      guestCount: 40,
      groupType: 'Wedding',
      roomType: 'Mixed (15 Standard, 10 Deluxe, 5 Suites)',
      specialRequirements: 'Wedding hall, Decoration services, Photography areas',
      status: 'Approved',
      contactPerson: 'Sarah Williams',
      contactEmail: 'sarah@email.com',
      contactPhone: '+94 76 987 6543',
      budget: 'LKR 1,200,000',
      mealsIncluded: 'All Inclusive',
      activities: ['Wedding Ceremony', 'Reception', 'Farewell Brunch'],
      transportNeeded: false
    },
    {
      id: 'QR-003',
      hotelName: 'Hilton Colombo',
      requestDate: '2025-06-14',
      checkIn: '2025-07-25',
      checkOut: '2025-07-30',
      guestCount: 22,
      groupType: 'Academic',
      roomType: 'Standard',
      specialRequirements: 'Study room, WiFi, Printing services',
      status: 'Pending',
      contactPerson: 'Prof. Robert Lee',
      contactEmail: 'robert@university.edu',
      contactPhone: '+94 71 234 5678',
      budget: 'LKR 500,000',
      mealsIncluded: 'Breakfast only',
      activities: ['Workshop Sessions', 'Field Visits'],
      transportNeeded: true
    },
    {
      id: 'QR-002',
      hotelName: 'Jetwing Blue',
      requestDate: '2025-06-13',
      checkIn: '2025-07-05',
      checkOut: '2025-07-10',
      guestCount: 30,
      groupType: 'Sports Team',
      roomType: 'Deluxe',
      specialRequirements: 'Gym access, Special diet meals, Early breakfast',
      status: 'Rejected',
      contactPerson: 'Coach David Brown',
      contactEmail: 'david@sportsteam.com',
      contactPhone: '+94 75 345 6789',
      budget: 'LKR 850,000',
      mealsIncluded: 'Full Board',
      activities: ['Training Sessions', 'Beach Activities'],
      transportNeeded: true
    },
    {
      id: 'QR-001',
      hotelName: 'Heritance Kandalama',
      requestDate: '2025-06-12',
      checkIn: '2025-07-20',
      checkOut: '2025-07-25',
      guestCount: 35,
      groupType: 'Tour Group',
      roomType: 'Superior',
      specialRequirements: 'Tour guides, Packed lunches, Evening entertainment',
      status: 'Approved',
      contactPerson: 'Amanda Chen',
      contactEmail: 'amanda@tours.com',
      contactPhone: '+94 78 456 7890',
      budget: 'LKR 900,000',
      mealsIncluded: 'Breakfast and Dinner',
      activities: ['Sightseeing', 'Cultural Show', 'Nature Walks'],
      transportNeeded: false
    }
  ];

  // Function to handle view button click
  const handleViewQuotation = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Filter quotations based on search and active tab
  const filteredQuotations = quotationRequests.filter(quotation => {
    const matchesSearch = quotation.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quotation.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && quotation.status === activeTab;
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Group Quotation Requests</h1>
      
      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex space-x-2">
          <button 
            className={`py-2 px-4 rounded-md ${activeTab === 'All' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('All')}
          >
            All
          </button>
          <button 
            className={`py-2 px-4 rounded-md ${activeTab === 'Pending' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('Pending')}
          >
            Pending
          </button>
          <button 
            className={`py-2 px-4 rounded-md ${activeTab === 'Approved' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('Approved')}
          >
            Approved
          </button>
          <button 
            className={`py-2 px-4 rounded-md ${activeTab === 'Rejected' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('Rejected')}
          >
            Rejected
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search quotations..."
            className="w-full md:w-64 border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400 material-icons">search</span>
        </div>
      </div>
      
      {/* Quotations Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In - Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {quotation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quotation.hotelName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quotation.groupType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.guestCount} <span className="text-xs text-gray-400">people</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(quotation.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(quotation.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(quotation.status)}`}>
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md text-xs"
                      onClick={() => handleViewQuotation(quotation)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredQuotations.length}</span> of <span className="font-medium">{filteredQuotations.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-yellow-400 text-black">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Quotation Details Modal */}
      {showModal && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Group Quotation Request Details - {selectedQuotation.id}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Quotation Content */}
            <div className="p-6">
              {/* Group and Hotel Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Group Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Group Information</h3>
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700">Group Type</h4>
                      <p className="text-lg font-bold">{selectedQuotation.groupType}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700">Contact Person</h4>
                      <p>{selectedQuotation.contactPerson}</p>
                      <p className="text-sm text-gray-500">{selectedQuotation.contactEmail}</p>
                      <p className="text-sm text-gray-500">{selectedQuotation.contactPhone}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700">Group Size</h4>
                        <p className="text-lg font-bold">{selectedQuotation.guestCount} people</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Budget</h4>
                        <p className="text-lg font-bold">{selectedQuotation.budget}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hotel Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Hotel Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700">Hotel Name</h4>
                      <p className="text-lg font-bold">{selectedQuotation.hotelName}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700">Room Requirements</h4>
                      <p>{selectedQuotation.roomType}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700">Check In</h4>
                        <p>{new Date(selectedQuotation.checkIn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Check Out</h4>
                        <p>{new Date(selectedQuotation.checkOut).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Special Requirements and Activities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Special Requirements */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Special Requirements</h3>
                  <div className="bg-gray-50 p-4 rounded-md h-full">
                    <p className="whitespace-pre-line">{selectedQuotation.specialRequirements}</p>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Meals Included</h4>
                      <p>{selectedQuotation.mealsIncluded}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Transport Needed</h4>
                      <p>{selectedQuotation.transportNeeded ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Activities */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Planned Activities</h3>
                  <div className="bg-gray-50 p-4 rounded-md h-full">
                    <ul className="list-disc pl-5 space-y-2">
                      {selectedQuotation.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Request Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Request Timeline</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Request Submitted</p>
                      <p className="text-sm text-gray-500">{selectedQuotation.requestDate}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 ml-6 border-l-2 border-gray-200 pl-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Current Status</p>
                        <p className={`text-sm mt-1 ${
                          selectedQuotation.status === 'Approved' ? 'text-green-500' : 
                          selectedQuotation.status === 'Rejected' ? 'text-red-500' : 
                          'text-yellow-500'
                        }`}>
                          {selectedQuotation.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              
              {selectedQuotation.status === 'Pending' && (
                <>
                  <button 
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuatationRequests;
