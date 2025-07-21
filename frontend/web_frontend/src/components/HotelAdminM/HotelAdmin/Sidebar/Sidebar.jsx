import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ unreadCount = 0 }) => {
  /* ------------------------------------------------------------------
     Menu items — notice we inject the unreadCount for “Notifications”
  ------------------------------------------------------------------ */
  const menuItems = [
    { path: '/hotel/dashboard',  label: 'Dashboard',     icon: 'dashboard'      },
    { path: '/hotel/rooms',      label: 'Room Inventory',icon: 'inventory_2'    },
    { path: '/hotel/bookings',   label: 'Bookings',      icon: 'book_online'    },
    { path: '/hotel/quotations', label: 'Quotations',    icon: 'description'    },
    { path: '/hotel/notifications',
      label: 'Notifications',
      icon: 'notifications',
      badge: unreadCount },                                     // ⬅️ dynamic
    { path: '/hotel/earnings',   label: 'Earnings',      icon: 'attach_money'  },
    { path: '/hotel/feedback',   label: 'Feedback',      icon: 'rate_review'   },
    { path: '/hotel/profile',    label: 'Profile',       icon: 'person'        },
  ];

  return (
    <div className="w-60 bg-white h-screen shadow-md flex flex-col">
      {/* logo / title */}
      <div className="flex items-center p-4">
        <img src="/logo.png" alt="TravelSri Logo" className="w-8 h-8 mr-2" />
        <h1 className="text-xl font-bold">TravelSri</h1>
      </div>

      {/* nav links */}
      <nav className="flex flex-col mt-6 flex-1">
        {menuItems.map(({ path, label, icon, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center p-4 relative transition
               ${isActive ? 'bg-yellow-300 text-black' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <span className="material-icons mr-3">{icon}</span>
            <span className="flex-1">{label}</span>

            {/* badge */}
            {badge > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5
                               flex items-center justify-center rounded-full">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* logout */}
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
  