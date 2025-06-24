import React, { useState } from 'react';

const QuatationRequests = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for quotation requests
  const quotationRequests = [
    {
      id: 'QR-005',
      hotelName: 'Shangri-La Hotel',
      requestDate: '2025-06-15',
      checkIn: '2023-07-01',
      checkOut: '2023-07-05',
      guestCount: 2,
      roomType: 'Deluxe',
      status: 'Pending'
    },
    {
      id: 'QR-004',
      hotelName: 'Cinnamon Grand',
      requestDate: '2025-06-14',
      checkIn: '2025-07-10',
      checkOut: '2025-07-15',
      guestCount: 4,
      roomType: 'Family Suite',
      status: 'Approved'
    },
    {
      id: 'QR-003',
      hotelName: 'Hilton Colombo',
      requestDate: '2025-06-14',
      checkIn: '2025-07-25',
      checkOut: '2025-07-30',
      guestCount: 2,
      roomType: 'Standard',
      status: 'Pending'
    },
    {
      id: 'QR-002',
      hotelName: 'Jetwing Blue',
      requestDate: '2025-06-13',
      checkIn: '2025-07-05',
      checkOut: '2025-07-10',
      guestCount: 3,
      roomType: 'Deluxe',
      status: 'Rejected'
    },
    {
      id: 'QR-001',
      hotelName: 'Heritance Kandalama',
      requestDate: '2025-06-12',
      checkIn: '2025-07-20',
      checkOut: '2025-07-25',
      guestCount: 2,
      roomType: 'Superior',
      status: 'Approved'
    }
  ];

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
      <h1 className="text-2xl font-bold mb-6">Quotation Requests</h1>
      
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
                  Quotation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.requestDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.checkIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.checkOut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.guestCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quotation.roomType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(quotation.status)}`}>
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <span className="material-icons text-sm">visibility</span>
                      </button>
                      {quotation.status === 'Pending' && (
                        <>
                          <button className="text-green-500 hover:text-green-600">
                            <span className="material-icons text-sm">check_circle</span>
                          </button>
                          <button className="text-red-500 hover:text-red-600">
                            <span className="material-icons text-sm">cancel</span>
                          </button>
                        </>
                      )}
                    </div>
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
    </div>
  );
};

export default QuatationRequests;
