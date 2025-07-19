import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';
//import './App.css';
import Login from './pages/Login/Login';
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from './pages/Admin/DashboardPage';
import AllHotelRequests from './pages/Admin/AllHotelRequests';
import AllVehicleRequests from './pages/Admin/AllVehicleRequests';
import AllGuidesRequests from './pages/Admin/AllGuidesRequests';
import AllUpcomingTrips from "./pages/Admin/AllUpcomingTrip";
import AllPendingTrip from "./pages/Admin/AllPendingTrip";
import UpcomingTripDetails from "./pages/Admin/UpcomingTripDetails";
import UpcomingTripParticipants from "./pages/Admin/UpcomingTripParticipants";
import UpcomingTripPayment from "./pages/Admin/UpcomingTripPayment";
import CancelTrip from "./pages/Admin/CancelTrip";
import CreateTrip01 from "./pages/Admin/CreateTrip01";
import CreateTrip02 from "./pages/Admin/CreateTrip02";
import PendingTripDetails from "./pages/Admin/PendingTripDetails";
import AllHotelQuotation from "./pages/Admin/AllHotelQuotation";
import AllGuideQuotation from "./pages/Admin/AllGuideQuotation";
import AllVehicleQuotation from "./pages/Admin/AllVehicleQuotation";
import PendingTripDetails02 from "./pages/Admin/PendingTripDetails02";
import PendingTripDetails03 from "./pages/Admin/PendingTripDetails03";
import CreateTrip03 from "./pages/Admin/CreateTrip03";
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
    <Router>      
      <div className="app">
        <Routes>
          {/* Login route without AdminLayout */}
          <Route 
            path="/" 
            element={<Login />}
          />
          
          {/* Admin routes with AdminLayout */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            }
          />
          <Route
            path="/allhotelrequests"
            element={
              <AdminLayout>
                <AllHotelRequests/>
              </AdminLayout>
            }
          />
          <Route
            path="/allvehiclerequests"
            element={
              <AdminLayout>
                <AllVehicleRequests/>
              </AdminLayout>
            }
          />
          <Route
            path="/allguiderequests"
            element={
              <AdminLayout>
                <AllGuidesRequests/>
              </AdminLayout>
            }
          />
          <Route
            path="/allupcomingtrips"
            element={
              <AdminLayout>
                <AllUpcomingTrips/>
              </AdminLayout>
            }
          />
          <Route
            path="/allpendingtrips"
            element={
              <AdminLayout>
                <AllPendingTrip/>
              </AdminLayout>
            }
          />
          <Route
            path="/upcomingtripdetails"
            element={
              <AdminLayout>
                <UpcomingTripDetails/>
              </AdminLayout>
            }
          />
          <Route
            path="/upcomingtripparticipants"
            element={
              <AdminLayout>
                <UpcomingTripParticipants/>
              </AdminLayout>
            }
          />
          <Route
            path="/upcomingtrippayment"
            element={
              <AdminLayout>
                <UpcomingTripPayment/>
              </AdminLayout>
            }
          />
          <Route
            path="/canceltrip"
            element={
              <AdminLayout>
                <CancelTrip/>
              </AdminLayout>
            }
          />
          <Route
            path="/createtrip01"
            element={
              <AdminLayout>
                <CreateTrip01/>
              </AdminLayout>
            }
          />
          <Route
            path="/createtrip02"
            element={
              <AdminLayout>
                <CreateTrip02/>
              </AdminLayout>
            }
          />
          <Route
            path="/createtrip03"
            element={
              <AdminLayout>
                <CreateTrip03/>
              </AdminLayout>
            }
          />
          <Route
            path="/pendingtripdetails"
            element={
              <AdminLayout>
                <PendingTripDetails/>
              </AdminLayout>
            }
          />
          <Route
            path="/pendingtripdetails02"
            element={
              <AdminLayout>
                <PendingTripDetails02/>
              </AdminLayout>
            }
          />
          <Route
            path="/pendingtripdetails03"
            element={
              <AdminLayout>
                <PendingTripDetails03 />
              </AdminLayout>
            }
          />
          <Route
            path="/allhotelquotation"
            element={
              <AdminLayout>
                <AllHotelQuotation/>
              </AdminLayout>
            }
          />
          <Route
            path="/allguidequotation"
            element={
              <AdminLayout>
                <AllGuideQuotation/>
              </AdminLayout>
            }
          />
          <Route
            path="/allvehiclequotation"
            element={
              <AdminLayout>
                <AllVehicleQuotation/>
              </AdminLayout>
            }
          />
          
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
      
    </Router>

  );
}

export default App;