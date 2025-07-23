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
    
    // Loading states
    const [loadingQuotations, setLoadingQuotations] = useState(true);
    const [error, setError] = useState("");

    // API base URLs
    const API_BASE_URLS = {
        hotel: "http://localhost:8080/api/hotel-quotation",
        vehicle: "http://localhost:8080/api/quotation",
        guide: "http://localhost:8080/api/guide-quotation"
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
    }, []);

    const fetchAllQuotations = async (pendingTripId) => {
        try {
            setLoadingQuotations(true);
            setError("");

            const [hotelResponse, vehicleResponse, guideResponse] = await Promise.all([
                axios.get(`${API_BASE_URLS.hotel}/trip/${pendingTripId}`),
                axios.get(`${API_BASE_URLS.vehicle}/trip/${pendingTripId}`),
                axios.get(`${API_BASE_URLS.guide}/trip/${pendingTripId}`)
            ]);

            setHotelQuotations(hotelResponse.data || []);
            setVehicleQuotations(vehicleResponse.data || []);
            setGuideQuotations(guideResponse.data || []);

        } catch (error) {
            console.error("Error fetching quotations:", error);
            setError("Failed to fetch quotations. Please try again.");
        } finally {
            setLoadingQuotations(false);
        }
    };

    const handleNavigateToQuotations = (href, quotationData, quotationType) => {
        localStorage.setItem(`${quotationType}QuotationsForTrip`, JSON.stringify(quotationData));
        localStorage.setItem('currentTripData', JSON.stringify(tripData));
        window.location.href = href;
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

    const quotationsList = [
        {
            icon: "bg-blue-400",
            label: "Hotel Quotations",
            count: hotelQuotations.length,
            data: hotelQuotations,
            type: "hotel",
            href: "/allhotelquotation",
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
            iconSvg: (
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <circle cx="12" cy="9" r="4" />
                    <rect x="6" y="15" width="12" height="5" rx="2.5" />
                </svg>
            )
        }
    ];

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
                                    onClick={() => tripData?.ptId && fetchAllQuotations(tripData.ptId)}
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
                                        className="flex flex-col sm:flex-row sm:items-center bg-gray-100 rounded-2xl px-4 py-3 md:px-6 md:py-4 hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        <div className="flex items-center mb-2 sm:mb-0 flex-1">
                                            <span className={`w-8 h-8 md:w-10 md:h-10 rounded-full inline-flex items-center justify-center ${item.icon} mr-4`}>
                                                {item.iconSvg}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-base md:text-lg">
                                                    {item.label}
                                                </span>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className={`text-sm font-semibold px-2 py-1 rounded ${
                                                        item.count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {loadingQuotations ? "Loading..." : `${item.count} quotation${item.count !== 1 ? 's' : ''}`}
                                                    </span>
                                                    {item.count > 0 && !loadingQuotations && (
                                                        <span className="text-xs text-gray-600">
                                                            Price range: {formatPriceLKR(Math.min(...item.data.map(q => q.price)))} - {formatPriceLKR(Math.max(...item.data.map(q => q.price)))}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleNavigateToQuotations(item.href, item.data, item.type)}
                                            className={`font-semibold rounded px-4 py-1 text-sm transition-colors duration-200 sm:ml-auto cursor-pointer ${
                                                item.count > 0 
                                                    ? 'bg-yellow-300 hover:bg-yellow-400 text-gray-900' 
                                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            }`}
                                            disabled={item.count === 0 || loadingQuotations}
                                        >
                                            view details →
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-auto">
                                <a href="/pendingtripdetails02" className="w-full md:w-auto">
                                    <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-8 py-2 transition-colors duration-200 cursor-pointer w-full md:w-auto">
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
                                <div className="bg-gray-50 rounded-xl p-4">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingTripDetails;