import React, { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Quick modal for “View”                                            */
/* ------------------------------------------------------------------ */
const ViewModal = ({ notification, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <header className="flex justify-between items-center px-5 py-3 border-b bg-gray-50">
        <h3 className="font-semibold text-lg">{notification.title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <span className="material-icons">close</span>
        </button>
      </header>
      <div className="p-5 space-y-2 text-sm">
        <p><strong>Room:</strong> {notification.roomNumber}</p>
        <p><strong>Received:</strong> {notification.time}</p>
        <p><strong>Status:</strong> {notification.isRead ? 'Read' : 'Unread'}</p>
        {/* put more content/details here if needed */}
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [selected, setSelected]  = useState(null);   // for View modal

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'booking_confirmed', title: 'Booking Confirmed',  roomNumber: '101', time: '2 hours ago', isRead: false, category: 'Message' },
    { id: 2, type: 'room_availability',  title: 'Room Availability Changed', roomNumber: '202', time: '2 hours ago', isRead: false, category: 'Unread' },
    { id: 3, type: 'booking_cancelled',  title: 'Booking Cancelled', roomNumber: '303', time: '2 hours ago', isRead: false, category: 'Unread' },
    { id: 4, type: 'special_request',    title: 'Special Request',   roomNumber: '204', time: '2 hours ago', isRead: false, category: 'Message' },
    { id: 5, type: 'booking_confirmed',  title: 'Booking Confirmed', roomNumber: '101', time: '3 days ago', isRead: true,  category: 'Message' },
  ]);

  /* ---------------- helpers ---------------- */
  const unread    = notifications.filter(n => !n.isRead);
  const messages  = notifications.filter(n => n.category === 'Message');
  const filtered  = activeTab === 'ALL'
      ? notifications
      : notifications.filter(n => (activeTab === 'Unread') ? !n.isRead : n.category === 'Message');

  const markAsRead = id => setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  const markAllRead = () => setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true })));

  const icon = (type) => {
    const cls = 'material-icons text-2xl';
    switch (type) {
      case 'booking_confirmed': return <span className={`${cls} text-green-600`}>check_circle</span>;
      case 'room_availability': return <span className={`${cls} text-blue-500`}>meeting_room</span>;
      case 'booking_cancelled': return <span className={`${cls} text-red-600`}>cancel</span>;
      case 'special_request':   return <span className={`${cls} text-gray-600`}>phone</span>;
      default:                  return <span className={`${cls} text-gray-600`}>notifications</span>;
    }
  };

  /* ---------------- style helper ---------------- */
  const tabBtn = (tab) =>
    `px-4 py-2 text-sm font-medium border border-gray-300 first:rounded-l-lg last:rounded-r-lg
     transition ${activeTab === tab ? 'bg-yellow-400 text-black' : 'bg-white text-gray-700 hover:bg-gray-100'}`;

  /* ---------------- render ---------------- */
  return (
    <div className="p-6 space-y-5">
      {/* header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <span className="text-gray-500">{today}</span>
      </header>

      {/* tab bar */}
      <div className="inline-flex rounded-md shadow-sm">
        <button className={tabBtn('ALL')}    onClick={() => setActiveTab('ALL')}>All ({notifications.length})</button>
        <button className={tabBtn('Unread')} onClick={() => setActiveTab('Unread')}>Unread ({unread.length})</button>
        <button className={tabBtn('Message')}onClick={() => setActiveTab('Message')}>Messages ({messages.length})</button>
      </div>

      {/* mark-all-as-read */}
      <div className="flex justify-end">
        {unread.length > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center px-3 py-1 text-xs border border-yellow-400 text-yellow-700 rounded hover:bg-yellow-50 transition"
          >
            <span className="material-icons text-sm mr-1">done_all</span>
            Mark all as read
          </button>
        )}
      </div>

      {/* list */}
      <div className="space-y-4">
        {filtered.map(n => (
          <div
            key={n.id}
            className={`p-4 rounded-lg border transition
              ${n.isRead ? 'bg-gray-100 border-gray-200' : 'bg-white border-yellow-400 shadow-md'}`}
          >
            <div className="flex items-start">
              <div className="mr-4 mt-1 w-8 h-8 flex items-center justify-center">
                {icon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{n.title}</h3>
                    <p className="text-sm text-gray-600">Room: {n.roomNumber}</p>
                  </div>
                  <span className="text-xs text-gray-500">{n.time}</span>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="px-3 py-1 text-xs border border-yellow-300 text-yellow-700 rounded hover:bg-yellow-100 transition"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => { markAsRead(n.id); setSelected(n); }}
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

      {/* view modal */}
      {selected && (
        <ViewModal
          notification={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
