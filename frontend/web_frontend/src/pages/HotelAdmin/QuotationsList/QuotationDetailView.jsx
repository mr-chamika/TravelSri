import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quotationService from '../../../services/quotationService';

const QuotationDetailView = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setLoading(true);
        const data = await quotationService.getQuotationById(id);
        setQuotation(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch quotation details:', err);
        setError('Failed to load quotation details. Please try again.');
        
        // No fallback data needed as we have good mock data now
        setQuotation(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchQuotation();
    }
  }, [id]);

  // Format date helper function
  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return iso; // Return original string if formatting fails
    }
  };
  
  // Format date and time helper function
  const formatDateTime = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return iso;
    }
  };
  
  // Calculate nights between dates
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    } catch (err) {
      return 0;
    }
  };
  
  // Get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error && !quotation) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <Link 
          to="/hotel/quotations-list" 
          className="text-yellow-600 hover:text-yellow-800 flex items-center"
        >
          <span className="material-icons mr-1">arrow_back</span>
          Back to Quotations List
        </Link>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow-sm">
          <p className="font-bold">No Quotation Found</p>
          <p>The requested quotation could not be found.</p>
        </div>
        <Link 
          to="/hotel/quotations-list" 
          className="text-yellow-600 hover:text-yellow-800 flex items-center"
        >
          <span className="material-icons mr-1">arrow_back</span>
          Back to Quotations List
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link 
          to="/hotel/quotations-list" 
          className="text-yellow-600 hover:text-yellow-800 flex items-center"
        >
          <span className="material-icons mr-1">arrow_back</span>
          Back to Quotations List
        </Link>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {quotation.quoteNumber || 'Quotation'}
        </h1>
        <div className="flex space-x-2">
          <Link 
            to="/hotel/quotations" 
            className="bg-yellow-300 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center"
          >
            <span className="material-icons mr-1">edit</span>
            Manage Quotations
          </Link>
        </div>
      </div>
      
      {/* Status Banner */}
      <div className={`p-4 rounded-lg border mb-6 ${getStatusBadgeClass(quotation.status)}`}>
        <div className="flex items-center">
          <span className={`material-icons mr-3 ${
            quotation.status === 'Approved' ? 'text-green-500' :
            quotation.status === 'Pending' ? 'text-yellow-500' : 
            'text-red-500'
          }`}>
            {quotation.status === 'Approved' ? 'check_circle' : 
            quotation.status === 'Pending' ? 'pending' : 'cancel'}
          </span>
          <div>
            <h2 className="font-medium text-lg">
              {quotation.status === 'Approved' ? 'Quotation Approved' : 
               quotation.status === 'Pending' ? 'Quotation Pending Review' : 
               'Quotation Rejected'}
            </h2>
            <p className="text-sm opacity-75">
              Last updated: {formatDateTime(quotation.updatedAt || quotation.createdAt)}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold">LKR {quotation.totalAmount}</p>
            <p className="text-sm opacity-75">Total Amount</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-8 mb-6">
        {/* Customer Information */}
        <section>
          <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="font-medium">{quotation.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium">{quotation.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-medium">{quotation.customerPhone || 'Not provided'}</p>
            </div>
          </div>
        </section>
        
        {/* Reservation Details */}
        <section>
          <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
            Reservation Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Room Type</p>
              <p className="font-medium">{quotation.roomType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="font-medium">
                {calculateNights(quotation.checkIn, quotation.checkOut)} night(s)
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Check-in Date</p>
              <p className="font-medium">{formatDate(quotation.checkIn)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Check-out Date</p>
              <p className="font-medium">{formatDate(quotation.checkOut)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Guests</p>
              <p className="font-medium">{quotation.guestCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Room Availability</p>
              <p className={`font-medium ${quotation.roomAvailability === 'Available' ? 'text-green-600' : 'text-orange-600'}`}>
                {quotation.roomAvailability || 'Unknown'}
              </p>
            </div>
          </div>
        </section>
        
        {/* Requirements */}
        {quotation.requirements && (
          <section>
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
              Special Requirements
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{quotation.requirements}</p>
            </div>
          </section>
        )}
        
        {/* Admin Notes */}
        {quotation.adminNotes && (
          <section>
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
              Admin Notes
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="italic text-blue-800">{quotation.adminNotes}</p>
            </div>
          </section>
        )}
        
        {/* Price Details */}
        <section>
          <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
            Price Details
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p>Room Rate</p>
              <p className="font-medium">LKR {quotation.totalAmount / calculateNights(quotation.checkIn, quotation.checkOut)} per night</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p>Number of Nights</p>
              <p className="font-medium">{calculateNights(quotation.checkIn, quotation.checkOut)}</p>
            </div>
            {quotation.discountOffered > 0 && (
              <div className="flex justify-between items-center mb-2">
                <p>Discount</p>
                <p className="font-medium text-green-600">{quotation.discountOffered}%</p>
              </div>
            )}
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <p className="font-medium">Total Amount</p>
              <p className="font-bold text-xl">LKR {parseFloat(quotation.totalAmount).toFixed(2)}</p>
            </div>
          </div>
        </section>
      </div>
      
      {/* Action Buttons */}
      {quotation.status === 'Pending' && (
        <div className="flex justify-end space-x-4 mt-6">
          <button 
            onClick={() => {
              alert('Quotation rejected. In a real application, this would update the status in the backend.');
            }}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center"
          >
            <span className="material-icons mr-2">cancel</span>
            Reject Quotation
          </button>
          
          <button 
            onClick={() => {
              alert('Quotation approved. In a real application, this would update the status in the backend.');
            }}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center"
          >
            <span className="material-icons mr-2">check_circle</span>
            Approve Quotation
          </button>
          
          <Link 
            to={`/hotel/quotations`}
            className="px-6 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-lg flex items-center"
          >
            <span className="material-icons mr-2">edit</span>
            Edit Response
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuotationDetailView;
