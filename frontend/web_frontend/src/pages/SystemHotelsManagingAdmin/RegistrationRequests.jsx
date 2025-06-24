import React, { useState } from 'react';

const RegistrationRequests = () => {
  // Filter tabs
  const [activeTab, setActiveTab] = useState('Hotels');
  
  // Mock data for registration requests
  const registrationRequests = [
    {
      id: '#001',
      name: 'Shangri-La',
      address: 'Galiface Road, Colombo 7',
      contactNumber: '+94112365894',
      description: '14 Single Rooms | 23 Double Rooms\n10 Delux Room | 8 Family Rooms'
    },
    {
      id: '#002',
      name: 'Cinnamon',
      address: 'Galiface Road, Colombo 7',
      contactNumber: '+94112365894',
      description: '14 Single Rooms | 23 Double Rooms\n10 Delux Room | 8 Family Rooms'
    },
    {
      id: '#003',
      name: 'Hilton',
      address: 'Galiface Road, Colombo 7',
      contactNumber: '+94112365894',
      description: '14 Single Rooms | 23 Double Rooms\n10 Delux Room | 8 Family Rooms'
    },
    {
      id: '#004',
      name: 'Jetwings',
      address: 'Galiface Road, Colombo 7',
      contactNumber: '+94112365894',
      description: '14 Single Rooms | 23 Double Rooms\n10 Delux Room | 8 Family Rooms'
    },
    {
      id: '#005',
      name: 'Maroons',
      address: 'Galiface Road, Colombo 7',
      contactNumber: '+94112365894',
      description: '14 Single Rooms | 23 Double Rooms\n10 Delux Room | 8 Family Rooms'
    },
    {
      id: '#006',
      name: 'Ocena Beach',
      address: 'Galiface Road, Colombo 7',
      contactNumber: '+94112365894',
      description: '14 Single Rooms | 23 Double Rooms\n10 Delux Room | 8 Family Rooms'
    },
    {
      id: '#007',
      name: 'Blue Sky',
      address: 'Galiface Road, Colombo 7',
      contactNumber: '+94112365894',
      description: '14 Single Rooms | 23 Double Rooms\n10 Delux Room | 8 Family Rooms'
    },
    {
      id: '#008',
      name: 'Lakeside View',
      address: 'Galiface Road, Colombo 7',
      contactNumber: '+94112365894',
      description: '14 Single Rooms | 23 Double Rooms\n10 Delux Room | 8 Family Rooms'
    }
  ];
  
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
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleAccept(request.id)} 
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-xs"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleReject(request.id)} 
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs"
                      >
                        Reject
                      </button>
                    </div>
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
    </div>
  );
};

export default RegistrationRequests;
