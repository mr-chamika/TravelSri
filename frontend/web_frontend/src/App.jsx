import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/VehicleAdmin/Dashboard';
import Pagelayout from './pages/VehicleAdmin/Pagelayout';
import RegistrationRequests from './pages/VehicleAdmin/RegistrationRequests';
import VehicleManagement from './pages/VehicleAdmin/VehicleManagement';
import BookingManagement from './pages/VehicleAdmin/BookingManagement';
import AdminProfile from './pages/VehicleAdmin/AdminProfile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/VehicleAdmin" replace />} />

        {/* Wrap all /VehicleAdmin routes inside Pagelayout */}
        <Route path="/VehicleAdmin" element={<Pagelayout />}>
          <Route index element={<Dashboard />} />
          <Route path="RegistrationRequests" element={<RegistrationRequests />} />
          <Route path="VehicleManagement" element={<VehicleManagement />} />
          <Route path="BookingManagement" element={<BookingManagement />} />
          <Route path="AdminProfile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
