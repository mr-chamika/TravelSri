import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

const PendingTripDetails02 = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const selectedItems = [
        {
            icon: "bg-blue-400",
            type: "Hotel",
            name: "Marriot",
            price: "Rs: 100,000",
            href: "/allhotelquotation",
            action: "Edit",
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
            name: "AAB-1289",
            price: "Rs: 80,000",
            href: "/allvehiclequotation",
            action: "Edit",
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
            name: "A.K.Samaraweera",
            price: "Rs: 10,000",
            href: "/allguidequotation",
            action: "Edit",
            iconSvg: (
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <circle cx="12" cy="9" r="4" />
                    <rect x="6" y="15" width="12" height="5" rx="2.5" />
                </svg>
            )
        }
    ];

    const handleNavigate = (href) => {
        window.location.href = href;
    };

    const handleNext = () => {
        console.log("Next button clicked");
        // Example: window.location.href = "/next-step";
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
           

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
               
                {/* Page Content */}
                <div className="flex-1 bg-gray-100 p-4 md:p-8">
                    <div className="bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row w-full max-w-6xl mx-auto min-h-[600px] p-6 md:p-8 gap-6">
                        {/* Main Content */}
                        <div className="flex-[2] flex flex-col">
                            {/* Trip Title */}
                            <div className="mb-8">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    Kandy trip
                                </h1>
                            </div>

                            {/* Selected Items List */}
                            <div className="flex flex-col gap-4 mb-8">
                                {selectedItems.map((item, idx) => (
                                    <div
                                        key={item.name}
                                        className="flex flex-col sm:flex-row sm:items-center bg-gray-100 rounded-2xl px-4 py-3 md:px-6 md:py-4"
                                    >
                                        <div className="flex items-center mb-2 sm:mb-0 flex-1">
                                            <span
                                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full inline-flex items-center justify-center ${item.icon} mr-4`}
                                            >
                                                {item.iconSvg}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-base md:text-lg">
                                                    {item.type} : {item.name}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                           
                                                <button 
                                                    onClick={() => handleNavigate(item.href)}
                                                    className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded px-4 py-1 text-sm transition-colors duration-200 cursor-pointer">
                                                    Edit
                                                </button>
                                            
                                            <span className="font-medium text-gray-700">
                                                {item.price}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pricing Summary */}
                            <div className="mb-8 space-y-3">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-700 font-medium">Total Seats (minimum slots 28)</span>
                                    <span className="font-semibold">30</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-700 font-medium">System charge</span>
                                    <span className="font-semibold">10%</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-3">
                                    <span className="text-gray-700 font-medium">Total Amount</span>
                                    <span className="font-semibold">Rs: 209,000</span>
                                </div>
                                <div className="flex justify-between items-center py-2 text-lg">
                                    <span className="text-gray-700 font-bold">Amount per person</span>
                                    <span className="font-bold text-gray-900">Rs: 7,500</span>
                                </div>
                            </div>

                            {/* Next Button */}
                            <div className="flex justify-center mt-auto">
                                <a href="/pendingtripdetails03" className="w-full md:w-auto">
                                    <button 
                                    onClick={handleNext}
                                    className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-8 py-2 transition-colors duration-200 cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </a>
                            </div>
                        </div>

                        {/* Right Sidebar - Calendar */}
                        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col">
                            <div className="font-bold text-lg md:text-xl mb-4 text-center">
                                Kandy trip
                            </div>
                            {/* MUI Calendar */}
                            <div className="bg-gray-100 rounded-xl p-4 w-full flex flex-col items-center">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar />
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingTripDetails02;