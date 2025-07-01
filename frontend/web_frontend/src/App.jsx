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
import AllVehileQuotation from "./pages/Admin/AllVehicleQuotation";
import AllGuideQuotation from "./pages/Admin/AllGuideQuotation";
import PendingTripDetails02 from "./pages/Admin/PendingTripDetails02";
import PendingTripDetails03 from "./pages/Admin/PendingTripDetails03";
// import CreateTrip03 from "./pages/Admin/CreateTrip03";

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
            <Route
              path="/createtrip01"
              element={
                <CreateTrip01/>
              }
            />
            <Route
              path="/createtrip02"
              element={
                <CreateTrip02/>
              }
            />
            {/* <Route
              path="/createtrip03"
              element={
                <CreateTrip03/>
              }
            /> */}
            <Route
              path="/pendingtripdetails"
              element={
                <PendingTripDetails/>
              }
            />
            <Route
              path="/pendingtripdetails02"
              element={
                <PendingTripDetails02/>
              }
            />
            <Route
              path="/pendingtripdetails03"
              element={
                <PendingTripDetails03/>
              }
            />
            <Route
              path="/allhotelquotation"
              element={
                <AllHotelQuotation/>
              }
            />
            <Route
              path="/allvehiclequotation"
              element={
                <AllVehileQuotation/>
              }
            />
            <Route
              path="/allguidequotation"
              element={
                <AllGuideQuotation/>
              }
            />
          </Routes>
        </AdminLayout>
      </div>
    </Router>
  );
}

export default App;