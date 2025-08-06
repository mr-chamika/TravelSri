import React from 'react';
import logo from '../../../assets/logo.png'

const Navbar = ({ toggleSidebar }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-1 py-3 flex items-center justify-between shadow-sm ">
      {/* Left side: Logo + TravelSri + Search */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="lg:hidden mr-2">
          <span className="material-icons">menu</span>
        </button>
        <img
          src={logo}// ✅ Correct usage from public/ folder
          alt="TravelSri Logo"
          className="h-8 w-8"
        />
        <span className="font-bold text-xl text-gray-800">TravelSri</span>
        <input
          type="search"
          placeholder="Search vehicles, bookings..."
          className="ml-4 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Center: Date */}
      <div className="hidden md:block text-gray-500 font-medium">
        {currentDate}
      </div>

      {/* Right side: Notifications + User Profile */}
      <div className="flex items-center space-x-6 mr-4">
        <button className="relative hover:bg-gray-100 p-2 rounded-full transition">
          <span className="material-icons text-gray-700">notifications</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            2
          </span>
        </button>

        {/* <button className="hover:bg-gray-100 p-2 rounded-full transition flex items-center space-x-2">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="User Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="hidden md:block text-gray-700 font-medium">
            System Hotel Managing Administrator
          </span>
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
