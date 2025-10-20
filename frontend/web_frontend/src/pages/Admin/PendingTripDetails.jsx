import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import axios from "axios";

const PendingTripDetails = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tripData, setTripData] = useState(null);
    const [calendarDate, setCalendarDate] = useState(null);
    
    // Quotation states
    const [hotelQuotations, setHotelQuotations] = useState([]);
    const [vehicleQuotations, setVehicleQuotations] = useState([]);
    const [guideQuotations, setGuideQuotations] = useState([]);
    
    // Selected quotations state
    const [selectedQuotations, setSelectedQuotations] = useState({
        hotel: null,
        vehicle: null,
        guide: null
    });
    
    // Loading states
    const [loadingQuotations, setLoadingQuotations] = useState(true);
    const [creatingUpcomingTrip, setCreatingUpcomingTrip] = useState(false);
    const [error, setError] = useState("");

    // API base URLs
    const API_BASE_URLS = {
        hotel: "http://localhost:8080/api/quotations",
        vehicle: "http://localhost:8080/api/vehicle",
        guide: "http://localhost:8080/api/guide",
        upcomingTrip: "http://localhost:8080/api/upcomingTrip"
    };

    useEffect(() => {
        const storedTrip = localStorage.getItem('selectedTripForDetails');
        if (storedTrip) {
            const parsedTrip = JSON.parse(storedTrip);
            setTripData(parsedTrip);
            if (parsedTrip.date) {
                setCalendarDate(dayjs(parsedTrip.date));
            }
            if (parsedTrip.ptId) {
                fetchAllQuotations(parsedTrip.ptId);
            }
        }
        
        // Load selected quotations from localStorage
        loadSelectedQuotations();
    }, []);

    const loadSelectedQuotations = () => {
        const hotelQuotation = localStorage.getItem('selectedHotelQuotation');
        const vehicleQuotation = localStorage.getItem('selectedVehicleQuotation');
        const guideQuotation = localStorage.getItem('selectedGuideQuotation');

        setSelectedQuotations({
            hotel: hotelQuotation ? JSON.parse(hotelQuotation) : null,
            vehicle: vehicleQuotation ? JSON.parse(vehicleQuotation) : null,
            guide: guideQuotation ? JSON.parse(guideQuotation) : null
        });
    };

    const fetchAllQuotations = async (pendingTripId) => {
        try {
            setLoadingQuotations(true);
            setError("");

            const [hotelResponse, vehicleResponse, guideResponse] = await Promise.all([
                axios.get(`${API_BASE_URLS.hotel}/trip/${pendingTripId}`),
                axios.get(`${API_BASE_URLS.vehicle}/trip/${pendingTripId}`),
                axios.get(`${API_BASE_URLS.guide}/trip/${pendingTripId}`)
            ]);
            
            console.log("Hotel Quotations:", hotelResponse.data);
            console.log("Vehicle Quotations:", vehicleResponse.data);
            console.log("Guide Quotations:", guideResponse.data);

            setHotelQuotations(hotelResponse.data || []);
            setVehicleQuotations(vehicleResponse.data || []);
            setGuideQuotations(guideResponse.data || []);

        } catch (error) {
            console.error("Error fetching quotations:", error);
        } finally {
            setLoadingQuotations(false);
        }
    };

    const handleNavigateToQuotations = (href, quotationData, quotationType) => {
        localStorage.setItem(`${quotationType}QuotationsForTrip`, JSON.stringify(quotationData));
        localStorage.setItem('currentTripData', JSON.stringify(tripData));
        window.location.href = href;
    };

    const clearSelection = (type) => {
        localStorage.removeItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}Quotation`);
        setSelectedQuotations(prev => ({
            ...prev,
            [type]: null
        }));
    };

    const createUpcomingTripFromSelections = () => {
        if (!tripData) {
            throw new Error("Missing trip data");
        }

        console.log("=== CREATING UPCOMING TRIP DATA ===");
        console.log("Trip data:", tripData);
        console.log("Selected hotel quotation:", selectedQuotations.hotel);
        console.log("Selected vehicle quotation:", selectedQuotations.vehicle);
        console.log("Selected guide quotation:", selectedQuotations.guide);

        const upcomingTrip = {
            // ========== TRIP BASIC INFORMATION (From PendingTrip) ==========
            originalPendingTripId: tripData.ptId,
            title: tripData.title,
            startLocation: tripData.startLocation,
            endLocation: tripData.endLocation,
            numberOfSeats: tripData.numberOfSeats,
            date: tripData.date,
            numberOfDates: tripData.numberOfDates,
            descriptionAboutStartLocation: tripData.descriptionAboutStartLocation,
            intermediatePlaces: tripData.intermediatePlaces,
            pickupTime: tripData.pickupTime,
            path: tripData.path,

            // ========== SELECTED SERVICE PROVIDERS ==========
            selectedHotelId: selectedQuotations.hotel?.hotelId || null,
            selectedVehicleId: selectedQuotations.vehicle?.vehicleId || null,
            selectedGuideId: selectedQuotations.guide?.guideId || null,

            // ========== HOTEL QUOTATION DETAILS ==========
            ...(selectedQuotations.hotel && {
                hotelQuotationId: selectedQuotations.hotel.quotationId,
                hotelQuoteNumber: selectedQuotations.hotel.quoteNumber,
                groupSize: selectedQuotations.hotel.groupSize,
                checkInDate: selectedQuotations.hotel.checkInDate,
                checkOutDate: selectedQuotations.hotel.checkOutDate,
                standardRooms: selectedQuotations.hotel.standardRooms || 0,
                deluxRooms: selectedQuotations.hotel.deluxRooms || 0,
                familyRooms: selectedQuotations.hotel.familyRooms || 0,
                suites: selectedQuotations.hotel.suites || 0,
                mealPlan: selectedQuotations.hotel.mealPlan,
                specialRequirements: selectedQuotations.hotel.specialRequirements,
                accommodationPricePerPerson: selectedQuotations.hotel.accommodationPricePerPerson,
                mealPricePerPerson: selectedQuotations.hotel.mealPricePerPerson,
                hotelTotalAmount: selectedQuotations.hotel.totalAmount,
                hotelDiscountOffered: selectedQuotations.hotel.discountOffered || 0,
                hotelFinalAmount: selectedQuotations.hotel.finalAmount,
                hotelUsername: selectedQuotations.hotel.hotelUsername || selectedQuotations.hotel.createdBy
            }),

            // ========== VEHICLE QUOTATION DETAILS ==========
            ...(selectedQuotations.vehicle && {
                vehicleQuotationId: selectedQuotations.vehicle._id,
                vehicleQuotedAmount: selectedQuotations.vehicle.quotedAmount,
                vehicleQuotationNotes: selectedQuotations.vehicle.quotationNotes,
                vehicleQuotationDate: selectedQuotations.vehicle.quotationDate,
                vehicleOwnerId: selectedQuotations.vehicle.ownerId,
                vehicleTotalAmount: selectedQuotations.vehicle.quotedAmount,
                vehicleFinalAmount: selectedQuotations.vehicle.quotedAmount
            }),

            // ========== GUIDE QUOTATION DETAILS ==========
            ...(selectedQuotations.guide && {
                guideQuotationId: selectedQuotations.guide._id,
                guideQuotedAmount: selectedQuotations.guide.quotedAmount,
                guideQuotationNotes: selectedQuotations.guide.quotationNotes,
                guideQuotationDate: selectedQuotations.guide.quotationDate,
                guideTotalAmount: selectedQuotations.guide.quotedAmount,
                guideFinalAmount: selectedQuotations.guide.quotedAmount
            }),

            // ========== CALCULATED PRICING ==========
            totalTripCost: calculateTotalTripCost(),
            totalPricePerPerson: calculateTotalPricePerPerson(),

            // ========== STATUS INFORMATION ==========
            tripStatus: "Confirmed",
            bookingStatus: "Booked",
            paymentStatus: "Pending",
            confirmationDate: new Date().toISOString(),

            // ========== ADMIN INFORMATION ==========
            createdBy: "admin",
            adminNotes: `Trip created from pending trip ${tripData.ptId} with selected quotations: ${
                selectedQuotations.hotel ? 'Hotel' : ''
            }${selectedQuotations.vehicle ? ', Vehicle' : ''}${
                selectedQuotations.guide ? ', Guide' : ''
            }`
        };

        console.log("Final upcoming trip object:", upcomingTrip);
        return upcomingTrip;
    };

    // Replace the existing calculateTotalTripCost function with this:
    const calculateTotalTripCost = () => {
        let totalQuotationPrice = 0;
        
        // Hotel quotation price
        if (selectedQuotations.hotel?.finalAmount) {
            totalQuotationPrice += parseFloat(selectedQuotations.hotel.finalAmount);
        } else if (selectedQuotations.hotel?.totalAmount) {
            totalQuotationPrice += parseFloat(selectedQuotations.hotel.totalAmount);
        } else if (selectedQuotations.hotel?.totalPricePerPerson && selectedQuotations.hotel?.groupSize) {
            totalQuotationPrice += parseFloat(selectedQuotations.hotel.totalPricePerPerson) * parseInt(selectedQuotations.hotel.groupSize);
        }
        
        // Vehicle quotation price
        if (selectedQuotations.vehicle?.quotedAmount) {
            totalQuotationPrice += parseFloat(selectedQuotations.vehicle.quotedAmount);
        }
        
        // Guide quotation price
        if (selectedQuotations.guide?.quotedAmount) {
            totalQuotationPrice += parseFloat(selectedQuotations.guide.quotedAmount);
        }
        
        // Calculate 10% markup
        const markupAmount = totalQuotationPrice * 0.10;
        
        // Total trip price = Total quotation price + 10% markup
        const totalTripPrice = totalQuotationPrice + markupAmount;
        
        console.log("Total Quotation Price:", totalQuotationPrice);
        console.log("Markup Amount (10%):", markupAmount);
        console.log("Total Trip Price:", totalTripPrice);
        
        return totalTripPrice;
    };

    // Replace the existing calculateTotalPricePerPerson function with this:
    const calculateTotalPricePerPerson = () => {
        const totalTripPrice = calculateTotalTripCost(); // This already includes the 10% markup
        const numberOfPersons = selectedQuotations.hotel?.groupSize || tripData?.numberOfSeats || 1;
        const pricePerPerson = totalTripPrice / numberOfPersons;
        
        console.log("Total Trip Price:", totalTripPrice);
        console.log("Number of Persons:", numberOfPersons);
        console.log("Price Per Person:", pricePerPerson);
        
        return pricePerPerson;
    };

    const handleCreateUpcomingTrip = async () => {
        // Enhanced validation
        if (!selectedQuotations.hotel) {
            alert('Please select at least a hotel quotation before creating the trip.');
            return;
        }

        // Optional: Warn if not all quotations are selected
        const missingServices = [];
        if (!selectedQuotations.vehicle) missingServices.push('Vehicle');
        if (!selectedQuotations.guide) missingServices.push('Guide');
        
        if (missingServices.length > 0) {
            const confirmMessage = `The following services are not selected: ${missingServices.join(', ')}. Do you want to proceed anyway?`;
            if (!window.confirm(confirmMessage)) {
                return;
            }
        }

        try {
            setCreatingUpcomingTrip(true);
            console.log("=== CREATING UPCOMING TRIP ===");
            
            const upcomingTripData = createUpcomingTripFromSelections();
            console.log("Sending upcoming trip data:", JSON.stringify(upcomingTripData, null, 2));

            const response = await axios.post(`${API_BASE_URLS.upcomingTrip}/create`, upcomingTripData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Created upcoming trip response:", response.data);

            // Store the upcoming trip data for the next step (ADDED)
            localStorage.setItem('currentUpcomingTrip', JSON.stringify(response.data));
            localStorage.setItem('upcomingTripForNextStep', JSON.stringify(response.data));
            localStorage.setItem('upcomingTripCreated', 'true');

            // Clear selected quotations
            localStorage.removeItem('selectedHotelQuotation');
            localStorage.removeItem('selectedVehicleQuotation');
            localStorage.removeItem('selectedGuideQuotation');

            // Reset the selected quotations state to update UI
            setSelectedQuotations({
                hotel: null,
                vehicle: null,
                guide: null
            });

            // Show success message with details
            const servicesIncluded = [];
            if (selectedQuotations.hotel) servicesIncluded.push('Hotel');
            if (selectedQuotations.vehicle) servicesIncluded.push('Vehicle');
            if (selectedQuotations.guide) servicesIncluded.push('Guide');
            
            alert(`Upcoming trip created successfully!\nServices included: ${servicesIncluded.join(', ')}\nTotal cost: ${formatPriceLKR(calculateTotalTripCost())}\n\nYou can now continue to the next step or select quotations for other trips.`);
            
            // REMOVED: Navigate to upcoming trips
            // window.location.href = "/upcomingtrips";
            
        } catch (error) {
            console.error("Error creating upcoming trip:", error);
            console.error("Error response data:", error.response?.data);
            
            if (error.response?.status === 400) {
                alert('Invalid data provided for creating upcoming trip. Please check the console for details.');
            } else if (error.response?.status === 500) {
                alert('Server error occurred while creating upcoming trip.');
            } else {
                alert('Unable to create upcoming trip. Please try again later.');
            }
        } finally {
            setCreatingUpcomingTrip(false);
        }
    };

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
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    const getGuidePriceRange = () => {
        if (guideQuotations.length === 0) return null;
        const prices = guideQuotations.map(q => q.quotedAmount).filter(p => p != null);
        if (prices.length === 0) return null;
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    };

    const getVehiclePriceRange = () => {
        if (vehicleQuotations.length === 0) return null;
        const prices = vehicleQuotations.map(q => q.quotedAmount).filter(p => p != null);
        if (prices.length === 0) return null;
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    };

    const getHotelPriceRange = () => {
        if (hotelQuotations.length === 0) return null;
        const prices = hotelQuotations.map(q => q.totalPricePerPerson).filter(p => p != null);
        if (prices.length === 0) return null;
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    };

    const quotationsList = [
        {
            icon: "bg-blue-400",
            label: "Hotel Quotations",
            count: hotelQuotations.length,
            data: hotelQuotations,
            type: "hotel",
            href: "/allhotelquotation",
            priceRange: getHotelPriceRange(),
            selected: selectedQuotations.hotel,
            iconSvg: (
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <rect x="4" y="8" width="16" height="10" rx="2" />
                    <rect x="9" y="4" width="6" height="4" rx="1" />
                </svg>
            )
        },
        {
            icon: "bg-purple-400",
            label: "Vehicle Quotations",
            count: vehicleQuotations.length,
            data: vehicleQuotations,
            type: "vehicle",
            href: "/allvehiclequotation",
            priceRange: getVehiclePriceRange(),
            selected: selectedQuotations.vehicle,
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
            label: "Guide Quotations",
            count: guideQuotations.length,
            data: guideQuotations,
            type: "guide",
            href: "/allguidequotation",
            priceRange: getGuidePriceRange(),
            selected: selectedQuotations.guide,
            iconSvg: (
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <circle cx="12" cy="9" r="4" />
                    <rect x="6" y="15" width="12" height="5" rx="2.5" />
                </svg>
            )
        }
    ];

    // Check if all quotations are selected
    const allQuotationsSelected = selectedQuotations.hotel && selectedQuotations.vehicle && selectedQuotations.guide;
    const canCreateTrip = selectedQuotations.hotel; // Minimum requirement

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-gray-100 p-4 md:p-8">
                    <div className="bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row w-full max-w-6xl mx-auto min-h-[600px] p-6 md:p-8 gap-6">
                        <div className="flex-[2] flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <a href="/allpendingtrips" className="w-max">
                                    <button className="flex items-center bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-3 md:px-4 py-1 transition-colors duration-200 cursor-pointer text-sm shadow">
                                        <svg className="mr-2" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                            <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Back
                                    </button>
                                </a>
                                
                                <button
                                    onClick={() => {
                                        if (tripData?.ptId) {
                                            fetchAllQuotations(tripData.ptId);
                                            loadSelectedQuotations();
                                        }
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200 cursor-pointer text-sm"
                                    disabled={loadingQuotations}
                                >
                                    {loadingQuotations ? "Refreshing..." : "Refresh"}
                                </button>
                            </div>

                            <div className="mb-8">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    {tripData?.title || "Trip Details"}
                                </h1>
                                {tripData?.ptId && (
                                    <p className="text-sm text-gray-500 mt-1">Trip ID: {tripData.ptId}</p>
                                )}
                            </div>

                            {tripData && (
                                <div className="mb-8 bg-gray-50 rounded-xl p-4 md:p-6 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="font-semibold text-gray-700">Start Location:</span>
                                            <span className="ml-2 text-gray-900">{tripData.startLocation}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">End Location:</span>
                                            <span className="ml-2 text-gray-900">{tripData.endLocation}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Intermediate Destinations:</span>
                                            <span className="ml-2 text-gray-900">{tripData.intermediatePlaces}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Date:</span>
                                            <span className="ml-2 text-gray-900">{formatDate(tripData.date)}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Number of Seats:</span>
                                            <span className="ml-2 text-gray-900">{tripData.numberOfSeats}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Pickup Time:</span>
                                            <span className="ml-2 text-gray-900">{tripData.pickupTime}</span>
                                        </div>
                                        <div className="md:col-span-2">
                                            <span className="font-semibold text-gray-700">Route:</span>
                                            <span className="ml-2 text-gray-900">{tripData.path}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-4 mb-8">
                                <h2 className="text-xl font-semibold text-gray-800">Available Quotations</h2>

                                {quotationsList.map((item) => (
                                    <div
                                        key={item.label}
                                        className={`flex flex-col sm:flex-row sm:items-center rounded-2xl px-4 py-3 md:px-6 md:py-4 transition-colors duration-200 ${
                                            item.selected 
                                                ? 'bg-green-100 border-2 border-green-300' 
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center mb-2 sm:mb-0 flex-1">
                                            <span className={`w-8 h-8 md:w-10 md:h-10 rounded-full inline-flex items-center justify-center ${item.icon} mr-4`}>
                                                {item.iconSvg}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-base md:text-lg">
                                                    {item.label}
                                                    {item.selected && (
                                                        <span className="ml-2 text-sm text-green-600 font-semibold">✓ Selected</span>
                                                    )}
                                                </span>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className={`text-sm font-semibold px-2 py-1 rounded ${
                                                        item.count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {loadingQuotations ? "Loading..." : `${item.count} quotation${item.count !== 1 ? 's' : ''}`}
                                                    </span>
                                                    {item.count > 0 && !loadingQuotations && item.priceRange && (
                                                        <span className="text-xs text-gray-600">
                                                            Price range: {formatPriceLKR(item.priceRange.min)} - {formatPriceLKR(item.priceRange.max)}
                                                        </span>
                                                    )}
                                                    {item.selected && (
                                                        <span className="text-xs text-green-600 font-medium">
                                                            Selected: {
                                                                item.type === 'hotel' 
                                                                    ? formatPriceLKR(item.selected.totalPricePerPerson)
                                                                    : formatPriceLKR(item.selected.quotedAmount)
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleNavigateToQuotations(item.href, item.data, item.type)}
                                                className={`font-semibold rounded px-4 py-1 text-sm transition-colors duration-200 cursor-pointer ${
                                                    item.count > 0 
                                                        ? 'bg-yellow-300 hover:bg-yellow-400 text-gray-900' 
                                                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                }`}
                                                disabled={item.count === 0 || loadingQuotations}
                                            >
                                                view details →
                                            </button>
                                            {item.selected && (
                                                <button 
                                                    onClick={() => clearSelection(item.type)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded px-3 py-1 text-sm transition-colors duration-200"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Create Trip Section */}
                            {canCreateTrip && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Create Upcoming Trip</h3>
                                    <div className="mb-4">
                                        <p className="text-sm text-blue-700 mb-2">Selected Services:</p>
                                        <ul className="text-sm text-blue-600 space-y-1">
                                            {selectedQuotations.hotel && (
                                                <li>✓ Hotel: {selectedQuotations.hotel.hotelId} - {formatPriceLKR(selectedQuotations.hotel.totalPricePerPerson)}</li>
                                            )}
                                            {selectedQuotations.vehicle && (
                                                <li>✓ Vehicle: {selectedQuotations.vehicle.vehicleId} - {formatPriceLKR(selectedQuotations.vehicle.quotedAmount)}</li>
                                            )}
                                            {selectedQuotations.guide && (
                                                <li>✓ Guide: {selectedQuotations.guide.guideId} - {formatPriceLKR(selectedQuotations.guide.quotedAmount)}</li>
                                            )}
                                        </ul>
                                    </div>
                                    <button
                                        onClick={handleCreateUpcomingTrip}
                                        disabled={creatingUpcomingTrip}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg px-6 py-3 transition-colors duration-200 disabled:cursor-not-allowed"
                                    >
                                        {creatingUpcomingTrip ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating Trip...
                                            </div>
                                        ) : (
                                            'Create Upcoming Trip'
                                        )}
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-center mt-auto">
                                <a href="/pendingtripdetails02" className="w-full md:w-auto">
                                    <button 
                                        className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-8 py-2 transition-colors duration-200 cursor-pointer w-full md:w-auto"
                                        onClick={() => {
                                            // Ensure trip data is available for next step
                                            const upcomingTrip = localStorage.getItem('currentUpcomingTrip');
                                            if (upcomingTrip) {
                                                localStorage.setItem('upcomingTripForNextStep', upcomingTrip);
                                            }
                                        }}
                                    >
                                        Next
                                    </button>
                                </a>
                            </div>
                        </div>

                        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col">
                            <div className="bg-gray-100 rounded-xl p-4 w-full flex flex-col items-center mb-6">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar value={calendarDate} readOnly />
                                </LocalizationProvider>
                            </div>

                            {!loadingQuotations && (
                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Hotels:</span>
                                            <span className="text-sm font-medium">{hotelQuotations.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Vehicles:</span>
                                            <span className="text-sm font-medium">{vehicleQuotations.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Guides:</span>
                                            <span className="text-sm font-medium">{guideQuotations.length}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-sm">Total:</span>
                                            <span className="text-sm">{hotelQuotations.length + vehicleQuotations.length + guideQuotations.length}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Selection Progress */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Selection Progress</h3>
                                <div className="space-y-2">
                                    <div className={`flex justify-between items-center p-2 rounded ${selectedQuotations.hotel ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        <span className="text-sm">Hotel</span>
                                        <span className={`text-xs ${selectedQuotations.hotel ? 'text-green-600' : 'text-gray-500'}`}>
                                            {selectedQuotations.hotel ? '✓ Selected' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className={`flex justify-between items-center p-2 rounded ${selectedQuotations.vehicle ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        <span className="text-sm">Vehicle</span>
                                        <span className={`text-xs ${selectedQuotations.vehicle ? 'text-green-600' : 'text-gray-500'}`}>
                                            {selectedQuotations.vehicle ? '✓ Selected' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className={`flex justify-between items-center p-2 rounded ${selectedQuotations.guide ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        <span className="text-sm">Guide</span>
                                        <span className={`text-xs ${selectedQuotations.guide ? 'text-green-600' : 'text-gray-500'}`}>
                                            {selectedQuotations.guide ? '✓ Selected' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t">
                                    <div className="text-sm text-gray-600">
                                        Progress: {Object.values(selectedQuotations).filter(Boolean).length}/3 completed
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${(Object.values(selectedQuotations).filter(Boolean).length / 3) * 100}%`
                                            }}
                                        ></div>
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

export default PendingTripDetails;