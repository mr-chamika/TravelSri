import React, { useState, useEffect } from "react";
import axios from "axios";

const AllPendingTrip = () => {
  const [pendingTrips, setPendingTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API base URL - adjust this to match your Spring Boot server
  const API_BASE_URL = "http://localhost:8080/api/pendingTrip";

  useEffect(() => {
    fetchPendingTrips();
  }, []);

  const fetchPendingTrips = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_BASE_URL}/getall`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setPendingTrips(response.data);
      console.log("Pending trips fetched successfully:", response.data);

    } catch (error) {
      console.error("Error fetching pending trips:", error);
      if (error.response) {
        setError(`Failed to fetch trips: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        setError("Unable to connect to server. Please check if the backend is running.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '/');
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  const handleViewTrip = (trip) => {
    // Store selected trip data for the details page
    localStorage.setItem('selectedTripForDetails', JSON.stringify(trip));
    window.location.href = "/pendingtripdetails";
  };

  const handleRefresh = () => {
    fetchPendingTrips();
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl min-h-[400px] p-4 md:p-8 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
          <p className="text-gray-600">Loading pending trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl min-h-[400px] p-4 md:p-8">
        {/* Header with Refresh Button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 md:mb-12">
          <div className="font-bold text-2xl md:text-4xl text-gray-800 mb-4 md:mb-0 text-left">
            All Pending Trips
          </div>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200 cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button
              onClick={handleRefresh}
              className="ml-4 underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Trips List */}
        <div className="flex flex-col gap-4 md:gap-6">
          {pendingTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending trips found</h3>
              <p className="text-gray-500 mb-4">Create your first trip to get started!</p>
              <a href="/createtrip01" className="inline-block">
                <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-6 py-2 transition-colors duration-200">
                  Create Trip
                </button>
              </a>
            </div>
          ) : (
            pendingTrips.map((trip, idx) => (
              <div
                key={trip.ptId || `trip-${idx}`}
                className="flex flex-col md:flex-row items-start md:items-center bg-gray-100 rounded-xl px-4 md:px-8 py-4 md:py-5 hover:bg-gray-200 transition-colors duration-200"
              >
                <div className="flex-1 w-full flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-base text-gray-800">
                      {trip.title || 'Untitled Trip'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(trip.date)}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      From {trip.startLocation} to {trip.endLocation} • {trip.numberOfSeats} seats
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleViewTrip(trip)}
                  className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-4 md:px-6 py-1 mt-3 md:mt-0 md:ml-6 transition-colors duration-200 cursor-pointer w-full md:w-auto"
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>

        {/* Trip Count */}
        {pendingTrips.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Total Pending Trips: {pendingTrips.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPendingTrip;