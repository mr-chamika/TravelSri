import React, { useState } from "react";

const HotelQuotation = () => {
    const [formData, setFormData] = useState({
        pendingTripId: "",
        hotelId: "",
        price: "",
        quotationPdf: null
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(""); // Clear error when user types
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileValidation(file);
    };

    // Handle drag and drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileValidation(e.dataTransfer.files[0]);
        }
    };

    // Validate file
    const handleFileValidation = (file) => {
        if (!file) return;

        // Check file type
        if (file.type !== "application/pdf") {
            setError("Please select a PDF file only");
            return;
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            setError("File size must be less than 10MB");
            return;
        }

        setFormData(prev => ({
            ...prev,
            quotationPdf: file
        }));
        setError("");
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (!formData.pendingTripId.trim()) {
            setError("Please enter a pending trip ID");
            return;
        }

        if (!formData.hotelId.trim()) {
            setError("Please enter a hotel ID");
            return;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            setError("Please enter a valid price");
            return;
        }

        if (!formData.quotationPdf) {
            setError("Please select a PDF file");
            return;
        }

        setLoading(true);

        try {
            // Create FormData for file upload
            const uploadData = new FormData();
            uploadData.append('pendingTripId', formData.pendingTripId.trim());
            uploadData.append('hotelId', formData.hotelId.trim());
            uploadData.append('price', parseFloat(formData.price));
            uploadData.append('quotationPdf', formData.quotationPdf);

            // API call to your backend
            const response = await fetch('http://localhost:8080/api/hotel-quotation/create', {
                method: 'POST',
                body: uploadData,
            });

            if (response.ok) {
                const result = await response.json();
                setSuccess(`Hotel quotation created successfully! ID: ${result.quotationId}`);
                
                // Reset form
                setFormData({
                    pendingTripId: "",
                    hotelId: "",
                    price: "",
                    quotationPdf: null
                });
                
                // Clear file input
                const fileInput = document.getElementById('pdfFile');
                if (fileInput) fileInput.value = '';
                
            } else {
                const errorText = await response.text();
                setError(`Failed to create quotation: ${errorText || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error creating quotation:', error);
            setError("Cannot connect to server. Please make sure the backend is running on port 8080.");
        } finally {
            setLoading(false);
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-gray-100 p-4 md:p-8">
                    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                Upload Hotel Quotation
                            </h1>
                            <p className="text-gray-600">
                                Submit your hotel accommodation quotation with PDF document
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

                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {success}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Pending Trip ID */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-3 text-lg">
                                    Pending Trip ID *
                                </label>
                                <input
                                    type="text"
                                    name="pendingTripId"
                                    value={formData.pendingTripId}
                                    onChange={handleInputChange}
                                    placeholder="Enter the pending trip ID"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                                    required
                                />
                            </div>

                            {/* Hotel ID */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-3 text-lg">
                                    Hotel ID *
                                </label>
                                <input
                                    type="text"
                                    name="hotelId"
                                    value={formData.hotelId}
                                    onChange={handleInputChange}
                                    placeholder="Enter the hotel ID"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-3 text-lg">
                                    Accommodation Price (LKR) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter the accommodation price"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                                    required
                                />
                            </div>

                            {/* PDF Upload */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-3 text-lg">
                                    Hotel Quotation PDF *
                                </label>
                                
                                {/* Drag and Drop Area */}
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                                        dragActive 
                                            ? "border-purple-500 bg-purple-50" 
                                            : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        id="pdfFile"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    
                                    {formData.quotationPdf ? (
                                        <div className="space-y-2">
                                            <svg className="w-12 h-12 mx-auto text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                            </svg>
                                            <p className="text-green-600 font-medium">{formData.quotationPdf.name}</p>
                                            <p className="text-sm text-gray-500">{formatFileSize(formData.quotationPdf.size)}</p>
                                            <p className="text-xs text-gray-400">Click to change file</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="text-gray-600 font-medium">
                                                Drag and drop your PDF file here
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                or click to browse files
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                PDF files only, max 10MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || !formData.pendingTripId.trim() || !formData.hotelId.trim() || !formData.price || !formData.quotationPdf}
                                    className={`w-full py-3 px-6 font-semibold rounded-lg transition-all duration-200 ${
                                        loading || !formData.pendingTripId.trim() || !formData.hotelId.trim() || !formData.price || !formData.quotationPdf
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-yellow-300 hover:bg-yellow-400 text-gray-900 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                        </div>
                                    ) : (
                                        "Upload Hotel Quotation"
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Info Section */}
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">Important Notes:</h3>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• Only PDF files are accepted</li>
                                <li>• Maximum file size is 10MB</li>
                                <li>• Ensure the pending trip ID is correct</li>
                                <li>• Ensure the hotel ID is correct</li>
                                <li>• Price should be in Sri Lankan Rupees (LKR)</li>
                                <li>• Include room details and amenities in the PDF</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelQuotation;