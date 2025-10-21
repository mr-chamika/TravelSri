import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quotationService from '../../../services/quotationService';

const QuotationDetailView = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get meal price per person with fallback logic
  const getMealPricePerPerson = (quotation) => {
    // Check for direct meal price fields
    if (quotation.mealPricePerPerson) return quotation.mealPricePerPerson;
    if (quotation.mealPlanPricePerPerson) return quotation.mealPlanPricePerPerson;
    
    // Fallback: calculate from meal plan type if available
    if (quotation.mealPlan && quotation.mealPlan !== 'Breakfast Only') {
      const basePrice = quotation.totalAmount || 0;
      const groupSize = quotation.guestCount || quotation.groupSize || 1;
      
      // Estimate meal price based on meal plan type
      switch (quotation.mealPlan) {
        case 'All Inclusive':
          return Math.round(basePrice * 0.4 / groupSize); // 40% for all-inclusive meals
        case 'Full Board':
          return Math.round(basePrice * 0.3 / groupSize); // 30% for full board
        case 'Half Board':
          return Math.round(basePrice * 0.2 / groupSize); // 20% for half board
        default:
          return Math.round(basePrice * 0.2 / groupSize); // Default 20%
      }
    }
    
    return 0;
  };

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setLoading(true);
        const data = await quotationService.getQuotationById(id);
        
        // Debug logging to check what data we receive
        console.log('QuotationDetailView - Raw quotation data:', data);
        if (data) {
          console.log('QuotationDetailView - Price fields check:', {
            accommodationPricePerPerson: data.accommodationPricePerPerson,
            mealPricePerPerson: data.mealPricePerPerson,
            mealPlanPricePerPerson: data.mealPlanPricePerPerson,
            totalPricePerPerson: data.totalPricePerPerson,
            mealPlan: data.mealPlan
          });
        }
        
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
        
        {/* Accommodation Price Details */}
        <section className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <h4 className="text-lg font-medium mb-3 flex items-center border-b pb-2">
            <span className="material-icons mr-2 text-yellow-600">payments</span>
            Accommodation Price Details
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="text-gray-600">Room Type:</div>
              <div className="text-right font-medium">{quotation.roomType || quotation.accommodationType || 'Standard'}</div>
              
              <div className="text-gray-600">Group Size:</div>
              <div className="text-right font-medium">{quotation.guestCount || quotation.groupSize || 0} people</div>
              
              <div className="text-gray-600">Stay Duration:</div>
              <div className="text-right font-medium">{calculateNights(quotation.checkIn, quotation.checkOut)} nights</div>
              
              <div className="text-gray-600 border-b pb-2">Base Accommodation:</div>
              <div className="text-right font-medium border-b pb-2">
                LKR {quotation.totalAmount ? parseFloat(quotation.totalAmount).toFixed(2) : '0.00'}
              </div>
              
              {quotation.mealPlan && quotation.mealPlan !== 'Breakfast Only' && getMealPricePerPerson(quotation) > 0 && (
                <>
                  <div className="text-gray-600">Meal Plan ({quotation.mealPlan}):</div>
                  <div className="text-right font-medium">
                    LKR {(getMealPricePerPerson(quotation) * (quotation.guestCount || quotation.groupSize || 1) * calculateNights(quotation.checkIn, quotation.checkOut)).toFixed(2)}
                  </div>
                </>
              )}
              
              {quotation.airportTransfer && (
                <>
                  <div className="text-gray-600">Transportation Cost:</div>
                  <div className="text-right font-medium">LKR {quotation.transportationPrice || '2000.00'}</div>
                </>
              )}
            </div>
            
            {quotation.discountOffered > 0 && (
              <div className="flex justify-between mb-2 text-green-600 bg-green-50 p-2 rounded">
                <span className="flex items-center">
                  <span className="material-icons text-sm mr-1">local_offer</span>
                  Discount ({quotation.discountOffered}%):
                </span>
                <span className="font-medium">-LKR {(quotation.totalAmount * quotation.discountOffered / 100).toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg border-t border-yellow-300 pt-3 mt-3 bg-yellow-50 p-3 rounded">
              <span className="text-gray-800">Total Quote Amount:</span>
              <span className="text-xl">
                LKR {quotation.finalAmount ? 
                  parseFloat(quotation.finalAmount).toFixed(2) : 
                  (quotation.totalAmount - (quotation.totalAmount * (quotation.discountOffered || 0) / 100)).toFixed(2)
                }
              </span>
            </div>
            
            {/* Per-Person Breakdown */}
            <div className="mt-4 bg-blue-50 p-3 border border-blue-200 rounded">
              <h5 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                <span className="material-icons text-blue-600 text-sm mr-2">person</span>
                Per Person Breakdown (Group Size: {quotation.guestCount || quotation.groupSize || 0})
              </h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-blue-700">Accommodation per person:</div>
                <div className="text-right font-medium text-blue-800">
                  LKR {quotation.accommodationPricePerPerson ? 
                    parseFloat(quotation.accommodationPricePerPerson).toFixed(2) : 
                    '0.00'}
                </div>
                
                <div className="text-blue-700">Meal plan per person:</div>
                <div className="text-right font-medium text-blue-800">
                  LKR {getMealPricePerPerson(quotation).toFixed(2)}
                </div>
                
                <div className="text-blue-700 font-semibold border-t pt-1">Total per person:</div>
                <div className="text-right font-bold text-blue-900 border-t pt-1">
                  LKR {quotation.totalPricePerPerson ? 
                    parseFloat(quotation.totalPricePerPerson).toFixed(2) : 
                    '0.00'}
                </div>
              </div>
            </div>
            
            {/* Meal Plan Information */}
            <div className="mt-4 bg-yellow-50 p-3 border border-yellow-200 rounded">
              <h5 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
                <span className="material-icons text-yellow-600 text-sm mr-2">restaurant</span>
                Meal Plan Details
              </h5>
              <p className="text-yellow-700 text-sm">
                {quotation.mealPlan || 'Not specified'}
                {quotation.mealNotes && ` - ${quotation.mealNotes}`}
              </p>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 bg-white p-3 border border-gray-100 rounded">
              <div className="flex items-start mb-1">
                <span className="material-icons text-yellow-600 text-sm mr-2">info</span>
                <p>Rates are based on group accommodation package. Per-person prices are calculated and saved automatically.</p>
              </div>
              <div className="flex items-start">
                <span className="material-icons text-yellow-600 text-sm mr-2">event</span>
                <p>Quote valid for 14 days from issue date.</p>
              </div>
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