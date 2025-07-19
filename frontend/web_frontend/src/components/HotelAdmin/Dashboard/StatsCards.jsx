import React from 'react';
import {
  MdMeetingRoom,
  MdBookOnline,
  MdAttachMoney,
  MdLogin,
} from 'react-icons/md';

const StatsIconCard = ({ label, value, Icon }) => (
  <div className="flex items-center gap-4 p-5 rounded-lg shadow bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-md transition">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/70">
      <Icon className="text-3xl text-yellow-500" />
    </div>
    <div>
      <h3 className="text-gray-500 text-xs font-medium tracking-wider">
        {label}
      </h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const StatsCards = ({ dashboardData }) => {
  const stats = [
    {
      label: 'AVAILABLE ROOMS',
      value: dashboardData.availableRooms,
      Icon: MdMeetingRoom,
    },
    {
      label: 'TOTAL BOOKINGS',
      value: dashboardData.totalBookings,
      Icon: MdBookOnline,
    },
    {
      label: 'TOTAL EARNINGS',
      value: `LKR ${dashboardData.earnings.toLocaleString()}`,
      Icon: MdAttachMoney,
    },
    {
      label: 'CHECK-INS TODAY',
      value: dashboardData.checkInsToday,
      Icon: MdLogin,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <StatsIconCard key={s.label} {...s} />
      ))}
    </div>
  );
};

export default StatsCards;
