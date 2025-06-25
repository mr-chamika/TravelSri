import React, { useState } from 'react';

const RegistrationRequests = () => {
  // Filter tabs
  const [activeTab, setActiveTab] = useState('Hotels');
  
  // State for modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Mock data for registration requests
  const registrationRequests = [
    {
      id: '#001',
      name: 'Shangri-La',
      address: 'Gallface Road, Colombo 7, Sri Lanka',
      contactNumber: '+94112365894',
      description: '36 Single Rooms | 32 Double Rooms\n24 Delux Room | 19 Family Rooms'
    },
    {
      id: '#002',
      name: 'Cinnamon Gardens',
      address: 'Park Avenue, Kandy, Sri Lanka',
      contactNumber: '+94112365894',
      description: '21 Single Rooms | 15 Double Rooms\n12 Delux Room | 6 Family Rooms'
    },
    {
      id: '#003',
      name: 'Hilton Grand ',
      address: '142, New South Road, Colombo, Sri Lanka',
      contactNumber: '+94112365894',
      description: '28 Single Rooms | 21 Double Rooms\n16 Delux Room | 14 Family Rooms'
    },
    {
      id: '#004',
      name: 'Jetwings',
      address: '74/A, Ocean Avenue, Matara, Sri Lanka',
      contactNumber: '+94112365894',
      description: '24 Single Rooms | 18 Double Rooms\n12 Delux Room | 10 Family Rooms'
    },
    {
      id: '#005',
      name: 'Dream Maroons',
      address: '124, Fransis Road, Negemobo',
      contactNumber: '+94112365894',
      description: '29 Single Rooms | 15 Double Rooms\n19 Delux Room | 12 Family Rooms'
    },
    {
      id: '#006',
      name: 'Ocena Beach',
      address: 'Resthouse Cross Road, Tricomalee, Sri Lanka',
      contactNumber: '+94112365894',
      description: '13 Single Rooms | 19 Double Rooms\n14 Delux Room | 5 Family Rooms'
    },
    {
      id: '#007',
      name: 'Blue Sky',
      address: 'Matara Road, Galle, Sri Lanka',
      contactNumber: '+94112365894',
      description: '16 Single Rooms | 29 Double Rooms\n11 Delux Room | 7 Family Rooms'
    },
    {
      id: '#008',
      name: 'Lakeside View',
      address: 'New Townhall Avenue, Matara, Sri Lanka',
      contactNumber: '+94112365894',
      description: '15 Single Rooms | 13 Double Rooms\n12 Delux Room | 6 Family Rooms'
    }
  ];
  
  // Add extended data for hotel details
  const extendedHotelData = {
    '#001': {
      description: "Luxury hotel in the heart of Colombo, offering stunning views of the ocean and premium amenities for travelers.",
      amenities: ["Swimming Pool", "Spa", "Fitness Center", "Restaurant", "Room Service", "Free WiFi", "Conference Rooms", "Business Center"],
      rating: 4.8,
      price: "LKR 20,000 - 45,000 per night",
      categories: ["Business", "Luxury", "Family-friendly"],
      manager: "David Fernando",
      managerContact: "+94 77 123 4567",
      email: "info@shangri-la.lk",
      website: "www.shangri-la.lk",
      registrationDate: "2023-10-12"
    },
    '#002': {
      description: "Elegant beachfront hotel with spacious rooms and world-class dining options.",
      amenities: ["Beach Access", "Infinity Pool", "Spa", "Multiple Restaurants", "Bar", "Room Service", "Free WiFi"],
      rating: 4.7,
      price: "LKR 18,000 - 40,000 per night",
      categories: ["Luxury", "Beach", "Family-friendly"],
      manager: "Sarah Perera",
      managerContact: "+94 77 987 6543",
      email: "reservations@cinnamon.lk",
      website: "www.cinnamon.lk",
      registrationDate: "2023-09-28"
    },
    // You can add more for other hotel IDs as needed
  };

  // Add hotel images data
  const hotelImages = {
    '#001': [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
    ],
    '#002': [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
    ],
    '#003': [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
    ]
  };

  // Map images for each location
 const mapImages = {
  '#001': 'https://via.placeholder.com/600x400.png?text=Map+Location+%23001',
  '#002': 'https://via.placeholder.com/600x400.png?text=Map+Location+%23002',
  '#003': 'https://via.placeholder.com/600x400.png?text=Map+Location+%23003',
  'default': 'https://via.placeholder.com/600x400.png?text=Map+Not+Available',
};


  // Default images if specific ones are not available
  const defaultImages = [
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1534612899740-55c821a90129?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
  ];

  // Helper function to get hotel images
  const getHotelImages = (id) => {
    return hotelImages[id] || defaultImages;
  };

  // Helper function to get map image
  const getMapImage = (id) => {
    return mapImages[id] || mapImages['default'];
  };

  // Handle property type change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle accept/reject
  const handleAccept = (id) => {
    console.log(`Accepted request ${id}`);
    // Implement API call to accept request
  };
  
  const handleReject = (id) => {
    console.log(`Rejected request ${id}`);
    // Implement API call to reject request
  };

  // Handle view request
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };
  
  // Handle close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 7; // Mock total pages
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Registration Requests</h1>
      
      {/* Property Type Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button 
            className={`py-2 px-4 rounded-md ${activeTab === 'Hotels' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => handleTabChange('Hotels')}
          >
            Hotels (100)
          </button>
          <button 
            className={`py-2 px-4 rounded-md ${activeTab === 'Apartments' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => handleTabChange('Apartments')}
          >
            Apartments (20)
          </button>
          <button 
            className={`py-2 px-4 rounded-md ${activeTab === 'Villas' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => handleTabChange('Villas')}
          >
            Villas (80)
          </button>
        </div>
      </div>
      
      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrationRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.contactNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {request.description.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewRequest(request)} 
                      className="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded text-xs"
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
          <button 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  page === currentPage 
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Registration Request Details</h2>
              <button 
                onClick={closeModal} 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Hotel Information */}
            <div className="p-6">
              {/* Hotel Header with Image */}
              <div className="mb-6 flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3 flex flex-col">
                  <div className="bg-yellow-50 p-4 rounded-md h-full">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{selectedRequest.name}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full h-fit">
                        {activeTab}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">Request ID: {selectedRequest.id}</p>
                    
                    <p className="text-gray-700 mb-4">
                      {extendedHotelData[selectedRequest.id]?.description || 
                      "A premier hotel offering exceptional service and comfortable accommodations for both business and leisure travelers."}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Address</h4>
                        <p className="text-gray-800">{selectedRequest.address}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
                        <p className="text-gray-800">{selectedRequest.contactNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="h-full bg-gray-100 rounded-md overflow-hidden relative">
                    {/* Hotel Featured Image */}
                    <img 
                      src={getHotelImages(selectedRequest.id)[0]}
                      alt={selectedRequest.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=Hotel+Image";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="ml-1 text-white font-medium">
                          {extendedHotelData[selectedRequest.id]?.rating || "4.5"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Room Details */}
              <h3 className="text-lg font-medium text-gray-800 mb-3">Room Information</h3>
              
              {/* Parse and display room information in a grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {selectedRequest.description.split('\n').flatMap((line) => {
                  return line.split('|').map((item, index) => {
                    const [roomCount, roomType] = item.trim().split(' ', 2);
                    const remainingText = item.trim().substring(roomCount.length + 1);
                    
                    return (
                      <div key={index} className="bg-gray-50 p-3 rounded-md shadow-sm">
                        <p className="text-sm text-gray-500">{remainingText}</p>
                        <p className="text-xl font-semibold">{roomCount}</p>
                      </div>
                    );
                  });
                })}
              </div>
              
              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {(extendedHotelData[selectedRequest.id]?.amenities || 
                    ["Swimming Pool", "WiFi", "Restaurant", "Parking", "Gym", "Room Service"]
                  ).map((amenity, index) => (
                    <div key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Details</h3>
                  <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Price Range</h4>
                        <p className="text-gray-800">
                          {extendedHotelData[selectedRequest.id]?.price || "LKR 15,000 - 35,000 per night"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Categories</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(extendedHotelData[selectedRequest.id]?.categories || ["Business", "Luxury"]).map((category, idx) => (
                            <span key={idx} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Website</h4>
                        <a href="#" className="text-blue-600 hover:underline">
                          {extendedHotelData[selectedRequest.id]?.website || `www.${selectedRequest.name.toLowerCase().replace(/\s+/g, '')}.lk`}
                        </a>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                        <p className="text-gray-800">
                          {extendedHotelData[selectedRequest.id]?.email || `info@${selectedRequest.name.toLowerCase().replace(/\s+/g, '')}.lk`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Registration Info</h3>
                  <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                        <p className="inline-flex bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Pending Approval
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Request Date</h4>
                        <p className="text-gray-800">
                          {extendedHotelData[selectedRequest.id]?.registrationDate || "October 15, 2023"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Manager</h4>
                        <p className="text-gray-800">
                          {extendedHotelData[selectedRequest.id]?.manager || "John Doe"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Manager Contact</h4>
                        <p className="text-gray-800">
                          {extendedHotelData[selectedRequest.id]?.managerContact || "+94 77 123 4567"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hotel Photos - updated with real images */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Property Photos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {getHotelImages(selectedRequest.id).map((imageUrl, index) => (
                    <div key={index} className="h-48 bg-gray-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <img 
                        src={imageUrl}
                        alt={`${selectedRequest.name} photo ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Location Map - updated with map image */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Location</h3>
                <div className="bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={getMapImage(selectedRequest.id)}
                    alt={`Map of ${selectedRequest.address}`}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = "https://media.istockphoto.com/id/1189124431/vector/simple-flat-color-sri-lanka-map.jpg?s=612x612&w=0&k=20&c=kDbiCzwTzVc30UYQNqQgR5cYQhWEAHGGYHgWSAfs8Y8=";
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedRequest.address}
                </p>
              </div>
            </div>
            
            {/* Modal Footer with Accept/Reject Buttons */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  handleReject(selectedRequest.id);
                  closeModal();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Reject
              </button>
              <button 
                onClick={() => {
                  handleAccept(selectedRequest.id);
                  closeModal();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationRequests;
