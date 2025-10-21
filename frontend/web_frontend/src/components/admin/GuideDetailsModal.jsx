import React from 'react';

const GuideDetailsModal = ({ isOpen, onClose, guide, loading }) => {
    if (!isOpen) return null;

    const formatPriceLKR = (price) => {
        if (price == null || isNaN(price)) return 'LKR 0.00';
        return `LKR ${parseFloat(price).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const renderStars = (rating) => {
        const starCount = rating || 0;
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                    <svg
                        key={index}
                        className={`w-5 h-5 ${index < starCount ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">({starCount}/5)</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Loading guide details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Guide Not Found</h3>
                        <p className="text-gray-500 mb-6">Unable to load guide details. The guide may not exist or there was an error.</p>
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
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50 rounded-t-xl">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {guide.guideName || guide.name || 'Guide Details'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Guide ID: {guide._id || guide.guideId}
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
                    {/* Guide Images */}
                    {guide.profileImage && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Image</h3>
                            <div className="w-full max-w-md">
                                <img
                                    src={guide.profileImage}
                                    alt="Guide profile"
                                    className="w-48 h-48 object-cover rounded-full shadow-md mx-auto"
                                    onError={(e) => {
                                        e.target.src = '/api/placeholder/200/200';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Certification Images */}
                    {guide.certificationImages && guide.certificationImages.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Certifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {guide.certificationImages.slice(0, 6).map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image}
                                            alt={`Certification ${index + 1}`}
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

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Guide Name</label>
                                <div className="text-lg font-semibold text-gray-900">
                                    {guide.guideName || guide.name || 'N/A'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                                <div className="text-gray-900">{guide.experienceLevel || 'N/A'}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ratings</label>
                                {renderStars(guide.rating || guide.stars)}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                                <div className="space-y-1">
                                    <div className="text-gray-900">{guide.phoneNumber || guide.mobileNumber || 'N/A'}</div>
                                    {guide.email && (
                                        <div className="text-gray-600 text-sm">{guide.email}</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <div className="text-gray-900">
                                    {guide.location || guide.city || 'N/A'}
                                </div>
                                {guide.district && (
                                    <div className="text-sm text-gray-600">
                                        {guide.district}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                                <div className="text-gray-900">
                                    {guide.yearsOfExperience || 'N/A'} years
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                                <div className="text-gray-900">{guide.licenseNumber || guide.guideLicense || 'N/A'}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                <div className="text-gray-900">{guide.age || 'N/A'} years old</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                                <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                                    guide.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {guide.isVerified ? 'Verified' : 'Not Verified'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
                                <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                                    guide.isAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {guide.isAvailable ? 'Available' : 'Busy'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Information */}
                    {(guide.dailyRate || guide.hourlyRate) && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {guide.dailyRate && (
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="text-sm text-green-600 font-medium">Daily Rate</div>
                                        <div className="text-lg font-semibold text-green-800">
                                            {formatPriceLKR(guide.dailyRate)}
                                        </div>
                                    </div>
                                )}
                                {guide.hourlyRate && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="text-sm text-blue-600 font-medium">Hourly Rate</div>
                                        <div className="text-lg font-semibold text-blue-800">
                                            {formatPriceLKR(guide.hourlyRate)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {guide.languages && guide.languages.length > 0 && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Languages</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {guide.languages.map((language, index) => (
                                    <div key={index} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {language}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Specializations */}
                    {guide.specializations && guide.specializations.length > 0 && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Specializations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {guide.specializations.map((specialization, index) => (
                                    <div key={index} className="flex items-center text-green-700">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {specialization}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Areas of Expertise */}
                    {guide.areasOfExpertise && guide.areasOfExpertise.length > 0 && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Areas of Expertise</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {guide.areasOfExpertise.map((area, index) => (
                                    <div key={index} className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full text-sm">
                                        {area}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bio/Description */}
                    {guide.bio && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Biography</h3>
                            <div className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                                {guide.bio}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {guide.education && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Education</h3>
                            <div className="text-gray-900 bg-blue-50 p-4 rounded-lg">
                                {guide.education}
                            </div>
                        </div>
                    )}

                    {/* Reviews Statistics */}
                    {(guide.totalReviews || guide.reviewCount) && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reviews Statistics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {guide.rating || guide.averageRating || 'N/A'}
                                    </div>
                                    <div className="text-sm text-yellow-700">Average Rating</div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {guide.totalReviews || guide.reviewCount || 0}
                                    </div>
                                    <div className="text-sm text-blue-700">Total Reviews</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {guide.completedTours || 0}
                                    </div>
                                    <div className="text-sm text-green-700">Tours Completed</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Business Information */}
                    {(guide.businessLicense || guide.username) && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {guide.username && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        <div className="text-gray-900">{guide.username}</div>
                                    </div>
                                )}
                                {guide.businessLicense && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Business License</label>
                                        <div className="text-gray-900">{guide.businessLicense}</div>
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

export default GuideDetailsModal;