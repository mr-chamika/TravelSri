import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

const PendingTripDetails03 = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [whatsappLink, setWhatsappLink] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const tripDetails = [
        {
            label: "Hotel : Marriot",
            action: "view details →"
        },
        {
            label: "Vehicle : AAB-1289",
            action: "view details →"
        },
        {
            label: "Total Slots : 30",
            action: "view details →"
        },
        {
            label: "Amount per person - Rs: 7,500/=",
            action: ""
        }
    ];

    const handleCreateAndPublish = () => {
        // Check if WhatsApp link is provided
        if (!whatsappLink.trim()) {
            alert("Please add a WhatsApp group link before publishing the trip.");
            return;
        }

        console.log("Create & Publish clicked");
        console.log("WhatsApp Link:", whatsappLink);
        
        // Show popup
        setShowPopup(true);
        
        // Hide popup after 2 seconds and navigate
        setTimeout(() => {
            setShowPopup(false);
            navigate("/allupcomingtrips");
        }, 2000);
    };

    // Check if the form is valid (WhatsApp link is not empty)
    const isFormValid = whatsappLink.trim().length > 0;

    return (
        <div className="flex min-h-screen bg-gray-100">
           
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              

                {/* Page Content */}
                <div className="flex-1 bg-gray-100 p-4 md:p-8">
                    <div className="bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row w-full max-w-6xl mx-auto min-h-[600px] p-6 md:p-8 gap-6">
                        {/* Main Content */}
                        <div className="flex-[2] flex flex-col">
                            {/* Trip Header */}
                            <div className="mb-8">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                    Kandy Trip
                                </h1>
                                <p className="text-gray-500">17 June, 2025</p>
                            </div>

                            {/* Trip Details List */}
                            <div className="flex flex-col gap-4 mb-8">
                                {tripDetails.map((detail, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col sm:flex-row sm:items-center bg-gray-100 rounded-2xl px-4 py-3 md:px-6 md:py-4"
                                    >
                                        <div className="flex items-center mb-2 sm:mb-0 flex-1">
                                            <span className="w-6 h-6 bg-yellow-300 rounded-full mr-4 flex-shrink-0"></span>
                                            <span className="font-medium text-base md:text-lg text-gray-700">
                                                {detail.label}
                                            </span>
                                        </div>
                                        
                                        {detail.action && (
                                            <button className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200 sm:ml-auto">
                                                {detail.action}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* WhatsApp Group Section */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Add a WhatsApp group link here <span className="text-red-500">*</span>
                                </h2>
                                <input
                                    type="text"
                                    value={whatsappLink}
                                    onChange={(e) => setWhatsappLink(e.target.value)}
                                    placeholder="https://chat.whatsapp.com/ABC123XyZ456DeFgHiJkLm"
                                    className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                                        whatsappLink.trim() 
                                            ? 'border-gray-300 focus:ring-blue-500 focus:border-transparent text-gray-600' 
                                            : 'border-red-300 focus:ring-red-500 focus:border-transparent text-gray-600'
                                    }`}
                                    required
                                />
                                {!whatsappLink.trim() && (
                                    <p className="text-red-500 text-sm mt-2">WhatsApp group link is required</p>
                                )}
                            </div>

                            {/* Create & Publish Button */}
                            <div className="flex justify-center mt-auto">
                                <button 
                                    onClick={handleCreateAndPublish}
                                    disabled={!isFormValid}
                                    className={`rounded-lg px-8 py-2 font-semibold transition-colors duration-200 ${
                                        isFormValid 
                                            ? 'bg-yellow-300 hover:bg-yellow-400 text-gray-900 cursor-pointer' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Create & Publish
                                </button>
                            </div>
                        </div>

                        {/* Right Sidebar - Calendar */}
                        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col">
                            <div className="font-bold text-lg md:text-xl mb-4 text-center">
                                Kandy Trips
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

            {/* Success Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center">
                        <div className="mb-4">
                            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Success!
                        </h3>
                        <p className="text-gray-600">
                            Create a new trip and Published it
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingTripDetails03;