import React, { useState } from "react";

const CreateTrip01 = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [startingLocation, setStartingLocation] = useState("");
    const [endingLocation, setEndingLocation] = useState("");
    const [error, setError] = useState("");
    const [startingDescription, setStartingDescription] = useState("");

    // Generate default path based on locations
    const generateDefaultPath = (start, end) => {
        if (!start || !end) return "";
        return `Route from ${start.charAt(0).toUpperCase() + start.slice(1)} to ${end.charAt(0).toUpperCase() + end.slice(1)} via highway`;
    };

    const handleNext = () => {
        // Clear previous errors
        setError("");

        // Validation
        if (!startingLocation || !endingLocation) {
            setError("Please select both starting and ending locations");
            return;
        }

        if (startingLocation === endingLocation) {
            setError("Starting and ending locations cannot be the same");
            return;
        }

        if (!startingDescription.trim()) {
            setError("Please provide a description about the starting location");
            return;
        }

        // Store trip data for next page - ensure all required fields are included
        const tripStep1Data = {
            startLocation: startingLocation.trim(),
            endLocation: endingLocation.trim(),
            descriptionAboutStartLocation: startingDescription.trim(), // Fixed field name
            path: generateDefaultPath(startingLocation, endingLocation)
        };

        // Store in localStorage
        localStorage.setItem('tripStep1Data', JSON.stringify(tripStep1Data));
        
        // Navigate to next page
        window.location.href = "/createtrip02";
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-gray-100 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                Create New Trip - Step 1
                            </h1>
                            <p className="text-gray-600">
                                Set up your trip locations and route details
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Starting Location */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-3 text-lg">
                                Starting Location *
                            </label>
                            <select
                                value={startingLocation}
                                onChange={(e) => {
                                    setStartingLocation(e.target.value);
                                    setError(""); // Clear error when user makes a selection
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                                required
                            >
                                <option value="">Select the starting location</option>
                                <option value="colombo">Colombo</option>
                                <option value="kandy">Kandy</option>
                                <option value="galle">Galle</option>
                                <option value="anuradhapura">Anuradhapura</option>
                                <option value="jaffna">Jaffna</option>
                                <option value="negombo">Negombo</option>
                                <option value="matara">Matara</option>
                                <option value="trincomalee">Trincomalee</option>
                            </select>
                        </div>

                        {/* Ending Location */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-3 text-lg">
                                Ending Location *
                            </label>
                            <select
                                value={endingLocation}
                                onChange={(e) => {
                                    setEndingLocation(e.target.value);
                                    setError(""); // Clear error when user makes a selection
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                                required

                            >
                                <option value="">Select the ending location</option>
                                <option value="colombo">Colombo</option>
                                <option value="kandy">Kandy</option>
                                <option value="galle">Galle</option>
                                <option value="anuradhapura">Anuradhapura</option>
                                <option value="jaffna">Jaffna</option>
                                <option value="negombo">Negombo</option>
                                <option value="matara">Matara</option>
                                <option value="trincomalee">Trincomalee</option>
                            </select>
                        </div>

                        {/* Description about starting location */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-3 text-lg">
                                Description about starting location *
                            </label>
                            <textarea
                                value={startingDescription}
                                onChange={(e) => {
                                    setStartingDescription(e.target.value);
                                    setError(""); // Clear error when user types
                                }}
                                placeholder="Provide detailed pickup location information (e.g., specific address, landmarks, special instructions)..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 resize-vertical"
                                rows="4"
                                maxLength="500"
                                required
                            />
                            <div className="mt-2 text-sm text-gray-500">
                                {startingDescription.length}/500 characters
                            </div>
                        </div>

                        {/* Select the path */}
                        <div className="mb-8">
                            <label className="block text-gray-700 font-medium mb-3 text-lg">
                                Route Preview
                            </label>
                            {/* Map Container */}
                            <div className="bg-gray-200 rounded-lg h-64 md:h-80 flex items-center justify-center border border-gray-300">
                                <div className="text-gray-500 text-center p-4">
                                    <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24" className="mx-auto mb-4">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    {!startingLocation || !endingLocation ? (
                                        <>
                                            <p className="text-lg font-medium mb-2">Map will be displayed here</p>
                                            <p className="text-sm">Select starting and ending locations to view the route</p>
                                        </>
                                    ) : (
                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                            <p className="text-lg font-medium text-purple-600 mb-2">
                                                Generated Route:
                                            </p>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {generateDefaultPath(startingLocation, endingLocation)}
                                            </p>
                                            <div className="mt-3 flex items-center justify-center text-green-600">
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Route ready
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="mb-6">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                            1
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-purple-600">Location & Route</span>
                                    </div>
                                    <div className="w-12 h-1 bg-gray-300 rounded"></div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                                            2
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-500">Trip Details</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className="flex justify-end">
                            <button 
                                onClick={handleNext}
                                disabled={!startingLocation || !endingLocation || !startingDescription.trim()}
                                className={`w-full md:w-auto px-8 py-3 font-semibold rounded-lg transition-all duration-200 ${
                                    !startingLocation || !endingLocation || !startingDescription.trim()
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-yellow-300 hover:bg-yellow-400 text-gray-900 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                }`}
                            >
                                Next Step →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTrip01;