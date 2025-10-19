import React, { useState, useEffect } from "react";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from 'dayjs';

// Define suitable icons for each detail
const detailIcons = [
    // Hotel icon
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="8" width="16" height="10" rx="2" fill="#fff" />
        <rect x="7" y="11" width="2" height="2" rx="1" fill="#facc15" />
        <rect x="11" y="11" width="2" height="2" rx="1" fill="#facc15" />
        <rect x="15" y="11" width="2" height="2" rx="1" fill="#facc15" />
        <rect x="7" y="15" width="2" height="2" rx="1" fill="#facc15" />
        <rect x="11" y="15" width="2" height="2" rx="1" fill="#facc15" />
        <rect x="15" y="15" width="2" height="2" rx="1" fill="#facc15" />
        <rect x="9" y="4" width="6" height="4" rx="1" fill="#fff" />
    </svg>,
    // Vehicle icon
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="13" width="18" height="5" rx="2" fill="#fff" />
        <rect x="5" y="10" width="14" height="4" rx="1" fill="#fff" />
        <circle cx="7" cy="19" r="2" fill="#facc15" />
        <circle cx="17" cy="19" r="2" fill="#facc15" />
    </svg>,
    // Total slots icon (users)
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="8" cy="10" r="3" fill="#fff" />
        <circle cx="16" cy="10" r="3" fill="#fff" />
        <rect x="2" y="16" width="20" height="4" rx="2" fill="#fff" />
        <circle cx="8" cy="10" r="2" fill="#facc15" />
        <circle cx="16" cy="10" r="2" fill="#facc15" />
    </svg>,
    // Available slots icon (slot/seat)
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="5" y="7" width="14" height="10" rx="3" fill="#fff" />
        <rect x="9" y="11" width="6" height="2" rx="1" fill="#facc15" />
        <rect x="7" y="15" width="10" height="2" rx="1" fill="#facc15" />
    </svg>,
];

const UpcomingTripDetails = () => {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [calendarDate, setCalendarDate] = useState(null);

    const API_BASE_URL = "http://localhost:8080/api/upcomingTrip";

    useEffect(() => {
        fetchTripDetails();
    }, []);

    const fetchTripDetails = async () => {
        try {
            setLoading(true);
            
            // First try to get trip ID from localStorage
            const tripId = localStorage.getItem('selectedUpcomingTripId');
            
            if (!tripId) {
                // If no trip ID, try to get the trip data directly from localStorage
                const tripData = localStorage.getItem('selectedUpcomingTrip');
                if (tripData) {
                    const parsedTrip = JSON.parse(tripData);
                    setTrip(parsedTrip);
                    if (parsedTrip.date) {
                        setCalendarDate(dayjs(parsedTrip.date));
                    }
                    setLoading(false);
                    return;
                } else {
                    setError("No trip selected. Please go back and select a trip.");
                    setLoading(false);
                    return;
                }
            }

            console.log("=== FETCHING TRIP DETAILS ===");
            console.log("Trip ID:", tripId);

            const response = await axios.get(`${API_BASE_URL}/get/${tripId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Trip details response:", response.data);
            setTrip(response.data);
            setError("");

            // Set calendar date if available
            if (response.data.date) {
                setCalendarDate(dayjs(response.data.date));
            }

        } catch (error) {
            console.error("Error fetching trip details:", error);
            
            if (error.response?.status === 404) {
                setError("Trip not found.");
            } else if (error.response?.status === 500) {
                setError("Server error occurred while fetching trip details.");
            } else {
                setError("Unable to fetch trip details. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const calculateAvailableSlots = () => {
        if (!trip) return 0;
        const totalSlots = trip.numberOfSeats || trip.groupSize || 0;
        const filledSlots = trip.groupSize || 0;
        return Math.max(0, totalSlots - filledSlots);
    };

    const calculateFilledSlots = () => {
        return trip?.groupSize || 0;
    };

    const handleCancelTrip = async () => {
        if (!trip) return;
        
        const reason = prompt("Please enter the reason for cancellation:");
        if (!reason) return;

        try {
            const response = await axios.patch(`${API_BASE_URL}/cancel/${trip.upcomingTripId}`, null, {
                params: { reason },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            alert("Trip cancelled successfully!");
            setTrip(response.data);
        } catch (error) {
            console.error("Error cancelling trip:", error);
            alert("Failed to cancel trip. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex-1 bg-gray-100 min-h-screen py-2 px-1 flex justify-center items-center">
                <div className="bg-white rounded-3xl shadow-lg p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Loading trip details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 bg-gray-100 min-h-screen py-2 px-1 flex justify-center items-center">
                <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Trip</h3>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <a href="/allupcomingtrips" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                            Back to All Trips
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="flex-1 bg-gray-100 min-h-screen py-2 px-1 flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip Not Found</h2>
                    <p className="text-gray-600 mb-6">The selected trip details could not be loaded.</p>
                    <a href="/allupcomingtrips" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                        Back to All Trips
                    </a>
                </div>
            </div>
        );
    }

    // Create trip details array based on actual data
    const tripDetails = [
        {
            icon: "bg-blue-400", // Hotel: blue
            label: `Hotel: ${trip.selectedHotelId || trip.hotelContactPerson || 'Not Selected'}`,
            action: "view details →",
        },
        {
            icon: "bg-purple-400", // Vehicle: purple
            label: `Vehicle: ${trip.vehicleRegistrationNumber || trip.selectedVehicleId || 'Not Selected'}`,
            action: "view details →",
        },
        {
            icon: "bg-yellow-400", // Total Slots: yellow
            label: `Total Slots: ${trip.numberOfSeats || trip.groupSize || 0}`,
            action: "view details →",
        },
        {
            icon: "bg-red-400", // Available Slots: red
            label: `Available Slots: ${calculateAvailableSlots()}`,
            action: "view details →",
        },
    ];

    return (
        <div className="flex-1 bg-gray-100 min-h-screen py-2 px-1 flex justify-center">
            <div className="bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row w-full max-w-6xl min-h-[600px] p-2 md:p-4 lg:p-8 gap-4 md:gap-6">
                {/* Main Content */}
                <div className="flex-[2] flex flex-col">
                    {/* Back Button */}
                    <a
                        href="/allupcomingtrips"
                        className="mb-4 w-max"
                    >
                        <button className="flex items-center bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-3 md:px-4 py-1 transition-colors duration-200 cursor-pointer text-sm shadow">
                            <svg className="mr-2" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back
                        </button>
                    </a>

                    {/* Trip Title and Date */}
                    <div className="font-semibold text-lg md:text-2xl mb-1 mt-2">
                        {trip.title || 'Untitled Trip'}
                    </div>
                    <div className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6">
                        {formatDate(trip.date)}
                    </div>

                    {/* Trip Status */}
                    {trip.tripStatus && (
                        <div className="mb-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
                                trip.tripStatus.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                                trip.tripStatus.toLowerCase() === 'in progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                trip.tripStatus.toLowerCase() === 'completed' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                                trip.tripStatus.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                                Status: {trip.tripStatus}
                            </span>
                        </div>
                    )}

                    {/* Trip Details List */}
                    <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
                        {tripDetails.map((item, idx) => (
                            <div
                                key={item.label}
                                className="flex flex-col sm:flex-row sm:items-center bg-gray-100 rounded-2xl px-3 py-2 md:px-6 md:py-4"
                            >
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <span
                                        className={`w-7 h-7 md:w-9 md:h-9 rounded-full inline-flex items-center justify-center ${item.icon} mr-3 md:mr-4`}
                                    >
                                        {detailIcons[idx]}
                                    </span>
                                    <span className="font-medium text-base md:text-lg">
                                        {item.label}
                                    </span>
                                </div>
                                <span className="text-gray-500 text-xs md:text-sm font-medium cursor-pointer hover:underline sm:ml-auto">
                                    {item.action}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Customer Information */}
                    {(trip.customerName || trip.customerEmail) && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-lg mb-2">Customer Information</h4>
                            <div className="bg-gray-100 rounded-lg p-4">
                                {trip.customerName && (
                                    <div className="mb-2">
                                        <span className="font-medium">Name: </span>
                                        <span>{trip.customerName}</span>
                                    </div>
                                )}
                                {trip.customerEmail && (
                                    <div className="mb-2">
                                        <span className="font-medium">Email: </span>
                                        <span>{trip.customerEmail}</span>
                                    </div>
                                )}
                                {trip.customerPhone && (
                                    <div className="mb-2">
                                        <span className="font-medium">Phone: </span>
                                        <span>{trip.customerPhone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* New Participants */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4">
                        <span className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="12" fill="#ef4444" />
                                <text
                                    x="12"
                                    y="17"
                                    textAnchor="middle"
                                    fontSize="16"
                                    fill="#fff"
                                    fontWeight="bold"
                                >
                                    !
                                </text>
                            </svg>
                        </span>
                        <span className="text-gray-700 font-medium">
                            New Participants: <span className="font-bold">4</span>
                        </span>
                        <a href="/upcomingtripparticipants" className="w-full sm:w-auto">
                            <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-3 md:px-4 py-1 ml-0 sm:ml-2 transition-colors duration-200 cursor-pointer text-sm w-full sm:w-auto">
                                View Details
                            </button>
                        </a>
                    </div>
                    
                    {/* Add extra space here */}
                    <div className="mb-2"></div>
                    
                    {/* Cancel Button */}
                    {trip.tripStatus !== 'Cancelled' && trip.tripStatus !== 'Completed' && (
                        <button 
                            onClick={handleCancelTrip}
                            className="bg-red-100 text-red-600 rounded-lg px-3 md:px-4 py-1 font-semibold w-max text-sm hover:bg-red-200 transition-colors duration-200 cursor-pointer"
                        >
                            Cancel the Trip
                        </button>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col items-center w-full">
                    <div className="font-bold text-lg md:text-xl mb-4 w-full text-center">
                        {trip.title || 'Trip Calendar'}
                    </div>
                    
                    {/* MUI Calendar */}
                    <div className="bg-gray-100 rounded-xl p-3 md:p-4 w-full mb-6 md:mb-8 flex flex-col items-center">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar 
                                value={calendarDate}
                                readOnly
                            />
                        </LocalizationProvider>
                    </div>
                    
                    {/* Filled Slots */}
                    <div className="bg-gray-100 rounded-xl p-4 md:p-6 w-full flex flex-col items-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
                            alt="notif"
                            className="w-10 md:w-12 mb-3"
                        />
                        <div className="text-gray-500 font-bold text-base md:text-lg mb-2">
                            Filled Slots:
                        </div>
                        <div className="font-bold text-2xl md:text-3xl mb-3">
                            {calculateFilledSlots()}
                        </div>
                        <button className="bg-gray-900 text-white rounded-lg px-4 md:px-6 py-1 font-semibold hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                            VIEW WhatsApp GROUP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpcomingTripDetails;