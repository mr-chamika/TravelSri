import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

const PendingTripDetails = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const quotationsList = [
        {
            icon: "bg-blue-400",
            label: "list of hotels quotation",
            action: "view details →",
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
            label: "list of vehicles quotation",
            action: "view details →",
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
            label: "list of guides quotation",
            action: "view details →",
            href: "/allguidequotation",
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
        // Add your next button functionality here
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
                            <a
                                href="/allpendingtrips"
                                className="mb-4 w-max"
                            >
                                <button className="flex items-center bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-3 md:px-4 py-1 transition-colors duration-200 cursor-pointer text-sm shadow">
                                    <svg className="mr-2" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                        <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Back
                                </button>
                            </a>
                            {/* Trip Title */}
                            <div className="mb-8">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    Kandy trip
                                </h1>
                            </div>

                            {/* Quotations List */}
                            <div className="flex flex-col gap-4 mb-8">
                                {quotationsList.map((item, idx) => (
                                    <div
                                        key={item.label}
                                        className="flex flex-col sm:flex-row sm:items-center bg-gray-100 rounded-2xl px-4 py-3 md:px-6 md:py-4"
                                    >
                                        <div className="flex items-center mb-2 sm:mb-0">
                                            <span
                                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full inline-flex items-center justify-center ${item.icon} mr-4`}
                                            >
                                                {item.iconSvg}
                                            </span>
                                            <span className="font-medium text-base md:text-lg">
                                                {item.label}
                                            </span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleNavigate(item.href)}
                                            className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded px-4 py-1 text-sm transition-colors duration-200 sm:ml-auto cursor-pointer"
                                        >
                                            {item.action}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Next Button */}
                            <div className="flex justify-center mt-auto">
                                <a href="/pendingtripdetails02" className="w-full md:w-auto">
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

export default PendingTripDetails;