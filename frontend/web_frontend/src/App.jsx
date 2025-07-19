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
import CreateTrip01 from "./pages/Admin/CreateTrip01";
import CreateTrip02 from "./pages/Admin/CreateTrip02";
import PendingTripDetails from "./pages/Admin/PendingTripDetails";
import AllHotelQuotation from "./pages/Admin/AllHotelQuotation";
import AllGuideQuotation from "./pages/Admin/AllGuideQuotation";
import AllVehicleQuotation from "./pages/Admin/AllVehicleQuotation";
import PendingTripDetails02 from "./pages/Admin/PendingTripDetails02";
import PendingTripDetails03 from "./pages/Admin/PendingTripDetails03";
import CreateTrip03 from "./pages/Admin/CreateTrip03";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;