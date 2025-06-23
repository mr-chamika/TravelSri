import React, { useState } from 'react';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('ALL');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'booking_confirmed', title: 'Booking Confirmed', roomNumber: '101', time: '2 hours ago', isRead: false, category: 'Message' },
    { id: 2, type: 'room_availability', title: 'Room Availability Changed', roomNumber: '202', time: '2 hours ago', isRead: false, category: 'Unread' },
    { id: 3, type: 'booking_cancelled', title: 'Booking Cancelled', roomNumber: '303', time: '2 hours ago', isRead: false, category: 'Unread' },
    { id: 4, type: 'special_request', title: 'Special Request', roomNumber: '204', time: '2 hours ago', isRead: false, category: 'Message' },
    { id: 5, type: 'booking_confirmed', title: 'Booking Confirmed', roomNumber: '101', time: '2 hours ago', isRead: true, category: 'Message' }
  ]);

  const filteredNotifications =
    activeTab === 'ALL'
      ? notifications
      : notifications.filter(notification => notification.category === activeTab);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
  };

  const viewNotification = (id) => {
    console.log(`Viewing notification ${id}`);
  };

  const getNotificationIcon = (type) => {
    const base = "material-icons text-2xl";
    switch (type) {
      case 'booking_confirmed':
        return <span className={`${base} text-green-600`}>check_circle</span>;
      case 'room_availability':
        return <span className={`${base} text-blue-500`}>meeting_room</span>;
      case 'booking_cancelled':
        return <span className={`${base} text-red-600`}>cancel</span>;
      case 'special_request':
        return <span className={`${base} text-gray-600`}>phone</span>;
      default:
        return <span className={`${base} text-gray-600`}>notifications</span>;
    }
  };

  const tabButtonStyle = (tab) =>
    `px-4 py-2 text-sm font-medium border border-gray-300 transition duration-150 ease-in-out 
    ${activeTab === tab ? 'bg-yellow-400 text-black' : 'bg-white text-gray-700 hover:bg-gray-100'}
    first:rounded-l-lg last:rounded-r-lg`;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-gray-500">{currentDate}</p>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-md shadow-sm mb-5">
        <button className={tabButtonStyle('ALL')} onClick={() => setActiveTab('ALL')}>ALL</button>
        <button className={tabButtonStyle('Unread')} onClick={() => setActiveTab('Unread')}>Unread (2)</button>
        <button className={tabButtonStyle('Message')} onClick={() => setActiveTab('Message')}>Messages (3)</button>
      </div>

      {/* Filter Button */}
      <div className="flex justify-end mb-4">
        <button className="flex items-center px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition">
          <span className="material-icons text-sm">filter_list</span>
          <span className="ml-1 text-sm">Filter</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map(notification => (
          <div
            key={notification.id}
            className={`
              p-4 rounded-lg border transition
              ${notification.isRead
                ? 'bg-gray-100 border-gray-200'
                : 'bg-white border-yellow-400 shadow-md'}
            `}
          >
            <div className="flex items-start">
              <div className="mr-4 mt-1 w-8 h-8 flex items-center justify-center">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-base">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">Room: {notification.roomNumber}</p>
                  </div>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-3 py-1 text-xs border border-yellow-300 text-yellow-700 rounded hover:bg-yellow-100 transition"
                    >
                      Mark As Read
                    </button>
                  )}
                  <button
                    onClick={() => viewNotification(notification.id)}
                    className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
