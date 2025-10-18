import React, {useState} from 'react';
import axios from 'axios';
import HotelDetailsModal from './HotelDetailsModal';

const QuotationDetailsModal = ({ isOpen, onClose, quotation }) => {
    const [hotelDetailsOpen, setHotelDetailsOpen] = useState(false);
    const [hotelData, setHotelData] = useState(null);
    const [loadingHotel, setLoadingHotel] = useState(false);

    if (!isOpen || !quotation) return null;

    const formatPriceLKR = (price) => {
        if (price == null || isNaN(price)) return 'LKR 0.00';
        return `LKR ${parseFloat(price).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'under review':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleViewHotelDetails = async () => {
        if (!quotation.hotelId) {
            alert('Hotel ID not available');
            return;
        }

        setLoadingHotel(true);
        try {
            console.log("=== FETCHING HOTEL DETAILS ===");
            console.log("Hotel ID:", quotation.hotelId);

            const response = await axios.get(`http://localhost:8080/hotels/${quotation.hotelId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Hotel details response:", response.data);
            setHotelData(response.data);
            setHotelDetailsOpen(true);
        } catch (error) {
            console.error("Error fetching hotel details:", error);
            
            if (error.response?.status === 404) {
                alert('Hotel not found. The hotel may have been removed from the system.');
            } else if (error.response?.status === 500) {
                alert('Server error occurred while fetching hotel details.');
            } else {
                alert('Unable to fetch hotel details. Please try again later.');
            }
        } finally {
            setLoadingHotel(false);
        }
    };

    const handleCloseHotelDetails = () => {
        setHotelDetailsOpen(false);
        setHotelData(null);
    };

    return (
        <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Hotel Quotation Details</h2>
                        <p className="text-sm text-gray-600 mt-1">Quote #{quotation.quoteNumber || quotation.quotationId}</p>
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
                    {/* Status and Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel ID</label>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-lg font-semibold text-gray-900">{quotation.hotelId || 'N/A'}</div>
                                        {quotation.hotelId && (
                                            <button
                                                onClick={handleViewHotelDetails}
                                                disabled={loadingHotel}
                                                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50"
                                            >
                                                {loadingHotel ? 'Loading...' : 'Hotel Details'}
                                            </button>
                                        )}
                                    </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(quotation.status)}`}>
                                    {quotation.status || 'Pending'}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
                                <div className="text-gray-900">{quotation.groupSize || 'N/A'} people</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pending Trip</label>
                                <div className="text-gray-900">{quotation.pendingTripName || quotation.pendingTripId || 'N/A'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                                <div className="text-gray-900">{formatDate(quotation.createdAt)}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Username</label>
                                <div className="text-gray-900">{quotation.hotelUsername || quotation.createdBy || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Stay Dates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                                <div className="text-gray-900">{formatDate(quotation.checkInDate)}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                                <div className="text-gray-900">{formatDate(quotation.checkOutDate)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Room Details */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Requirements</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-sm text-blue-600 font-medium">Standard Rooms</div>
                                <div className="text-xl font-bold text-blue-800">{quotation.standardRooms || 0}</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                                <div className="text-sm text-purple-600 font-medium">Delux Rooms</div>
                                <div className="text-xl font-bold text-purple-800">{quotation.deluxRooms || 0}</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <div className="text-sm text-green-600 font-medium">Family Rooms</div>
                                <div className="text-xl font-bold text-green-800">{quotation.familyRooms || 0}</div>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg">
                                <div className="text-sm text-yellow-600 font-medium">Suites</div>
                                <div className="text-xl font-bold text-yellow-800">{quotation.suites || 0}</div>
                            </div>
                        </div>
                    </div>

                    {/* Meal Plan & Requirements */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
                                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{quotation.mealPlan || 'Not specified'}</div>
                            </div>
                            {quotation.specialRequirements && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                                    <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{quotation.specialRequirements}</div>
                                </div>
                            )}
                            {quotation.adminNotes && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                                    <div className="text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{quotation.adminNotes}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Details</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Accommodation Price per Person:</span>
                                <span className="font-semibold text-gray-900">{formatPriceLKR(quotation.accommodationPricePerPerson)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Meal Price per Person:</span>
                                <span className="font-semibold text-gray-900">{formatPriceLKR(quotation.mealPricePerPerson)}</span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800">Total Price per Person:</span>
                                    <span className="text-xl font-bold text-blue-600">{formatPriceLKR(quotation.totalPricePerPerson)}</span>
                                </div>
                            </div>
                            
                            <div className="border-t pt-3 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Total Amount:</span>
                                    <span className="font-semibold text-gray-900">{formatPriceLKR(quotation.totalAmount)}</span>
                                </div>
                                {quotation.discountOffered > 0 && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <span>Discount Offered:</span>
                                        <span className="font-semibold">-{formatPriceLKR(quotation.discountOffered)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                                    <span className="text-gray-800">Final Amount:</span>
                                    <span className="text-green-600">{formatPriceLKR(quotation.finalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Group Total Calculation */}
                    {quotation.groupSize && quotation.totalPricePerPerson && (
                        <div className="border-t pt-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-blue-800 mb-2">Group Total Calculation</h3>
                                <div className="text-blue-700">
                                    {quotation.groupSize} people × {formatPriceLKR(quotation.totalPricePerPerson)} = 
                                    <span className="font-bold text-xl ml-2">{formatPriceLKR(quotation.groupSize * quotation.totalPricePerPerson)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            localStorage.setItem('selectedHotelQuotation', JSON.stringify(quotation));
                            alert(`Selected: ${quotation.hotelId} - ${formatPriceLKR(quotation.totalPricePerPerson || quotation.finalAmount)}`);
                            onClose();
                        }}
                        className="px-6 py-2 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                    >
                        Select This Quotation
                    </button>
                </div>
            </div>
        </div>
        {/* Hotel Details Modal (Nested Modal) */}
            <HotelDetailsModal 
                isOpen={hotelDetailsOpen}
                onClose={handleCloseHotelDetails}
                hotel={hotelData}
                loading={loadingHotel}
            />

        </>
    );
};

export default QuotationDetailsModal;