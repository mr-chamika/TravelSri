import React, { useState } from 'react';

const BookingsManagement = () => {
  // Sample bookings data
  const [bookings, setBookings] = useState([
    {
      id: 1, 
      guestName: 'John Smith', 
      roomType: 'Deluxe Room', 
      roomNumber: '101',
      checkIn: '2025-06-12', 
      checkOut: '2025-06-15', 
      status: 'Confirmed',
      paymentStatus: 'Paid',
      totalAmount: 450
    },
    {
      id: 2, 
      guestName: 'Sarah Johnson', 
      roomType: 'Suite', 
      roomNumber: '103',
      checkIn: '2025-06-23', 
      checkOut: '2025-06-26', 
      status: 'Pending',
      paymentStatus: 'Pending',
      totalAmount: 750
    },
    {
      id: 3, 
      guestName: 'Michael Brown', 
      roomType: 'Standard Room', 
      roomNumber: '105',
      checkIn: '2025-06-17', 
      checkOut: '2025-06-19', 
      status: 'Confirmed',
      paymentStatus: 'Paid',
      totalAmount: 240
    },
    {
      id: 4, 
      guestName: 'Emily Davis', 
      roomType: 'Deluxe Room', 
      roomNumber: '201',
      checkIn: '2025-06-18', 
      checkOut: '2025-06-20', 
      status: 'Cancelled',
      paymentStatus: 'Refunded',
      totalAmount: 300
    },
    {
      id: 5, 
      guestName: 'James Wilson', 
      roomType: 'Suite', 
      roomNumber: '202',
      checkIn: '2025-06-20', 
      checkOut: '2025-06-22', 
      status: 'Confirmed',
      paymentStatus: 'Paid',
      totalAmount: 1250
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('All');

  // Filter bookings by status
  const filteredBookings = filterStatus === 'All' 
    ? bookings 
    : bookings.filter(booking => booking.status === filterStatus);
  
  // Format date from YYYY-MM-DD to more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-6">      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bookings Management</h2>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md flex items-center">
          <span className="material-icons mr-2">add</span> New Booking
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex mb-6">
        {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
          <button
            key={status}
            className={`mr-4 px-4 py-2 rounded-md ${filterStatus === status ? 'bg-yellow-500 text-black' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="py-3 px-4 whitespace-nowrap">#{booking.id}</td>
                <td className="py-3 px-4 whitespace-nowrap">{booking.guestName}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {booking.roomType} ({booking.roomNumber})
                </td>
                <td className="py-3 px-4 whitespace-nowrap">{formatDate(booking.checkIn)}</td>
                <td className="py-3 px-4 whitespace-nowrap">{formatDate(booking.checkOut)}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span 
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : ''}
                      ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span 
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : ''}
                      ${booking.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${booking.paymentStatus === 'Refunded' ? 'bg-gray-100 text-gray-800' : ''}
                    `}
                  >
                    {booking.paymentStatus}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">${booking.totalAmount}</td>
                <td className="py-3 px-4 whitespace-nowrap">                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-yellow-600 hover:text-yellow-700">
                      <span className="material-icons">edit</span>
                    </button>
                    <button className="p-1 text-gray-600 hover:text-gray-800">
                      <span className="material-icons">visibility</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsManagement;