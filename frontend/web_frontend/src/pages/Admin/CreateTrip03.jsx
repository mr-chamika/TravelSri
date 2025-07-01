import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';

const CreateTrip03 = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [startingLocation, setStartingLocation] = useState("");
    const [endingLocation, setEndingLocation] = useState("");
    const [error, setError] = useState("");
    const [startingDescription, setStartingDescription] = useState("");
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 }); // Sri Lanka center
    const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

    // Google Maps API loader
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API key
        libraries: ['places', 'geometry']
    });

    // Sri Lankan city coordinates
    const cityCoordinates = {
        colombo: { lat: 6.9271, lng: 79.8612, name: "Colombo" },
        kandy: { lat: 7.2906, lng: 80.6337, name: "Kandy" },
        galle: { lat: 6.0535, lng: 80.2210, name: "Galle" },
        anuradhapura: { lat: 8.3114, lng: 80.4037, name: "Anuradhapura" },
        jaffna: { lat: 9.6615, lng: 80.0255, name: "Jaffna" },
        negombo: { lat: 7.2083, lng: 79.8358, name: "Negombo" },
        matara: { lat: 5.9549, lng: 80.5550, name: "Matara" },
        trincomalee: { lat: 8.5874, lng: 81.2152, name: "Trincomalee" }
    };

    // Map container styling
    const mapContainerStyle = {
        width: '100%',
        height: '100%',
        borderRadius: '8px'
    };

    // Map options
    const mapOptions = {
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
    };

    // Calculate route when both locations are selected
    const calculateRoute = useCallback(async () => {
        if (!startingLocation || !endingLocation || !isLoaded) return;

        const startCoords = cityCoordinates[startingLocation];
        const endCoords = cityCoordinates[endingLocation];

        if (!startCoords || !endCoords) return;

        setIsCalculatingRoute(true);
        setDirectionsResponse(null);

        try {
            const directionsService = new window.google.maps.DirectionsService();
            
            const results = await directionsService.route({
                origin: new window.google.maps.LatLng(startCoords.lat, startCoords.lng),
                destination: new window.google.maps.LatLng(endCoords.lat, endCoords.lng),
                travelMode: window.google.maps.TravelMode.DRIVING,
                optimizeWaypoints: true,
                provideRouteAlternatives: false
            });

            setDirectionsResponse(results);
            
            // Center map on the route
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(new window.google.maps.LatLng(startCoords.lat, startCoords.lng));
            bounds.extend(new window.google.maps.LatLng(endCoords.lat, endCoords.lng));
            
            // Calculate center of bounds
            const center = bounds.getCenter();
            setMapCenter({ lat: center.lat(), lng: center.lng() });

        } catch (error) {
            console.error("Error calculating route:", error);
            setError("Unable to calculate route. Please try again.");
        } finally {
            setIsCalculatingRoute(false);
        }
    }, [startingLocation, endingLocation, isLoaded]);

    // Effect to calculate route when locations change
    useEffect(() => {
        if (startingLocation && endingLocation && startingLocation !== endingLocation) {
            calculateRoute();
        } else {
            setDirectionsResponse(null);
        }
    }, [startingLocation, endingLocation, calculateRoute]);

    // Generate route description from directions response
    const getRouteDescription = () => {
        if (!directionsResponse) return "";
        
        const route = directionsResponse.routes[0];
        if (!route) return "";

        const distance = route.legs[0].distance.text;
        const duration = route.legs[0].duration.text;
        const startCity = cityCoordinates[startingLocation]?.name;
        const endCity = cityCoordinates[endingLocation]?.name;

        return `Route from ${startCity} to ${endCity} - Distance: ${distance}, Estimated time: ${duration}`;
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

        // Store trip data for next page
        const tripStep1Data = {
            startLocation: startingLocation.trim(),
            endLocation: endingLocation.trim(),
            descriptionAboutStartLocation: startingDescription.trim(),
            path: directionsResponse ? getRouteDescription() : `Route from ${startingLocation} to ${endingLocation}`
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
                                    setError("");
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
                                    setError("");
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
                                    setError("");
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

                        {/* Google Maps Route Display */}
                        <div className="mb-8">
                            <label className="block text-gray-700 font-medium mb-3 text-lg">
                                Route Preview
                            </label>
                            
                            {/* Map Container */}
                            <div className="bg-gray-200 rounded-lg h-64 md:h-80 border border-gray-300 relative overflow-hidden">
                                {!isLoaded ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-gray-500 text-center p-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                                            <p>Loading Google Maps...</p>
                                        </div>
                                    </div>
                                ) : !startingLocation || !endingLocation ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-gray-500 text-center p-4">
                                            <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24" className="mx-auto mb-4">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                            </svg>
                                            <p className="text-lg font-medium mb-2">Select locations to view route</p>
                                            <p className="text-sm">Choose both starting and ending locations to see the route on the map</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative h-full">
                                        <GoogleMap
                                            mapContainerStyle={mapContainerStyle}
                                            center={mapCenter}
                                            zoom={8}
                                            options={mapOptions}
                                        >
                                            {isCalculatingRoute && (
                                                <div className="absolute top-4 left-4 bg-white rounded-lg px-4 py-2 shadow-lg z-10">
                                                    <div className="flex items-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                                                        <span className="text-sm text-gray-600">Calculating route...</span>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {directionsResponse ? (
                                                <DirectionsRenderer
                                                    directions={directionsResponse}
                                                    options={{
                                                        polylineOptions: {
                                                            strokeColor: "#8B5CF6",
                                                            strokeWeight: 5,
                                                            strokeOpacity: 0.8
                                                        },
                                                        markerOptions: {
                                                            icon: {
                                                                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                                                                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                                                        <circle cx="20" cy="20" r="18" fill="#8B5CF6" stroke="white" stroke-width="4"/>
                                                                        <circle cx="20" cy="20" r="8" fill="white"/>
                                                                    </svg>
                                                                `),
                                                                scaledSize: new window.google.maps.Size(40, 40),
                                                                anchor: new window.google.maps.Point(20, 20)
                                                            }
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    {startingLocation && cityCoordinates[startingLocation] && (
                                                        <Marker
                                                            position={cityCoordinates[startingLocation]}
                                                            icon={{
                                                                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                                                                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                                                        <circle cx="20" cy="20" r="18" fill="#10B981" stroke="white" stroke-width="4"/>
                                                                        <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">S</text>
                                                                    </svg>
                                                                `),
                                                                scaledSize: new window.google.maps.Size(40, 40),
                                                                anchor: new window.google.maps.Point(20, 20)
                                                            }}
                                                            title={`Start: ${cityCoordinates[startingLocation].name}`}
                                                        />
                                                    )}
                                                    {endingLocation && cityCoordinates[endingLocation] && (
                                                        <Marker
                                                            position={cityCoordinates[endingLocation]}
                                                            icon={{
                                                                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                                                                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                                                        <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="4"/>
                                                                        <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">E</text>
                                                                    </svg>
                                                                `),
                                                                scaledSize: new window.google.maps.Size(40, 40),
                                                                anchor: new window.google.maps.Point(20, 20)
                                                            }}
                                                            title={`End: ${cityCoordinates[endingLocation].name}`}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </GoogleMap>
                                    </div>
                                )}
                            </div>

                            {/* Route Information */}
                            {directionsResponse && (
                                <div className="mt-4 bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-purple-800 font-medium">Route Calculated Successfully</span>
                                    </div>
                                    <p className="text-purple-700 text-sm leading-relaxed">
                                        {getRouteDescription()}
                                    </p>
                                </div>
                            )}
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

export default CreateTrip03;