import React, { useState, useEffect } from "react";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from 'dayjs';

// Enhanced icons for different sections
const detailIcons = {
    hotel: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <rect x="4" y="8" width="16" height="10" rx="2" fill="#fff" />
            <rect x="7" y="11" width="2" height="2" rx="1" fill="#facc15" />
            <rect x="11" y="11" width="2" height="2" rx="1" fill="#facc15" />
            <rect x="15" y="11" width="2" height="2" rx="1" fill="#facc15" />
            <rect x="9" y="4" width="6" height="4" rx="1" fill="#fff" />
        </svg>
    ),
    vehicle: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="13" width="18" height="5" rx="2" fill="#fff" />
            <rect x="5" y="10" width="14" height="4" rx="1" fill="#fff" />
            <circle cx="7" cy="19" r="2" fill="#facc15" />
            <circle cx="17" cy="19" r="2" fill="#facc15" />
        </svg>
    ),
    guide: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" fill="#fff" />
            <rect x="6" y="14" width="12" height="6" rx="3" fill="#fff" />
            <circle cx="12" cy="8" r="2" fill="#facc15" />
        </svg>
    ),
    money: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#fff" />
            <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#facc15" fontWeight="bold">$</text>
        </svg>
    ),
    calendar: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" fill="#fff" />
            <path d="M8 2v4M16 2v4M3 10h18" stroke="#facc15" strokeWidth="2" />
        </svg>
    ),
    route: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#fff" />
            <circle cx="12" cy="10" r="3" fill="#facc15" />
        </svg>
    )
};

const UpcomingTripDetails = () => {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [calendarDate, setCalendarDate] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // New state for tabs

    const API_BASE_URL = "http://localhost:8080/api/upcomingTrip";

    useEffect(() => {
        fetchTripDetails();
    }, []);

    const fetchTripDetails = async () => {
        try {
            setLoading(true);
            
            const tripId = localStorage.getItem('selectedUpcomingTripId');
            
            console.log("=== FETCHING TRIP DETAILS ===");
            console.log("Trip ID from localStorage:", tripId);
            
            if (!tripId || tripId === 'undefined' || tripId === 'null') {
                const tripData = localStorage.getItem('selectedUpcomingTrip');
                console.log("No valid trip ID, checking stored trip data...");
                
                if (tripData && tripData !== 'undefined' && tripData !== 'null') {
                    try {
                        const parsedTrip = JSON.parse(tripData);
                        console.log("Using stored trip data:", parsedTrip);
                        setTrip(parsedTrip);
                        if (parsedTrip.date) {
                            setCalendarDate(dayjs(parsedTrip.date));
                        }
                        setLoading(false);
                        return;
                    } catch (parseError) {
                        console.error("Error parsing stored trip data:", parseError);
                    }
                }
                
                setError("No trip selected. Please go back and select a trip.");
                setLoading(false);
                return;
            }

            console.log("Making API call to fetch trip details...");
            const response = await axios.get(`${API_BASE_URL}/get/${tripId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Trip details response:", response.data);
            setTrip(response.data);
            setError("");

            if (response.data.date) {
                setCalendarDate(dayjs(response.data.date));
            }

        } catch (error) {
            console.error("Error fetching trip details:", error);
            
            if (error.response?.status === 404) {
                setError("Trip not found. The trip may have been deleted or the ID is invalid.");
            } else if (error.response?.status === 500) {
                setError("Server error occurred while fetching trip details.");
            } else {
                setError("Unable to fetch trip details. Please try again later.");
            }
            
            // Fallback to stored trip data
            const tripData = localStorage.getItem('selectedUpcomingTrip');
            if (tripData && tripData !== 'undefined' && tripData !== 'null') {
                try {
                    const parsedTrip = JSON.parse(tripData);
                    console.log("Using stored trip data as fallback:", parsedTrip);
                    setTrip(parsedTrip);
                    if (parsedTrip.date) {
                        setCalendarDate(dayjs(parsedTrip.date));
                    }
                    setError("");
                } catch (parseError) {
                    console.error("Error parsing fallback trip data:", parseError);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper functions
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

    const formatPriceLKR = (price) => {
        if (price == null || isNaN(price)) return 'LKR 0.00';
        return `LKR ${parseFloat(price).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        try {
            return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return timeString;
        }
    };

    const calculateTripDuration = () => {
        // First, try to use numberOfDates directly (this is the intended trip duration)
        if (trip?.numberOfDates && trip.numberOfDates > 0) {
            return trip.numberOfDates;
        }
        
        // Fallback: try to calculate from hotel check-in/check-out dates
        if (trip?.checkInDate && trip?.checkOutDate) {
            try {
                const checkIn = new Date(trip.checkInDate);
                const checkOut = new Date(trip.checkOutDate);
                
                // Calculate the difference in days
                const diffTime = checkOut.getTime() - checkIn.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                // Return at least 1 day
                return Math.max(1, diffDays);
            } catch (error) {
                console.error("Error calculating duration from dates:", error);
            }
        }
        
        // Final fallback
        return 1;
    };

    const calculateDaysUntilTrip = () => {
        if (!trip?.date) return 0;
        const today = new Date();
        const tripDate = new Date(trip.date);
        const diffTime = tripDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    const getServiceProviderSummary = () => {
        const summary = [];
        
        console.log("=== SERVICE PROVIDER SUMMARY DEBUG ===");
        console.log("Trip data:", trip);
        console.log("Selected Hotel ID:", trip?.selectedHotelId);
        console.log("Selected Vehicle ID:", trip?.selectedVehicleId);
        console.log("Selected Guide ID:", trip?.selectedGuideId);
        console.log("Vehicle Quoted Amount:", trip?.vehicleQuotedAmount);
        console.log("Vehicle Final Amount:", trip?.vehicleFinalAmount);
        console.log("=====================================");
        
        // Hotel Service
        if (trip?.selectedHotelId) {
            summary.push({
                type: 'Hotel',
                id: trip.selectedHotelId,
                contact: trip.hotelContactPerson || trip.hotelUsername || 'Not provided',
                phone: trip.hotelContactPhone || 'Not provided',
                amount: trip.hotelFinalAmount || trip.hotelTotalAmount || trip.accommodationPricePerPerson,
                details: `${trip.mealPlan || 'No meal plan'} | Check-in: ${formatDate(trip.checkInDate)}`
            });
        }

        // Vehicle Service - Updated to handle multiple possible field names
        if (trip?.selectedVehicleId || trip?.vehicleQuotedAmount || trip?.vehicleFinalAmount) {
            summary.push({
                type: 'Vehicle',
                id: trip.selectedVehicleId || 'Vehicle Service',
                contact: trip.vehicleDriverName || trip.vehicleOwnerName || trip.vehicleContactPerson || 'Not provided',
                phone: trip.vehicleDriverContact || trip.vehicleOwnerPhone || trip.vehicleContactPhone || 'Not provided',
                amount: trip.vehicleFinalAmount || trip.vehicleQuotedAmount || trip.vehicleTotalAmount || 0,
                details: `${trip.vehicleQuotationNotes || 'Vehicle transportation service'} | Reg: ${trip.vehicleRegistrationNumber || 'N/A'}`
            });
        }

        // Guide Service  
        if (trip?.selectedGuideId || trip?.guideQuotedAmount || trip?.guideFinalAmount) {
            summary.push({
                type: 'Guide',
                id: trip.selectedGuideId || 'Guide Service',
                contact: trip.guideName || trip.guideContactPerson || 'Not provided',
                phone: trip.guideContact || trip.guideContactPhone || trip.guidePhone || 'Not provided',
                amount: trip.guideFinalAmount || trip.guideQuotedAmount || trip.guideTotalAmount || 0,
                details: trip.guideQuotationNotes || 'Professional tour guide service'
            });
        }

        console.log("Generated service summary:", summary);
        return summary;
    };

    // Add these new helper functions for pricing calculations
    const calculateTotalQuotationPrice = () => {
        let total = 0.0;

        // Hotel quotation price
        if (trip?.hotelFinalAmount) {
            total += parseFloat(trip.hotelFinalAmount);
        } else if (trip?.hotelTotalAmount) {
            total += parseFloat(trip.hotelTotalAmount);
        }

        // Vehicle quotation price
        if (trip?.vehicleFinalAmount) {
            total += parseFloat(trip.vehicleFinalAmount);
        } else if (trip?.vehicleQuotedAmount) {
            total += parseFloat(trip.vehicleQuotedAmount);
        }

        // Guide quotation price
        if (trip?.guideFinalAmount) {
            total += parseFloat(trip.guideFinalAmount);
        } else if (trip?.guideQuotedAmount) {
            total += parseFloat(trip.guideQuotedAmount);
        }

        return total;
    };

    const calculateMarkupAmount = () => {
        const totalQuotationPrice = calculateTotalQuotationPrice();
        return totalQuotationPrice * 0.10; // 10% markup
    };

    const calculateTotalTripPrice = () => {
        const totalQuotationPrice = calculateTotalQuotationPrice();
        const markupAmount = calculateMarkupAmount();
        return totalQuotationPrice + markupAmount;
    };

    const calculatePricePerPerson = () => {
        const totalTripPrice = calculateTotalTripPrice();
        const numberOfPersons = trip?.groupSize || trip?.numberOfSeats || 1;
        return totalTripPrice / numberOfPersons;
    };

    // Replace the existing getPricingBreakdown function with this enhanced version:
    const getPricingBreakdown = () => {
        const breakdown = [];
        
        // Individual service costs
        if (trip?.hotelFinalAmount || trip?.hotelTotalAmount) {
            breakdown.push({
                service: 'Hotel Accommodation',
                amount: trip.hotelFinalAmount || trip.hotelTotalAmount,
                perPerson: trip.accommodationPricePerPerson,
                mealPerPerson: trip.mealPricePerPerson,
                groupSize: trip.groupSize,
                type: 'service'
            });
        }

        if (trip?.vehicleFinalAmount || trip?.vehicleQuotedAmount) {
            breakdown.push({
                service: 'Vehicle Transportation',
                amount: trip.vehicleFinalAmount || trip.vehicleQuotedAmount,
                notes: trip.vehicleQuotationNotes,
                type: 'service'
            });
        }

        if (trip?.guideFinalAmount || trip?.guideQuotedAmount) {
            breakdown.push({
                service: 'Tour Guide',
                amount: trip.guideFinalAmount || trip.guideQuotedAmount,
                notes: trip.guideQuotationNotes,
                type: 'service'
            });
        }

        // Calculation summary
        const totalQuotationPrice = calculateTotalQuotationPrice();
        const markupAmount = calculateMarkupAmount();
        const totalTripPrice = calculateTotalTripPrice();
        const pricePerPerson = calculatePricePerPerson();

        breakdown.push({
            service: 'Subtotal (All Services)',
            amount: totalQuotationPrice,
            type: 'subtotal'
        });

        breakdown.push({
            service: 'Service Markup (10%)',
            amount: markupAmount,
            type: 'markup'
        });

        breakdown.push({
            service: 'Total Trip Price',
            amount: totalTripPrice,
            type: 'total'
        });

        breakdown.push({
            service: `Price Per Person (${trip?.groupSize || trip?.numberOfSeats || 1} persons)`,
            amount: pricePerPerson,
            type: 'perperson'
        });

        return breakdown;
    };

    // Update the getOverviewDetails function to use the new calculation:
    const getOverviewDetails = () => [
        {
            icon: "bg-blue-400",
            iconSvg: detailIcons.route,
            label: "Route",
            value: `${trip?.startLocation || 'N/A'} → ${trip?.endLocation || 'N/A'}`,
            subtitle: trip?.intermediatePlaces ? `Via: ${trip.intermediatePlaces}` : null
        },
        {
            icon: "bg-green-400",
            iconSvg: detailIcons.calendar,
            label: "Duration",
            value: `${calculateTripDuration()} day${calculateTripDuration() !== 1 ? 's' : ''}`,
            subtitle: `${calculateDaysUntilTrip()} days remaining`
        },
        {
            icon: "bg-purple-400",
            iconSvg: detailIcons.money,
            label: "Total Cost",
            value: formatPriceLKR(calculateTotalTripPrice()), // Updated to use new calculation
            subtitle: `${formatPriceLKR(calculatePricePerPerson())} per person` // Updated to use new calculation
        },
        {
            icon: "bg-yellow-400",
            iconSvg: detailIcons.calendar,
            label: "Pickup Time",
            value: formatTime(trip?.pickupTime),
            subtitle: formatDate(trip?.date)
        }
    ];

    const handleCancelTrip = () => {
        if (!trip) return;
        
        // Store the trip data in localStorage for CancelTrip component to access
        localStorage.setItem('tripToCancelId', trip.id);
        localStorage.setItem('tripToCancelData', JSON.stringify(trip));
        
        // Navigate to CancelTrip page
        window.location.href = "/canceltrip";
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

    return (
        <div className="flex-1 bg-gray-100 min-h-screen py-2 px-1 flex justify-center">
            <div className="bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row w-full max-w-7xl min-h-[600px] p-2 md:p-4 lg:p-8 gap-4 md:gap-6">
                {/* Main Content */}
                <div className="flex-[2] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <a href="/allupcomingtrips" className="w-max">
                            <button className="flex items-center bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-3 md:px-4 py-1 transition-colors duration-200 cursor-pointer text-sm shadow">
                                <svg className="mr-2" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                    <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Back
                            </button>
                        </a>
                        
                        {/* Trip Status Badge */}
                        {trip.tripStatus && (
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
                                trip.tripStatus.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                                trip.tripStatus.toLowerCase() === 'in progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                trip.tripStatus.toLowerCase() === 'completed' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                                trip.tripStatus.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                                {trip.tripStatus}
                            </span>
                        )}
                    </div>

                    {/* Trip Title and Basic Info */}
                    <div className="mb-6">
                        <h1 className="font-bold text-2xl md:text-3xl mb-2">
                            {trip.title || 'Untitled Trip'}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>Trip ID: {trip.id}</span>
                            <span>Group Size: {trip.groupSize || trip.numberOfSeats}</span>
                            <span>Payment: {trip.paymentStatus}</span>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 mb-6">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'services', label: 'Service Providers' },
                            { id: 'pricing', label: 'Pricing Details' },
                            { id: 'customer', label: 'Customer Info' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-4">
                                {getOverviewDetails().map((item, idx) => (
                                    <div key={idx} className="flex items-center bg-gray-50 rounded-xl p-4">
                                        <span className={`w-10 h-10 rounded-full inline-flex items-center justify-center ${item.icon} mr-4`}>
                                            {item.iconSvg}
                                        </span>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800">{item.label}</div>
                                            <div className="text-lg font-semibold text-gray-900">{item.value}</div>
                                            {item.subtitle && (
                                                <div className="text-sm text-gray-500">{item.subtitle}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Trip Description */}
                                {trip.descriptionAboutStartLocation && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <h4 className="font-semibold text-blue-800 mb-2">About Start Location</h4>
                                        <p className="text-blue-700">{trip.descriptionAboutStartLocation}</p>
                                    </div>
                                )}

                                {/* Route Path */}
                                {trip.path && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <h4 className="font-semibold text-green-800 mb-2">Route Information</h4>
                                        <p className="text-green-700">{trip.path}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Service Providers Tab */}
                        {activeTab === 'services' && (
                            <div className="space-y-4">
                                {getServiceProviderSummary().map((service, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center ${
                                                    service.type === 'Hotel' ? 'bg-blue-400' :
                                                    service.type === 'Vehicle' ? 'bg-purple-400' : 'bg-green-400'
                                                } mr-3`}>
                                                    {service.type === 'Hotel' ? detailIcons.hotel :
                                                     service.type === 'Vehicle' ? detailIcons.vehicle : detailIcons.guide}
                                                </span>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{service.type}</h4>
                                                    <p className="text-sm text-gray-600">ID: {service.id}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-800">
                                                    {formatPriceLKR(service.amount)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            {service.contact && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Contact: </span>
                                                    <span className="text-gray-600">{service.contact}</span>
                                                </div>
                                            )}
                                            {service.phone && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Phone: </span>
                                                    <span className="text-gray-600">{service.phone}</span>
                                                </div>
                                            )}
                                            <div className="md:col-span-2">
                                                <span className="font-medium text-gray-700">Details: </span>
                                                <span className="text-gray-600">{service.details}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pricing Tab */}
                        {activeTab === 'pricing' && (
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <h4 className="font-semibold text-blue-800 mb-3">Pricing Summary</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-blue-600">
                                                {formatPriceLKR(trip.totalTripCost)}
                                            </div>
                                            <div className="text-sm text-blue-700">Total Trip Cost</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {formatPriceLKR(trip.totalPricePerPerson)}
                                            </div>
                                            <div className="text-sm text-green-700">Per Person</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-purple-600">
                                                {trip.groupSize || trip.numberOfSeats}
                                            </div>
                                            <div className="text-sm text-purple-700">Participants</div>
                                        </div>
                                    </div>
                                </div>

                                {getPricingBreakdown().map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-semibold text-gray-800">{item.service}</h5>
                                            <span className="font-bold text-gray-900">{formatPriceLKR(item.amount)}</span>
                                        </div>
                                        {item.perPerson && (
                                            <div className="text-sm text-gray-600 mb-1">
                                                Accommodation: {formatPriceLKR(item.perPerson)} per person
                                                {item.mealPerPerson && ` | Meals: ${formatPriceLKR(item.mealPerPerson)} per person`}
                                            </div>
                                        )}
                                        {item.notes && (
                                            <div className="text-sm text-gray-500">{item.notes}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Customer Info Tab */}
                        {activeTab === 'customer' && (
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="font-medium text-gray-700">Name: </span>
                                            <span className="text-gray-900">{trip.customerName || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Email: </span>
                                            <span className="text-gray-900">{trip.customerEmail || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Phone: </span>
                                            <span className="text-gray-900">{trip.customerPhone || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Emergency Contact: </span>
                                            <span className="text-gray-900">{trip.emergencyContact || 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Notes */}
                                {(trip.adminNotes || trip.internalNotes) && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                        <h4 className="font-semibold text-yellow-800 mb-3">Admin Notes</h4>
                                        {trip.adminNotes && (
                                            <div className="mb-2">
                                                <span className="font-medium text-yellow-700">Admin Notes: </span>
                                                <p className="text-yellow-600">{trip.adminNotes}</p>
                                            </div>
                                        )}
                                        {trip.internalNotes && (
                                            <div>
                                                <span className="font-medium text-yellow-700">Internal Notes: </span>
                                                <p className="text-yellow-600">{trip.internalNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Booking Timeline */}
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <h4 className="font-semibold text-green-800 mb-3">Booking Timeline</h4>
                                    <div className="space-y-2 text-sm">
                                        {trip.createdAt && (
                                            <div>
                                                <span className="font-medium text-green-700">Created: </span>
                                                <span className="text-green-600">{formatDate(trip.createdAt)}</span>
                                            </div>
                                        )}
                                        {trip.confirmationDate && (
                                            <div>
                                                <span className="font-medium text-green-700">Confirmed: </span>
                                                <span className="text-green-600">{formatDate(trip.confirmationDate)}</span>
                                            </div>
                                        )}
                                        {trip.completedAt && (
                                            <div>
                                                <span className="font-medium text-green-700">Completed: </span>
                                                <span className="text-green-600">{formatDate(trip.completedAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                        {trip.tripStatus !== 'Cancelled' && trip.tripStatus !== 'Completed' && (
                            <button 
                                onClick={handleCancelTrip}
                                className="bg-red-100 text-red-600 rounded-lg px-4 py-2 font-semibold hover:bg-red-200 transition-colors duration-200"
                            >
                                Cancel Trip
                            </button>
                        )}
                        <a href="/upcomingtripparticipants">
                            {/* <button className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-600 transition-colors duration-200">
                                Manage Participants
                            </button> */}
                        </a>
                        {/* <button className="bg-gray-500 text-white rounded-lg px-4 py-2 font-semibold hover:bg-gray-600 transition-colors duration-200">
                            Generate Invoice
                        </button> */}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col">
                    {/* Calendar */}
                    <div className="bg-gray-100 rounded-xl p-4 mb-6 flex flex-col items-center">
                        <h3 className="font-bold text-lg mb-4">Trip Calendar</h3>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar 
                                value={calendarDate}
                                readOnly
                            />
                        </LocalizationProvider>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="bg-gray-100 rounded-xl p-4 mb-6">
                        <h3 className="font-bold text-lg mb-4 text-center">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Days Until Trip:</span>
                                <span className="font-bold text-blue-600">{calculateDaysUntilTrip()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Trip Duration:</span>
                                <span className="font-bold">{calculateTripDuration()} days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Participants:</span>
                                <span className="font-bold text-green-600">{trip.groupSize || trip.numberOfSeats}</span>
                            </div>
                            {/* <div className="flex justify-between">
                                <span className="text-gray-600">Payment Status:</span>
                                <span className={`font-bold ${
                                    trip.paymentStatus === 'Paid' ? 'text-green-600' : 
                                    trip.paymentStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                    {trip.paymentStatus}
                                </span>
                            </div> */}
                        </div>
                    </div>

                    {/* Communication */}
                    {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h3 className="font-bold text-blue-800 mb-4 text-center">Communication</h3>
                        <div className="space-y-3">
                            <button className="w-full bg-green-500 text-white rounded-lg py-2 font-semibold hover:bg-green-600 transition-colors duration-200">
                                WhatsApp Group
                            </button>
                            <button className="w-full bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 transition-colors duration-200">
                                Send Notifications
                            </button>
                            <button className="w-full bg-purple-500 text-white rounded-lg py-2 font-semibold hover:bg-purple-600 transition-colors duration-200">
                                Trip Updates
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default UpcomingTripDetails;