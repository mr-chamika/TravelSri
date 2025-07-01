import React, { useState } from "react";

const CreateTrip02 = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tripTitle, setTripTitle] = useState("");
    const [numberOfSlots, setNumberOfSlots] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

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

    const handleSendNotification = () => {
        alert("Notifications sent to available hotels, vehicles, and guides!");
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
                            {/* Add a Title */}
                            <div className="mb-6">
                                <label className="block text-gray-600 font-medium mb-3 text-lg">
                                    Add a Title to new trip:
                                </label>
                                <input
                                    type="text"
                                    value={tripTitle}
                                    onChange={(e) => setTripTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter trip title..."
                                />
                            </div>

                            {/* Number of Slots */}
                            <div className="mb-8">
                                <label className="block text-gray-600 font-medium mb-3 text-lg">
                                    Select the number of slots:
                                </label>
                                <input
                                    type="number"
                                    value={numberOfSlots}
                                    onChange={(e) => setNumberOfSlots(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter number of slots..."
                                    min="1"
                                />
                            </div>

                            {/* Available Resources */}
                            <div className="flex flex-col gap-4 mb-8">
                                {availableResources.map((item, idx) => (
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
                                        <span className="text-gray-500 text-sm font-medium cursor-pointer hover:underline sm:ml-auto">
                                            {item.action}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Notification Section */}
                            <div className="text-center mb-6">
                                <p className="text-gray-600 mb-4">
                                    Send notifications to available hotels, vehicles and guides to send their quotation
                                </p>
                                <button 
                                    onClick={handleSendNotification}
                                    className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-8 py-2 transition-colors duration-200 cursor-pointer"
                                >
                                    Send Notification
                                </button>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col">
                            <div className="font-bold text-lg md:text-xl mb-4 text-center">
                                Select the Date:
                            </div>
                            
                            {/* Date Picker/Calendar */}
                            <div className="bg-gray-100 rounded-xl p-4 w-full mb-8 flex flex-col items-center">
                                <div className="w-full max-w-sm">
                                    {/* Simple date input - you can replace with a proper calendar component */}
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Pending Stage Section */}
                            <div className="bg-gray-100 rounded-xl p-6 w-full flex flex-col items-center">
                                <div className="flex items-center gap-4 mb-4">
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
                                <a href="/allpendingtrips" className="w-full md:w-auto">
                                    <button className="bg-gray-900 text-white rounded-lg px-6 py-2 font-semibold hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                                        VIEW pending Trip
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