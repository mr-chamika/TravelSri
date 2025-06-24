import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  MdChevronLeft,
  MdChevronRight,
  MdArrowForward,
  MdEdit,
  MdDelete,
  MdHotel,
  MdEventNote,
  MdAttachMoney,
  MdStars
} from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SystemAdminDashboard = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [chartView, setChartView] = useState('monthly'); // 'monthly' or 'revenue'

  const stats = [
    { 
      label: 'Total Hotels', 
      value: 240, 
      icon: <MdHotel className="text-3xl text-yellow-500" />,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
    },
    { 
      label: 'Bookings', 
      value: 1200, 
      icon: <MdEventNote className="text-3xl text-yellow-500" />,
      bgColor: 'bg-gradient-to-br from-yello-50 to-yellow-100'
    },
    { 
      label: 'Revenue', 
      value: '$75,000', 
      icon: <MdAttachMoney className="text-3xl text-yellow-500" />,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
    },
    { 
      label: 'Top Revenue Property', 
      value: 'The Grand Hotel',
      icon: <MdStars className="text-3xl text-yellow-500" />,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
    }
  ];

  const hotelData = [
    {
      id: 1,
      name: 'The Grand Hotel',
      location: 'New York, USA',
      status: 'Active',
      manager: 'John Doe',
    },
    {
      id: 2,
      name: 'Seaside Resort',
      location: 'California, USA',
      status: 'Pending',
      manager: 'Jane Smith',
    },
    {
      id: 3,
      name: 'Mountain Lodge',
      location: 'Denver, USA',
      status: 'Active',
      manager: 'Robert Johnson',
    },
    {
      id: 4,
      name: 'Palm Paradise',
      location: 'Miami, USA',
      status: 'Active',
      manager: 'Emily Williams',
    },
  ];

  // Hotel Revenue Data
  const hotelRevenue = [
    { hotel: 'The Grand Hotel', revenue: 25000 },
    { hotel: 'Seaside Resort', revenue: 18500 },
    { hotel: 'Mountain Lodge', revenue: 15000 },
    { hotel: 'City Center', revenue: 22000 },
    { hotel: 'Palm Paradise', revenue: 19500 }
  ];

  // Chart Data based on selected view
  const getChartData = () => {
    if (chartView === 'monthly') {
      return {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Occupancy Rate (%)',
            data: [78, 62, 75, 42, 89, 78, 80, 82, 90, 85],
            backgroundColor: 'yellow',
            borderRadius: 5,
          },
        ],
      };
    } else {
      // Sort hotels by revenue in descending order
      const sortedHotelData = [...hotelRevenue].sort((a, b) => b.revenue - a.revenue);
      
      return {
        labels: sortedHotelData.map(item => item.hotel),
        datasets: [
          {
            label: 'Revenue ($)',
            data: sortedHotelData.map(item => item.revenue),
            backgroundColor: 'yellow',
            borderRadius: 5,
          },
        ],
      };
    }
  };

  // Chart Options based on selected view
  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: 'gray',
            font: { weight: 'bold' },
          },
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (chartView === 'monthly') {
                label += context.parsed.y + '%';
              } else {
                label += '$' + context.parsed.y.toLocaleString();
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    if (chartView === 'monthly') {
      baseOptions.scales.y.max = 100;
      baseOptions.scales.y.ticks = {
        callback: (value) => `${value}%`,
      };
    } else {
      baseOptions.scales.y.ticks = {
        callback: (value) => `$${value / 1000}k`,
      };
    }

    return baseOptions;
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const paddedDays = Array.from({ length: firstDayOfMonth }, () => null);
  const days = [...paddedDays, ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Helper function to get status badge style
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // State for managing hotel detail modal
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to open hotel details modal
  const openHotelDetails = (hotel) => {
    setSelectedHotel(hotel);
    setShowModal(true);
  };

  // Function to close hotel details modal
  const closeModal = () => {
    setShowModal(false);
  };

  // More detailed hotel data (could be fetched from API)
  const extendedHotelData = {
    1: {
      description: 'A luxury hotel in the heart of New York, offering premium amenities and excellent service.',
      address: '123 Fifth Avenue, New York, NY 10001',
      contactNumber: '+1 (212) 555-1234',
      email: 'info@grandhotel.com',
      website: 'www.thegrandhotel.com',
      totalRooms: 120,
      amenities: ['Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service', 'Free Wi-Fi'],
      roomTypes: ['Standard', 'Deluxe', 'Suite', 'Presidential Suite'],
      rating: 4.8,
      joinedDate: '2022-05-15',
      revenue: {
        lastMonth: '$28,500',
        year: '$342,000'
      }
    },
    2: {
      description: 'Beautiful beachfront resort with scenic ocean views and luxury accommodations.',
      address: '456 Ocean Drive, Santa Monica, CA 90401',
      contactNumber: '+1 (310) 555-6789',
      email: 'bookings@seasideresort.com',
      website: 'www.seasideresort.com',
      totalRooms: 85,
      amenities: ['Private Beach', 'Infinity Pool', 'Spa', 'Water Sports', 'Beachfront Dining', 'Free Wi-Fi'],
      roomTypes: ['Garden View', 'Ocean View', 'Beach Cottage', 'Presidential Villa'],
      rating: 4.5,
      joinedDate: '2022-07-22',
      revenue: {
        lastMonth: '$22,800',
        year: '$274,500'
      }
    },
    3: {
      description: 'Cozy mountain retreat offering spectacular views and outdoor activities all year round.',
      address: '789 Mountain Pass, Denver, CO 80202',
      contactNumber: '+1 (720) 555-4321',
      email: 'stay@mountainlodge.com',
      website: 'www.mountainlodge.com',
      totalRooms: 42,
      amenities: ['Fireplace', 'Hiking Trails', 'Ski Storage', 'Restaurant', 'Hot Tub', 'Free Wi-Fi'],
      roomTypes: ['Standard Room', 'Suite', 'Cabin', 'Family Lodge'],
      rating: 4.7,
      joinedDate: '2022-08-10',
      revenue: {
        lastMonth: '$18,900',
        year: '$227,000'
      }
    },
    4: {
      description: 'Tropical paradise resort with lush gardens and easy access to the beach.',
      address: '101 Palm Avenue, Miami Beach, FL 33139',
      contactNumber: '+1 (305) 555-9876',
      email: 'reservations@palmparadise.com',
      website: 'www.palmparadise.com',
      totalRooms: 95,
      amenities: ['Outdoor Pool', 'Tropical Garden', 'Beach Access', 'Spa', 'Restaurant', 'Free Wi-Fi'],
      roomTypes: ['Garden View', 'Pool View', 'Ocean View', 'Luxury Suite'],
      rating: 4.6,
      joinedDate: '2022-06-15',
      revenue: {
        lastMonth: '$26,400',
        year: '$317,000'
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">System Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`rounded-lg shadow overflow-hidden ${stat.bgColor}`}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-600 text-sm font-medium">{stat.label}</h2>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="p-2 rounded-full bg-white bg-opacity-80 shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-yellow-400"></div>
          </div>
        ))}
      </div>

      {/* Chart + Calendar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {chartView === 'monthly' ? 'Monthly Booking Trends' : 'Hotel Revenue Overview'}
            </h2>
            <div className="flex gap-4">
              <button 
                className={`${chartView === 'monthly' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'} font-medium px-4 py-1 rounded transition-colors`}
                onClick={() => setChartView('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`${chartView === 'revenue' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'} font-medium px-4 py-1 rounded transition-colors`}
                onClick={() => setChartView('revenue')}
              >
                Revenue
              </button>
            </div>
          </div>
          <Bar data={getChartData()} options={getChartOptions()} />
        </div>

        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow-sm w-full lg:w-80">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth}>
              <MdChevronLeft className="text-2xl text-gray-600 hover:text-gray-800" />
            </button>
            <h2 className="text-lg font-medium text-gray-800">
              {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
            </h2>
            <button onClick={handleNextMonth}>
              <MdChevronRight className="text-2xl text-gray-600 hover:text-gray-800" />
            </button>
          </div>
          <div className="grid grid-cols-7 text-sm text-center text-gray-700 gap-y-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="font-semibold">{day}</div>
            ))}
            {days.map((day, index) => {
              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();
              return (
                <div
                  key={index}
                  className={`h-8 w-8 mx-auto mb-1 flex items-center justify-center rounded-full text-sm
                    ${isToday ? 'bg-yellow-400 text-black font-bold' : 'text-gray-800'}
                    ${day === null ? '' : 'hover:bg-gray-200 cursor-pointer'}
                  `}
                >
                  {day !== null ? day : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Hotels */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Recent Hotels</h2>
          <button className="text-yellow-500 hover:text-yellow-600 flex items-center text-sm font-medium">
            View All <MdArrowForward className="ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Name</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hotelData.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{hotel.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{hotel.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(hotel.status)}`}>
                      {hotel.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{hotel.manager}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button 
                      className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors p-1.5 rounded-full"
                      title="View hotel details"
                      onClick={() => openHotelDetails(hotel)}
                    >
                      <MdArrowForward />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hotel Detail Modal */}
      {showModal && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">{selectedHotel.name}</h2>
              <button 
                onClick={closeModal} 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              {/* Hotel Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Hotel Information</h3>
                    <p className="text-gray-600">
                      {extendedHotelData[selectedHotel.id].description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700">Address</h4>
                      <p className="text-gray-600">{extendedHotelData[selectedHotel.id].address}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700">Contact</h4>
                      <p className="text-gray-600">{extendedHotelData[selectedHotel.id].contactNumber}</p>
                      <p className="text-gray-600">{extendedHotelData[selectedHotel.id].email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Amenities</h4>
                    <div className="flex flex-wrap mt-1">
                      {extendedHotelData[selectedHotel.id].amenities.map((amenity, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs mr-2 mb-2">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Room Types</h4>
                    <div className="flex flex-wrap mt-1">
                      {extendedHotelData[selectedHotel.id].roomTypes.map((roomType, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs mr-2 mb-2">
                          {roomType}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Stats & Manager */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Hotel Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(selectedHotel.status)}`}>{selectedHotel.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rooms:</span>
                        <span className="font-medium">{extendedHotelData[selectedHotel.id].totalRooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-medium">{extendedHotelData[selectedHotel.id].rating}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joined:</span>
                        <span className="font-medium">{new Date(extendedHotelData[selectedHotel.id].joinedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Revenue</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Month:</span>
                        <span className="font-medium text-green-600">{extendedHotelData[selectedHotel.id].revenue.lastMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">This Year:</span>
                        <span className="font-medium text-green-600">{extendedHotelData[selectedHotel.id].revenue.year}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Manager</h4>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                        {selectedHotel.manager.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{selectedHotel.manager}</p>
                        <p className="text-sm text-gray-500">Hotel Manager</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2"
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
                onClick={() => {
                  // Here would go navigation to the full hotel details page
                  closeModal();
                  console.log(`Navigate to full details for hotel ${selectedHotel.id}`);
                }}
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminDashboard;
