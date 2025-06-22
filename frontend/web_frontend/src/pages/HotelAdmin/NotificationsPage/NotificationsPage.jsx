import React, { useState } from 'react';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  
  // Get current date in "Day of week, Month Day, Year" format
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Sample notification data
  const notifications = [
    {
      id: 1,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      roomNumber: '101',
      time: '2 hours ago',
      isRead: false,
      category: 'Message'
    },
    {
      id: 2,
      type: 'room_availability',
      title: 'Room Availability Changed',
      roomNumber: '202',
      time: '2 hours ago',
      isRead: false,
      category: 'Unread'
    },
    {
      id: 3,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      roomNumber: '303',
      time: '2 hours ago',
      isRead: false,
      category: 'Unread'
    },
    {
      id: 4,
      type: 'special_request',
      title: 'Special Request',
      roomNumber: '204',
      time: '2 hours ago',
      isRead: false,
      category: 'Message'
    },
    {
      id: 5,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      roomNumber: '101',
      time: '2 hours ago',
      isRead: false,
      category: 'Message'
    }
  ];
  
  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'ALL' 
    ? notifications 
    : notifications.filter(notification => notification.category === activeTab);

  // Mark notification as read
  const markAsRead = (id) => {
    console.log(`Marked notification ${id} as read`);
  };
  
  // View notification details
  const viewNotification = (id) => {
    console.log(`Viewing notification ${id}`);
  };
    // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="material-icons text-green-600 text-2xl">check_circle</span>
          </div>
        );
      case 'room_availability':
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="material-icons text-blue-500 text-2xl">meeting_room</span>
          </div>
        );
      case 'booking_cancelled':
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="material-icons text-red-600 text-2xl">cancel</span>
          </div>
        );
      case 'special_request':
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="material-icons text-gray-600 text-2xl">phone</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="material-icons text-gray-600 text-2xl">notifications</span>
          </div>
        );
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-gray-500">{currentDate}</p>
      </div>
      
      {/* Filter tabs */}
      <div className="inline-flex rounded-md shadow-sm mb-5">
        <button
          className={`px-4 py-2 text-sm font-medium border border-gray-200 ${activeTab === 'ALL' ? 'bg-yellow-400 text-black' : 'bg-white text-gray-700'} first:rounded-l-lg last:rounded-r-lg`}
          onClick={() => setActiveTab('ALL')}
        >
          ALL
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-200 ${activeTab === 'Unread' ? 'bg-yellow-400 text-black' : 'bg-white text-gray-700'} first:rounded-l-lg last:rounded-r-lg`}
          onClick={() => setActiveTab('Unread')}
        >
          Unread(2)
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-200 ${activeTab === 'Message' ? 'bg-yellow-400 text-black' : 'bg-white text-gray-700'} first:rounded-l-lg last:rounded-r-lg`}
          onClick={() => setActiveTab('Message')}
        >
          Messages(3)
        </button>
      </div>
      
      {/* Filter button */}
      <div className="flex justify-end mb-4">
        <button className="flex items-center px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
          <span className="material-icons text-sm">filter_list</span>
          <span className="ml-1">Filter</span>
        </button>
      </div>
      
      {/* Notifications list */}
      <div className="space-y-4">
        {filteredNotifications.map(notification => (
          <div key={notification.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
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
                <div className="mt-3 flex space-x-2">
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
                  >
                    Mark As Read
                  </button>
                  <button 
                    onClick={() => viewNotification(notification.id)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
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