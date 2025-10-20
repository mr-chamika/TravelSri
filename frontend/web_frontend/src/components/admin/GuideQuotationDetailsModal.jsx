import React, { useState } from 'react';
import axios from 'axios';
import GuideDetailsModal from './GuideDetailsModal';

const GuideQuotationDetailsModal = ({ isOpen, onClose, quotation }) => {
    const [guideDetailsOpen, setGuideDetailsOpen] = useState(false);
    const [guideData, setGuideData] = useState(null);
    const [loadingGuide, setLoadingGuide] = useState(false);

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
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'expired':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const handleViewGuideDetails = async () => {
        if (!quotation.guideId) {
            alert('Guide ID not available');
            return;
        }

        setLoadingGuide(true);
        try {
            console.log("=== FETCHING GUIDE DETAILS ===");
            console.log("Guide ID:", quotation.guideId);

            const response = await axios.get(`http://localhost:8080/api/guides/${quotation.guideId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Guide details response:", response.data);
            setGuideData(response.data);
            setGuideDetailsOpen(true);
        } catch (error) {
            console.error("Error fetching guide details:", error);
            
            if (error.response?.status === 404) {
                alert('Guide not found. The guide may have been removed from the system.');
            } else if (error.response?.status === 500) {
                alert('Server error occurred while fetching guide details.');
            } else {
                alert('Unable to fetch guide details. Please try again later.');
            }
        } finally {
            setLoadingGuide(false);
        }
    };

    const handleCloseGuideDetails = () => {
        setGuideDetailsOpen(false);
        setGuideData(null);
    };

    const handleSelectQuotation = () => {
        localStorage.setItem('selectedGuideQuotation', JSON.stringify(quotation));
        alert(`Selected: Guide ${quotation.guideId} - ${formatPriceLKR(quotation.quotedAmount)}`);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Guide Quotation Details</h2>
                            <p className="text-sm text-gray-600 mt-1">Guide ID: {quotation.guideId || 'N/A'}</p>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Guide ID</label>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-lg font-semibold text-gray-900">{quotation.guideId || 'N/A'}</div>
                                        {quotation.guideId && (
                                            <button
                                                onClick={handleViewGuideDetails}
                                                disabled={loadingGuide}
                                                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50"
                                            >
                                                {loadingGuide ? 'Loading...' : 'Guide Details'}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pending Trip ID</label>
                                    <div className="text-gray-900">{quotation.pendingTripId || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Date</label>
                                    <div className="text-gray-900">{formatDate(quotation.quotationDate)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                                    <div className="text-gray-900">{formatDate(quotation.createdAt)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                                    <div className="text-gray-900">{formatDate(quotation.updatedAt)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Details */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Information</h3>
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                                <div className="text-center">
                                    <div className="text-sm text-gray-600 mb-2">Quoted Amount</div>
                                    <div className="text-3xl font-bold text-green-600">
                                        {formatPriceLKR(quotation.quotedAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes and Comments */}
                        {quotation.quotationNotes && (
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quotation Notes</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-gray-900 whitespace-pre-wrap">{quotation.quotationNotes}</div>
                                </div>
                            </div>
                        )}

                        {/* Additional Information */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-sm text-blue-600 font-medium mb-1">Quotation ID</div>
                                    <div className="text-lg font-semibold text-blue-800">{quotation._id || 'N/A'}</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-sm text-green-600 font-medium mb-1">Service Type</div>
                                    <div className="text-lg font-semibold text-green-800">Tour Guide Service</div>
                                </div>
                            </div>
                        </div>

                        {/* Quotation Summary */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quotation Summary</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Guide ID:</span>
                                    <span className="font-medium text-gray-900">{quotation.guideId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Status:</span>
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(quotation.status)}`}>
                                        {quotation.status || 'Pending'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Quoted Amount:</span>
                                    <span className="font-bold text-lg text-green-600">{formatPriceLKR(quotation.quotedAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Trip ID:</span>
                                    <span className="font-medium text-gray-900">{quotation.pendingTripId}</span>
                                </div>
                            </div>
                        </div>
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
                            onClick={handleSelectQuotation}
                            className="px-6 py-2 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                        >
                            Select This Quotation
                        </button>
                    </div>
                </div>
            </div>

            {/* Guide Details Modal (Nested Modal) */}
            <GuideDetailsModal 
                isOpen={guideDetailsOpen}
                onClose={handleCloseGuideDetails}
                guide={guideData}
                loading={loadingGuide}
            />
        </>
    );
};

export default GuideQuotationDetailsModal;