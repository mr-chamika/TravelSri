import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

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

const tripDetails = [
    {
        icon: "bg-blue-400", // Hotel: blue
        label: "Hotel :  ABC Villa",
        action: "view details →",
    },
    {
        icon: "bg-purple-400", // Vehicle: purple
        label: "Vehicle : AAk 2378",
        action: "view details →",
    },
    {
        icon: "bg-yellow-400", // Total Slots: yellow
        label: "Total Slots : 32",
        action: "view details →",
    },
    {
        icon: "bg-red-400", // Available Slots: red
        label: "Available Slots : 12",
        action: "view details →",
    },
];

const UpcomingTripDetails = () => {
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
                    <div className="font-semibold text-lg md:text-2xl mb-1 mt-2">
                        Kandy Trip
                    </div>
                    <div className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6">17 June, 2025</div>
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
                            New Participants : <span className="font-bold">4</span>
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
                    <a href="/canceltrip" className="w-full sm:w-auto">
                        <button className="bg-red-100 text-red-600 rounded-lg px-3 md:px-4 py-1 font-semibold w-max text-sm hover:bg-red-200 transition-colors duration-200 cursor-pointer">
                            Cancel the Trip
                        </button>
                    </a>
                </div>
                {/* Right Sidebar */}
                <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col items-center w-full">
                    <div className="font-bold text-lg md:text-xl mb-4 w-full text-center">
                        Kandy Trips
                    </div>
                    {/* MUI Calendar */}
                    <div className="bg-gray-100 rounded-xl p-3 md:p-4 w-full mb-6 md:mb-8 flex flex-col items-center">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar />
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
                            Filled Slots :
                        </div>
                        <div className="font-bold text-2xl md:text-3xl mb-3">20</div>
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


