import React, { useState, useEffect } from "react";
import axios from "axios";


const CreateTrip02 = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tripTitle, setTripTitle] = useState("");
    const [numberOfSlots, setNumberOfSlots] = useState("");

    const [numberOfDates, setNumberOfDates] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [tripStep1Data, setTripStep1Data] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:8080/api/pendingTrip";

    useEffect(() => {
        const step1Data = localStorage.getItem('tripStep1Data');
        if (step1Data) {
            try {
                const parsedData = JSON.parse(step1Data);
                setTripStep1Data(parsedData);
                console.log("Loaded step 1 data:", parsedData);
            } catch (err) {
                console.error("Error parsing step 1 data:", err);
                setError("Invalid trip data from previous step. Please start again.");
            }
        } else {
            setError("No trip data found. Please start from the first step.");
        }
    }, []);

    const availableResources = [
        {
            icon: "bg-blue-400",
            label: "Available Hotels",
            action: "view details →",
            iconSvg: (
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <rect x="4" y="8" width="16" height="10" rx="2" />
                    <rect x="9" y="4" width="6" height="4" rx="1" />
                </svg>
            )
        },
        {
            icon: "bg-purple-400",
            label: "Available Vehicles",
            action: "view details →",
            iconSvg: (
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <rect x="3" y="13" width="18" height="5" rx="2" />
                    <circle cx="7" cy="19" r="2" />
                    <circle cx="17" cy="19" r="2" />
                </svg>
            )
        },
        {
            icon: "bg-green-400",
            label: "Available Guides",
            action: "view details →",
            iconSvg: (
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <circle cx="12" cy="9" r="4" />
                    <rect x="6" y="15" width="12" height="5" rx="2.5" />
                </svg>
            )
        }
    ];


    // Helper function to format date properly for backend (avoiding timezone issues)
    const formatDateForBackend = (dateString) => {
        if (!dateString) return null;
        return dateString; // Send as YYYY-MM-DD string directly
    };

    // Helper function to format time properly for backend
    const formatTimeForBackend = (timeString) => {
        if (!timeString) return null;
        return timeString; // HTML time input gives HH:MM format which matches LocalTime
    };

    const handleSendNotification = async () => {
        setError("");

        // Comprehensive validation
        if (!tripTitle.trim()) {
            setError("Please enter a trip title");
            return;
        }
        if (!numberOfSlots || numberOfSlots < 1 || numberOfSlots > 50) {
            setError("Please enter a valid number of slots (1-50)");
            return;
        }
        if (!numberOfDates || numberOfDates < 1 || numberOfDates > 30) {
            setError("Please enter a valid number of dates (1-30)");
            return;
        }
        if (!pickupTime) {
            setError("Please enter a pickup time");
            return;
        }
        if (!selectedDate) {
            setError("Please select a date");
            return;
        }
        if (!tripStep1Data) {
            setError("Missing trip location data. Please start from the first step.");
            return;
        }

        // Validate that selected date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(selectedDate + 'T00:00:00');
        if (selected < today) {
            setError("Please select a date that is today or in the future");
            return;
        }

        setLoading(true);

        try {
            // Create complete trip object matching your model exactly
            const completeTrip = {
                title: tripTitle.trim(),
                startLocation: tripStep1Data.startLocation,
                endLocation: tripStep1Data.endLocation,
                numberOfSeats: parseInt(numberOfSlots, 10),
                date: formatDateForBackend(selectedDate),
                numberOfDates: parseInt(numberOfDates, 10),
                descriptionAboutStartLocation: tripStep1Data.descriptionAboutStartLocation,
                pickupTime: formatTimeForBackend(pickupTime),
                path: tripStep1Data.path
            };

            console.log("Sending trip data:", completeTrip);

            const response = await axios.post(`${API_BASE_URL}/create`, completeTrip, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log("Trip created successfully:", response.data);
            
            if (response.data && response.data.ptId) {
                localStorage.setItem('currentTripId', response.data.ptId);
            }
            localStorage.setItem('createdTripData', JSON.stringify(response.data));
            localStorage.removeItem('tripStep1Data');

            alert(`Trip "${tripTitle}" created successfully! Notifications sent to hotels, vehicles, and guides.`);
            window.location.href = "/allpendingtrips";

        } catch (error) {
            console.error("Error creating trip:", error);
            
            if (error.response) {
                const errorMessage = error.response.data?.message || error.response.data?.error || 'Unknown server error';
                setError(`Failed to create trip: ${errorMessage} (Status: ${error.response.status})`);
                console.error("Server response:", error.response.data);
            } else if (error.request) {
                setError("Unable to connect to server. Please check if the backend is running on http://localhost:8080");
            } else {
                setError(`An unexpected error occurred: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-gray-100 p-4 md:p-8">
                    <div className="bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row w-full max-w-6xl mx-auto min-h-[600px] p-6 md:p-8 gap-6">
                        <div className="flex-[2] flex flex-col">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                    Create New Trip - Step 2
                                </h1>
                                <p className="text-gray-600">
                                    Add trip details and send notifications
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                </div>
                            )}

                            {/* Progress Indicator */}
                            <div className="mb-6">
                                <div className="flex items-center justify-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                ✓
                                            </div>
                                            <span className="ml-2 text-sm font-medium text-green-600">Location & Route</span>
                                        </div>
                                        <div className="w-12 h-1 bg-green-500 rounded"></div>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                2
                                            </div>
                                            <span className="ml-2 text-sm font-medium text-purple-600">Trip Details</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trip Step 1 Data Display */}
                            {tripStep1Data && (
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-medium text-blue-800 mb-3">Trip Route Summary:</h3>
                                    <div className="space-y-2 text-blue-700">
                                        <p>
                                            <strong>From:</strong> {tripStep1Data.startLocation?.charAt(0).toUpperCase() + tripStep1Data.startLocation?.slice(1)}
                                        </p>
                                        <p>
                                            <strong>To:</strong> {tripStep1Data.endLocation?.charAt(0).toUpperCase() + tripStep1Data.endLocation?.slice(1)}
                                        </p>
                                        <p>
                                            <strong>Pickup Details:</strong> {tripStep1Data.descriptionAboutStartLocation}
                                        </p>
                                        <p className="text-sm text-blue-600 mt-2">
                                            <strong>Route:</strong> {tripStep1Data.path}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Trip Title */}
                            <div className="mb-6">
                                <label className="block text-gray-600 font-medium mb-3 text-lg">
                                    Add a Title to new trip: *
                                </label>
                                <input
                                    type="text"
                                    value={tripTitle}
                                    onChange={(e) => {
                                        setTripTitle(e.target.value);
                                        setError("");
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter an attractive trip title..."
                                    disabled={loading}
                                    maxLength="100"
                                    required
                                />
                                <div className="mt-2 text-sm text-gray-500">
                                    {tripTitle.length}/100 characters
                                </div>
                            </div>

                            {/* Number of Slots */}
                            <div className="mb-6">
                                <label className="block text-gray-600 font-medium mb-3 text-lg">
                                    Select the number of slots: *
                                </label>
                                <input
                                    type="number"
                                    value={numberOfSlots}
                                    onChange={(e) => {
                                        setNumberOfSlots(e.target.value);
                                        setError("");
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter number of slots..."
                                    min="1"
                                    max="50"
                                    disabled={loading}
                                    required
                                />
                                <div className="mt-2 text-sm text-gray-500">
                                    Available slots for passengers (1-50)
                                </div>
                            </div>

                            {/* Number of Dates */}
                            <div className="mb-6">
                                <label className="block text-gray-600 font-medium mb-3 text-lg">
                                    Number of Dates: *
                                </label>
                                <input
                                    type="number"
                                    value={numberOfDates}
                                    onChange={(e) => {
                                        setNumberOfDates(e.target.value);
                                        setError("");
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter number of dates..."
                                    min="1"
                                    max="30"
                                    disabled={loading}
                                    required
                                />
                                <div className="mt-2 text-sm text-gray-500">
                                    Duration of the trip in dates (1-30)
                                </div>
                            </div>

                            {/* Pickup Time */}
                            <div className="mb-8">
                                <label className="block text-gray-600 font-medium mb-3 text-lg">
                                    Pickup Time: *
                                </label>
                                <input
                                    type="time"
                                    value={pickupTime}
                                    onChange={(e) => {
                                        setPickupTime(e.target.value);
                                        setError("");
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                    required
                                />
                                <div className="mt-2 text-sm text-gray-500">
                                    Select the pickup time for passengers
                                </div>  
                            </div>

                            {/* Available Resources */}
                            <div className="flex flex-col gap-4 mb-8">
                                <h3 className="text-lg font-medium text-gray-700">Available Resources:</h3>
                                {availableResources.map((item, idx) => (
                                    <div key={item.label} className="flex flex-col sm:flex-row sm:items-center bg-gray-100 rounded-2xl px-4 py-3 md:px-6 md:py-4">
                                        <div className="flex items-center mb-2 sm:mb-0">
                                            <span className={`w-8 h-8 md:w-10 md:h-10 rounded-full inline-flex items-center justify-center ${item.icon} mr-4`}>
                                                {item.iconSvg}
                                            </span>
                                            <span className="font-medium text-base md:text-lg">{item.label}</span>
                                        </div>
                                        <span className="text-gray-500 text-sm font-medium cursor-pointer hover:underline sm:ml-auto">
                                            {item.action}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Send Notification Section */}
                            <div className="text-center mb-6">
                                <p className="text-gray-600 mb-4 text-lg">
                                    Send notifications to available hotels, vehicles and guides to send their quotation
                                </p>
                                <button
                                    onClick={handleSendNotification}
                                    disabled={loading || !tripTitle.trim() || !numberOfSlots || !numberOfDates || !pickupTime || !selectedDate || !tripStep1Data}
                                    className={`px-8 py-3 font-semibold rounded-lg transition-all duration-200 ${
                                        loading || !tripTitle.trim() || !numberOfSlots || !numberOfDates || !pickupTime || !selectedDate || !tripStep1Data
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-yellow-300 hover:bg-yellow-400 text-gray-900 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Trip...
                                        </div>
                                    ) : (
                                        "Send Notification"
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Date Selection */}
                        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col">
                            <div className="font-bold text-lg md:text-xl mb-6 text-center">
                                Select the Date: *
                            </div>

                            <div className="bg-gray-100 rounded-xl p-6 w-full mb-8 flex flex-col items-center">
                                <div className="w-full max-w-sm">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setError("");
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                                        disabled={loading}
                                        required
                                    />
                                    <div className="mt-3 text-sm text-gray-600 text-center">
                                        {selectedDate ? (
                                            <span className="text-green-600 font-medium">
                                                ✓ Date selected: {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}
                                            </span>
                                        ) : (
                                            "Please select a trip date"
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Pending Trip Section */}
                            <div className="bg-gray-100 rounded-xl p-6 w-full flex flex-col items-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-orange-400 rounded flex items-center justify-center">
                                        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                                            <rect x="3" y="4" width="18" height="12" rx="2" />
                                            <path d="M7 16l4-4 4 4" />
                                        </svg>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                                        <svg width="24" height="24" fill="#60a5fa" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-gray-600 font-medium mb-4 text-center">
                                    Go to pending stage
                                </div>
                                <a href="/allpendingtrips" className="w-full">
                                    <button className="w-full bg-gray-900 text-white rounded-lg px-6 py-3 font-semibold hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                                        VIEW Pending Trips
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTrip02;