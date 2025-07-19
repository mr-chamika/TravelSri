import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/HotelAdmin/Sidebar/Sidebar';
import Navbar from '../../components/HotelAdmin/Navbar/Navbar';

const HotelAdmin = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar hotelName="Shangrila Hotel" />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HotelAdmin;