import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
//import './App.css';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

// Hotel Admin components
const HotelAdmin = lazy(() => import('./pages/HotelAdmin/HotelAdmin'));
const HotelDashboard = lazy(() => import('./pages/HotelAdmin/HotelDashboard/HotelDashboard'));
const RoomManagement = lazy(() => import('./pages/HotelAdmin/RoomManagement/RoomManagement'));
const BookingsManagement = lazy(() => import('./pages/HotelAdmin/BookingsManagement/BookingsManagement'));
const NotificationsPage = lazy(() => import('./pages/HotelAdmin/NotificationsPage/NotificationsPage'));
const EarningsPage = lazy(() => import('./pages/HotelAdmin/EarningsPage/EarningsPage'));
const FeedbackPage = lazy(() => import('./pages/HotelAdmin/FeedbackPage/FeedbackPage'));
const ProfilePage = lazy(() => import('./pages/HotelAdmin/ProfilePage/ProfilePage'));

// System Hotels Managing Admin components
const SystemAdmin = lazy(() => import('./pages/SystemHotelsManagingAdmin/SystemAdmin'));
const SystemAdminDashboard = lazy(() => import('./pages/SystemHotelsManagingAdmin/SystemAdminDashboard'));
const Properties = lazy(() => import('./pages/SystemHotelsManagingAdmin/Properties'));
const RegistrationRequests = lazy(() => import('./pages/SystemHotelsManagingAdmin/RegistrationRequests'));
const QuatationRequests = lazy(() => import('./pages/SystemHotelsManagingAdmin/QuatationRequests'));
const CommisionRevenue = lazy(() => import('./pages/SystemHotelsManagingAdmin/CommisionRevenue'));
const AdminProfile = lazy(() => import('./pages/SystemHotelsManagingAdmin/AdminProfile'));

function App() {
  return (
    <BrowserRouter>      
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* System Hotels Managing Admin Routes */}
          <Route path="/system-admin" element={
            <Suspense fallback={<div className="flex justify-center items-center h-screen ">Loading...</div>}>
              <SystemAdmin />
            </Suspense>
          }>
            <Route index element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <SystemAdminDashboard />
              </Suspense>
            } />
            <Route path="dashboard" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <SystemAdminDashboard />
              </Suspense>
            } />
            <Route path="properties" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <Properties />
              </Suspense>
            } />
            <Route path="registration-requests" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <RegistrationRequests />
              </Suspense>
            } />
            <Route path="quatation-requests" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <QuatationRequests />
              </Suspense>
            } />
            <Route path="commision-revenue" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <CommisionRevenue />
              </Suspense>
            } />
            <Route path="admin-profile" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <AdminProfile />
              </Suspense>
            } />
          </Route>
          
          {/* Hotel Admin Routes */}
          <Route path="/hotel" element={
            <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
              <HotelAdmin />
            </Suspense>
          }>
            <Route index element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <HotelDashboard />
              </Suspense>
            } />
            <Route path="dashboard" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <HotelDashboard />
              </Suspense>
            } />            <Route path="rooms" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <RoomManagement />
              </Suspense>
            } />
            <Route path="bookings" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <BookingsManagement />
              </Suspense>
            } />            <Route path="notifications" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <NotificationsPage />
              </Suspense>
            } />            <Route path="earnings" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <EarningsPage />
              </Suspense>
            } />
            <Route path="feedback" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <FeedbackPage />
              </Suspense>
            } />
            <Route path="profile" element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                <ProfilePage />
              </Suspense>
            } />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;