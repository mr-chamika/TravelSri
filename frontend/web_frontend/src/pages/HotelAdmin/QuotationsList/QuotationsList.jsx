import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import quotationService from '../../../services/quotationService';

// Status Badge component
const StatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100 text-gray-800';
  
  if (status === 'Approved') {
    bgColor = 'bg-green-100 text-green-800';
  } else if (status === 'Rejected') {
    bgColor = 'bg-red-100 text-red-800';
  } else if (status === 'Pending') {
    bgColor = 'bg-yellow-100 text-yellow-800';
  }
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
      {status}
    </span>
  );
};

// Tooltip component for displaying requirements
const RequirementsTooltip = ({ children, requirements }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!requirements) return children;
  
  return (
    <div className="relative" 
         onMouseEnter={() => setShowTooltip(true)}
         onMouseLeave={() => setShowTooltip(false)}>
      {children}
      {showTooltip && (
        <div className="absolute z-10 p-2 bg-black text-white text-xs rounded w-64 bottom-full left-0 mb-2">
          <div className="font-bold mb-1">Special Requirements:</div>
          {requirements}
          <div className="absolute bottom-0 left-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
        </div>
      )}
    </div>
  );
};

const QuotationsList = () => {
  // State
  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination settings
  const itemsPerPage = 10;
  
  // Fetch quotations on component mount
  useEffect(() => {
    const fetchQuotations = async () => {
      setIsLoading(true);
      try {
        const data = await quotationService.getAllQuotations();
        setQuotations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching quotations:', err);
        setError('Failed to load quotations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuotations();
  }, []);
  
  // Filter quotations based on status and search term
  const filteredQuotations = quotations
    .filter(q => filterStatus === 'All' || q.status === filterStatus)
    .filter(q => {
      if (!searchTerm.trim()) return true;
      
      const term = searchTerm.toLowerCase();
      return (
        q.quoteNumber.toLowerCase().includes(term) ||
        q.organizationName.toLowerCase().includes(term) ||
        q.contactPersonName.toLowerCase().includes(term) ||
        q.contactEmail.toLowerCase().includes(term) ||
        q.packageType.toLowerCase().includes(term) ||
        (q.contactPhone && q.contactPhone.toLowerCase().includes(term)) ||
        (q.requirements && q.requirements.toLowerCase().includes(term))
      );
    });
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sort quotations
  const sortedQuotations = [...filteredQuotations].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle special cases
    if (sortField === 'checkIn' || sortField === 'checkOut' || sortField === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Handle numeric fields
    if (sortField === 'totalAmount') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }
    
    // Compare based on direction
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotations = sortedQuotations.slice(startIndex, startIndex + itemsPerPage);
  
  // Format date for display
  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (err) {
      return iso;
    }
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Quotations</h2>
        
        {/* Search box */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by name, email, room, requirements..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 material-icons">
            search
          </span>
        </div>
      </div>
      
      {/* Filter tabs with counts */}
      <div className="flex flex-wrap mb-6">
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => {
          // Calculate count for each status
          const count = status === 'All' 
            ? quotations.length 
            : quotations.filter(q => q.status === status).length;
            
          // Determine badge color
          let badgeColor = 'bg-gray-200 text-gray-700';
          if (status === 'Pending') badgeColor = 'bg-yellow-100 text-yellow-800';
          if (status === 'Approved') badgeColor = 'bg-green-100 text-green-800';
          if (status === 'Rejected') badgeColor = 'bg-red-100 text-red-800';
          
          return (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(status)}
              className={`mr-3 mb-2 px-4 py-2 rounded-md transition-colors flex items-center ${
                filterStatus === status
                  ? 'bg-yellow-300 text-black'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {status}
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                filterStatus === status ? 'bg-yellow-400 text-black' : badgeColor
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      )}
      
      {/* Quotations table */}
      {!isLoading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('quoteNumber')}
                  >
                    Group Quote # & Date
                    {sortField === 'quoteNumber' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('organizationName')}
                  >
                    Organization
                    {sortField === 'organizationName' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('packageType')}
                  >
                    Package & Group Size
                    {sortField === 'packageType' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('departureDate')}
                  >
                    Travel Period
                    {sortField === 'departureDate' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortField === 'status' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('totalAmount')}
                  >
                    Amount & Discount
                    {sortField === 'totalAmount' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedQuotations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No quotations found.
                    </td>
                  </tr>
                ) : (
                  paginatedQuotations.map((quotation) => (
                    <tr key={quotation.id} className="hover:bg-gray-50" title={quotation.requirements ? `Requirements: ${quotation.requirements}` : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {quotation.quoteNumber}
                        <div className="text-xs text-gray-400 mt-1">
                          Created: {new Date(quotation.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <RequirementsTooltip requirements={quotation.requirements}>
                          <div className="font-medium">
                            {quotation.customerName}
                            {quotation.requirements && (
                              <span className="ml-1 text-xs text-blue-500 cursor-help">
                                <i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle' }}>info</i>
                              </span>
                            )}
                          </div>
                        </RequirementsTooltip>
                        <div className="text-xs text-gray-400">{quotation.customerEmail}</div>
                        <div className="text-xs text-gray-400">{quotation.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{quotation.roomType}</div>
                        <div className="text-xs text-gray-400">
                          {quotation.guestCount} guest{quotation.guestCount !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className={quotation.roomAvailability === 'Available' ? 'text-green-600' : 'text-orange-600'}>
                            {quotation.roomAvailability}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatDate(quotation.checkIn)}</div>
                        <div className="text-xs text-gray-400">to {formatDate(quotation.checkOut)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={quotation.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div>LKR {quotation.totalAmount.toFixed(2)}</div>
                        {quotation.discountOffered > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            {quotation.discountOffered}% discount
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/hotel/quotations/${quotation.id}`}
                          className="text-yellow-600 hover:text-yellow-800 mr-4"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, filteredQuotations.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredQuotations.length}</span> quotations
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <span className="material-icons text-sm">chevron_left</span>
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(totalPages).keys()].map(page => (
                      <button
                        key={page + 1}
                        onClick={() => handlePageChange(page + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === page + 1
                            ? 'bg-yellow-300 text-black'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <span className="material-icons text-sm">chevron_right</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuotationsList;
