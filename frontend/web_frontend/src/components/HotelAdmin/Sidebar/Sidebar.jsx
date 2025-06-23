import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  // Menu items for the hotel admin sidebar
  const menuItems = [
    { path: '/hotel/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/hotel/rooms', label: 'Room Inventory', icon: 'inventory_2' },
    { path: '/hotel/bookings', label: 'Bookings', icon: 'book_online' },
    { path: '/hotel/notifications', label: 'Notifications', icon: 'notifications', badge: 5 },
    { path: '/hotel/earnings', label: 'Earnings', icon: 'attach_money' },
    { path: '/hotel/profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <div className="w-60 bg-white h-screen shadow-md flex flex-col">
      <div className="flex items-center p-4">
        <img src="/logo.svg" alt="TravelSri Logo" className="w-8 h-8 mr-2" />
        <h1 className="text-xl font-bold">TravelSri</h1>
      </div>

      <nav className="flex flex-col mt-6 flex-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-4 relative ${isActive ? 'bg-yellow-400 text-black' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <span className="material-icons mr-3">{item.icon}</span>
            <span className="flex-1">{item.label}</span>

            {/* Badge on the right side */}
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <NavLink to="/" className="flex items-center p-2 text-red-500 hover:bg-red-50 rounded">
          <span className="material-icons mr-3">logout</span>
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
