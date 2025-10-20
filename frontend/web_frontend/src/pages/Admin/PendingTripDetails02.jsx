import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

const PendingTripDetails02 = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [upcomingTrip, setUpcomingTrip] = useState(null);
    const [calendarDate, setCalendarDate] = useState(null);

    useEffect(() => {
        // Load upcoming trip data - prioritize the newly created trip
        const upcomingTripForNextStep = localStorage.getItem('upcomingTripForNextStep');
        const currentUpcomingTrip = localStorage.getItem('currentUpcomingTrip');
        const upcomingTripCreated = localStorage.getItem('upcomingTripCreated');
        
        console.log("=== LOADING TRIP DATA IN DETAILS02 ===");
        console.log("upcomingTripForNextStep exists:", !!upcomingTripForNextStep);
        console.log("currentUpcomingTrip exists:", !!currentUpcomingTrip);
        console.log("upcomingTripCreated flag:", upcomingTripCreated);
        
        let tripDataToUse = null;
        
        // Priority 1: Use the trip data specifically stored for next step
        if (upcomingTripForNextStep) {
            try {
                tripDataToUse = JSON.parse(upcomingTripForNextStep);
                console.log("Using upcomingTripForNextStep data");
            } catch (error) {
                console.error("Error parsing upcomingTripForNextStep:", error);
            }
        }
        
        // Priority 2: Use current upcoming trip if first option failed
        if (!tripDataToUse && currentUpcomingTrip) {
            try {
                tripDataToUse = JSON.parse(currentUpcomingTrip);
                console.log("Using currentUpcomingTrip data");
            } catch (error) {
                console.error("Error parsing currentUpcomingTrip:", error);
            }
        }
        
        if (tripDataToUse) {
            setUpcomingTrip(tripDataToUse);
            console.log("=== UPCOMING TRIP LOADED IN DETAILS02 ===");
            console.log("Trip ID:", tripDataToUse.id);
            console.log("Trip Title:", tripDataToUse.title);
            console.log("Selected Hotel ID:", tripDataToUse.selectedHotelId);
            console.log("Selected Vehicle ID:", tripDataToUse.selectedVehicleId);
            console.log("Selected Guide ID:", tripDataToUse.selectedGuideId);
            console.log("Hotel Final Amount:", tripDataToUse.hotelFinalAmount);
            console.log("Vehicle Final Amount:", tripDataToUse.vehicleFinalAmount);
            console.log("Guide Final Amount:", tripDataToUse.guideFinalAmount);
            console.log("Total Trip Cost:", tripDataToUse.totalTripCost);
            console.log("Total Price Per Person:", tripDataToUse.totalPricePerPerson);
            console.log("==========================================");
            
            if (tripDataToUse.date) {
                setCalendarDate(dayjs(tripDataToUse.date));
            }
        } else {
            console.warn("No upcoming trip data found in localStorage");
        }
    }, []);

    const formatPriceLKR = (price) => {
        if (price == null || isNaN(price)) return 'LKR 0.00';
        return `LKR ${parseFloat(price).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatDate = (dateString) => {
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

    // Service items with real data from upcoming trip
    const selectedItems = [
        {
            icon: "bg-blue-400",
            type: "Hotel",
            name: upcomingTrip?.selectedHotelId ? `Hotel ${upcomingTrip.selectedHotelId}` : "No Hotel Selected",
            price: upcomingTrip?.hotelFinalAmount ? formatPriceLKR(upcomingTrip.hotelFinalAmount) : 
                   upcomingTrip?.hotelTotalAmount ? formatPriceLKR(upcomingTrip.hotelTotalAmount) : "LKR 0.00",
            href: "/allhotelquotation",
            action: "Edit",
            isSelected: !!upcomingTrip?.selectedHotelId,
            iconSvg: (
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <rect x="4" y="8" width="16" height="10" rx="2" />
                    <rect x="9" y="4" width="6" height="4" rx="1" />
                </svg>
            )
        },
        {
            icon: "bg-purple-400",
            type: "Vehicle",
            name: upcomingTrip?.selectedVehicleId ? `Vehicle ${upcomingTrip.selectedVehicleId}` : "No Vehicle Selected",
            price: upcomingTrip?.vehicleFinalAmount ? formatPriceLKR(upcomingTrip.vehicleFinalAmount) : 
                   upcomingTrip?.vehicleQuotedAmount ? formatPriceLKR(upcomingTrip.vehicleQuotedAmount) : 
                   upcomingTrip?.vehicleTotalAmount ? formatPriceLKR(upcomingTrip.vehicleTotalAmount) : "LKR 0.00",
            href: "/allvehiclequotation",
            action: "Edit",
            isSelected: !!(upcomingTrip?.selectedVehicleId || upcomingTrip?.vehicleFinalAmount || upcomingTrip?.vehicleQuotedAmount),
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
            type: "Guide",
            name: upcomingTrip?.selectedGuideId ? `Guide ${upcomingTrip.selectedGuideId}` : "No Guide Selected",
            price: upcomingTrip?.guideFinalAmount ? formatPriceLKR(upcomingTrip.guideFinalAmount) : 
                   upcomingTrip?.guideQuotedAmount ? formatPriceLKR(upcomingTrip.guideQuotedAmount) : "LKR 0.00",
            href: "/allguidequotation",
            action: "Edit",
            isSelected: !!upcomingTrip?.selectedGuideId,
            iconSvg: (
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <circle cx="12" cy="9" r="4" />
                    <rect x="6" y="15" width="12" height="5" rx="2.5" />
                </svg>
            )
        }
    ];

    const handleNavigate = (href) => {
        // Store current upcoming trip data for when returning
        if (upcomingTrip) {
            localStorage.setItem('currentUpcomingTripForEdit', JSON.stringify(upcomingTrip));
        }
        window.location.href = href;
    };

    const handleNext = () => {
        console.log("Next button clicked");
        if (upcomingTrip) {
            localStorage.setItem('finalUpcomingTrip', JSON.stringify(upcomingTrip));
        }
        window.location.href = "/pendingtripdetails03";
    };

    // Calculate totals
    const calculateTotals = () => {
        if (!upcomingTrip) {
            return {
                totalAmount: 0,
                systemCharge: 0,
                finalAmount: 0,
                amountPerPerson: 0,
                totalSeats: 30
            };
        }

        // Use the pre-calculated values from the database if available
        if (upcomingTrip.totalTripCost && upcomingTrip.totalPricePerPerson) {
            const totalSeats = upcomingTrip.numberOfSeats || upcomingTrip.groupSize || 30;
            const finalAmount = upcomingTrip.totalTripCost;
            const amountPerPerson = upcomingTrip.totalPricePerPerson;
            
            // Calculate the base amount and system charge from the final amount
            // finalAmount = totalAmount + (totalAmount * 0.1)
            // finalAmount = totalAmount * 1.1
            const totalAmount = finalAmount / 1.1;
            const systemCharge = finalAmount - totalAmount;
            
            return {
                totalAmount,
                systemCharge,
                finalAmount,
                amountPerPerson,
                totalSeats
            };
        } else {
            // Fallback to manual calculation if pre-calculated values aren't available
            const hotelAmount = upcomingTrip.hotelFinalAmount || upcomingTrip.hotelTotalAmount || 0;
            const vehicleAmount = upcomingTrip.vehicleFinalAmount || upcomingTrip.vehicleQuotedAmount || 0;
            const guideAmount = upcomingTrip.guideFinalAmount || upcomingTrip.guideQuotedAmount || 0;
            const totalAmount = hotelAmount + vehicleAmount + guideAmount;
            const systemCharge = totalAmount * 0.1; // 10% system charge
            const finalAmount = totalAmount + systemCharge;
            const totalSeats = upcomingTrip.numberOfSeats || upcomingTrip.groupSize || 30;
            const amountPerPerson = finalAmount / totalSeats;

            return {
                totalAmount,
                systemCharge,
                finalAmount,
                amountPerPerson,
                totalSeats
            };
        }
    };

    const totals = calculateTotals();

    if (!upcomingTrip) {
        return (
            <div className="flex min-h-screen bg-gray-100 justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading upcoming trip details...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-gray-100 p-4 md:p-8">
                    <div className="bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row w-full max-w-6xl mx-auto min-h-[600px] p-6 md:p-8 gap-6">
                        <div className="flex-[2] flex flex-col">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <a href="/pendingtripdetails" className="w-max">
                                        <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-3 py-1 transition-colors duration-200 text-sm">
                                            <svg className="mr-2" width="16" height="16" fill="none" viewBox="0 0 24 24">
                                                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Back
                                        </button>
                                    </a>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Trip ID: {upcomingTrip.id || upcomingTrip.upcomingTripId}
                                        </span>
                                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Status: {upcomingTrip.tripStatus}
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    {upcomingTrip.title}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {upcomingTrip.startLocation} → {upcomingTrip.endLocation}
                                </p>
                            </div>

                            {/* Trip Details Summary */}
                            <div className="mb-8 bg-gray-50 rounded-xl p-4 md:p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Summary</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-semibold text-gray-700">Date:</span>
                                        <span className="ml-2 text-gray-900">{formatDate(upcomingTrip.date)}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Group Size:</span>
                                        <span className="ml-2 text-gray-900">{upcomingTrip.groupSize} people</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Check-in:</span>
                                        <span className="ml-2 text-gray-900">{formatDate(upcomingTrip.checkInDate)}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Check-out:</span>
                                        <span className="ml-2 text-gray-900">{formatDate(upcomingTrip.checkOutDate)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Items List */}
                            <div className="flex flex-col gap-4 mb-8">
                                <h2 className="text-xl font-semibold text-gray-800">Selected Services</h2>
                                {selectedItems.map((item, idx) => (
                                    <div
                                        key={item.name}
                                        className={`flex flex-col sm:flex-row sm:items-center rounded-2xl px-4 py-3 md:px-6 md:py-4 transition-colors duration-200 ${
                                            item.isSelected 
                                                ? 'bg-green-50 border-2 border-green-200' 
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center mb-2 sm:mb-0 flex-1">
                                            <span
                                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full inline-flex items-center justify-center ${item.icon} mr-4`}
                                            >
                                                {item.iconSvg}
                                            </span>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-base md:text-lg">
                                                        {item.type}: {item.name}
                                                    </span>
                                                    {item.isSelected && (
                                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                {item.isSelected && (
                                                    <span className="text-sm text-green-600 font-medium">✓ Selected</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleNavigate(item.href)}
                                                className={`font-semibold rounded px-4 py-1 text-sm transition-colors duration-200 cursor-pointer ${
                                                    item.isSelected 
                                                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                                                        : 'bg-yellow-300 hover:bg-yellow-400 text-gray-900'
                                                }`}
                                            >
                                                {item.isSelected ? 'Change' : 'Select'}
                                            </button>

                                            <span className="font-medium text-gray-700">
                                                {item.price}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pricing Summary */}
                            <div className="mb-8 space-y-3 bg-gray-50 rounded-xl p-4 md:p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Summary</h3>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-700 font-medium">Total Seats (minimum slots 28)</span>
                                    <span className="font-semibold">{totals.totalSeats}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-700 font-medium">Service Total</span>
                                    <span className="font-semibold">{formatPriceLKR(totals.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-700 font-medium">System charge (10%)</span>
                                    <span className="font-semibold">{formatPriceLKR(totals.systemCharge)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-3">
                                    <span className="text-gray-700 font-medium">Total Amount</span>
                                    <span className="font-semibold">{formatPriceLKR(totals.finalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 text-lg">
                                    <span className="text-gray-700 font-bold">Amount per person</span>
                                    <span className="font-bold text-gray-900">{formatPriceLKR(totals.amountPerPerson)}</span>
                                </div>
                            </div>

                            {/* Next Button */}
                            <div className="flex justify-center mt-auto">
                                <button
                                    onClick={handleNext}
                                    className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-8 py-2 transition-colors duration-200 cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>


                        {/* Right Sidebar - Calendar */}
                        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col">
                            <div className="font-bold text-lg md:text-xl mb-4 text-center">
                                {upcomingTrip.title}
                            </div>
                            {/* MUI Calendar */}
                            <div className="bg-gray-100 rounded-xl p-4 w-full flex flex-col items-center">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar />
                                </LocalizationProvider>
                            </div>

                                {/* Additional Trip Information */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Trip Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Original Trip ID:</span>
                                        <span className="font-medium">{upcomingTrip.originalPendingTripId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trip Duration:</span>
                                        <span className="font-medium">{upcomingTrip.numberOfDates || 1} day(s)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Pickup Time:</span>
                                        <span className="font-medium">{upcomingTrip.pickupTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Status:</span>
                                        <span className={`font-medium px-2 py-1 rounded text-xs ${
                                            upcomingTrip.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                                            upcomingTrip.paymentStatus === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {upcomingTrip.paymentStatus}
                                        </span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-semibold">
                                        <span>Services Selected:</span>
                                        <span>{selectedItems.filter(item => item.isSelected).length}/3</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingTripDetails02;