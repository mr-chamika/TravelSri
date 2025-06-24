import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/system-admin/dashboard' },
    { name: 'Properties', icon: 'apartment', path: '/system-admin/properties' },
    { name: 'Registration Requests', icon: 'how_to_reg', path: '/system-admin/registration-requests' },
    { name: 'Quatation Requests', icon: 'request_quote', path: '/system-admin/quatation-requests' },
    { name: 'Commision Revenue', icon: 'payments', path: '/system-admin/commision-revenue' },
    { name: 'Admin Profile', icon: 'person', path: '/system-admin/admin-profile' },
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-64 h-screen bg-black text-white transition-transform duration-300 ease-in-out flex flex-col`}>
      <div className="flex items-center p-4 mb-6">
        <button onClick={() => setIsOpen(false)} className="lg:hidden mr-2">
          <span className="material-icons">close</span>
        </button>
        <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
          <img 
            src="https://randomuser.me/api/portraits/men/75.jpg" 
            alt="Admin" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/100?text=Admin";
            }}
          />
        </div>
        <div className="ml-3">
          <h3 className="font-medium">System Hotel Admin</h3>
          <p className="text-xs text-gray-400">syshotelamin@email.com</p>
        </div>
      </div>
      
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path}
            className={`px-4 py-3 flex items-center transition-colors ${
              isActive(item.path) ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
          >
            <span className="material-icons mr-3">{item.icon}</span>
            {item.name}
            {item.name === 'Registration Requests' && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            )}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 mt-auto">
        <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-md font-medium transition">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
