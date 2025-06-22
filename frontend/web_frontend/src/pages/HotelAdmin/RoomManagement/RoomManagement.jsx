import React, { useState } from 'react';

const RoomManagement = () => {
  // Sample room data
  const [rooms, setRooms] = useState([
    { id: 1, number: '101', type: 'Deluxe Room', status: 'Available', price: 150, capacity: 2 },
    { id: 2, number: '102', type: 'Standard Room', status: 'Occupied', price: 120, capacity: 2 },
    { id: 3, number: '103', type: 'Suite', status: 'Available', price: 250, capacity: 4 },
    { id: 4, number: '104', type: 'Deluxe Room', status: 'Maintenance', price: 150, capacity: 2 },
    { id: 5, number: '105', type: 'Standard Room', status: 'Available', price: 120, capacity: 2 },
    { id: 6, number: '201', type: 'Suite', status: 'Occupied', price: 250, capacity: 4 },
  ]);

  const [filterStatus, setFilterStatus] = useState('All');

  // Filter rooms by status
  const filteredRooms = filterStatus === 'All' 
    ? rooms 
    : rooms.filter(room => room.status === filterStatus);

  return (
    <div className="p-6">      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Room Inventory</h2>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md flex items-center">
          <span className="material-icons mr-2">add</span> Add New Room
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex mb-6">
        {['All', 'Available', 'Occupied', 'Maintenance'].map((status) => (
          <button
            key={status}
            className={`mr-4 px-4 py-2 rounded-md ${filterStatus === status ? 'bg-yellow-500 text-black' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Room cards */}
      <div className="grid grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Room {room.number}</h3>
                <p className="text-gray-600">{room.type}</p>
              </div>
              <span 
                className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${room.status === 'Available' ? 'bg-green-100 text-green-800' : ''}
                  ${room.status === 'Occupied' ? 'bg-red-100 text-red-800' : ''}
                  ${room.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' : ''}
                `}
              >
                {room.status}
              </span>
            </div>
            
            <div className="flex items-center mb-4">
              <span className="material-icons text-gray-500 mr-2">person</span>
              <span>Capacity: {room.capacity} guests</span>
            </div>
            
            <div className="flex items-center mb-4">
              <span className="material-icons text-gray-500 mr-2">attach_money</span>
              <span>${room.price}/night</span>
            </div>
              <div className="flex space-x-2">
              <button className="flex-1 bg-yellow-50 text-yellow-700 py-2 rounded-md hover:bg-yellow-100">
                Edit
              </button>
              <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-md hover:bg-gray-100">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomManagement;