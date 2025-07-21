import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quotationService from '../../../services/quotationService';

// Input component for the form
const Input = ({ label, type = 'text', name, value, onChange, required = false, disabled = false }) => (
  <div className="mb-4">
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
      className={`w-full px-3 py-2 border ${
        disabled ? 'bg-gray-100' : 'bg-white'
      } border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
    />
  </div>
);

// Select component for the form
const Select = ({ label, name, value, onChange, options, required = false, disabled = false }) => (
  <div className="mb-4">
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

// Textarea component for the form
const Textarea = ({ label, name, value, onChange, rows = 3, required = false, disabled = false }) => (
  <div className="mb-4">
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
    />
  </div>
);

// Main component
const QuotationDetailView = ({ quotation, onClose, onApprove, onReject, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuotation, setEditedQuotation] = useState({...quotation});
  const [notes, setNotes] = useState('');
  
  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-xl font-bold">
          Quotation #{quotation.quoteNumber}
          <span className={`ml-4 px-3 py-1 text-sm rounded-full ${
            quotation.status === 'Approved' ? 'bg-green-100 text-green-800' :
            quotation.status === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {quotation.status}
          </span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="material-icons">close</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Information */}
        <section>
          <h4 className="text-lg font-medium mb-3">Customer Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Customer Name"
              name="customerName"
              value={editedQuotation.customerName}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Email"
              type="email"
              name="customerEmail"
              value={editedQuotation.customerEmail}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Phone"
              name="customerPhone"
              value={editedQuotation.customerPhone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </section>

        {/* Reservation Details */}
        <section>
          <h4 className="text-lg font-medium mb-3">Reservation Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select
              label="Room Type"
              name="roomType"
              value={editedQuotation.roomType}
              onChange={handleChange}
              options={roomTypes}
              disabled={!isEditing}
            />
            <Input
              label="Guest Count"
              type="number"
              name="guestCount"
              min="1"
              value={editedQuotation.guestCount}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <div className="md:col-span-3 bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Room Availability: {quotation.roomAvailability}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Check-in Date"
              type="date"
              name="checkIn"
              value={editedQuotation.checkIn}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Check-out Date"
              type="date"
              name="checkOut"
              value={editedQuotation.checkOut}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="md:col-span-2 bg-gray-50 p-3 rounded mb-4">
            <p className="text-sm">Stay Duration: <span className="font-medium">{calculateNights(editedQuotation.checkIn, editedQuotation.checkOut)} nights</span></p>
          </div>
          
          <Textarea
            label="Special Requirements"
            name="requirements"
            value={editedQuotation.requirements}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </section>

        {/* Price Details */}
        <section>
          <h4 className="text-lg font-medium mb-3">Price Details</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Base Price:</span>
              <span>${quotation.totalAmount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount ({quotation.discountOffered}%):</span>
              <span>-${(quotation.totalAmount * quotation.discountOffered / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total Amount:</span>
              <span>${(quotation.totalAmount - (quotation.totalAmount * quotation.discountOffered / 100)).toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Admin Section */}
        {quotation.status === 'Pending' && (
          <section>
            <h4 className="text-lg font-medium mb-3">Response</h4>
            <Textarea
              label="Add Notes"
              name="adminNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or comments for this quotation..."
            />
          </section>
        )}

        {quotation.adminNotes && (
          <section className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">Admin Notes:</h4>
            <p className="text-gray-700">{quotation.adminNotes}</p>
          </section>
        )}
        
        {/* Approval Workflow Section */}
        <section>
          <h4 className="text-lg font-medium mb-3">Approval Workflow</h4>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-5 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* Step 1: Created */}
              <div className="flex items-center mb-6 relative">
                <div className="z-10 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full border border-green-500">
                  <span className="material-icons text-green-500 text-xs">check</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Created</h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(quotation.createdAt)} by Hotel Admin
                  </p>
                </div>
              </div>
              
              {/* Step 2: Sent to Super Admin */}
              <div className="flex items-center mb-6 relative">
                <div className={`z-10 flex items-center justify-center w-6 h-6 rounded-full border ${
                  quotation.status === 'Pending' ? 'bg-white border-gray-300' : 
                  'bg-green-100 border-green-500'
                }`}>
                  {quotation.status !== 'Pending' ? 
                    <span className="material-icons text-green-500 text-xs">check</span> : 
                    <span className="text-gray-500 text-xs">2</span>}
                </div>
                <div className="ml-4">
                  <h4 className={`font-medium ${quotation.status === 'Pending' ? 'text-gray-400' : ''}`}>
                    Sent to Super Admin
                  </h4>
                  {quotation.sentToSuperAdminDate ? (
                    <p className="text-sm text-gray-500">
                      {formatDate(quotation.sentToSuperAdminDate)} by {quotation.sentToSuperAdminBy || 'Hotel Admin'}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {quotation.status === 'Pending' ? 'Waiting to be sent' : 'No date recorded'}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Step 3: Review by Super Admin */}
              <div className="flex items-center mb-6 relative">
                <div className={`z-10 flex items-center justify-center w-6 h-6 rounded-full border ${
                  quotation.status === 'Approved' || quotation.status === 'Rejected' ? 
                  'bg-green-100 border-green-500' : 
                  'bg-white border-gray-300'
                }`}>
                  {quotation.status === 'Approved' || quotation.status === 'Rejected' ? 
                    <span className="material-icons text-green-500 text-xs">check</span> : 
                    <span className="text-gray-500 text-xs">3</span>}
                </div>
                <div className="ml-4">
                  <h4 className={`font-medium ${quotation.status === 'Pending' || quotation.status === 'Under Review' ? 'text-gray-400' : ''}`}>
                    Reviewed by Super Admin
                  </h4>
                  {quotation.reviewDate && (quotation.status === 'Approved' || quotation.status === 'Rejected') ? (
                    <p className="text-sm text-gray-500">
                      {formatDate(quotation.reviewDate)} by {quotation.reviewedBy || 'Super Admin'}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {quotation.status === 'Under Review' ? 'In progress' : 'Not yet reviewed'}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Status message */}
              <div className={`ml-10 p-3 rounded-lg ${
                quotation.status === 'Approved' ? 'bg-green-50 text-green-700' :
                quotation.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                quotation.status === 'Under Review' ? 'bg-purple-50 text-purple-700' :
                'bg-yellow-50 text-yellow-700'
              }`}>
                <span className="material-icons text-sm align-middle mr-2">
                  {quotation.status === 'Approved' ? 'check_circle' :
                   quotation.status === 'Rejected' ? 'cancel' :
                   quotation.status === 'Under Review' ? 'rate_review' :
                   'hourglass_empty'}
                </span>
                {quotation.status === 'Approved' && 'Quotation has been approved by Super Admin.'}
                {quotation.status === 'Rejected' && 'Quotation has been rejected by Super Admin.'}
                {quotation.status === 'Under Review' && 'Quotation is currently under review by Super Admin.'}
                {quotation.status === 'Pending' && 'Quotation is waiting to be sent to Super Admin.'}
              </div>
            </div>
          </div>
        </section>
        
        {/* Created Date */}
        <div className="text-sm text-gray-500 pt-4">
          Created on: {formatDate(quotation.createdAt)}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            Close
          </button>
          
          {quotation.status === 'Pending' && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  // Call our handleSendToSuperAdmin function
                  const event = new CustomEvent('sendToSuperAdmin', { detail: quotation.id });
                  document.dispatchEvent(event);
                }}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md text-sm"
              >
                Send to Super Admin
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
              >
                Approve
              </button>
            </>
          )}
          
          {isEditing && (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-md text-sm"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationDetailView;
