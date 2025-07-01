import React, { useState } from "react";


const CreateTrip01 = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [startingLocation, setStartingLocation] = useState("");
    const [endingLocation, setEndingLocation] = useState("");

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Only include sidebar here - remove any duplicate sidebar from AdminNavbar */}
            {/* <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Make sure AdminNavbar doesn't include its own sidebar */}
                {/* <AdminNavbar onMenuClick={() => setSidebarOpen(true)} /> */}

                {/* Page Content */}
                <div className="flex-1 bg-gray-100 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-8">
                        {/* Starting Location */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Starting Location
                            </label>
                            <select
                                value={startingLocation}
                                onChange={(e) => setStartingLocation(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-500"
                            >
                                <option value="">Select the starting location</option>
                                <option value="colombo">Colombo</option>
                                <option value="kandy">Kandy</option>
                                <option value="galle">Galle</option>
                                <option value="anuradhapura">Anuradhapura</option>
                            </select>
                        </div>

                        {/* Ending Location */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Ending Location
                            </label>
                            <select
                                value={endingLocation}
                                onChange={(e) => setEndingLocation(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-500"
                            >
                                <option value="">Select the ending location</option>
                                <option value="colombo">Colombo</option>
                                <option value="kandy">Kandy</option>
                                <option value="galle">Galle</option>
                                <option value="anuradhapura">Anuradhapura</option>
                            </select>
                        </div>

                        {/* Select the path */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Select the path
                            </label>
                            {/* Map Container */}
                            <div className="bg-gray-200 rounded-lg h-64 md:h-80 flex items-center justify-center">
                                <div className="text-gray-500 text-center">
                                    <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24" className="mx-auto mb-2">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    <p>Map will be displayed here</p>
                                    <p className="text-sm">Select starting and ending locations to view the route</p>
                                </div>
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className="flex justify-end">
                            <a href="/createtrip02" className="w-full md:w-auto">
                                <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-8 py-2 transition-colors duration-200 cursor-pointer">
                                    Next
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTrip01;