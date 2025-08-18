import React, { useState, useEffect } from 'react';
import quotationService from '../../../services/quotationService';
import pendingTripService from '../../../services/pendingTripService';
import { Link } from 'react-router-dom';

// Input component
const Input = ({ label, type = 'text', name, value, onChange, min, max, required = false, disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      className={`w-full px-3 py-2 border ${
        disabled ? 'bg-gray-100' : 'bg-white'
      } border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
    />
  </div>
);

// Select component
const Select = ({ label, name, value, onChange, options, required = false, disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`w-full px-3 py-2 border ${
        disabled ? 'bg-gray-100' : 'bg-white'
      } border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Textarea component
const Textarea = ({ label, name, value, onChange, rows = 3, required = false, disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      required={required}
      className={`w-full px-3 py-2 border ${
        disabled ? 'bg-gray-100' : 'bg-white'
      } border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
      placeholder={`Enter ${label.toLowerCase()}...`}
    />
  </div>
);

// Flash Message component
const FlashMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg animate-fadeIn ${
      type === 'success' ? 'bg-green-50 border border-green-200' :
      type === 'error' ? 'bg-red-50 border border-red-200' :
      'bg-yellow-50 border border-yellow-200'
    }`}>
      <div className="flex items-center">
        <span className={`material-icons mr-2 ${
          type === 'success' ? 'text-green-500' :
          type === 'error' ? 'text-red-500' : 
          'text-yellow-500'
        }`}>
          {type === 'success' ? 'check_circle' : 
           type === 'error' ? 'error' : 
           'info'}
        </span>
        <p className={`${
          type === 'success' ? 'text-green-700' :
          type === 'error' ? 'text-red-700' : 
          'text-yellow-700'
        }`}>
          {message}
        </p>
        <button 
          onClick={onClose}
          className="ml-auto text-gray-400 hover:text-gray-600"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
    </div>
  );
};

// Confirmation Dialog component
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-600">{message}</p>
        </div>
        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-yellow-300 text-black rounded-md hover:bg-yellow-400"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Quotation Detail View component
const QuotationDetailView = ({ quotation, onClose, onApprove, onReject, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuotation, setEditedQuotation] = useState({...quotation});
  const [notes, setNotes] = useState('');
  
  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      
      // Check for valid date objects
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid date format:', { checkIn, checkOut });
        return 0;
      }
      
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('Error calculating nights:', error);
      return 0;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date format:', dateString);
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error';
    }
  };
  
  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedQuotation(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle save
  const handleSave = () => {
    onUpdate(editedQuotation);
    setIsEditing(false);
  };
  
  // Handle approve with notes
  const handleApprove = () => {
    onApprove(quotation.id, notes);
  };
  
  // Handle reject with notes
  const handleReject = () => {
    onReject(quotation.id, notes);
  };
  
  // Room type options for selection
  const roomTypes = [
    'Standard Room',
    'Deluxe Room',
    'Suite',
    'Family Room',
    'Executive Suite',
  ];
  
  return (
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      {/* Modal header */}
      <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-200 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold flex items-center">
            <span className="material-icons mr-2">description</span>
            Accommodation Quote #{quotation.quoteNumber}
            <span className={`ml-4 px-3 py-1 text-sm rounded-full ${
              quotation.status === 'Approved' ? 'bg-green-100 text-green-800' :
              quotation.status === 'Rejected' ? 'bg-red-100 text-red-800' :
              quotation.status === 'Under Review' ? 'bg-purple-100 text-purple-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {quotation.status}
            </span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">Submitted form details for group accommodation quotation</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="material-icons">close</span>
        </button>
      </div>      <div className="p-6 space-y-6">
        {/* Group and Contact Information */}
        <section className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <h4 className="text-lg font-medium mb-3 flex items-center border-b pb-2">
            <span className="material-icons mr-2 text-yellow-600">groups</span>
            Group Trip Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-r pr-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Package Name</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 font-medium">{editedQuotation.packageName || 'Not specified'}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 font-medium">{editedQuotation.hotelName || 'Your Hotel'}</div>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="material-icons text-sm mr-1 align-text-bottom">person</span> Contact Person
                </label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">{editedQuotation.contactPersonName}</div>
              </div>
              <div className="flex flex-wrap mb-4">
                <div className="w-1/2 pr-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="material-icons text-sm mr-1 align-text-bottom">email</span> Contact Email
                  </label>
                  <div className="bg-gray-50 p-2 rounded border border-gray-200 overflow-hidden text-ellipsis">{editedQuotation.contactEmail}</div>
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="material-icons text-sm mr-1 align-text-bottom">phone</span> Contact Phone
                  </label>
                  <div className="bg-gray-50 p-2 rounded border border-gray-200">{editedQuotation.contactPhone}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accommodation Details */}
        <section className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm mt-4">
          <h4 className="text-lg font-medium mb-3 flex items-center border-b pb-2">
            <span className="material-icons mr-2 text-yellow-600">hotel</span>
            Group Accommodation Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  {editedQuotation.accommodationType || 'Not specified'}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 flex items-center">
                  <span className="material-icons text-yellow-600 mr-1 text-sm">groups</span>
                  {editedQuotation.groupSize || '0'} people
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 flex items-center">
                  <span className="material-icons text-yellow-600 mr-1 text-sm">hotel</span>
                  {editedQuotation.roomsRequired || Math.ceil(editedQuotation.groupSize / 2) || '0'} rooms
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Travel Schedule</label>
                <div className="bg-yellow-50 p-2 rounded border border-yellow-200 text-sm">
                  <span className="font-medium">Group Trip Package:</span> {editedQuotation.packageName || 'Not specified'}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex flex-wrap mb-4">
                <div className="w-1/2 pr-2 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <div className="bg-gray-50 p-2 rounded border border-gray-200">
                    {formatDate(editedQuotation.checkInDate) || 'Not specified'}
                  </div>
                </div>
                <div className="w-1/2 pl-2 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <div className="bg-gray-50 p-2 rounded border border-gray-200">
                    {formatDate(editedQuotation.checkOutDate) || 'Not specified'}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stay Duration</label>
                <div className="bg-yellow-50 p-2 rounded border border-yellow-200 font-medium">
                  {calculateNights(editedQuotation.checkInDate, editedQuotation.checkOutDate)} nights
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  {editedQuotation.mealPlan || 'Breakfast Only'}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Services</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  {editedQuotation.airportTransfer ? 
                    <span className="text-green-600 flex items-center">
                      <span className="material-icons text-sm mr-1">check_circle</span> Pool Facilities Included
                    </span> : 
                    <span className="text-gray-500 flex items-center">
                      <span className="material-icons text-sm mr-1">cancel</span> No Pool Facilities
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Accommodation Requirements</label>
            <div className="bg-gray-50 p-3 rounded border border-gray-200 min-h-[80px] whitespace-pre-wrap">
              {editedQuotation.specialRequirements || 'None specified'}
            </div>
          </div>
        </section>

        {/* Accommodation Price Details */}
        <section className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm mt-4">
          <h4 className="text-lg font-medium mb-3 flex items-center border-b pb-2">
            <span className="material-icons mr-2 text-yellow-600">payments</span>
            Accommodation Price Details
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="text-gray-600">Room Rate:</div>
              <div className="text-right font-medium">LKR {roomPrices[quotation.accommodationType] || 0} per room/night</div>
              
              <div className="text-gray-600">Number of Rooms:</div>
              <div className="text-right font-medium">{quotation.roomsRequired || Math.ceil(quotation.groupSize / 2)} rooms</div>
              
              <div className="text-gray-600">Stay Duration:</div>
              <div className="text-right font-medium">{calculateNights(quotation.checkInDate, quotation.checkOutDate)} nights</div>
              
              <div className="text-gray-600 border-b pb-2">Accommodation Subtotal:</div>
              <div className="text-right font-medium border-b pb-2">
                LKR {((roomPrices[quotation.accommodationType] || 0) * 
                  (quotation.roomsRequired || Math.ceil(quotation.groupSize / 2)) * 
                  calculateNights(quotation.checkInDate, quotation.checkOutDate)).toFixed(2)}
              </div>
              
              {quotation.mealPlan && quotation.mealPlan !== 'Breakfast Only' && (
                <>
                  <div className="text-gray-600">Meal Plan ({quotation.mealPlan}):</div>
                  <div className="text-right font-medium">
                    LKR {(quotation.groupSize * 
                      (quotation.mealPlan === 'Half Board' ? 25 : 
                       quotation.mealPlan === 'Full Board' ? 40 : 
                       quotation.mealPlan === 'All Inclusive' ? 60 : 0) * 
                      calculateNights(quotation.checkInDate, quotation.checkOutDate)).toFixed(2)}
                  </div>
                </>
              )}
              
              {quotation.airportTransfer && (
                <>
                  <div className="text-gray-600"> Transpotation Cost:</div>
                  <div className="text-right font-medium">LKR 2000.00</div>
                </>
              )}
              
              {isEditing && (
                <>
                  <div className="col-span-2 pt-2">
                    <Input
                      label="Discount Offered (%)"
                      type="number"
                      name="discountOffered"
                      min="0"
                      max="100"
                      value={editedQuotation.discountOffered || 0}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
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
              <span className="text-xl">LKR {(quotation.totalAmount - (quotation.totalAmount * (quotation.discountOffered || 0) / 100)).toFixed(2)}</span>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 bg-white p-3 border border-gray-100 rounded">
              <div className="flex items-start mb-1">
                <span className="material-icons text-yellow-600 text-sm mr-2">info</span>
                <p>Rates are based on group accommodation package.</p>
              </div>
              <div className="flex items-start">
                <span className="material-icons text-yellow-600 text-sm mr-2">event</span>
                <p>Quote valid for 14 days from issue date.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Approval Status Section */}
        <section className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm mt-4">
          <h4 className="text-lg font-medium mb-3 flex items-center border-b pb-2">
            <span className="material-icons mr-2 text-yellow-600">verified</span>
            Approval Status
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* Progress timeline */}
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  'bg-green-500 text-white'
                }`}>
                  <span className="material-icons text-sm">check</span>
                </div>
                <div className="absolute top-0 -ml-2 mt-12 w-14 text-center text-xs font-medium">Created</div>
                <div className="absolute top-0 -ml-2 mt-16 w-14 text-center text-xs text-gray-500">{formatDate(quotation.createdAt)}</div>
              </div>
              
              <div className={`flex-1 h-1 ${quotation.status !== 'Pending' ? 'bg-green-500' : 'bg-gray-300'} mx-2`}></div>
              
              <div className="relative">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  quotation.status === 'Under Review' || quotation.status === 'Approved' || quotation.status === 'Rejected' ? 
                  'bg-green-500 text-white' : 'bg-gray-300 text-white'
                }`}>
                  {quotation.status !== 'Pending' ? 
                    <span className="material-icons text-sm">check</span> : 
                    <span className="text-sm">2</span>}
                </div>
                <div className="absolute top-0 -ml-6 mt-12 w-20 text-center text-xs font-medium">Sent to Admin</div>
                {quotation.sentToSuperAdminDate && (
                  <div className="absolute top-0 -ml-6 mt-16 w-20 text-center text-xs text-gray-500">
                    {formatDate(quotation.sentToSuperAdminDate)}
                  </div>
                )}
              </div>
              
              <div className={`flex-1 h-1 ${
                quotation.status === 'Approved' || quotation.status === 'Rejected' ? 'bg-green-500' : 'bg-gray-300'
              } mx-2`}></div>
              
              <div className="relative">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  quotation.status === 'Approved' ? 'bg-green-500 text-white' : 
                  quotation.status === 'Rejected' ? 'bg-red-500 text-white' : 
                  'bg-gray-300 text-white'
                }`}>
                  {quotation.status === 'Approved' ? 
                    <span className="material-icons text-sm">check</span> : 
                    quotation.status === 'Rejected' ? 
                    <span className="material-icons text-sm">close</span> : 
                    <span className="text-sm">3</span>}
                </div>
                <div className="absolute top-0 -ml-4 mt-12 w-16 text-center text-xs font-medium">Decision</div>
                {(quotation.reviewDate && (quotation.status === 'Approved' || quotation.status === 'Rejected')) && (
                  <div className="absolute top-0 -ml-4 mt-16 w-16 text-center text-xs text-gray-500">
                    {formatDate(quotation.reviewDate)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Current status message */}
            <div className={`p-3 mb-4 rounded-md flex items-center ${
              quotation.status === 'Approved' ? 'bg-green-100 text-green-800' : 
              quotation.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
              quotation.status === 'Under Review' ? 'bg-purple-100 text-purple-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              <span className="material-icons mr-2">
                {quotation.status === 'Approved' ? 'check_circle' : 
                quotation.status === 'Rejected' ? 'cancel' : 
                quotation.status === 'Under Review' ? 'rate_review' : 
                'hourglass_empty'}
              </span>
              <div>
                <div className="font-medium">
                  {quotation.status === 'Approved' ? 'Quotation Approved' : 
                  quotation.status === 'Rejected' ? 'Quotation Rejected' : 
                  quotation.status === 'Under Review' ? 'Under Review by Super Admin' : 
                  'Pending Submission'}
                </div>
                <div className="text-xs mt-1">
                  {quotation.status === 'Approved' ? 'This quotation has been approved and can be processed.' : 
                  quotation.status === 'Rejected' ? 'This quotation has been rejected. See notes for details.' : 
                  quotation.status === 'Under Review' ? 'Awaiting decision from Super Admin.' : 
                  'Quotation is pending submission to Super Admin.'}
                </div>
              </div>
            </div>
            
            {/* Status details */}
            <div className="bg-white rounded-md p-4 border border-gray-200">
              <h5 className="font-medium mb-3 text-sm border-b pb-1">Approval Timeline</h5>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 border border-green-500 flex items-center justify-center mt-1 mr-3">
                    <span className="material-icons text-green-500 text-xs">check</span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">Created by Hotel Admin</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(quotation.createdAt)} {quotation.createdAt ? formatTime(quotation.createdAt) : ''}
                    </p>
                  </div>
                </div>
                
                {quotation.status !== 'Pending' && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 border border-green-500 flex items-center justify-center mt-1 mr-3">
                      <span className="material-icons text-green-500 text-xs">check</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">Sent to Super Admin for Review</p>
                      <p className="text-xs text-gray-500">
                        {quotation.sentToSuperAdminDate ? formatDate(quotation.sentToSuperAdminDate) : 'Date not recorded'} {quotation.sentToSuperAdminBy ? `by ${quotation.sentToSuperAdminBy}` : ''}
                      </p>
                    </div>
                  </div>
                )}
                
                {(quotation.status === 'Approved' || quotation.status === 'Rejected') && (
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full ${
                      quotation.status === 'Approved' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                    } border flex items-center justify-center mt-1 mr-3`}>
                      <span className={`material-icons ${
                        quotation.status === 'Approved' ? 'text-green-500' : 'text-red-500'
                      } text-xs`}>
                        {quotation.status === 'Approved' ? 'check' : 'close'}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">
                        {quotation.status === 'Approved' ? 'Approved by ' : 'Rejected by '}
                        {quotation.reviewedBy || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {quotation.reviewDate ? formatDate(quotation.reviewDate) : 'Date not recorded'}
                      </p>
                      {quotation.adminNotes && (
                        <p className="text-xs bg-gray-50 p-2 mt-1 rounded border border-gray-100">
                          <span className="font-medium">Note:</span> {quotation.adminNotes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Admin Section */}
        {quotation.status === 'Pending' && (
          <section className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm mt-4">
            <h4 className="text-lg font-medium mb-3 flex items-center border-b pb-2">
              <span className="material-icons mr-2 text-yellow-600">comment</span>
              Add Response
            </h4>
            <Textarea
              label="Add Notes"
              name="adminNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or comments for this quotation..."
            />
          </section>
        )}

        {quotation.adminNotes && quotation.status !== 'Pending' && !quotation.reviewDate && (
          <section className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm mt-4">
            <h4 className="text-lg font-medium mb-3 flex items-center border-b pb-2">
              <span className="material-icons mr-2 text-yellow-600">comment</span>
              Admin Notes
            </h4>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap">{quotation.adminNotes}</p>
            </div>
          </section>
        )}
        
        {/* Submission Info */}
        <div className="flex items-center justify-between mt-6 text-sm text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-100">
          <div className="flex items-center">
            <span className="material-icons text-yellow-500 mr-2">event</span>
            Quote #{quotation.quoteNumber} created on: {formatDate(quotation.createdAt)}
          </div>
          <div className="flex items-center">
            <span className="material-icons text-yellow-500 mr-2">schedule</span>
            {formatTime(quotation.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm flex items-center"
          >
            <span className="material-icons text-sm mr-1">close</span> Close
          </button>
          
          {quotation.status === 'Pending' && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm flex items-center border border-gray-300"
              >
                <span className="material-icons text-sm mr-1">edit</span> Edit
              </button>
              <button
                onClick={() => handleSendToSuperAdmin(quotation.id)}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md text-sm flex items-center border border-purple-200"
              >
                <span className="material-icons text-sm mr-1">send</span> Send to Super Admin
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm flex items-center border border-red-200"
              >
                <span className="material-icons text-sm mr-1">cancel</span> Reject
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm flex items-center"
              >
                <span className="material-icons text-sm mr-1">check_circle</span> Approve
              </button>
            </>
          )}
          
          {isEditing && (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm flex items-center"
              >
                <span className="material-icons text-sm mr-1">close</span> Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-md text-sm flex items-center"
              >
                <span className="material-icons text-sm mr-1">save</span> Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Animation styles
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

// Main component
const QuotationsManagement = () => {
  // State
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' or 'quotations'
  const [groupPackages, setGroupPackages] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showGroupPackageModal, setShowGroupPackageModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedGroupPackage, setSelectedGroupPackage] = useState(null);
  const [flashMessage, setFlashMessage] = useState({ visible: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: () => {}, 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
  // Hotel data (normally would come from user context or API)
  const hotelData = {
    hotelName: 'Shangri-La Hotel',
    managerName: 'Sarah Williams',
    email: 'info@shangrilahotel.com',
    phone: '+94 11 234 5678',
    address: '123 Beach Road, Colombo, Sri Lanka',
    website: 'www.shangrilahotel.com'
  };
  
  // Form state for new hotel accommodation quotation
  const blankQuotation = {
    packageName: '',
    contactPersonName: hotelData.managerName, // Pre-fill with hotel manager name
    contactEmail: hotelData.email, // Pre-fill with hotel email
    contactPhone: hotelData.phone, // Pre-fill with hotel phone
    accommodationType: 'Group Accommodation', // Generic type for group bookings
    checkInDate: '',
    checkOutDate: '',
    groupSize: 10,
    pricePerPersonPerNight: 0, // Price per person per night for accommodation
    mealPlan: 'Breakfast Only',
    mealPlanPricePerPerson: 15, // Price per person per night for meal plan
    specialRequirements: '',
    totalAmount: 0,
    discountOffered: 0,
    hotelName: hotelData.hotelName, // Use the hotel name from hotelData
    airportTransfer: false, // Using existing field name for pool facilities
    transportationPrice: 2000, // Default pool facilities price (variable name kept for backward compatibility)
    // Empty array for room distributions (will be determined after approval)
    roomDistributions: [],
  };
  const [newQuotation, setNewQuotation] = useState(blankQuotation);
  
  // Accommodation options
  const accommodationTypes = [
    'Standard Rooms',
    'Deluxe Rooms',
    'Executive Suites',
    'Family Rooms',
    'Dormitory Style',
    'Villa Accommodation',
  ];
  
  // Room type pricing options
  const roomPrices = {
    'Standard Rooms': 2500,
    'Deluxe Rooms': 3200,
    'Executive Suites': 4000,
    'Family Rooms': 4500,
    'Dormitory Style': 3000,
    'Villa Accommodation': 5000,
  };
  
  // Mock data for group trip packages
  const mockGroupTripPackages = [
    {
      id: 1,
      packageCode: 'GT-001',
      packageName: 'Kandy Cultural Tour',
      destinations: ['Kandy', 'Sigiriya', 'Dambulla'],
      duration: 5,
      maxGroupSize: 20,
      travelStartDate: '2025-08-10',
      travelEndDate: '2025-08-15',
      description: 'Experience the cultural heritage of Kandy, visit the Temple of the Sacred Tooth Relic, and explore ancient ruins.',
      activities: ['Temple Visits', 'Cultural Shows', 'City Tours', 'Nature Walks'],
      travelGuideIncluded: true,
      transportIncluded: true,
      createdBy: 'Super Admin',
      createdAt: '2025-07-01T10:15:00Z'
    },
    {
      id: 2,
      packageCode: 'GT-002',
      packageName: 'Southern Beach Paradise',
      destinations: ['Galle', 'Mirissa', 'Unawatuna'],
      duration: 6,
      maxGroupSize: 15,
      travelStartDate: '2025-09-05',
      travelEndDate: '2025-09-11',
      description: 'Enjoy the beautiful beaches of Southern Sri Lanka, visit Galle Fort, and experience whale watching.',
      activities: ['Whale Watching', 'Beach Activities', 'Fort Tour', 'Water Sports'],
      travelGuideIncluded: true,
      transportIncluded: true,
      createdBy: 'Super Admin',
      createdAt: '2025-07-05T14:30:00Z'
    },
    {
      id: 3,
      packageCode: 'GT-003',
      packageName: 'Central Highlands Adventure',
      destinations: ['Nuwara Eliya', 'Ella', 'Horton Plains'],
      duration: 4,
      maxGroupSize: 12,
      travelStartDate: '2025-08-20',
      travelEndDate: '2025-08-24',
      description: 'Explore the scenic highlands, visit tea plantations, and enjoy cool climate and beautiful landscapes.',
      activities: ['Tea Factory Visits', 'Train Journey', 'Hiking', 'Waterfall Visits'],
      travelGuideIncluded: true,
      transportIncluded: true,
      createdBy: 'Super Admin',
      createdAt: '2025-07-10T09:45:00Z'
    },
    {
      id: 4,
      packageCode: 'GT-004',
      packageName: 'Wildlife Safari Experience',
      destinations: ['Yala', 'Udawalawe', 'Bundala'],
      duration: 3,
      maxGroupSize: 10,
      travelStartDate: '2025-10-15',
      travelEndDate: '2025-10-18',
      description: 'Experience wildlife safaris in Sri Lanka\'s most famous national parks, spotting leopards, elephants and more.',
      activities: ['Safari Tours', 'Bird Watching', 'Camping', 'Nature Photography'],
      travelGuideIncluded: true,
      transportIncluded: true,
      createdBy: 'Super Admin',
      createdAt: '2025-07-12T16:20:00Z'
    },
    {
      id: 5,
      packageCode: 'GT-005',
      packageName: 'Ancient Cities Exploration',
      destinations: ['Anuradhapura', 'Polonnaruwa', 'Mihintale'],
      duration: 7,
      maxGroupSize: 18,
      travelStartDate: '2025-09-20',
      travelEndDate: '2025-09-27',
      description: 'Discover Sri Lanka\'s ancient cities and their rich history, architecture, and archaeological wonders.',
      activities: ['Historical Site Visits', 'Museum Tours', 'Cultural Experiences', 'Bicycle Tours'],
      travelGuideIncluded: true,
      transportIncluded: true,
      createdBy: 'Super Admin',
      createdAt: '2025-07-15T11:30:00Z'
    }
  ];

  // Create mock data for quotations
  const mockQuotations = [
    {
      id: 1,
      quoteNumber: 'HQ-210722',
      packageName: 'Kandy Cultural Tour',
      hotelName: 'Hilton Kandy Resort',
      contactPersonName: 'John Smith',
      contactEmail: 'john.smith@example.com',
      contactPhone: '+1-555-123-4567',
      accommodationType: 'Deluxe Rooms',
      checkInDate: '2025-08-10',
      checkOutDate: '2025-08-15',
      groupSize: 12,
      roomsRequired: 6,
      mealPlan: 'Half Board',
      airportTransfer: true,
      specialRequirements: 'We need rooms close to each other and at least one accessible room.',
      totalAmount: 1850.00,
      finalAmount: 1665.00,
      discountOffered: 10,
      status: 'Pending',
      createdAt: '2025-07-15T08:30:00Z',
    },
    {
      id: 2,
      quoteNumber: 'HQ-210723',
      packageName: 'Galle Fort Experience',
      hotelName: 'Jetwing Lighthouse',
      contactPersonName: 'Emma Johnson',
      contactEmail: 'emma@traveler.com',
      contactPhone: '+44-20-7123-4567',
      accommodationType: 'Standard Rooms',
      checkInDate: '2025-09-05',
      checkOutDate: '2025-09-08',
      groupSize: 8,
      roomsRequired: 4,
      mealPlan: 'Breakfast Only',
      airportTransfer: false,
      specialRequirements: 'Ocean view rooms preferred.',
      totalAmount: 960.00,
      finalAmount: 960.00,
      discountOffered: 0,
      status: 'Under Review',
      createdAt: '2025-07-18T10:15:00Z',
      sentToSuperAdminDate: '2025-07-18T14:20:00Z',
      sentToSuperAdminBy: 'Hotel Manager',
    },
    {
      id: 3,
      quoteNumber: 'HQ-210724',
      packageName: 'Colombo Business Conference',
      hotelName: 'Cinnamon Grand',
      contactPersonName: 'Robert Chen',
      contactEmail: 'r.chen@bizgroup.com',
      contactPhone: '+65-9876-5432',
      accommodationType: 'Executive Suites',
      checkInDate: '2025-08-22',
      checkOutDate: '2025-08-26',
      groupSize: 15,
      roomsRequired: 15,
      mealPlan: 'Full Board',
      airportTransfer: true,
      specialRequirements: 'Need meeting room facilities and airport transfers for all guests.',
      totalAmount: 4500.00,
      finalAmount: 4050.00,
      discountOffered: 10,
      status: 'Approved',
      createdAt: '2025-07-10T09:45:00Z',
      sentToSuperAdminDate: '2025-07-10T16:30:00Z',
      sentToSuperAdminBy: 'Sales Manager',
      reviewedBy: 'Regional Director',
      reviewDate: '2025-07-12T11:20:00Z',
      adminNotes: 'Approved with special corporate rate applied.'
    },
    {
      id: 4,
      quoteNumber: 'HQ-210725',
      packageName: 'Sigiriya Adventure Group',
      hotelName: 'Aliya Resort & Spa',
      contactPersonName: 'Sarah Williams',
      contactEmail: 'sarah@adventuretours.com',
      contactPhone: '+1-415-555-6789',
      accommodationType: 'Deluxe Rooms',
      checkInDate: '2025-10-15',
      checkOutDate: '2025-10-19',
      groupSize: 20,
      roomsRequired: 10,
      mealPlan: 'All Inclusive',
      airportTransfer: true,
      specialRequirements: 'Need early check-in if possible and safari tour arrangements.',
      totalAmount: 5200.00,
      finalAmount: 4680.00,
      discountOffered: 10,
      status: 'Rejected',
      createdAt: '2025-07-05T14:25:00Z',
      sentToSuperAdminDate: '2025-07-05T16:10:00Z',
      sentToSuperAdminBy: 'Front Office Manager',
      reviewedBy: 'Revenue Manager',
      reviewDate: '2025-07-07T09:30:00Z',
      adminNotes: 'Rejected due to unavailability during peak season. Please suggest alternative dates.'
    },
    {
      id: 5,
      quoteNumber: 'HQ-210726',
      packageName: 'Ella Hiking Enthusiasts',
      hotelName: 'Ella Mountain Resort',
      contactPersonName: 'Michael Davis',
      contactEmail: 'mdavis@hikers.org',
      contactPhone: '+49-30-1234-5678',
      accommodationType: 'Standard Rooms',
      checkInDate: '2025-09-28',
      checkOutDate: '2025-10-03',
      groupSize: 16,
      roomsRequired: 8,
      mealPlan: 'Half Board',
      airportTransfer: true,
      specialRequirements: 'Need packed lunches for hiking days and early breakfast.',
      totalAmount: 2400.00,
      finalAmount: 2280.00,
      discountOffered: 5,
      status: 'Pending',
      createdAt: '2025-07-20T08:50:00Z',
    }
  ];

  // Effect to load group packages and quotations
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Fetch real data from backend
    const fetchData = async () => {
      try {
        // Fetch pending trips and convert them to group packages format
        const pendingTrips = await pendingTripService.getAllPendingTrips();
        if (pendingTrips && pendingTrips.length > 0) {
          // Map backend data to the frontend group packages format
          const mappedGroupPackages = pendingTrips.map(trip => 
            pendingTripService.mapPendingTripToGroupPackage(trip)
          );
          setGroupPackages(mappedGroupPackages);
        } else {
          console.log('No pending trips found, using mock data as fallback');
          setGroupPackages(mockGroupTripPackages);
        }
        
        // Fetch actual quotations from API
        const fetchedQuotations = await quotationService.getAllQuotations();
        setQuotations(fetchedQuotations);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
        // Fallback to mock data if API fails
        setGroupPackages(mockGroupTripPackages);
        setQuotations(mockQuotations);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Add event listener for sendToSuperAdmin
    const handleSendToSuperAdminEvent = (e) => {
      handleSendToSuperAdmin(e.detail);
    };
    
    document.addEventListener('sendToSuperAdmin', handleSendToSuperAdminEvent);
    
    return () => {
      document.removeEventListener('sendToSuperAdmin', handleSendToSuperAdminEvent);
    };
  }, []);
  
  // Filter quotations based on status
  const filteredQuotations = filterStatus === 'All' 
    ? quotations 
    : quotations.filter(q => q.status === filterStatus);
  
  // Get current quotations for pagination
  const indexOfLastQuotation = currentPage * itemsPerPage;
  const indexOfFirstQuotation = indexOfLastQuotation - itemsPerPage;
  const currentQuotations = filteredQuotations.slice(indexOfFirstQuotation, indexOfLastQuotation);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Add room distribution
  const addRoomDistribution = () => {
    setNewQuotation(prev => ({
      ...prev,
      roomDistributions: [
        ...prev.roomDistributions,
        { accommodationType: '', quantity: 0, occupants: 0 }
      ]
    }));
  };
  
  // Remove room distribution
  const removeRoomDistribution = (index) => {
    setNewQuotation(prev => ({
      ...prev,
      roomDistributions: prev.roomDistributions.filter((_, i) => i !== index)
    }));
  };
  
  // Handle changes to room distribution
  const handleRoomDistributionChange = (index, field, value) => {
    
    setNewQuotation(prev => {
      // Create a deep copy of all distributions to avoid reference issues
      const newDistributions = prev.roomDistributions.map(dist => ({...dist}));
      
      // Set the field value
      newDistributions[index][field] = value;
      
      // If changing room type, set default values for quantity and occupants
      if (field === 'accommodationType' && value) {
        // Always ensure quantity has a valid default (minimum 1)
        newDistributions[index].quantity = newDistributions[index].quantity < 1 ? 1 : newDistributions[index].quantity;
        
        // Set occupants based on room type
        if (value.includes('Suite') || value.includes('Family')) {
          newDistributions[index].occupants = 4;
        } else if (value.includes('Deluxe')) {
          newDistributions[index].occupants = 3;
        } else {
          newDistributions[index].occupants = 2;
        }
        
        // Ensure the ID is present for React key stability
        if (!newDistributions[index].id) {
          newDistributions[index].id = Date.now() + index;
        }
      }
      
      // Calculate total rooms and update roomsRequired
      const totalRooms = newDistributions.reduce((sum, dist) => sum + (parseInt(dist.quantity) || 0), 0);
      const totalOccupants = newDistributions.reduce((sum, dist) => sum + (parseInt(dist.occupants) || 0), 0);
      
      return {
        ...prev,
        roomDistributions: newDistributions,
        roomsRequired: totalRooms,
        groupSize: Math.max(prev.groupSize, totalOccupants) // Update group size if needed
      };
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuotation(prev => ({ ...prev, [name]: value }));
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
  
  // Calculate accommodation total (without meal plan and pool facilities)
  const calculateAccommodationTotal = (quotation) => {
    if (!quotation.checkInDate || !quotation.checkOutDate || !quotation.groupSize) return 0;
    
    const nights = calculateNights(quotation.checkInDate, quotation.checkOutDate);
    
    // Calculate accommodation cost based on price per person per night
    let accommodationCost = 0;
    
    if (quotation.pricePerPersonPerNight) {
      // Use price per person per night
      accommodationCost = quotation.pricePerPersonPerNight * quotation.groupSize * nights;
    } else {
      // Default to zero if price per person is not set
      accommodationCost = 0;
    }
    
    return accommodationCost;
  };
  
  // Calculate meal plan cost
  const calculateMealPlanUpgradeTotal = (quotation = newQuotation) => {
    if (!quotation.checkInDate || !quotation.checkOutDate || !quotation.groupSize) return 0;
    
    const nights = calculateNights(quotation.checkInDate, quotation.checkOutDate);
    
    // Calculate meal plan costs for any selected plan
    if (quotation.mealPlan) {
      // If mealPlanPricePerPerson is set, use it directly
      if (quotation.mealPlanPricePerPerson) {
        return quotation.groupSize * quotation.mealPlanPricePerPerson * nights;
      } 
      // Fall back to default pricing if not set
      return quotation.groupSize * 
        (quotation.mealPlan === 'Breakfast Only' ? 15 :
         quotation.mealPlan === 'Half Board' ? 25 : 
         quotation.mealPlan === 'Full Board' ? 40 : 
         quotation.mealPlan === 'All Inclusive' ? 60 : 0) * nights;
    }
    return 0;
  };
  
  // Calculate pool facilities cost (function name kept for backward compatibility)
  const calculateTransportationTotal = (quotation = newQuotation) => {
    // Add pool access cost if selected
    if (quotation.airportTransfer) {
      return quotation.transportationPrice || 2000;
    }
    return 0;
  };
  
  // Calculate total before discount
  const calculateSubtotalBeforeDiscount = (quotation = newQuotation) => {
    return calculateAccommodationTotal(quotation) + 
           calculateMealPlanUpgradeTotal(quotation) + 
           calculateTransportationTotal(quotation);
  };
  
  // Calculate final total amount with discount applied
  const calculateFinalTotal = (quotation) => {
    const subtotal = calculateSubtotalBeforeDiscount(quotation);
    const discount = quotation.discountOffered > 0 ? (subtotal * quotation.discountOffered / 100) : 0;
    return (subtotal - discount).toFixed(2);
  };
  
  // Calculate price per person
  const calculatePerPersonPrice = (quotation = newQuotation) => {
    if (!quotation.groupSize || quotation.groupSize <= 0) return 0;
    return parseFloat(calculateFinalTotal(quotation)) / quotation.groupSize;
  };
  
  // Format date for display with improved handling of different date formats
  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      // Handle Date objects, ISO strings, and LocalDate objects from Java backend
      let dateObj;
      
      if (iso instanceof Date) {
        // Already a Date object
        dateObj = iso;
      } else if (typeof iso === 'string') {
        // ISO string format
        dateObj = new Date(iso);
      } else if (iso && iso.year && iso.month && iso.day) {
        // Java LocalDate format with year, month, day properties
        // Note: JavaScript months are 0-indexed, so we subtract 1 from the month
        dateObj = new Date(iso.year, iso.month - 1, iso.day);
      } else {
        // Try to convert whatever format we have
        dateObj = new Date(iso);
      }
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date:', iso);
        return 'Invalid date';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (err) {
      console.error('Date formatting error:', err, iso);
      return String(iso);
    }
  };
  
  // Show flash message
  const showFlashMessage = (message, type = 'success') => {
    setFlashMessage({ visible: true, message, type });
  };
  
  // Handle view group package details
  const handleViewGroupPackage = (tripPackage) => {
    setSelectedGroupPackage(tripPackage);
    setShowGroupPackageModal(true);
  };
  
  // Handle creating quotation from group package
  const handleCreateQuotation = (tripPackage) => {
    // Ensure dates are in the correct format for the form
    let checkInDate = tripPackage.travelStartDate;
    let checkOutDate = tripPackage.travelEndDate;
    
    // If the dates are LocalDate objects from Java, convert them to ISO strings
    if (tripPackage.travelStartDate && typeof tripPackage.travelStartDate === 'object' && 
        tripPackage.travelStartDate.year && tripPackage.travelStartDate.month && tripPackage.travelStartDate.day) {
      // Convert Java LocalDate to ISO string
      const year = tripPackage.travelStartDate.year;
      const month = String(tripPackage.travelStartDate.month).padStart(2, '0'); // Ensure 2 digits
      const day = String(tripPackage.travelStartDate.day).padStart(2, '0'); // Ensure 2 digits
      checkInDate = `${year}-${month}-${day}`;
    }
    
    if (tripPackage.travelEndDate && typeof tripPackage.travelEndDate === 'object' && 
        tripPackage.travelEndDate.year && tripPackage.travelEndDate.month && tripPackage.travelEndDate.day) {
      // Convert Java LocalDate to ISO string
      const year = tripPackage.travelEndDate.year;
      const month = String(tripPackage.travelEndDate.month).padStart(2, '0'); // Ensure 2 digits
      const day = String(tripPackage.travelEndDate.day).padStart(2, '0'); // Ensure 2 digits
      checkOutDate = `${year}-${month}-${day}`;
    }
    
    // Pre-fill the quotation form with group package details and hotel contact info
    setNewQuotation({
      ...blankQuotation,
      packageName: tripPackage.packageName,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      groupSize: tripPackage.maxGroupSize,
      pricePerPersonPerNight: 5000, // Default starting price per person per night in LKR
      mealPlan: 'Breakfast Only',
      mealPlanPricePerPerson: 1500, // Default meal plan price in LKR
      // Add reference to the original trip
      originalTripId: tripPackage.id,
      // Contact details are already pre-filled from blankQuotation which uses hotelData
    });
    
    // Close the group package modal and show the quotation form
    setShowGroupPackageModal(false);
    setShowQuotationModal(true);
  };
  
  // Handle form submission for new accommodation quotation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Calculate total amount
      const accommodationTotal = calculateAccommodationTotal(newQuotation);
      const finalTotal = parseFloat(calculateFinalTotal(newQuotation));
      
      const quotationToAdd = {
        ...newQuotation,
        accommodationType: "Group Accommodation", // Generic accommodation type
        roomDistributions: [], // Empty array as room distribution will be decided later
        totalAmount: accommodationTotal,
        finalAmount: finalTotal,
        quoteNumber: `HQ-${Date.now().toString().substr(-6)}`, // Generate a unique quote number
      };
      
      // Call the API to create quotation
      console.log('Sending quotation data:', quotationToAdd);
      const createdQuotation = await quotationService.createQuotation(quotationToAdd);
      console.log('Created quotation response:', createdQuotation);
      
      // Get fresh data from the server to ensure we have the latest list
      const updatedQuotations = await quotationService.getAllQuotations();
      setQuotations(updatedQuotations);
      
      // Reset form and close modal
      setShowQuotationModal(false);
      setNewQuotation(blankQuotation);
      
      // Show success message
      showFlashMessage('Accommodation quotation sent successfully!', 'success');
    } catch (error) {
      console.error('Error creating quotation:', error);
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create quotation';
      showFlashMessage(`Failed to create quotation: ${errorMessage}. Please try again.`, 'error');
    }
  };
  
  // Handle view quotation details
  const handleViewDetails = (quotation) => {
    setSelectedQuotation(quotation);
    setShowDetailModal(true);
  };
  
  // Handle approve quotation
  const handleApprove = async (id, notes) => {
    try {
      // Add current user and timestamp information
      const currentDate = new Date().toISOString();
      const currentUser = "Hotel Admin"; // Replace with actual user info when available
      
      const result = await quotationService.updateQuotationStatus(id, 'Approved', notes);
      
      // Update quotation in state with approval details
      setQuotations(prev => 
        prev.map(q => q.id === id 
          ? { 
              ...q, 
              status: 'Approved', 
              adminNotes: notes,
              approvedBy: currentUser,
              approvedDate: currentDate,
              reviewedBy: currentUser,
              reviewDate: currentDate
            } 
          : q
        )
      );
      
      // Close modal and show success message
      setShowDetailModal(false);
      showFlashMessage('Quotation approved successfully!', 'success');
    } catch (error) {
      console.error('Error approving quotation:', error);
      showFlashMessage('Failed to approve quotation. Please try again.', 'error');
    }
  };
  
  // Handle reject quotation
  const handleReject = async (id, notes) => {
    try {
      // Add current user and timestamp information
      const currentDate = new Date().toISOString();
      const currentUser = "Hotel Admin"; // Replace with actual user info when available
      
      const result = await quotationService.updateQuotationStatus(id, 'Rejected', notes);
      
      // Update quotation in state with rejection details
      setQuotations(prev => 
        prev.map(q => q.id === id 
          ? { 
              ...q, 
              status: 'Rejected', 
              adminNotes: notes,
              rejectedBy: currentUser,
              rejectedDate: currentDate,
              reviewedBy: currentUser,
              reviewDate: currentDate
            } 
          : q
        )
      );
      
      // Close modal and show success message
      setShowDetailModal(false);
      showFlashMessage('Quotation rejected.', 'info');
    } catch (error) {
      console.error('Error rejecting quotation:', error);
      showFlashMessage('Failed to reject quotation. Please try again.', 'error');
    }
  };
  
  // Handle update quotation
  const handleUpdateQuotation = async (updatedQuotation) => {
    try {
      const result = await quotationService.updateQuotation(updatedQuotation.id, updatedQuotation);
      
      // Update quotation in state
      setQuotations(prev => 
        prev.map(q => q.id === updatedQuotation.id 
          ? { ...updatedQuotation, updatedAt: result.updatedAt }
          : q
        )
      );
      
      // Close modal and show success message
      setShowDetailModal(false);
      showFlashMessage('Quotation updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating quotation:', error);
      showFlashMessage('Failed to update quotation. Please try again.', 'error');
    }
  };
  
  // Handle send to super admin
  const handleSendToSuperAdmin = async (id) => {
    try {
      // Add current user and timestamp information
      const currentDate = new Date().toISOString();
      const currentUser = "Hotel Admin"; // Replace with actual user info when available
      
      // Call API to update status
      const result = await quotationService.updateQuotationStatus(id, 'Under Review', "Sent to Super Admin for review");
      
      // Update quotation in state
      setQuotations(prev => 
        prev.map(q => q.id === id 
          ? { 
              ...q, 
              status: 'Under Review', 
              sentToSuperAdminBy: currentUser,
              sentToSuperAdminDate: currentDate,
              reviewedBy: 'Super Admin',
            } 
          : q
        )
      );
      
      // Close modal and show success message
      setShowDetailModal(false);
      showFlashMessage('Quotation sent to Super Admin for review!', 'success');
    } catch (error) {
      console.error('Error sending quotation to Super Admin:', error);
      showFlashMessage('Failed to send to Super Admin. Please try again.', 'error');
    }
  };
  
  // Show delete confirmation
  const handleDeleteClick = (id) => {
    // Find the quotation to show in confirmation message
    const quotation = quotations.find(q => q.id === id);
    if (!quotation) return;
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Quotation',
      message: `Are you sure you want to delete quotation ${quotation.quoteNumber}? This action cannot be undone.`,
      onConfirm: () => confirmDelete(id),
      onCancel: () => setConfirmDialog(prev => ({ ...prev, isOpen: false })),
    });
  };
  
  // Confirm delete
  const confirmDelete = async (id) => {
    try {
      await quotationService.deleteQuotation(id);
      
      // Remove from state
      setQuotations(prev => prev.filter(q => q.id !== id));
      
      // Close dialog and show success message
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      showFlashMessage('Quotation deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting quotation:', error);
      showFlashMessage('Failed to delete quotation. Please try again.', 'error');
    }
  };
  
  // Status badge component
  // Group Trip Package Details View component
const GroupTripDetailView = ({ tripPackage, onClose, onCreateQuotation }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      {/* Modal header */}
      <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-200 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold flex items-center">
            <span className="material-icons mr-2">explore</span>
            {tripPackage.packageName}
            <span className="ml-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {tripPackage.packageCode}
            </span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">Group trip package details</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Package overview */}
        <section className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <h4 className="text-lg font-medium mb-3 flex items-center border-b pb-2">
            <span className="material-icons mr-2 text-yellow-600">info</span>
            Package Overview
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* <p className="text-gray-700 mb-4">{tripPackage.description}</p> */}
              
              <div className="mb-4">
                <h5 className="font-medium text-gray-800 mb-2">Start Location:</h5>
                <div className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded">
                  <div className="flex items-center">
                    <span className="material-icons mr-2">flight_takeoff</span>
                    <span className="font-medium">{tripPackage.startLocation || 'Not specified'}</span>
                  </div>
                  {tripPackage.startLocationDescription && (
                    <p className="mt-2 text-sm text-gray-700 pl-7">{tripPackage.startLocationDescription}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="font-medium text-gray-800 mb-2">End Location:</h5>
                <div className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded">
                  <div className="flex items-center">
                    <span className="material-icons mr-2">flight_land</span>
                    <span className="font-medium">{tripPackage.endLocation || 'Not specified'}</span>
                  </div>
                  {tripPackage.endLocationDescription && (
                    <p className="mt-2 text-sm text-gray-700 pl-7">{tripPackage.endLocationDescription}</p>
                  )}
                </div>
              </div>
              
              {/* <div className="mb-4">
                <h5 className="font-medium text-gray-800 mb-2">Pickup Location:</h5>
                <div className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded">
                  <div className="flex items-center">
                    <span className="material-icons mr-2">location_on</span>
                    <span className="font-medium">{tripPackage.pickupLocation || 'Same as start location'}</span>
                    {tripPackage.pickupTime && (
                      <span className="ml-2 bg-yellow-100 px-2 py-1 rounded text-xs flex items-center">
                        <span className="material-icons text-xs mr-1">access_time</span>
                        {tripPackage.pickupTime}
                      </span>
                    )}
                  </div>
                  {tripPackage.pickupLocationDescription && (
                    <p className="mt-2 text-sm text-gray-700 pl-7">{tripPackage.pickupLocationDescription}</p>
                  )}
                </div>
              </div> */}
              
              {/* <div className="mb-4">
                <h5 className="font-medium text-gray-800 mb-2">Route Summary:</h5>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="flex items-center">
                    <span className="material-icons text-yellow-600 mr-2">timeline</span>
                    <span className="font-medium">
                      {tripPackage.startLocation || 'Origin'} → {tripPackage.endLocation || 'Destination'}
                    </span>
                    {tripPackage.path && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({tripPackage.path.split(',').length} stops)
                      </span>
                    )}
                  </div>
                  {tripPackage.routePathDescription && (
                    <p className="mt-2 text-sm text-gray-700 pl-7 border-t border-gray-100 pt-2">
                      {tripPackage.routePathDescription}
                    </p>
                  )}
                </div>
              </div> */}
            </div>
            
            <div className="border-l pl-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 font-medium flex items-center">
                  <span className="material-icons text-yellow-600 mr-2">date_range</span>
                  {tripPackage.duration} days
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Travel Dates</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="flex items-center">
                    <span className="material-icons text-green-600 text-sm">flight_takeoff</span>
                    <span className="ml-2">{formatDate(tripPackage.travelStartDate)}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="material-icons text-red-600 text-sm">flight_land</span>
                    <span className="ml-2">{formatDate(tripPackage.travelEndDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Group Size</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 flex items-center">
                  <span className="material-icons text-yellow-600 mr-2">groups</span>
                  {tripPackage.maxGroupSize} people
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Package image if available */}
        {tripPackage.image && (
          <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="material-icons text-5xl">image</span>
              <span className="ml-2">Image: {tripPackage.image}</span>
            </div>
          </div>
        )}
        
        {/* Additional info */}
        <div className="flex items-center justify-between mt-6 text-sm text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-100">
          <div className="flex items-center">
            <span className="material-icons text-yellow-500 mr-2">event</span>
            Created on: {formatDate(tripPackage.createdAt)}
          </div>
          <div className="flex items-center">
            <span className="material-icons text-yellow-500 mr-2">person</span>
            By: Super Admin
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm flex items-center"
          >
            <span className="material-icons text-sm mr-1">close</span> Close
          </button>
          <button
            onClick={() => onCreateQuotation(tripPackage)}
            className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-md text-sm flex items-center"
          >
            <span className="material-icons text-sm mr-1">hotel</span> Create Accommodation Quote
          </button>
        </div>
      </div>
    </div>
  );
};

// QuotationDetailView component for viewing quotation details
const QuotationDetailView = ({ quotation, onClose, onDelete }) => {
  
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
  
  // We're no longer using form editing functionality in this simplified view
  
  // We're no longer using edit mode in this simplified view
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
      {/* Modal header */}
      <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold flex items-center">
            <span className="material-icons mr-2">hotel</span>
            Accommodation Quotation {quotation.quoteNumber}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {quotation.createdAt ? 
              `Created on ${new Date(quotation.createdAt).toLocaleDateString()}` : 
              'Recently Created'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
      
      <div className="p-6">
        {/* Status banner */}
        <div className={`p-4 rounded-lg border mb-6 ${getStatusBadgeClass(quotation.status)}`}>
          <div className="flex items-center">
            <span className="material-icons mr-2">
              {quotation.status === 'Approved' ? 'check_circle' :
               quotation.status === 'Rejected' ? 'cancel' :
               quotation.status === 'Under Review' ? 'rate_review' : 'hourglass_empty'}
            </span>
            <div>
              <h4 className="font-medium">Status: {quotation.status}</h4>
              {quotation.reviewDate && (
                <p className="text-sm">Last updated: {new Date(quotation.reviewDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Package Info */}
        <section className="mb-6">
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <span className="material-icons mr-2 text-yellow-600">explore</span>
            Package Information
          </h4>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h5 className="font-medium text-lg">{quotation.packageName || 'N/A'}</h5>
            <p className="text-gray-600">Accommodation Type: {quotation.accommodationType || 'Standard'}</p>
          </div>
        </section>
        
        {/* Customer & Hotel Contact */}
        <section className="mb-6">
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <span className="material-icons mr-2 text-yellow-600">people</span>
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-2">Client Details</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Contact Person:</strong> {quotation.contactPersonName}</p>
                <p><strong>Email:</strong> {quotation.contactEmail}</p>
                <p><strong>Phone:</strong> {quotation.contactPhone}</p>
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Hotel Details</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Contact Person:</strong> {quotation.contactPersonName || 'N/A'}</p>
                <p><strong>Accommodation Type:</strong> {quotation.accommodationType}</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Accommodation Details */}
        <section className="mb-6">
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <span className="material-icons mr-2 text-yellow-600">hotel</span>
            Accommodation Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Check-in Date</p>
              <p className="font-medium">{formatDate(quotation.checkInDate)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Check-out Date</p>
              <p className="font-medium">{formatDate(quotation.checkOutDate)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{calculateNights(quotation.checkInDate, quotation.checkOutDate)} nights</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Group Size</p>
              <p className="font-medium">{quotation.groupSize} people</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Number of Rooms</p>
              <p className="font-medium">{quotation.roomsRequired} rooms</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Meal Plan</p>
              <p className="font-medium">{quotation.mealPlan}</p>
            </div>
          </div>
          
          {quotation.specialRequirements && (
            <div className="mt-4">
              <h5 className="font-medium mb-2">Special Requirements</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{quotation.specialRequirements}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <h5 className="font-medium mb-2">Additional Services</h5>
            <div className="bg-gray-50 p-4 rounded-lg">
              {quotation.airportTransfer ? (
                <div className="flex items-center text-green-600">
                  <span className="material-icons mr-2">check_circle</span>
                  Pool Facilities Included
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  <span className="material-icons mr-2">cancel</span>
                  No Pool Facilities
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Price Details */}
        <section className="mb-6">
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <span className="material-icons mr-2 text-green-600">payments</span>
            Price Details
          </h4>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="text-gray-600">Price Per Person:</div>
              <div className="text-right font-medium">
                LKR {quotation.pricePerPersonPerNight || 0} per person/night
              </div>
              
              <div className="text-gray-600">Group Size:</div>
              <div className="text-right font-medium">{quotation.groupSize} people</div>
              
              <div className="text-gray-600">Stay Duration:</div>
              <div className="text-right font-medium">{calculateNights(quotation.checkInDate, quotation.checkOutDate)} nights</div>
              
              <div className="text-gray-600">Accommodation Subtotal:</div>
              <div className="text-right font-medium">LKR {quotation.totalAmount.toFixed(2)}</div>
              
              {quotation.mealPlanPricePerPerson > 0 && (
                <>
                  <div className="text-gray-600">Meal Plan ({quotation.mealPlan}):</div>
                  <div className="text-right font-medium">
                    LKR {(quotation.mealPlanPricePerPerson * quotation.groupSize * calculateNights(quotation.checkInDate, quotation.checkOutDate)).toFixed(2)}
                  </div>
                </>
              )}
              
              {quotation.airportTransfer && quotation.transportationPrice > 0 && (
                <>
                  <div className="text-gray-600">Pool Facilities:</div>
                  <div className="text-right font-medium">
                    LKR {quotation.transportationPrice.toFixed(2)}
                  </div>
                </>
              )}
              
              {quotation.discountOffered > 0 && (
                <>
                  <div className="text-green-600">Discount ({quotation.discountOffered}%):</div>
                  <div className="text-right text-green-600 font-medium">
                    -LKR {(quotation.totalAmount * quotation.discountOffered / 100).toFixed(2)}
                  </div>
                </>
              )}
            </div>
            
            <div className="border-t border-green-200 pt-2 mt-2">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Final Amount:</span>
                <span>LKR {quotation.finalAmount?.toFixed(2) || (quotation.totalAmount - (quotation.totalAmount * quotation.discountOffered / 100)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Admin Notes */}
        {quotation.adminNotes && (
          <section className="mb-6">
            <h4 className="text-lg font-medium mb-3 flex items-center">
              <span className="material-icons mr-2 text-yellow-600">note</span>
              Admin Notes
            </h4>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p className="italic">{quotation.adminNotes}</p>
            </div>
          </section>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
          {quotation.status === 'Pending' && (
            <button
              onClick={() => onDelete(quotation.id)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm flex items-center"
            >
              <span className="material-icons text-sm mr-1">delete</span> Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-md text-sm flex items-center"
          >
            <span className="material-icons text-sm mr-1">close</span> Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
    const getBadgeClasses = () => {
      switch (status) {
        case 'Approved':
          return 'bg-green-100 text-green-800';
        case 'Rejected':
          return 'bg-red-100 text-red-800';
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'Pending Review':
          return 'bg-yellow-100 text-yellow-800';
        case 'Under Review':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    
    const getStatusIcon = () => {
      switch (status) {
        case 'Approved':
          return 'check_circle';
        case 'Rejected':
          return 'cancel';
        case 'Pending':
          return 'hourglass_empty';
        case 'Pending Review':
          return 'schedule';
        case 'Under Review':
          return 'rate_review';
        default:
          return 'help_outline';
      }
    };
    
    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getBadgeClasses()}`}>
        <span className="material-icons text-xs mr-1">{getStatusIcon()}</span>
        {status}
      </span>
    );
  };
  
  return (
    <div className="p-6">
      {/* Inject animation styles */}
      <style>{styles}</style>
      
      {/* Flash Message */}
      {flashMessage.visible && (
        <FlashMessage 
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => setFlashMessage({ ...flashMessage, visible: false })}
        />
      )}
      
      {/* Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />
    
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Group Trip Packages & Accommodation Quotations</h2>
        <div className="flex">
          <button
            className="bg-yellow-300 hover:bg-yellow-400 text-black px-4 py-2 rounded-md flex items-center"
            onClick={() => setShowQuotationModal(true)}
            disabled={isLoading}
          >
            <span className="material-icons mr-2">add</span> Create New Quotation
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button 
              onClick={() => setActiveTab('packages')} 
              className={`mr-8 py-4 px-1 font-medium text-sm inline-flex items-center border-b-2 ${
                activeTab === 'packages'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={isLoading}
            >
              <span className="material-icons mr-2">explore</span>
              Group Trip Packages
            </button>
            <button 
              onClick={() => setActiveTab('quotations')} 
              className={`mr-8 py-4 px-1 font-medium text-sm inline-flex items-center border-b-2 ${
                activeTab === 'quotations'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={isLoading}
            >
              <span className="material-icons mr-2">hotel</span>
              Accommodation Quotations
            </button>
          </nav>
        </div>
      </div>
      
      {/* Group Trip Packages Section - Only visible when packages tab is active */}
      {activeTab === 'packages' && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <span className="material-icons mr-2 text-yellow-500">explore</span>
              Available Group Trip Packages
            </h3>
            <div className="flex items-center">
              {isLoading && (
                <div className="mr-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              )}
              <p className="text-gray-500">Select a package to create an accommodation quotation</p>
            </div>
          </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        )}
        
        {/* List view of packages */}
        {!isLoading && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Package Code
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Package Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Destinations
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Travel Dates
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Group Size
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {groupPackages.map((tripPackage) => (
                  <tr 
                    key={tripPackage.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewGroupPackage(tripPackage)}
                  >
                    <td className="py-3 px-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium">
                        {tripPackage.packageCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{tripPackage.packageName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="material-icons text-yellow-500 text-xs mr-1">place</span>
                        {tripPackage.destinations.slice(0, 2).join(', ')}
                        {tripPackage.destinations.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm">
                        <span className="material-icons text-yellow-600 text-xs mr-1">date_range</span>
                        {tripPackage.duration} days
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{formatDate(new Date(tripPackage.travelStartDate))}</div>
                        <div className="text-xs text-gray-500">to {formatDate(new Date(tripPackage.travelEndDate))}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm">
                        <span className="material-icons text-yellow-600 text-xs mr-1">groups</span>
                        Max {tripPackage.maxGroupSize}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewGroupPackage(tripPackage);
                          }}
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md text-xs flex items-center"
                        >
                          <span className="material-icons text-xs mr-1">visibility</span>
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateQuotation(tripPackage);
                          }}
                          className="bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-1 rounded-md text-xs flex items-center"
                        >
                          <span className="material-icons text-xs mr-1">hotel</span>
                          Create Quote
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!isLoading && groupPackages.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Package Code
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Package Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Destinations
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Travel Dates
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Group Size
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-icons text-3xl text-yellow-300 mb-2">info</span>
                      <p>No group trip packages available.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Common error message - visible on both tabs */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong className="font-bold mr-1">Error:</strong>
          <span>{error}</span>
        </div>
      )}

      {/* Accommodation Quotations Section - Only visible when quotations tab is active */}
      {activeTab === 'quotations' && (
        <>
        {/* Filter tabs */}
        <div className="flex mb-6 overflow-x-auto whitespace-nowrap pb-2">
          {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            className={`mr-4 px-4 py-2 rounded-md ${
              filterStatus === status
                ? 'bg-yellow-300 text-black'
                : 'bg-gray-200 hover:bg-gray-300'
            } flex items-center`}
            onClick={() => {
              setFilterStatus(status);
              setCurrentPage(1); // Reset pagination when filter changes
            }}
            disabled={isLoading}
          >
            {status === 'Under Review' && <span className="material-icons text-xs mr-1">rate_review</span>}
            {status === 'Approved' && <span className="material-icons text-xs mr-1">check_circle</span>}
            {status === 'Rejected' && <span className="material-icons text-xs mr-1">cancel</span>}
            {status === 'Pending' && <span className="material-icons text-xs mr-1">hourglass_empty</span>}
            {status} 
            {status !== 'All' && (
              <span className="ml-2 bg-white bg-opacity-80 px-2 py-0.5 rounded-full text-xs">
                {quotations.filter(q => q.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Quotations table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Quote #
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Package Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Accommodation Type
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Check-In Date
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Group Size
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Quote Amount
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentQuotations.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  {isLoading ? 'Loading quotations...' : 'No quotations found.'}
                </td>
              </tr>
            ) : (
              currentQuotations.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{q.quoteNumber}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{q.packageName || 'Group Package'}</p>
                      <p className="text-xs text-gray-500">{q.contactPersonName} ({q.contactEmail})</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{q.accommodationType || 'Hotel'}</td>
                  <td className="py-3 px-4">{formatDate(q.departureDate || q.checkInDate)}</td>
                  <td className="py-3 px-4">{q.groupSize} people</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <p className="text-sm">{q.status}</p>
                      {q.reviewDate && (
                        <span className="text-xs text-gray-500">
                          {formatDate(q.reviewDate)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">LKR {q.totalAmount?.toFixed(2)}</p>
                      {q.discountOffered > 0 && (
                        <p className="text-xs text-green-600">
                          {q.discountOffered}% discount
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-1 rounded-md text-xs font-medium flex items-center"
                        onClick={() => handleViewDetails(q)}
                      >
                        <span className="material-icons text-xs mr-1">visibility</span> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredQuotations.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.ceil(filteredQuotations.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-yellow-300 text-black'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredQuotations.length / itemsPerPage)}
              className={`px-3 py-1 rounded-md ${
                currentPage === Math.ceil(filteredQuotations.length / itemsPerPage)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      </>
      )}

      {/* Add Quotation Modal */}
      {showQuotationModal && (
        <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Hotel Accommodation Quotation for Group Trip</h3>
              <button
                onClick={() => setShowQuotationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Group Trip Info */}
              <section>
                <h4 className="text-lg font-medium mb-3 flex items-center">
                  <span className="material-icons mr-2 text-yellow-500">group</span>
                  Group Trip & Hotel Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Group Package Name*"
                    name="packageName"
                    value={newQuotation.packageName}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="md:col-span-2 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium text-yellow-800 flex items-center">
                        <span className="material-icons text-yellow-600 mr-2 text-sm">hotel</span>
                        Hotel Contact Details (Pre-filled)
                      </h5>
                      <div className="text-xs text-yellow-600 flex items-center">
                        <span className="material-icons text-xs mr-1">info</span>
                        Auto-filled from your hotel profile
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Hotel Manager*"
                        name="contactPersonName"
                        value={newQuotation.contactPersonName}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Hotel Email*"
                        type="email"
                        name="contactEmail"
                        value={newQuotation.contactEmail}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Hotel Phone*"
                        type="tel"
                        name="contactPhone"
                        value={newQuotation.contactPhone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Accommodation Details */}
              <section>
                <h4 className="text-lg font-medium mb-3 flex items-center">
                  <span className="material-icons mr-2 text-yellow-600">hotel</span>
                  Group Accommodation Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input
                    label="Group Trip Package*"
                    name="packageName"
                    value={newQuotation.packageName}
                    onChange={handleInputChange}
                    placeholder="e.g., Cultural Sri Lanka Tour"
                    required
                  />
                  <Input
                    label="Group Size*"
                    type="number"
                    name="groupSize"
                    min="5"
                    value={newQuotation.groupSize}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input
                    label="Check-in Date*"
                    type="date"
                    name="checkInDate"
                    min={new Date().toISOString().split('T')[0]}
                    value={newQuotation.checkInDate}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Check-out Date*"
                    type="date"
                    name="checkOutDate"
                    min={newQuotation.checkInDate || new Date().toISOString().split('T')[0]}
                    value={newQuotation.checkOutDate}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="md:col-span-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-700">Stay Duration:</div>
                      <div className="text-sm font-medium">
                        {calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} nights
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 mt-2">
                  <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <span className="material-icons text-yellow-600 mr-2 text-sm">payments</span>
                    Average Accommodation Price Per Person Per Night
                  </h5>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 gap-4 mb-3">
                      <Input
                        label="Price Per Person Per Night (LKR)*"
                        type="number"
                        name="pricePerPersonPerNight"
                        min="0"
                        step="100"
                        value={newQuotation.pricePerPersonPerNight || 0}
                        onChange={(e) => setNewQuotation({
                          ...newQuotation,
                          pricePerPersonPerNight: Math.max(0, parseInt(e.target.value) || 0)
                        })}
                        required
                      />
                    </div>

                    <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-yellow-800">Group Size:</div>
                        <div className="text-sm font-medium">
                          {newQuotation.groupSize} people
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center">
                          <span className="material-icons text-yellow-500 text-xs mr-1">info</span>
                          Room allocation will be determined after quotation approval
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm font-medium text-yellow-800">Total Accommodation Price:</div>
                        <div className="text-sm font-medium">
                          LKR {(newQuotation.pricePerPersonPerNight * newQuotation.groupSize * 
                            calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="material-icons text-yellow-600 mr-2 text-sm">restaurant</span>
                      Meal Plan Options
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Select
                        label="Meal Plan Type*"
                        name="mealPlan"
                        value={newQuotation.mealPlan}
                        onChange={(e) => {
                          const selectedMealPlan = e.target.value;
                          // Set default prices based on meal plan
                          let mealPlanPrice = 0;
                          if (selectedMealPlan === 'Breakfast Only') mealPlanPrice = 15;
                          else if (selectedMealPlan === 'Half Board') mealPlanPrice = 25;
                          else if (selectedMealPlan === 'Full Board') mealPlanPrice = 40;
                          else if (selectedMealPlan === 'All Inclusive') mealPlanPrice = 60;
                          
                          setNewQuotation({
                            ...newQuotation, 
                            mealPlan: selectedMealPlan,
                            mealPlanPricePerPerson: mealPlanPrice
                          });
                        }}
                        options={['Breakfast Only', 'Half Board', 'Full Board', 'All Inclusive']}
                        required
                      />
                      
                      <Input
                        label={`${newQuotation.mealPlan} Price Per Person Per Day (LKR)`}
                        type="number"
                        name="mealPlanPricePerPerson"
                        min="0"
                        value={newQuotation.mealPlanPricePerPerson || 0}
                        onChange={(e) => setNewQuotation({
                          ...newQuotation,
                          mealPlanPricePerPerson: Math.max(0, parseInt(e.target.value) || 0)
                        })}
                        required
                      />
                    </div>
                    
                    <div className="mt-2 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-yellow-800">
                          Total {newQuotation.mealPlan} Cost:
                        </div>
                        <div className="text-sm font-medium">
                          LKR {((newQuotation.mealPlanPricePerPerson || 0) * newQuotation.groupSize * 
                            calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center h-full">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="airportTransfer"
                        checked={newQuotation.airportTransfer}
                        onChange={(e) => setNewQuotation({...newQuotation, airportTransfer: e.target.checked})}
                        className="rounded text-yellow-500 focus:ring-yellow-400"
                      />
                      <span>Include Pool Facilities</span>
                    </label>
                  </div>
                  
                  {newQuotation.airportTransfer && (
                    <Input
                      label="Pool Access Price (LKR)"
                      type="number"
                      name="transportationPrice"
                      min="0"
                      value={newQuotation.transportationPrice || 2000}
                      onChange={(e) => setNewQuotation({
                        ...newQuotation,
                        transportationPrice: Math.max(0, parseInt(e.target.value) || 0)
                      })}
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Discount Offered (%)"
                    type="number"
                    name="discountOffered"
                    min="0"
                    max="100"
                    value={newQuotation.discountOffered || 0}
                    onChange={handleInputChange}
                  />
                  <div className="flex items-center h-full mt-6 text-gray-500">
                    {newQuotation.discountOffered > 0 ? (
                      <div className="flex items-center text-green-600">
                        <span className="material-icons text-sm mr-2">check_circle</span>
                        Discount of {newQuotation.discountOffered}% will be applied
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="material-icons text-sm mr-2">info</span>
                        No discount applied
                      </div>
                    )}
                  </div>
                </div>
                
                <Textarea
                  label="Special Accommodation Requirements"
                  name="specialRequirements"
                  value={newQuotation.specialRequirements}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Special room arrangements, accessibility needs, dietary restrictions, etc."
                />
              </section>

              {/* Price Summary */}
              <section>
                <h4 className="text-lg font-medium mb-3 flex items-center">
                  <span className="material-icons mr-2 text-yellow-600">attach_money</span>
                  Price Calculation
                </h4>
                
                {(!newQuotation.checkInDate || !newQuotation.checkOutDate || !newQuotation.groupSize || 
                  !newQuotation.pricePerPersonPerNight || 
                  newQuotation.pricePerPersonPerNight <= 0 || 
                  newQuotation.groupSize <= 0) ? (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-center">
                    <span className="material-icons text-yellow-600 mr-3">info</span>
                    <p className="text-yellow-700">
                      Please fill in the accommodation details above with valid values to see the price calculation.
                      <br />
                      <span className="text-xs mt-1 block">Required: Check-in/Check-out dates, Group size, Price per person per night</span>
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg overflow-hidden">
                    <div className="bg-yellow-100 px-4 py-2 border-b border-yellow-200">
                      <h5 className="font-medium flex items-center">
                        <span className="material-icons mr-2 text-sm">calculate</span>
                        Quote Calculation
                      </h5>
                    </div>
                    <div className="p-4">
                      {/* Price Summary at a glance */}
                      <div className="mb-4 bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-2 border-b pb-2">
                          <span className="font-medium text-lg flex items-center">
                            <span className="material-icons text-yellow-600 mr-2">summarize</span>
                            Price Summary
                          </span>
                          <span className="font-bold text-lg text-yellow-700">
                            LKR {calculateFinalTotal(newQuotation)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="col-span-2 text-center bg-yellow-50 py-1 mb-1 rounded">
                            <span className="font-medium">Base Rate: LKR {newQuotation.pricePerPersonPerNight || 0} per person/night</span>
                          </div>
                          
                          <div className="text-gray-600">Total Per Person:</div>
                          <div className="text-right font-medium">LKR {calculatePerPersonPrice().toFixed(2)}</div>
                          
                          <div className="text-gray-600">Group Size:</div>
                          <div className="text-right">{newQuotation.groupSize} people</div>
                          
                          <div className="text-gray-600">Duration:</div>
                          <div className="text-right">{calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} nights</div>
                          
                          <div className="text-gray-600 border-t pt-1 mt-1">Total Amount:</div>
                          <div className="text-right font-medium border-t pt-1 mt-1">LKR {calculateFinalTotal(newQuotation)}</div>
                        </div>
                      </div>

                      {/* Accommodation price breakdown */}
                      <div className="mb-3 bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium flex items-center">
                            <span className="material-icons text-yellow-600 text-sm mr-1">hotel</span>
                            Accommodation
                          </span>
                          <span>Group Accommodation</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">Price Per Person:</div>
                          <div className="text-right">LKR {newQuotation.pricePerPersonPerNight || 0}/night</div>
                          
                          <div className="text-gray-600">Group Size:</div>
                          <div className="text-right">{newQuotation.groupSize} people</div>
                          
                          <div className="text-gray-600">Nights:</div>
                          <div className="text-right">{calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} nights</div>
                          
                          <div className="text-gray-600">Accommodation Formula:</div>
                          <div className="text-right text-xs">
                            LKR {newQuotation.pricePerPersonPerNight || 0} × {newQuotation.groupSize} people × {calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} nights
                          </div>
                          
                          <div className="text-gray-600 font-medium">Accommodation Subtotal:</div>
                          <div className="text-right font-medium text-yellow-700">
                            LKR {((newQuotation.pricePerPersonPerNight || 0) * 
                              newQuotation.groupSize * 
                              calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-gray-600 flex items-center">
                          <span className="material-icons text-yellow-600 text-sm mr-2">nightlife</span>
                          Stay Duration:
                        </div>
                        <div className="text-right font-medium">{calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} nights</div>
                        
                        <div className="text-gray-600 flex items-center">
                          <span className="material-icons text-yellow-600 text-sm mr-2">groups</span>
                          Group Size:
                        </div>
                        <div className="text-right font-medium">{newQuotation.groupSize} people</div>
                        
                        <div className="text-gray-600 border-b pb-2 flex items-center">
                          <span className="material-icons text-yellow-600 text-sm mr-2">apartment</span>
                          Accommodation Subtotal:
                        </div>
                        <div className="text-right font-medium border-b pb-2">
                          LKR {calculateAccommodationTotal(newQuotation).toFixed(2)}
                        </div>
                        
                        {newQuotation.mealPlan && (
                          <>
                            <div className="text-gray-600 flex items-center">
                              <span className="material-icons text-yellow-600 text-sm mr-2">restaurant</span>
                              Meal Plan ({newQuotation.mealPlan}):
                            </div>
                            <div className="text-right font-medium">
                              LKR {calculateMealPlanUpgradeTotal(newQuotation).toFixed(2)}
                            </div>
                            
                            <div className="text-xs text-gray-500 col-span-2">
                              <div className="flex justify-between">
                                <span>LKR {newQuotation.mealPlanPricePerPerson || 0}/person/day × {newQuotation.groupSize} people × {calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} days</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {newQuotation.airportTransfer && (
                          <>
                            <div className="text-gray-600 flex items-center">
                              <span className="material-icons text-yellow-600 text-sm mr-2">pool</span>
                              Pool Facilities:
                            </div>
                            <div className="text-right font-medium">
                              LKR {calculateTransportationTotal(newQuotation).toFixed(2)}
                            </div>
                          </>
                        )}
                        
                        <div className="text-gray-700 font-medium border-t border-gray-200 pt-2 mt-2 flex items-center">
                          <span className="material-icons text-yellow-600 text-sm mr-2">receipt</span>
                          Subtotal:
                        </div>
                        <div className="text-right font-medium border-t border-gray-200 pt-2 mt-2">
                          LKR {calculateSubtotalBeforeDiscount(newQuotation).toFixed(2)}
                        </div>
                        
                        {newQuotation.discountOffered > 0 && (
                          <>
                            <div className="text-green-600 flex items-center">
                              <span className="material-icons text-green-600 text-sm mr-2">discount</span>
                              Discount ({newQuotation.discountOffered}%):
                            </div>
                            <div className="text-right text-green-600 font-medium">
                              -LKR {(calculateSubtotalBeforeDiscount(newQuotation) * newQuotation.discountOffered / 100).toFixed(2)}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-200 shadow-md">
                        <div className="flex justify-between font-bold text-lg">
                          <span className="flex items-center">
                            <span className="material-icons mr-2">payments</span>
                            Final Quotation Total:
                          </span>
                          <span className="font-bold text-xl text-yellow-800">
                            LKR {calculateFinalTotal(newQuotation)}
                          </span>
                        </div>
                        
                        {/* Comprehensive price breakdown with visual enhancements */}
                        <div className="mt-3 bg-white p-4 rounded border border-yellow-100 shadow-sm">
                          <h6 className="font-medium text-yellow-800 flex items-center mb-3 border-b border-yellow-100 pb-1">
                            <span className="material-icons text-yellow-600 text-sm mr-2">receipt</span>
                            Complete Price Breakdown
                          </h6>
                          
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-gray-600 font-medium col-span-3 bg-yellow-50 p-1 rounded">
                              Base Accommodation
                            </div>
                            
                            <div className="text-gray-600 pl-2">Room Rate:</div>
                            <div className="text-gray-600">LKR {newQuotation.pricePerPersonPerNight || 0} × {newQuotation.groupSize} people</div>
                            <div className="text-right font-medium">
                              LKR {((newQuotation.pricePerPersonPerNight || 0) * newQuotation.groupSize).toFixed(2)}/night
                            </div>
                            
                            <div className="text-gray-600 pl-2">Stay Duration:</div>
                            <div className="text-gray-600">{calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} nights</div>
                            <div className="text-right">×{calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)}</div>
                            
                            <div className="text-gray-700 font-medium pl-2 border-t border-gray-100 pt-1">Accommodation Total:</div>
                            <div className="border-t border-gray-100 pt-1"></div>
                            <div className="text-right font-medium border-t border-gray-100 pt-1">
                              LKR {calculateAccommodationTotal(newQuotation).toFixed(2)}
                            </div>
                            
                            <div className="text-gray-600 font-medium col-span-3 bg-yellow-50 p-1 rounded mt-2">
                              Add-on Services
                            </div>
                            
                            <div className="text-gray-600 pl-2 flex items-center">
                              <span className="material-icons text-yellow-600 text-xs mr-1">restaurant</span>
                              {newQuotation.mealPlan || 'No Meal Plan'}:
                            </div>
                            <div className="text-gray-600">
                              {newQuotation.mealPlan ? 
                              `LKR ${newQuotation.mealPlanPricePerPerson || 0} × ${newQuotation.groupSize} people × ${calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} days` : '-'}
                            </div>
                            <div className="text-right">
                              {newQuotation.mealPlan ? `LKR ${calculateMealPlanUpgradeTotal(newQuotation).toFixed(2)}` : 'LKR 0.00'}
                            </div>
                            
                            <div className="text-gray-600 pl-2 flex items-center">
                              <span className="material-icons text-yellow-600 text-xs mr-1">pool</span>
                              Pool Facilities:
                            </div>
                            <div className="text-gray-600">
                              {newQuotation.airportTransfer ? `LKR ${newQuotation.transportationPrice || 2000} (flat fee)` : '-'}
                            </div>
                            <div className="text-right">
                              {newQuotation.airportTransfer ? `LKR ${calculateTransportationTotal(newQuotation).toFixed(2)}` : 'LKR 0.00'}
                            </div>
                            
                            <div className="text-gray-700 font-medium pl-2 border-t border-gray-100 pt-1 mt-1">
                              Subtotal (before discount):
                            </div>
                            <div className="border-t border-gray-100 pt-1 mt-1"></div>
                            <div className="text-right font-medium border-t border-gray-100 pt-1 mt-1">
                              LKR {calculateSubtotalBeforeDiscount(newQuotation).toFixed(2)}
                            </div>
                            
                            {newQuotation.discountOffered > 0 && (
                              <>
                                <div className="text-green-600 font-medium pl-2 flex items-center">
                                  <span className="material-icons text-green-600 text-xs mr-1">discount</span>
                                  Discount ({newQuotation.discountOffered}%):
                                </div>
                                <div className="text-green-600">
                                  {newQuotation.discountOffered}% of LKR {calculateSubtotalBeforeDiscount(newQuotation).toFixed(2)}
                                </div>
                                <div className="text-right text-green-600 font-medium">
                                  -LKR {(calculateSubtotalBeforeDiscount(newQuotation) * newQuotation.discountOffered / 100).toFixed(2)}
                                </div>
                                
                                <div className="text-gray-700 font-medium pl-2 border-t border-gray-100 pt-1 mt-1">
                                  Final Amount (after discount):
                                </div>
                                <div className="border-t border-gray-100 pt-1 mt-1"></div>
                                <div className="text-right font-medium border-t border-gray-100 pt-1 mt-1 text-yellow-700">
                                  LKR {calculateFinalTotal(newQuotation)}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-100 shadow-sm">
                          <h6 className="font-medium text-blue-800 flex items-center mb-2 border-b border-blue-100 pb-1">
                            <span className="material-icons text-blue-600 text-sm mr-2">person</span>
                            Per Person Cost Breakdown
                          </h6>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-gray-600 pl-2">Accommodation:</div>
                            <div className="text-gray-600">LKR {newQuotation.pricePerPersonPerNight || 0}/night × {calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} nights</div>
                            <div className="text-right font-medium">
                              LKR {(newQuotation.pricePerPersonPerNight * calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)).toFixed(2)}
                            </div>
                            
                            <div className="text-gray-600 pl-2">Meal Plan ({newQuotation.mealPlan || 'None'}):</div>
                            <div className="text-gray-600">
                              {newQuotation.mealPlanPricePerPerson ? 
                              `LKR ${newQuotation.mealPlanPricePerPerson}/day × ${calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} days` : '-'}
                            </div>
                            <div className="text-right font-medium">
                              {newQuotation.mealPlanPricePerPerson ? 
                              `LKR ${(newQuotation.mealPlanPricePerPerson * calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)).toFixed(2)}` : 'LKR 0.00'}
                            </div>
                            
                            <div className="text-gray-600 pl-2">Pool Facilities:</div>
                            <div className="text-gray-600">
                              {newQuotation.airportTransfer ? 'Included (shared)' : 'Not included'}
                            </div>
                            <div className="text-right font-medium">
                              {newQuotation.airportTransfer ? 
                              `LKR ${(calculateTransportationTotal(newQuotation) / newQuotation.groupSize).toFixed(2)}` : 'LKR 0.00'}
                            </div>
                            
                            {newQuotation.discountOffered > 0 && (
                              <>
                                <div className="text-green-600 pl-2">Discount ({newQuotation.discountOffered}%):</div>
                                <div className="text-green-600">Applied to total</div>
                                <div className="text-right text-green-600 font-medium">
                                  -LKR {((calculateSubtotalBeforeDiscount(newQuotation) * newQuotation.discountOffered / 100) / newQuotation.groupSize).toFixed(2)}
                                </div>
                              </>
                            )}
                            
                            <div className="text-gray-700 font-medium border-t border-blue-100 pt-1 mt-1 pl-2">
                              Total Per Person:
                            </div>
                            <div className="border-t border-blue-100 pt-1 mt-1"></div>
                            <div className="text-right font-medium border-t border-blue-100 pt-1 mt-1 text-blue-700">
                              LKR {calculatePerPersonPrice().toFixed(2)}
                            </div>
                          </div>
                          
                          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-1 rounded flex items-center justify-center">
                            <span className="material-icons text-xs mr-1">info</span>
                            This is what each person will pay for the full accommodation package.
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-600 flex items-center bg-yellow-50 p-2 rounded">
                          <span className="material-icons text-yellow-600 mr-2">info</span>
                          This total amount will be the final quotation price sent to the group trip coordinator.
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 shadow-sm">
                          <h6 className="font-medium text-yellow-800 flex items-center mb-2 border-b border-yellow-100 pb-1">
                            <span className="material-icons text-yellow-600 text-sm mr-2">savings</span>
                            Revenue Summary
                          </h6>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-600">Trip Duration:</div>
                            <div className="text-right font-medium">{calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} nights</div>
                            
                            <div className="text-gray-600">Guest Count:</div>
                            <div className="text-right font-medium">{newQuotation.groupSize} people</div>
                            
                            <div className="text-gray-600">Total Room Nights:</div>
                            <div className="text-right font-medium">
                              {calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate) * newQuotation.groupSize} person-nights
                            </div>
                            
                            <div className="text-gray-600 border-t border-yellow-100 mt-1 pt-1">Revenue Breakdown:</div>
                            <div className="text-right border-t border-yellow-100 mt-1 pt-1"></div>
                            
                            <div className="text-gray-600 pl-2">Room Revenue:</div>
                            <div className="text-right">LKR {calculateAccommodationTotal(newQuotation).toFixed(2)}</div>
                            
                            <div className="text-gray-600 pl-2">Food & Beverage:</div>
                            <div className="text-right">LKR {calculateMealPlanUpgradeTotal(newQuotation).toFixed(2)}</div>
                            
                            {newQuotation.airportTransfer && (
                              <>
                                <div className="text-gray-600 pl-2">Pool Facilities:</div>
                                <div className="text-right">LKR {calculateTransportationTotal(newQuotation).toFixed(2)}</div>
                              </>
                            )}
                            
                            {newQuotation.discountOffered > 0 && (
                              <>
                                <div className="text-green-600">Discount Applied:</div>
                                <div className="text-right text-green-600">
                                  -LKR {(calculateSubtotalBeforeDiscount(newQuotation) * newQuotation.discountOffered / 100).toFixed(2)}
                                </div>
                              </>
                            )}
                            
                            <div className="text-gray-700 font-medium border-t border-yellow-100 mt-1 pt-1">Net Revenue:</div>
                            <div className="text-right font-medium border-t border-yellow-100 mt-1 pt-1 text-yellow-700">
                              LKR {calculateFinalTotal(newQuotation)}
                            </div>
                            
                            <div className="text-gray-600 text-xs col-span-2 mt-1 bg-yellow-50 p-1 rounded text-center">
                              Average Revenue Per Person: <span className="font-medium">LKR {calculatePerPersonPrice().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 shadow-sm">
                          <h6 className="font-medium text-green-800 flex items-center mb-2 border-b border-green-100 pb-1">
                            <span className="material-icons text-green-600 text-sm mr-2">monetization_on</span>
                            Value Added Services
                          </h6>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-600 font-medium">Service</div>
                            <div className="text-right font-medium">Revenue</div>
                            
                            <div className="text-gray-600">Meal Plan:</div>
                            <div className="text-right">
                              {newQuotation.mealPlan ? (
                                <div className="flex flex-col">
                                  <span className="font-medium">LKR {calculateMealPlanUpgradeTotal(newQuotation).toFixed(2)}</span>
                                  <span className="text-xs text-gray-500">
                                    ({newQuotation.mealPlan})
                                  </span>
                                </div>
                              ) : 'None'}
                            </div>
                            
                            <div className="text-xs text-gray-500 col-span-2 bg-green-50 p-1 rounded">
                              <span className="font-medium">Formula:</span> LKR {newQuotation.mealPlanPricePerPerson || 0}/person/day × {newQuotation.groupSize} people × {calculateNights(newQuotation.checkInDate, newQuotation.checkOutDate)} days
                            </div>
                            
                            <div className="text-gray-600 mt-1">Pool Facilities:</div>
                            <div className="text-right mt-1">
                              {newQuotation.airportTransfer ? (
                                <div className="flex flex-col">
                                  <span className="font-medium">LKR {calculateTransportationTotal(newQuotation).toFixed(2)}</span>
                                  <span className="text-xs text-gray-500">(Group Access)</span>
                                </div>
                              ) : 'Not included'}
                            </div>
                            
                            <div className="text-gray-600 font-medium pt-1 mt-1 border-t border-green-100">Total Add-on Revenue:</div>
                            <div className="text-right font-medium pt-1 mt-1 border-t border-green-100 text-green-700">
                              LKR {(calculateMealPlanUpgradeTotal(newQuotation) + calculateTransportationTotal(newQuotation)).toFixed(2)}
                            </div>
                            
                            <div className="text-gray-600 text-xs col-span-2 mt-1 bg-green-50 p-1 rounded text-center">
                              Add-ons Percentage: <span className="font-medium">
                                {(((calculateMealPlanUpgradeTotal(newQuotation) + calculateTransportationTotal(newQuotation)) / 
                                   calculateSubtotalBeforeDiscount(newQuotation)) * 100).toFixed(1)}% of total revenue
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowQuotationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-md text-sm font-medium flex items-center"
                  disabled={!newQuotation.checkInDate || 
                           !newQuotation.checkOutDate || 
                           !newQuotation.pricePerPersonPerNight || 
                           !newQuotation.groupSize ||
                           !newQuotation.contactEmail}
                >
                  <span className="material-icons text-sm mr-2">send</span>
                  {newQuotation.checkInDate && newQuotation.checkOutDate && 
                   newQuotation.pricePerPersonPerNight && newQuotation.groupSize && newQuotation.contactEmail ? 
                    `Send Quotation (LKR ${calculateFinalTotal(newQuotation)})` : 
                    'Send Accommodation Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {showDetailModal && selectedQuotation && (
        <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <QuotationDetailView 
            quotation={selectedQuotation}
            onClose={() => setShowDetailModal(false)}
            onDelete={(id) => {
              setShowDetailModal(false); // First close the modal
              setTimeout(() => handleDeleteClick(id), 100); // Then trigger delete with slight delay
            }}
          />
        </div>
      )}
      
      {/* Group Trip Package Detail Modal */}
      {showGroupPackageModal && selectedGroupPackage && (
        <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <GroupTripDetailView 
            tripPackage={selectedGroupPackage}
            onClose={() => setShowGroupPackageModal(false)}
            onCreateQuotation={handleCreateQuotation}
          />
        </div>
      )}
    </div>
  );
};

export default QuotationsManagement;