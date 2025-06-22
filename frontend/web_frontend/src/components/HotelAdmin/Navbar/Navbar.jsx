import React from 'react';

const Navbar = ({ hotelName }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm">
      <h1 className="text-2xl text-gray-500 font-light">Welcome {hotelName || 'Shangrila Hotel'}</h1>
      
      <div className="flex items-center">
        <div className="mr-6 text-gray-500">{currentDate}</div>
        <div className="mr-6 cursor-pointer relative">
          <span className="material-icons">notifications</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
        </div>        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer relative group">
          <img 
            src="/profile.svg" 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hotel Settings</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;