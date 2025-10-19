import React, { useState, useEffect } from "react";
import axios from "axios";

const AllUpcomingTrips = () => {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  const API_BASE_URL = "http://localhost:8080/api/upcomingTrip";

  useEffect(() => {
    fetchUpcomingTrips();
  }, []);

  useEffect(() => {
    filterTripsByStatus();
  }, [upcomingTrips, filterStatus]);

  const fetchUpcomingTrips = async () => {
    try {
      setLoading(true);
      console.log("=== FETCHING UPCOMING TRIPS ===");
      
      const response = await axios.get(`${API_BASE_URL}/getall`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Upcoming trips response:", response.data);
      setUpcomingTrips(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching upcoming trips:", error);
      
      if (error.response?.status === 404) {
        setError("No upcoming trips found.");
        setUpcomingTrips([]);
      } else if (error.response?.status === 500) {
        setError("Server error occurred while fetching upcoming trips.");
      } else {
        setError("Unable to fetch upcoming trips. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filterTripsByStatus = () => {
    if (filterStatus === "all") {
      setFilteredTrips(upcomingTrips);
    } else {
      const filtered = upcomingTrips.filter(trip => 
        trip.tripStatus?.toLowerCase() === filterStatus.toLowerCase()
      );
      setFilteredTrips(filtered);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    } catch (error) {
      return dateString;
    }
  };

  const calculateRemainingDays = (tripDate) => {
    if (!tripDate) return 0;
    try {
      const today = new Date();
      const trip = new Date(tripDate);
      const diffTime = trip - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch (error) {
      return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const handleViewTrip = (trip) => {
    // Store the selected trip ID in localStorage
    localStorage.setItem('selectedUpcomingTripId', trip.upcomingTripId);
    localStorage.setItem('selectedUpcomingTrip', JSON.stringify(trip));
    // Navigate to trip details page
    window.location.href = "/upcomingtripdetails";
  };

  const handleRefresh = () => {
    fetchUpcomingTrips();
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading upcoming trips...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Trips</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl min-h-[400px] p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
          <div className="font-bold text-2xl md:text-4xl text-gray-800 mb-4 md:mb-0">
            All Upcoming Trips ({filteredTrips.length})
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Trips List */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Upcoming Trips Found</h3>
            <p className="text-gray-500">
              {filterStatus === "all" 
                ? "There are no upcoming trips available at the moment." 
                : `No trips found with status "${filterStatus}".`
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:gap-6">
            {filteredTrips.map((trip, idx) => (
              <div
                key={trip.upcomingTripId || idx}
                className="flex flex-col md:flex-row items-start md:items-center bg-gray-100 rounded-xl px-4 md:px-8 py-4 md:py-5 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-1 w-full flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
                      <span className="font-medium text-base text-gray-800">
                        {trip.title || 'Untitled Trip'}
                      </span>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border w-fit ${getStatusColor(trip.tripStatus)}`}>
                        {trip.tripStatus || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-gray-500">
                      <span>{formatDate(trip.date)}</span>
                      <span>Route: {trip.startLocation} → {trip.endLocation}</span>
                      <span>Group Size: {trip.groupSize || trip.numberOfSeats || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 md:mt-0">
                    <span className="text-sm text-gray-700 md:text-right">
                      Remaining Days: {calculateRemainingDays(trip.date)}
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-auto mt-3 md:mt-0">
                  <button 
                    onClick={() => handleViewTrip(trip)}
                    className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-4 md:px-6 py-1 md:ml-6 transition-colors duration-200 cursor-pointer w-full md:w-auto"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUpcomingTrips;