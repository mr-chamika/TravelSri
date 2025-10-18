import React from 'react';
import { Outlet } from 'react-router-dom';
import { useHotel } from '../contexts/HotelContext';
import toast, { Toaster } from 'react-hot-toast';

// A Sidebar component for the Hotel Admin
const HotelAdminSidebar = () => {
  const { hotel, loading } = useHotel();
  
  return (
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0 border-r border-gray-200 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <img src="/hotel-logo.svg" alt="Hotel Logo" className="h-10 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-center text-gray-800">
          {loading ? 'Loading...' : hotel?.hotelName || 'Hotel Admin'}
        </h2>
        <p className="text-xs text-center text-gray-500">
          {loading ? '' : hotel?.email || ''}
        </p>
      </div>
      
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          <li>
            <a 
              href="/hotel/dashboard" 
              className="flex items-center p-3 text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors"
            >
              <span className="material-icons mr-3 text-gray-500">dashboard</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a 
              href="/hotel/rooms" 
              className="flex items-center p-3 text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors"
            >
              <span className="material-icons mr-3 text-gray-500">hotel</span>
              <span>Room Management</span>
            </a>
          </li>
          <li>
            <a 
              href="/hotel/bookings" 
              className="flex items-center p-3 text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors"
            >
              <span className="material-icons mr-3 text-gray-500">calendar_today</span>
              <span>Bookings</span>
            </a>
          </li>
          <li>
            <a 
              href="/hotel/quotations" 
              className="flex items-center p-3 text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors"
            >
              <span className="material-icons mr-3 text-gray-500">receipt</span>
              <span>Quotation Requests</span>
            </a>
          </li>
          <li>
            <a 
              href="/hotel/earnings" 
              className="flex items-center p-3 text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors"
            >
              <span className="material-icons mr-3 text-gray-500">payments</span>
              <span>Earnings</span>
            </a>
          </li>
          <li>
            <a 
              href="/hotel/feedback" 
              className="flex items-center p-3 text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors"
            >
              <span className="material-icons mr-3 text-gray-500">reviews</span>
              <span>Feedback</span>
            </a>
          </li>
          <li>
            <a 
              href="/hotel/profile" 
              className="flex items-center p-3 text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors"
            >
              <span className="material-icons mr-3 text-gray-500">account_circle</span>
              <span>Profile</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button 
          onClick={() => {
            // Clear all authentication tokens and user data
            localStorage.removeItem('user');
            localStorage.removeItem('hotelAuthToken');
            localStorage.removeItem('hotelUserData');
            localStorage.removeItem('token');
            localStorage.removeItem('rememberedUser');
            window.location.href = '/login';
          }}
          className="flex items-center justify-center w-full p-2 text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span className="material-icons mr-2 text-gray-500">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// The top header for the hotel admin
const HotelAdminHeader = () => {
  const { hotel, loading } = useHotel();
  
  return (
    <header className="bg-white shadow-sm h-16 fixed top-0 left-64 right-0 z-10">
      <div className="h-full flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-gray-800">
          {loading ? 'Loading...' : `Welcome, ${hotel?.hotelName || 'Hotel Admin'}`}
        </h1>
        
        <div className="flex items-center space-x-4">
          <a 
            href="/hotel/notifications" 
            className="p-2 text-gray-500 hover:text-yellow-500 rounded-full relative"
          >
            <span className="material-icons">notifications</span>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              2
            </span>
          </a>
          
          <a 
            href="/hotel/profile" 
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <img 
                src="/profile.svg" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {loading ? 'Loading...' : hotel?.name || 'Admin'}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};

// The main layout component
const HotelAdminLayout = () => {
  const { loading, error } = useHotel();
  
  // Show loading state while fetching hotel profile
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Hotel Dashboard</h2>
          <p className="text-gray-500">Please wait while we load your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast container for notifications */}
      <Toaster position="top-right" />
      
      {/* Error banner if there's an error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 fixed top-0 right-0 left-0 z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons">error</span>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <HotelAdminSidebar />
      
      {/* Main content */}
      <div className="ml-64 pt-16">
        {/* Header */}
        <HotelAdminHeader />
        
        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HotelAdminLayout;
