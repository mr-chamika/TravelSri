import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';   // ⬅️ React-Router v6

const Navbar = ({ hotelName, notifications = [] }) => {
  const navigate = useNavigate();                // ⬅️ navigation helper
  const [showPopup, setShowPopup] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // unread notifications only
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  /* ---------- handlers ---------- */
  const togglePopup = () => setShowPopup((prev) => !prev);
  const goToNotifications = () => navigate('/hotel/notifications');
  const goToProfile       = () => navigate('/hotel/profile');

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm relative">
      <h1 className="text-2xl text-gray-500 font-light">
        Welcome {hotelName || 'Shangri-La Hotel'}
      </h1>

      <div className="flex items-center">
        {/* current date */}
        <div className="mr-6 text-gray-500">{currentDate}</div>

        {/* --------- Notification Icon --------- */}
        <div className="relative mr-6 cursor-pointer" onClick={togglePopup}>
          <span className="material-icons">notifications</span>
          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {unreadNotifications.length}
            </span>
          )}

          {/* popover */}
          {showPopup && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border rounded-md shadow-lg z-20">
              <div className="p-3 border-b font-semibold text-gray-700 flex justify-between">
                Unread Notifications
                <button
                  className="text-xs text-yellow-600"
                  onClick={goToNotifications}
                >
                  View all
                </button>
              </div>

              {unreadNotifications.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">
                  No unread messages.
                </div>
              ) : (
                unreadNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                    onClick={goToNotifications}
                  >
                    <div className="font-medium text-sm">{n.title}</div>
                    <div className="text-xs text-gray-500">
                      Room: {n.roomNumber}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* --------- Avatar --------- */}
        <div
          className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer relative group"
          onClick={goToProfile}
        >
          <img
            src="/profile.svg"
            alt="Profile"
            className="w-full h-full object-cover"
          />

          {/* dropdown (optional) — remove if you only need direct redirect */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={goToProfile}
            >
              Your Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => navigate('/hotel-settings')}
            >
              Hotel Settings
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {/* sign-out logic */}}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
