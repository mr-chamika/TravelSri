import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X, Car, Calendar, DollarSign, MapPin, Clock, FileText } from 'lucide-react';

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Sample booking data with different trip types
  const [bookings, setBookings] = useState([
    {
      id: 123,
      customer: 'Charitha Sudewa', // User who joined the trip
      vehicle: 'Toyota Hiace',
      date: '2024-01-15',
      status: 'Confirmed',
      amount: 'Rs.2500',
      duration: '3 days',
      pickupLocation: 'Colombo',
      dropoffLocation: 'Kandy',
      phone: '+94 77 123 4567',
      email: 'charitha@email.com',
      tripType: 'user-created',
      description: 'Family trip to Kandy'
    },
    {
      id: 124,
      customer: 'Thaakshana Thushara', // User who joined the trip
      vehicle: 'Toyota Prius',
      date: '2024-01-16',
      status: 'Quotation Sent',
      amount: 'Rs.7500',
      duration: '5 days',
      pickupLocation: 'Galle',
      dropoffLocation: 'Colombo',
      phone: '+94 71 987 6543',
      email: 'thaakshana@email.com',
      tripType: 'pre-planned',
      description: 'Southern Province Cultural Tour - Created by Super Admin'
    },
    {
      id: 345,
      customer: 'Hasith Chandika', // User who joined the trip
      vehicle: 'Honda Civic',
      date: '2024-01-17',
      status: 'Completed',
      amount: 'Rs.12000',
      duration: '7 days',
      pickupLocation: 'Negombo',
      dropoffLocation: 'Matara',
      phone: '+94 76 456 7890',
      email: 'hasith@email.com',
      tripType: 'user-created',
      description: 'Wedding ceremony transportation'
    },
    {
      id: 789,
      customer: 'Thushara Samaraweera', // User who joined the trip
      vehicle: 'Toyota Corolla',
      date: '2024-01-18',
      status: 'Pending Approval',
      amount: 'Rs.1500',
      duration: '2 days',
      pickupLocation: 'Kandy',
      dropoffLocation: 'Anuradhapura',
      phone: '+94 75 234 5678',
      email: 'thushara@email.com',
      tripType: 'user-created',
      description: 'Business trip to Anuradhapura'
    },
    {
      id: 432,
      customer: 'Teejan Savidya', // User who joined the trip
      vehicle: 'Toyota RAV4',
      date: '2024-01-19',
      status: 'Awaiting Quotation',
      amount: 'Rs.2900',
      duration: '4 days',
      pickupLocation: 'Jaffna',
      dropoffLocation: 'Colombo',
      phone: '+94 78 345 6789',
      email: 'teejan@email.com',
      tripType: 'pre-planned',
      description: 'Northern Province Heritage Tour - Created by Super Admin'
    },
    {
      id: 703,
      customer: 'Samsara Hewath', // User who joined the trip
      vehicle: 'Peugot',
      date: '2024-01-20',
      status: 'Confirmed',
      amount: 'Rs.5500',
      duration: '6 days',
      pickupLocation: 'Batticaloa',
      dropoffLocation: 'Trincomalee',
      phone: '+94 72 567 8901',
      email: 'samsara@email.com',
      tripType: 'user-created',
      description: 'Family vacation to eastern coast'
    }
  ]);

  const handleBookingAction = (bookingId, action) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: action } : booking
    ));
  };


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending approval': return 'bg-yellow-100 text-yellow-800';
      case 'awaiting quotation': return 'bg-orange-100 text-orange-800';
      case 'quotation sent': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTripTypeColor = (tripType) => {
    return tripType === 'pre-planned' 
      ? 'bg-indigo-100 text-indigo-800' 
      : 'bg-emerald-100 text-emerald-800';
  };

  const getTripTypeLabel = (tripType) => {
    return tripType === 'pre-planned' ? 'Pre-planned Trip (Super Admin)' : 'User Created Trip';
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toString().includes(searchTerm) ||
                         booking.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase().replace(' ', '') === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingApprovalCount = bookings.filter(b => b.status === 'Pending Approval').length;
  const awaitingQuotationCount = bookings.filter(b => b.status === 'Awaiting Quotation').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const totalRevenue = bookings
    .filter(b => b.amount !== 'Pending' && !b.amount.includes('Pending'))
    .reduce((sum, booking) => {
      const amount = parseInt(booking.amount.replace('Rs.', '').replace(',', ''));
      return sum + amount;
    }, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Management</h1>
            <p className="text-gray-600">Manage vehicle bookings and quotations</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
              <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Confirmed</div>
              <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Awaiting Quotation</div>
              <div className="text-2xl font-bold text-orange-600">{awaitingQuotationCount}</div>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Completed</div>
              <div className="text-2xl font-bold text-purple-600">{completedCount}</div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-blue-600">Rs.{totalRevenue.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by booking ID, customer name, vehicle, or trip description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pendingapproval">Pending Approval</option>
              <option value="awaitingquotation">Awaiting Quotation</option>
              <option value="quotationsent">Quotation Sent</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-[0.5px] border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Trip Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Date & Duration
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{booking.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{booking.customer}</div>
                      <div className="text-sm text-gray-500">
                        {booking.tripType === 'pre-planned' ? 'Joined pre-planned trip' : 'Created own trip'}
                      </div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${getTripTypeColor(booking.tripType)}`}>
                        {getTripTypeLabel(booking.tripType)}
                      </span>
                      <div className="text-sm text-gray-900">{booking.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {booking.pickupLocation} → {booking.dropoffLocation}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{booking.vehicle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">{booking.duration}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{booking.amount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>


      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Booking Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
                    <p className="text-gray-900">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTripTypeColor(selectedBooking.tripType)}`}>
                      {getTripTypeLabel(selectedBooking.tripType)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
                    <p className="text-gray-900">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <p className="text-gray-900">{selectedBooking.duration}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <p className="text-2xl font-bold text-green-600">{selectedBooking.amount}</p>
                  </div>
                </div>
              </div>

              {/* Trip Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Description</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedBooking.description}</p>
              </div>

              {/* User Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                    <p className="text-gray-900">{selectedBooking.customer}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                    <p className="text-gray-900">
                      {selectedBooking.tripType === 'pre-planned' ? 'Joined pre-planned trip' : 'Created own trip'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedBooking.phone}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle & Trip Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle & Route Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                    <p className="text-gray-900">{selectedBooking.vehicle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <p className="text-gray-900">{selectedBooking.pickupLocation}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <p className="text-gray-900">{selectedBooking.dropoffLocation}</p>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;