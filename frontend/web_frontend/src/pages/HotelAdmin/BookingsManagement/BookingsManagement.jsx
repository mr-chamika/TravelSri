import React, { useState, useEffect } from 'react';
import bookingService from '../../../services/bookingService';

/* ------------------------------------------------------------------ */
/*  BookingsManagement Component                                      */
/* ------------------------------------------------------------------ */
const BookingsManagement = () => {
  /* -------------------------------------------------------------- */
  /* 1. STATE                                                       */
  /* -------------------------------------------------------------- */
  // Bookings from API
  const [bookings, setBookings] = useState([]);
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // Error state
  const [error, setError] = useState(null);
  // Counter for display IDs
  const [nextDisplayId, setNextDisplayId] = useState(1);
  // Flash message state
  const [flashMessage, setFlashMessage] = useState({ visible: false, message: '', type: 'success' });
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    bookingId: null
  });

  // Fetch bookings when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await bookingService.getAllBookings();
        // Transform data to match frontend model and add display IDs
        const transformedData = data.map((booking, index) => ({
          id: booking.id, // Original MongoDB ID
          displayId: index + 1, // Sequential display ID starting from 1
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          guestPhone: '', // Not available in backend model
          roomType: booking.roomType,
          roomNumber: String(booking.roomNumber), // Convert to string for frontend
          adults: 1, // Default values as backend doesn't have these
          children: 0,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          status: booking.status,
          paymentStatus: booking.status === 'Confirmed' ? 'Paid' : 'Pending', // Derive from status
          totalAmount: booking.totalCost,
          specialRequests: '',
          paymentMethod: 'Credit Card', // Default value as backend doesn't have this
        }));

        // Update the next display ID
        setNextDisplayId(data.length + 1);
        setBookings(transformedData);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        // setError('Failed to load bookings. Please try again later.');
        // Fallback to sample data if API fails
        setBookings([
          {
            id: 'sample1', // Mock MongoDB ID
            displayId: 1,  // Display ID
            guestName: 'Theekshana Thathsara',
            guestEmail: 'thathsara@example.com',
            guestPhone: '+9471-555-0101',
            roomType: 'Deluxe Room',
            roomNumber: '101',
            adults: 2,
            children: 0,
            checkIn: '2025-06-12',
            checkOut: '2025-06-15',
            status: 'Confirmed',
            paymentStatus: 'Paid',
            totalAmount: 450,
            specialRequests: 'Early check-in if possible',
            paymentMethod: 'Credit Card',
          },
          {
            id: 'sample2', // Mock MongoDB ID
            displayId: 2,  // Display ID
            guestName: 'Tharusha Samarawickrama',
            guestEmail: 'tharusha@example.com',
            guestPhone: '+9477-585-0162',
            roomType: 'Suite',
            roomNumber: '103',
            adults: 2,
            children: 1,
            checkIn: '2025-06-23',
            checkOut: '2025-06-26',
            status: 'Pending',
            paymentStatus: 'Pending',
            totalAmount: 750,
            specialRequests: 'High floor with city view',
            paymentMethod: 'Debit Card',
          },
          {
            id: 'sample3', // Mock MongoDB ID
            displayId: 3,  // Display ID
            guestName: 'Hasith Chamika',
            guestEmail: 'chamika@example.com',
            guestPhone: '+9478-958-0175',
            roomType: 'Standard Room',
            roomNumber: '105',
            adults: 1,
            children: 0,
            checkIn: '2025-06-17',
            checkOut: '2025-06-19',
            status: 'Confirmed',
            paymentStatus: 'Paid',
            totalAmount: 240,
            specialRequests: '',
            paymentMethod: 'Credit Card',
          },
          {
            id: 'sample4', // Mock MongoDB ID
            displayId: 4,  // Display ID
            guestName: 'Charitha Sudewa',
            guestEmail: 'charitha@example.com',
            guestPhone: '+9475-963-4583',
            roomType: 'Deluxe Room',
            roomNumber: '201',
            adults: 2,
            children: 2,
            checkIn: '2025-06-18',
            checkOut: '2025-06-20',
            status: 'Cancelled',
            paymentStatus: 'Refunded',
            totalAmount: 300,
            specialRequests: 'Extra rollaway bed',
            paymentMethod: 'Bank Transfer',
          },
          {
            id: 'sample5', // Mock MongoDB ID
            displayId: 5,  // Display ID
            guestName: 'Bimsara Imash',
            guestEmail: 'bimsara@example.com',
            guestPhone: '+9472-852-4635',
            roomType: 'Suite',
            roomNumber: '202',
            adults: 2,
            children: 0,
            checkIn: '2025-06-20',
            checkOut: '2025-06-22',
            status: 'Confirmed',
            paymentStatus: 'Paid',
            totalAmount: 1250,
            specialRequests: 'Late check-out requested',
            paymentMethod: 'Credit Card',
          },
          {
            id: 'sample6', // Mock MongoDB ID
            displayId: 6,  // Display ID
            guestName: 'Teshini Sawidya',
            guestEmail: 'teshini@example.com',
            guestPhone: '+9476-450-6395',
            roomType: 'Standard Room',
            roomNumber: '203',
            adults: 2,
            children: 0,
            checkIn: '2025-06-20',
            checkOut: '2025-06-22',
            status: 'Confirmed',
            paymentStatus: 'Paid',
            totalAmount: 1250,
            specialRequests: 'Late check-out requested',
            paymentMethod: 'Credit Card',
          }
        ]);
        setNextDisplayId(7); // Set next display ID after sample data
      }
      setIsLoading(false);
    };

    fetchBookings();
  }, []);

  // Active tab filter
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal visibility
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Form state for a new booking
  const blankBooking = {
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    roomType: 'Deluxe Room',
    roomNumber: '',
    adults: 1,
    children: 0,
    checkIn: '',
    checkOut: '',
    specialRequests: '',
    paymentMethod: 'Credit Card',
    status: 'Pending',
    paymentStatus: 'Pending',
    totalAmount: 0,
  };
  const [newBooking, setNewBooking] = useState(blankBooking);
  const [editBooking, setEditBooking] = useState(null);

  /* -------------------------------------------------------------- */
  /* 2. CONSTANTS & HELPERS                                          */
  /* -------------------------------------------------------------- */
  const roomTypes = [
    'Standard Room',
    'Deluxe Room',
    'Suite',
    'Family Room',
    'Executive Suite',
  ];

  const availableRooms = {
    'Standard Room': ['105', '107', '108', '205'],
    'Deluxe Room': ['101', '104', '201', '204'],
    Suite: ['103', '202', '303'],
    'Family Room': ['106', '206'],
    'Executive Suite': ['301', '302'],
  };

  const roomPrices = {
    'Standard Room': 2500,
    'Deluxe Room': 3200,
    'Suite': 3500,
    'Family Room': 4500,
    'Executive Suite': 4000,
  };

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

  // Helper to calculate night duration between dates
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

  // Computed list after filter
  const filteredBookings =
    filterStatus === 'All'
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  // Sort bookings by displayId (ascending order)
  filteredBookings.sort((a, b) => a.displayId - b.displayId);

  const calculateAmount = (booking) => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const nights = calculateNights(booking.checkIn, booking.checkOut);
    return nights * roomPrices[booking.roomType];
  };

  // Helper function to show flash messages
  const showFlashMessage = (message, type = 'success') => {
    setFlashMessage({ visible: true, message, type });
  };

  /* -------------------------------------------------------------- */
  /* 3. HANDLERS                                                    */
  /* -------------------------------------------------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomTypeChange = (e) => {
    const selected = e.target.value;
    setNewBooking((prev) => ({
      ...prev,
      roomType: selected,
      roomNumber: '',
    }));
  };

  const handleEditRoomTypeChange = (e) => {
    const selected = e.target.value;
    setEditBooking((prev) => ({
      ...prev,
      roomType: selected,
      roomNumber: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Calculate total amount before sending
      const calculatedAmount = calculateAmount(newBooking);
      const bookingToAdd = {
        ...newBooking,
        totalAmount: calculatedAmount
      };

      // Call the API to create booking
      const createdBooking = await bookingService.createBooking(bookingToAdd);

      // Transform the response to match our frontend model
      const frontendBooking = {
        id: createdBooking.id,
        displayId: nextDisplayId, // Add sequential display ID
        guestName: createdBooking.guestName,
        guestEmail: createdBooking.guestEmail,
        guestPhone: newBooking.guestPhone, // Keep frontend data that's not in backend
        roomType: createdBooking.roomType,
        roomNumber: String(createdBooking.roomNumber),
        adults: newBooking.adults,
        children: newBooking.children,
        checkIn: createdBooking.checkIn,
        checkOut: createdBooking.checkOut,
        status: createdBooking.status,
        paymentStatus: newBooking.paymentStatus,
        totalAmount: createdBooking.totalCost,
        specialRequests: newBooking.specialRequests,
        paymentMethod: newBooking.paymentMethod
      };

      // Update local state
      setBookings((prev) => [...prev, frontendBooking]);
      // Increment the next display ID for future bookings
      setNextDisplayId(nextDisplayId + 1);
      setShowBookingModal(false);
      setNewBooking(blankBooking);
      // Show success message
      showFlashMessage('Booking created successfully!', 'success');
    } catch (error) {
      console.error('Error creating booking:', error);
      showFlashMessage('Failed to create booking. Please try again.', 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const calculatedAmount = calculateAmount(editBooking);
      const updatedBooking = {
        ...editBooking,
        totalAmount: calculatedAmount,
      };

      console.log('Updating booking:', updatedBooking);

      try {
        // Call API to update booking
        const result = await bookingService.updateBooking(updatedBooking.id, updatedBooking);
        console.log('Update result:', result);

        // Show success message
        showFlashMessage('Booking updated successfully!', 'success');

        // Update local state but preserve the displayId
        setBookings((prev) =>
          prev.map((b) => (b.id === updatedBooking.id ?
            { ...updatedBooking, displayId: b.displayId } : b))
        );
        setShowEditModal(false);
        setEditBooking(null);
      } catch (error) {
        console.error('API error updating booking:', error);

        // Use confirmation dialog for network errors
        setConfirmDialog({
          isOpen: true,
          title: 'Network Error',
          message: 'Could not connect to the server. Do you want to update this booking in your local view only? Changes will not be saved on the server.',
          onConfirm: () => {
            // Continue with local update even if API call fails
            console.log('Proceeding with local update only');

            // Update local state but preserve the displayId
            setBookings((prev) =>
              prev.map((b) => (b.id === updatedBooking.id ?
                { ...updatedBooking, displayId: b.displayId } : b))
            );
            setShowEditModal(false);
            setEditBooking(null);

            showFlashMessage('Booking updated locally. Changes will not be saved on the server.', 'info');
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          },
          onCancel: () => {
            // User chose not to proceed with local update
            showFlashMessage('Update canceled. No changes were made.', 'info');
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          },
          bookingId: updatedBooking.id
        });
        return; // Exit here to prevent double error handling
      }
    } catch (error) {
      console.error('Error in edit process:', error);
      showFlashMessage('Failed to update booking. Please try again.', 'error');
    }
  };

  const handleEdit = (booking) => {
    setEditBooking({ ...booking });
    setShowEditModal(true);
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  // Show confirmation dialog for deletion
  const showDeleteConfirmation = (id) => {
    // Find the booking to show in confirmation message
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Delete Booking',
      message: `Are you sure you want to delete booking #${booking.displayId} for ${booking.guestName}? This action cannot be undone.`,
      onConfirm: () => confirmDelete(id),
      onCancel: () => setConfirmDialog(prev => ({ ...prev, isOpen: false })),
      bookingId: id
    });
  };

  // Actual deletion function after confirmation
  const confirmDelete = async (id) => {
    try {
      console.log('Deleting booking with ID:', id);
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));

      try {
        // Call API to delete booking
        await bookingService.deleteBooking(id);
        // Show success message
        showFlashMessage('Booking deleted successfully!', 'success');
      } catch (apiError) {
        console.error('API error deleting booking:', apiError);

        // Show another confirmation for local-only deletion
        setConfirmDialog({
          isOpen: true,
          title: 'Network Error',
          message: 'Could not connect to the server. Do you want to delete this booking from your local view only? It will reappear on refresh.',
          onConfirm: () => {
            // Continue with local delete only
            console.log('Proceeding with local delete only');
            setBookings(bookings.filter(booking => booking.id !== id));
            showFlashMessage('Booking deleted locally. Changes will not be saved on the server.', 'info');
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          },
          onCancel: () => {
            // User chose not to proceed with local delete
            showFlashMessage('Delete operation canceled. No changes were made.', 'info');
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          },
          bookingId: id
        });
        return; // Exit here to wait for user confirmation
      }

      // Remove from local state
      setBookings(bookings.filter(booking => booking.id !== id));

      // Note: We don't need to adjust display IDs of remaining bookings here
      // as they already have assigned display IDs. When we fetch bookings again,
      // new display IDs will be assigned sequentially.
    } catch (error) {
      console.error('Error deleting booking:', error);
      showFlashMessage('Failed to delete booking. Please try again.', 'error');
    }
  };

  // Handler for delete button click
  const handleDelete = (id) => {
    showDeleteConfirmation(id);
  };

  /* -------------------------------------------------------------- */
  /* 4. RENDER                                                      */
  /* -------------------------------------------------------------- */
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
        onConfirm={() => confirmDialog.onConfirm(confirmDialog.bookingId)}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bookings Management</h2>
        <button
          className="bg-yellow-300 hover:bg-yellow-400 text-black px-4 py-2 rounded-md flex items-center"
          onClick={() => setShowBookingModal(true)}
          disabled={isLoading}
        >
          <span className="material-icons mr-2">add</span> New Booking
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong className="font-bold mr-1">Error:</strong>
          <span>{error}</span>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex mb-6">
        {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
          <button
            key={status}
            className={`mr-4 px-4 py-2 rounded-md ${filterStatus === status
              ? 'bg-yellow-300 text-black'
              : 'bg-gray-200'
              }`}
            onClick={() => setFilterStatus(status)}
            disabled={isLoading}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Booking ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Guest
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Room
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Check In
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Check Out
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Payment
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.map((b) => (
              <tr key={b.id}>
                <td className="py-3 px-4">#{b.displayId}</td>
                <td className="py-3 px-4">{b.guestName}</td>
                <td className="py-3 px-4">
                  {b.roomType} ({b.roomNumber})
                </td>
                <td className="py-3 px-4">{formatDate(b.checkIn)}</td>
                <td className="py-3 px-4">{formatDate(b.checkOut)}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${b.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800'
                        : ''
                      }
                      ${b.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : ''
                      }
                      ${b.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : ''
                      }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${b.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : ''
                      }
                      ${b.paymentStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : ''
                      }
                      ${b.paymentStatus === 'Refunded'
                        ? 'bg-gray-100 text-gray-800'
                        : ''
                      }`}
                  >
                    {b.paymentStatus}
                  </span>
                </td>
                <td className="py-3 px-4">LKR {b.totalAmount}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-1 rounded-md text-xs font-medium"
                      onClick={() => handleEdit(b)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-xs font-medium"
                      onClick={() => handleView(b)}
                    >
                      View
                    </button>
                    <button
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-xs font-medium"
                      onClick={() => handleDelete(b.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">New Booking</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Guest Info */}
              <section>
                <h4 className="text-lg font-medium mb-3">Guest Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Guest Name*"
                    name="guestName"
                    value={newBooking.guestName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Email*"
                    type="email"
                    name="guestEmail"
                    value={newBooking.guestEmail}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Phone*"
                    type="tel"
                    name="guestPhone"
                    value={newBooking.guestPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </section>

              {/* Reservation Details */}
              <section>
                <h4 className="text-lg font-medium mb-3">
                  Reservation Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Select
                    label="Room Type*"
                    name="roomType"
                    value={newBooking.roomType}
                    onChange={handleRoomTypeChange}
                    options={roomTypes}
                  />
                  <Select
                    label="Room Number*"
                    name="roomNumber"
                    value={newBooking.roomNumber}
                    onChange={handleInputChange}
                    options={[
                      '',
                      ...(availableRooms[newBooking.roomType] || []),
                    ]}
                    displayFn={(val) => (val ? `Room ${val}` : 'Select')}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <Input
                    label="Check-in*"
                    type="date"
                    name="checkIn"
                    min={new Date().toISOString().split('T')[0]}
                    value={newBooking.checkIn}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Check-out*"
                    type="date"
                    name="checkOut"
                    min={newBooking.checkIn || undefined}
                    value={newBooking.checkOut}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Adults*"
                    type="number"
                    name="adults"
                    min="1"
                    value={newBooking.adults}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Children"
                    type="number"
                    name="children"
                    min="0"
                    value={newBooking.children}
                    onChange={handleInputChange}
                  />
                </div>
              </section>

              {/* Payment Info */}
              <section>
                <h4 className="text-lg font-medium mb-3">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Payment Method*"
                    name="paymentMethod"
                    value={newBooking.paymentMethod}
                    onChange={handleInputChange}
                    options={[
                      'Credit Card',
                      'Debit Card',
                      'Cash',
                      'Bank Transfer',
                    ]}
                  />
                  <Select
                    label="Booking Status*"
                    name="status"
                    value={newBooking.status}
                    onChange={handleInputChange}
                    options={['Pending', 'Confirmed']}
                  />
                </div>
              </section>

              {/* Extras */}
              <section>
                <h4 className="text-lg font-medium mb-3">
                  Additional Information
                </h4>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  rows="3"
                  value={newBooking.specialRequests}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter any special requirements..."
                />
              </section>

              {/* Price Summary */}
              {newBooking.checkIn && newBooking.checkOut && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-xl">
                      ${calculateAmount(newBooking)}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-md text-sm font-medium"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && editBooking && (
        <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Booking #{editBooking.displayId}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Guest Info */}
              <section>
                <h4 className="text-lg font-medium mb-3">Guest Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Guest Name*"
                    name="guestName"
                    value={editBooking.guestName}
                    onChange={handleEditInputChange}
                    required
                  />
                  <Input
                    label="Email*"
                    type="email"
                    name="guestEmail"
                    value={editBooking.guestEmail}
                    onChange={handleEditInputChange}
                    required
                  />
                  <Input
                    label="Phone*"
                    type="tel"
                    name="guestPhone"
                    value={editBooking.guestPhone}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </section>

              {/* Reservation Details */}
              <section>
                <h4 className="text-lg font-medium mb-3">
                  Reservation Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Select
                    label="Room Type*"
                    name="roomType"
                    value={editBooking.roomType}
                    onChange={handleEditRoomTypeChange}
                    options={roomTypes}
                  />
                  <Select
                    label="Room Number*"
                    name="roomNumber"
                    value={editBooking.roomNumber}
                    onChange={handleEditInputChange}
                    options={[
                      '',
                      ...(availableRooms[editBooking.roomType] || []),
                    ]}
                    displayFn={(val) => (val ? `Room ${val}` : 'Select')}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <Input
                    label="Check-in*"
                    type="date"
                    name="checkIn"
                    value={editBooking.checkIn}
                    onChange={handleEditInputChange}
                    required
                  />
                  <Input
                    label="Check-out*"
                    type="date"
                    name="checkOut"
                    min={editBooking.checkIn || undefined}
                    value={editBooking.checkOut}
                    onChange={handleEditInputChange}
                    required
                  />
                  <Input
                    label="Adults*"
                    type="number"
                    name="adults"
                    min="1"
                    value={editBooking.adults}
                    onChange={handleEditInputChange}
                    required
                  />
                  <Input
                    label="Children"
                    type="number"
                    name="children"
                    min="0"
                    value={editBooking.children}
                    onChange={handleEditInputChange}
                  />
                </div>
              </section>

              {/* Payment Info */}
              <section>
                <h4 className="text-lg font-medium mb-3">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Select
                    label="Payment Method*"
                    name="paymentMethod"
                    value={editBooking.paymentMethod}
                    onChange={handleEditInputChange}
                    options={[
                      'Credit Card',
                      'Debit Card',
                      'Cash',
                      'Bank Transfer',
                    ]}
                  />
                  <Select
                    label="Booking Status*"
                    name="status"
                    value={editBooking.status}
                    onChange={handleEditInputChange}
                    options={['Pending', 'Confirmed', 'Cancelled']}
                  />
                  <Select
                    label="Payment Status*"
                    name="paymentStatus"
                    value={editBooking.paymentStatus}
                    onChange={handleEditInputChange}
                    options={['Pending', 'Paid', 'Refunded']}
                  />
                </div>
              </section>

              {/* Extras */}
              <section>
                <h4 className="text-lg font-medium mb-3">
                  Additional Information
                </h4>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  rows="3"
                  value={editBooking.specialRequests}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter any special requirements..."
                />
              </section>

              {/* Price Summary */}
              {editBooking.checkIn && editBooking.checkOut && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-xl">
                      LKR {calculateAmount(editBooking)}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-md text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {showViewModal && selectedBooking && (
        <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Booking #{selectedBooking.displayId} Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`px-4 py-3 rounded-md ${selectedBooking.status === 'Confirmed' ? 'bg-green-50 border border-green-200' :
                selectedBooking.status === 'Pending' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                <div className="flex items-center">
                  <span className={`material-icons mr-2 ${selectedBooking.status === 'Confirmed' ? 'text-green-500' :
                    selectedBooking.status === 'Pending' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                    {selectedBooking.status === 'Confirmed' ? 'check_circle' :
                      selectedBooking.status === 'Pending' ? 'pending' : 'cancel'}
                  </span>
                  <div>
                    <p className={`font-medium ${selectedBooking.status === 'Confirmed' ? 'text-green-700' :
                      selectedBooking.status === 'Pending' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                      {selectedBooking.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment: {selectedBooking.paymentStatus}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <p className="font-bold text-xl">${selectedBooking.totalAmount}</p>
                    <p className="text-right text-xs text-gray-500">Total Amount</p>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <section>
                <h4 className="text-lg font-medium mb-3 pb-2 border-b border-gray-200">Guest Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Guest Name</p>
                    <p className="font-medium">{selectedBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{selectedBooking.guestEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{selectedBooking.guestPhone}</p>
                  </div>
                </div>
              </section>

              {/* Reservation Details */}
              <section>
                <h4 className="text-lg font-medium mb-3 pb-2 border-b border-gray-200">Reservation Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Room Type</p>
                    <p className="font-medium">{selectedBooking.roomType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Room Number</p>
                    <p className="font-medium">{selectedBooking.roomNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-in</p>
                    <p>{formatDate(selectedBooking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-out</p>
                    <p>{formatDate(selectedBooking.checkOut)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p>{calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)} night(s)</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adults</p>
                    <p>{selectedBooking.adults}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Children</p>
                    <p>{selectedBooking.children}</p>
                  </div>
                </div>
              </section>

              {/* Payment Information */}
              <section>
                <h4 className="text-lg font-medium mb-3 pb-2 border-b border-gray-200">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p>{selectedBooking.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${selectedBooking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : ''}
                      ${selectedBooking.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${selectedBooking.paymentStatus === 'Refunded' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="font-bold">${selectedBooking.totalAmount}</p>
                  </div>
                </div>
              </section>

              {/* Additional Information */}
              {selectedBooking.specialRequests && (
                <section>
                  <h4 className="text-lg font-medium mb-3 pb-2 border-b border-gray-200">Special Requests</h4>
                  <p className="bg-gray-50 p-3 rounded-md">{selectedBooking.specialRequests}</p>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Helper Sub-Components                                             */
/* ------------------------------------------------------------------ */
// Confirmation Dialog Component
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${title.includes('Delete') ?
              'bg-red-600 hover:bg-red-700' :
              'bg-blue-600 hover:bg-blue-700'} text-white rounded-md text-sm font-medium`}
          >
            {title.includes('Delete') ? 'Delete' :
              (title.includes('Network') ? 'Continue Anyway' : 'Confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Flash Message Component for success/error notifications
const FlashMessage = ({ message, type, onClose }) => {
  // Animation state
  const [animation, setAnimation] = useState('fadeIn');

  React.useEffect(() => {
    // Auto dismiss after 5 seconds
    const dismissTimer = setTimeout(() => {
      setAnimation('fadeOut');
      // Actually close after animation completes
      const closeTimer = setTimeout(() => {
        onClose();
      }, 500); // Match this to CSS animation duration

      return () => clearTimeout(closeTimer);
    }, 4500); // Show for 4.5 seconds before starting fade out

    return () => clearTimeout(dismissTimer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
    type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
      'bg-yellow-100 border-yellow-400 text-yellow-700';

  const icon = type === 'success' ? 'check_circle' :
    type === 'error' ? 'error' : 'info';

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded border ${bgColor} shadow-lg flex items-center max-w-md transform`}
      style={{
        animation: `${animation === 'fadeIn' ? 'slideInRight' : 'slideOutRight'} 0.5s ease-in-out`,
        opacity: animation === 'fadeIn' ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
      }}
    >
      <span className="material-icons mr-2">{icon}</span>
      <div className="flex-grow">{message}</div>
      <button onClick={() => {
        setAnimation('fadeOut');
        setTimeout(onClose, 500);
      }} className="ml-2 text-gray-500 hover:text-gray-700">
        <span className="material-icons">close</span>
      </button>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = 'text', ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
      {...rest}
    />
  </div>
);

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  displayFn = (val) => val,
  ...rest
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {displayFn(opt)}
        </option>
      ))}
    </select>
  </div>
);

// Add CSS keyframes for animations
const styles = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
`;

export default BookingsManagement;