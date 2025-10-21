import React from 'react';

const VehicleDetailsModal = ({ isOpen, onClose, vehicle, loading }) => {
    if (!isOpen) return null;

    const formatPriceLKR = (price) => {
        if (price == null || isNaN(price)) return 'LKR 0.00';
        return `LKR ${parseFloat(price).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Loading vehicle details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Vehicle Not Found</h3>
                        <p className="text-gray-500 mb-6">Unable to load vehicle details. The vehicle may not exist or there was an error.</p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-50 rounded-t-xl">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {vehicle.vehicleName || vehicle.model || 'Vehicle Details'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Vehicle ID: {vehicle._id || vehicle.vehicleId}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Vehicle Images */}
                    {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Images</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vehicle.vehicleImages.slice(0, 6).map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image}
                                            alt={`Vehicle image ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg shadow-md"
                                            onError={(e) => {
                                                e.target.src = '/api/placeholder/300/200';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Primary Vehicle Image */}
                    {vehicle.primaryImage && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Primary Image</h3>
                            <div className="w-full max-w-2xl">
                                <img
                                    src={vehicle.primaryImage}
                                    alt="Primary vehicle image"
                                    className="w-full h-64 object-cover rounded-lg shadow-md"
                                    onError={(e) => {
                                        e.target.src = '/api/placeholder/400/300';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name/Model</label>
                                <div className="text-lg font-semibold text-gray-900">
                                    {vehicle.vehicleName || vehicle.model || 'N/A'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                <div className="text-gray-900">{vehicle.vehicleType || vehicle.type || 'N/A'}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                                <div className="text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded">
                                    {vehicle.licensePlate || vehicle.plateNumber || 'N/A'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand/Make</label>
                                <div className="text-gray-900">{vehicle.brand || vehicle.make || 'N/A'}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <div className="text-gray-900">{vehicle.year || vehicle.manufacturingYear || 'N/A'}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                <div className="text-gray-900">{vehicle.color || 'N/A'}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                                <div className="text-gray-900">
                                    {vehicle.capacity || vehicle.seatingCapacity || 'N/A'} passengers
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                <div className="text-gray-900">{vehicle.fuelType || 'N/A'}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                                <div className="text-gray-900">{vehicle.transmission || 'N/A'}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                                <div className="text-gray-900">
                                    {vehicle.mileage ? `${vehicle.mileage} km` : 'N/A'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Air Conditioning</label>
                                <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                                    vehicle.airConditioning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {vehicle.airConditioning ? 'Available' : 'Not Available'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
                                <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                                    vehicle.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {vehicle.isAvailable ? 'Available' : 'Not Available'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Driver Information */}
                    {(vehicle.driverName || vehicle.driverLicense) && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {vehicle.driverName && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                                        <div className="text-gray-900">{vehicle.driverName}</div>
                                    </div>
                                )}
                                {vehicle.driverLicense && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver License</label>
                                        <div className="text-gray-900">{vehicle.driverLicense}</div>
                                    </div>
                                )}
                                {vehicle.driverExperience && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver Experience</label>
                                        <div className="text-gray-900">{vehicle.driverExperience} years</div>
                                    </div>
                                )}
                                {vehicle.driverPhone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver Contact</label>
                                        <div className="text-gray-900">{vehicle.driverPhone}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Pricing Information */}
                    {(vehicle.dailyRate || vehicle.hourlyRate || vehicle.pricePerDay || vehicle.pricePerKm) && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {(vehicle.dailyRate || vehicle.pricePerDay) && (
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <div className="text-sm text-purple-600 font-medium">Daily Rate</div>
                                        <div className="text-lg font-semibold text-purple-800">
                                            {formatPriceLKR(vehicle.dailyRate || vehicle.pricePerDay)}
                                        </div>
                                    </div>
                                )}
                                {vehicle.hourlyRate && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="text-sm text-blue-600 font-medium">Hourly Rate</div>
                                        <div className="text-lg font-semibold text-blue-800">
                                            {formatPriceLKR(vehicle.hourlyRate)}
                                        </div>
                                    </div>
                                )}
                                {vehicle.pricePerKm && (
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="text-sm text-green-600 font-medium">Price per KM</div>
                                        <div className="text-lg font-semibold text-green-800">
                                            {formatPriceLKR(vehicle.pricePerKm)}
                                        </div>
                                    </div>
                                )}
                                {vehicle.weeklyRate && (
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <div className="text-sm text-yellow-600 font-medium">Weekly Rate</div>
                                        <div className="text-lg font-semibold text-yellow-800">
                                            {formatPriceLKR(vehicle.weeklyRate)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Features & Amenities */}
                    {vehicle.features && vehicle.features.length > 0 && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Features & Amenities</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {vehicle.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-green-700">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {vehicle.description && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                            <div className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                                {vehicle.description}
                            </div>
                        </div>
                    )}

                    {/* Insurance & Safety */}
                    {(vehicle.insuranceDetails || vehicle.safetyFeatures) && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Insurance & Safety</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {vehicle.insuranceDetails && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Details</label>
                                        <div className="text-gray-900 bg-blue-50 p-3 rounded-lg">
                                            {vehicle.insuranceDetails}
                                        </div>
                                    </div>
                                )}
                                {vehicle.safetyFeatures && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Safety Features</label>
                                        <div className="text-gray-900 bg-green-50 p-3 rounded-lg">
                                            {vehicle.safetyFeatures}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Owner Information */}
                    {(vehicle.ownerName || vehicle.ownerContact || vehicle.username) && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Owner Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(vehicle.ownerName || vehicle.username) && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                                        <div className="text-gray-900">{vehicle.ownerName || vehicle.username}</div>
                                    </div>
                                )}
                                {vehicle.ownerContact && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Owner Contact</label>
                                        <div className="text-gray-900">{vehicle.ownerContact}</div>
                                    </div>
                                )}
                                {vehicle.businessLicense && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Business License</label>
                                        <div className="text-gray-900">{vehicle.businessLicense}</div>
                                    </div>
                                )}
                                {vehicle.isVerified !== undefined && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                                            vehicle.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {vehicle.isVerified ? 'Verified' : 'Not Verified'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Maintenance Records */}
                    {vehicle.lastServiceDate && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Maintenance Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Service Date</label>
                                    <div className="text-gray-900">{vehicle.lastServiceDate}</div>
                                </div>
                                {vehicle.nextServiceDue && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Next Service Due</label>
                                        <div className="text-gray-900">{vehicle.nextServiceDue}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsModal;