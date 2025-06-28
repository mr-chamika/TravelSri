import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <div className="app">
        <AdminLayout>
          <Routes>
            <Route 
              path="/" 
              element={
              <Login />
              }
           />
            <Route
              path="/admin"
              element={
                <DashboardPage />
              }
            />
            <Route
              path="/allhotelrequests"
              element={
                <AllHotelRequests/>
              }
            />
            <Route
              path="/allvehiclerequests"
              element={
                <AllVehicleRequests/>
              }
            />
            <Route
              path="/allguiderequests"
              element={
                <AllGuidesRequests/>
              }
            />
            <Route
              path="/allupcomingtrips"
              element={
                <AllUpcomingTrips/>
              }
            />
            <Route
              path="/allpendingtrips"
              element={
                <AllPendingTrip/>
              }
            />
            <Route
              path="/upcomingtripdetails"
              element={
                <UpcomingTripDetails/>
              }
            />
            <Route
              path="/upcomingtripparticipants"
              element={
                <UpcomingTripParticipants/>
              }
            />
            <Route
              path="/upcomingtrippayment"
              element={
                <UpcomingTripPayment/>
              }
            />
            <Route
              path="/canceltrip"
              element={
                <CancelTrip/>
              }
            />
          </Routes>
        </AdminLayout>
      </div>
    </Router>
  );
}

export default App;