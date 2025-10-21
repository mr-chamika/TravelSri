import React, { useState, useEffect } from "react";
import axios from "axios";

const CancelTrip = () => {
  const [reason, setReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api/upcomingTrip";

  // Load trip data when component mounts
  useEffect(() => {
    const tripId = localStorage.getItem('tripToCancelId');
    const storedTripData = localStorage.getItem('tripToCancelData');
    
    if (storedTripData) {
      try {
        const parsedTripData = JSON.parse(storedTripData);
        setTripData(parsedTripData);
      } catch (error) {
        console.error("Error parsing trip data:", error);
        alert("Error loading trip data. Please try again.");
        window.location.href = "/allupcomingtrips";
      }
    } else {
      alert("No trip selected for cancellation.");
      window.location.href = "/allupcomingtrips";
    }
  }, []);

  const handleDelete = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for cancelling the trip.");
      return;
    }

    if (!tripData) {
      alert("Trip data not found. Please try again.");
      return;
    }

    try {
      setLoading(true);
      
      console.log("=== CANCELLING TRIP ===");
      console.log("Trip ID:", tripData.id);
      console.log("Reason:", reason);

      // Make API call to cancel the trip
      const response = await axios.patch(`${API_BASE_URL}/cancel/${tripData.id}`, null, {
        params: { reason: reason.trim() },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Trip cancelled successfully:", response.data);

      // Update localStorage with the cancelled trip data
      localStorage.setItem('selectedUpcomingTrip', JSON.stringify(response.data));
      
      // Clear the cancellation data
      localStorage.removeItem('tripToCancelId');
      localStorage.removeItem('tripToCancelData');

      // Show success message
      setShowSuccess(true);
      
      // Redirect after showing success
      setTimeout(() => {
        window.location.href = "/upcomingtripdetails";
      }, 2000); // Show success for 2 seconds then redirect

    } catch (error) {
      console.error("Error cancelling trip:", error);
      
      if (error.response?.status === 404) {
        alert("Trip not found. It may have already been cancelled or deleted.");
      } else if (error.response?.status === 400) {
        alert("Invalid request. Please check the trip details and try again.");
      } else if (error.response?.status === 500) {
        alert("Server error occurred while cancelling the trip. Please try again later.");
      } else {
        alert("Failed to cancel trip. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    // Clear the cancellation data and go back
    localStorage.removeItem('tripToCancelId');
    localStorage.removeItem('tripToCancelData');
    window.location.href = "/upcomingtripdetails";
  };

  if (!tripData) {
    return (
      <div className="flex-1 bg-gray-100 min-h-screen py-8 px-2 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <span className="text-gray-600">Loading trip data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 min-h-screen py-8 px-2 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-3xl min-h-[500px] p-6 md:p-12 flex flex-col items-center justify-center">
        {showSuccess ? (
          <div className="bg-gray-200 rounded-2xl w-full max-w-2xl p-16 flex flex-col items-center justify-center">
            <div className="bg-blue-500 rounded-full w-24 h-24 flex items-center justify-center mb-6">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#3B82F6"/>
                <path d="M16 25l6 6 10-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-2xl md:text-2xl font-semibold text-gray-700 text-center">
              Successfully cancelled the trip
            </div>
            <div className="text-sm text-gray-500 text-center mt-2">
              Redirecting to trip details...
            </div>
          </div>
        ) : (
          <div className="bg-gray-200 rounded-2xl w-full max-w-2xl p-8 flex flex-col items-center">
            <div className="font-bold text-3xl md:text-4xl text-gray-800 mb-2 text-center">
              Cancel Trip
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-2 text-center">
              Are you sure you want to cancel <span className="font-bold text-black">"{tripData.title || 'this trip'}" ?</span>
            </div>
            <div className="text-sm text-gray-600 mb-6 text-center">
              Trip ID: {tripData.id} | Group Size: {tripData.groupSize || tripData.numberOfSeats}
            </div>

            {/* Warning */}
            <div className="w-full mb-6">
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-center">
                <span className="mr-2 text-2xl">⚠️</span>
                <div>
                  <span className="font-bold">Warning</span>
                  <div className="text-sm mt-1">
                    By cancelling this trip, the trip status will be changed to "Cancelled" and the allocated hotel, vehicle and guide will be notified. Admin must provide a reason for cancellation.
                  </div>
                </div>
              </div>
            </div>

            {/* Reason Input */}
            <textarea
              className="w-full bg-[#f5e7df] rounded-lg p-4 text-lg text-gray-700 mb-8 outline-none border-none resize-none placeholder-gray-500"
              rows={3}
              placeholder="Please provide the reason for cancelling this trip..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              disabled={loading}
            />

            {/* Buttons */}
            <div className="flex w-full justify-between mt-2">
              <button
                className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded px-6 py-2 transition-colors duration-200 cursor-pointer disabled:opacity-50"
                onClick={handleGoBack}
                disabled={loading}
              >
                No, Go Back
              </button>
              <button
                className="bg-red-400 hover:bg-red-600 text-white font-semibold rounded px-6 py-2 transition-colors duration-200 cursor-pointer disabled:opacity-50 flex items-center"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel Trip"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelTrip;