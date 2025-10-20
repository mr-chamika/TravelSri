import React, { useState, useEffect } from "react";
import axios from "axios";
import QuotationDetailsModal from "../../components/admin/QuotationDetailsModal";

const AllHotelQuotation = () => {
    const [hotelQuotations, setHotelQuotations] = useState([]);
    const [tripData, setTripData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);

    const API_BASE_URL = "http://localhost:8080/api/quotations";

    useEffect(() => {
        loadQuotations();
        loadTripData();
    }, []);

    //old loadQuotations function
    // const loadQuotations = () => {
    //     const storedQuotations = localStorage.getItem('hotelQuotationsForTrip');
    //     if (storedQuotations) {
    //         setHotelQuotations(JSON.parse(storedQuotations));
    //     }
    //     setLoading(false);
    // };

    const loadQuotations = () => {
        const storedQuotations = localStorage.getItem('hotelQuotationsForTrip');
        if (storedQuotations) {
            const quotations = JSON.parse(storedQuotations);
            console.log("=== LOADED HOTEL QUOTATIONS ===");
            console.log("Quotations:", quotations);
            if (quotations.length > 0) {
                console.log("First quotation:", quotations[0]);
                console.log("Available fields:", Object.keys(quotations[0]));
            }
            console.log("==============================");
            setHotelQuotations(quotations);
        }
        setLoading(false);
    };

    const loadTripData = () => {
        const storedTripData = localStorage.getItem('currentTripData');
        if (storedTripData) {
            setTripData(JSON.parse(storedTripData));
        }
    };

    const formatPriceLKR = (price) => {
        if (price == null || isNaN(price)) return 'LKR 0.00';
        return `LKR ${parseFloat(price).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    //Old handleViewQuotation function
    // const handleViewQuotation = async (quotationId) => {
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}/trip/${quotationId}`, {
    //             responseType: 'blob'
    //         });
            
    //         const blob = new Blob([response.data], { type: 'application/pdf' });
    //         const url = window.URL.createObjectURL(blob);
    //         window.open(url, '_blank');
    //     } catch (error) {
    //         console.error("Error downloading PDF:", error);
    //         alert("Unable to view quotation PDF. Please try again.");
    //     }
    // };

    const handleViewQuotation = (quotation) => {
        console.log("=== VIEWING QUOTATION ===");
        console.log("Selected quotation:", quotation);
        console.log("========================");
        setSelectedQuotation(quotation);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedQuotation(null);
    };

    const handleSelectQuotation = (quotation) => {
        localStorage.setItem('selectedHotelQuotation', JSON.stringify(quotation));
        const price = quotation.totalPricePerPerson || quotation.finalAmount || quotation.totalAmount;
        alert(`Selected: ${quotation.hotelId} - ${formatPriceLKR(quotation.price)}`);
    };

    const handleDownloadPDF = async (quotationId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${quotationId}/pdf`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert("Unable to download quotation PDF. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-100 justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-gray-100 py-4 px-2 flex justify-center items-start">
                    <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl min-h-[400px] p-4 md:p-8">
                        <div className="flex items-center justify-between mb-8 md:mb-12">
                            <div>
                                <h1 className="font-bold text-2xl md:text-3xl text-gray-800 mb-2">
                                    {tripData?.title || "Trip"} <span className="text-gray-500 font-normal text-lg">(All hotels quotations)</span>
                                </h1>
                                <a href="/pendingtripdetails" className="inline-block">
                                    <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-3 py-1 transition-colors duration-200 text-sm">
                                        <svg className="mr-2" width="16" height="16" fill="none" viewBox="0 0 24 24">
                                            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Back to Trip Details
                                    </button>
                                </a>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-4 md:gap-6 mb-8">
                            {hotelQuotations.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 mb-4">
                                        <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 7h6m-6 4h6m-6 4h6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hotel quotations found</h3>
                                    <p className="text-gray-500">There are currently no hotel quotations available for this trip.</p>
                                </div>
                            ) : (
                                hotelQuotations.map((hotel, idx) => (
                                    <div
                                        key={hotel.quotationId || idx}
                                        className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-100 rounded-xl px-4 md:px-6 py-4 md:py-5 hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        <div className="flex-1 w-full mb-3 sm:mb-0">
                                            <div className="font-medium text-base md:text-lg text-gray-800 mb-1">
                                                Hotel ID: {hotel.hotelId || `Hotel ${idx + 1}`}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                {/* {formatPriceLKR(hotel.totalPricePerPerson)} */}
                                                Total Price Per Person: {formatPriceLKR(hotel.totalPricePerPerson)} | Meal Price : {formatPriceLKR(hotel.mealPricePerPerson)} | Accommodation Price : {formatPriceLKR(hotel.accommodationPricePerPerson)}
                                            </div>
                                            {/* {hotel.pdfFilename && (
                                                <div className="text-xs text-gray-500">
                                                    PDF: {hotel.pdfFilename}
                                                </div>
                                            )} */}
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    hotel.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    hotel.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    hotel.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {hotel.status || 'Pending'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Group Size: {hotel.groupSize || 'N/A'}
                                                </span>
                                                {hotel.quoteNumber && (
                                                    <span className="text-xs text-gray-500">
                                                        Quote #: {hotel.quoteNumber}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleViewQuotation(hotel)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded px-4 py-1 text-sm transition-colors duration-200"
                                            >
                                                View Details
                                            </button>
                                            {hotel.quotationPdf && (
                                                <button 
                                                    onClick={() => handleDownloadPDF(hotel.quotationId)}
                                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded px-4 py-1 text-sm transition-colors duration-200"
                                                >
                                                    PDF
                                                </button>
                                            )}
                                            {/* <button 
                                                onClick={() => handleSelectQuotation(hotel)}
                                                className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded px-4 py-1 text-sm transition-colors duration-200"
                                                title="Select this quotation"
                                            >
                                                Select
                                            </button> */}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex justify-center">
                            <a href="/pendingtripdetails" className="w-full sm:w-auto">
                                <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-8 py-2 transition-colors duration-200 cursor-pointer w-full sm:w-auto">
                                    Continue
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quotation Details Modal */}
            <QuotationDetailsModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                quotation={selectedQuotation}
            />
        </div>
    );
};

export default AllHotelQuotation;