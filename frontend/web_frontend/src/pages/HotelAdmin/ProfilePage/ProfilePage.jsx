import React, { useState, useEffect } from 'react';
import roomService from '../../../services/roomService';
import hotelProfileService from '../../../services/hotelProfileService';
import { useHotel } from '../../../contexts/HotelContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { hotel, loading: hotelLoading, updateHotelProfile } = useHotel();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const [formData, setFormData] = useState({
    hotelName: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    starRating: 3,
    facilities: [],
    roomTypes: [],
    paymentOptions: ['Credit Card', 'Cash'],
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      branch: '',
      swiftCode: ''
    }
  });

  const [formErrors, setFormErrors] = useState({});

  // Update form data when hotel profile loads from context
  useEffect(() => {
    if (hotel) {
      setIsProfileLoading(false);
      
      // Set profile image preview from hotel data
      if (hotel.thumbnail) {
        setProfileImagePreview(hotel.thumbnail);
      } else if (hotel.images && hotel.images.length > 0) {
        setProfileImagePreview(hotel.images[0]);
      }

      // Load existing gallery images
      if (hotel.images && hotel.images.length > 0) {
        setGalleryImages(hotel.images);
      }
      
      // Map the backend data structure to our form structure
      setFormData(prevData => ({
        ...prevData,
        hotelName: hotel.hotelName || '',
        address: hotel.hotelAddress || '',
        email: hotel.email || '',
        phone: hotel.phoneNumber || '',
        website: hotel.website || '',
        description: hotel.description || '',
        // Convert check-in/out times to proper format if available
        checkInTime: hotel.checkInTime || '14:00',
        checkOutTime: hotel.checkOutTime || '12:00',
        starRating: hotel.stars || hotel.starRating || 3,
        // Use facilities from profile if available, otherwise keep defaults
        facilities: hotel.facilities || prevData.facilities,
        // Payment options might not be in the backend model
        paymentOptions: hotel.paymentOptions || prevData.paymentOptions,
        // Set bank details if available
        bankDetails: {
          accountName: hotel.bankDetails?.accountName || '',
          accountNumber: hotel.bankDetails?.accountNumber || '',
          bankName: hotel.bankDetails?.bankName || '',
          branch: hotel.bankDetails?.branch || '',
          swiftCode: hotel.bankDetails?.swiftCode || ''
        }
      }));
      console.log('Hotel profile loaded from context:', hotel);
    }
  }, [hotel]);

  // Fetch room inventory data when component mounts
  useEffect(() => {
    // Fetch room inventory data
    const fetchRoomInventory = async () => {
      setIsLoading(true);
      try {
        // Get all rooms from the API
        const rooms = await roomService.getAllRooms();
        
        if (!rooms || rooms.length === 0) {
          console.log('No rooms found or empty response');
          // Set some default room types as a fallback
          setFormData(prevData => ({
            ...prevData,
            roomTypes: [
              { name: 'Standard Room', count: 0 },
              { name: 'Deluxe Room', count: 0 },
              { name: 'Suite', count: 0 }
            ]
          }));
          return;
        }
        
        // Group rooms by type and count them
        const roomTypeMap = {};
        
        rooms.forEach(room => {
          const roomType = room.type || room.roomType || 'Standard';
          if (!roomTypeMap[roomType]) {
            roomTypeMap[roomType] = 0;
          }
          roomTypeMap[roomType]++;
        });
        
        // Convert to the format needed for formData
        const roomTypesData = Object.entries(roomTypeMap).map(([name, count]) => ({
          name,
          count
        }));
        
        // Update form data with real room types
        setFormData(prevData => ({
          ...prevData,
          roomTypes: roomTypesData.length > 0 ? roomTypesData : prevData.roomTypes
        }));
        
        console.log('Room types loaded from database:', roomTypesData);
      } catch (error) {
        console.error('Error fetching room inventory:', error);
        // Keep default room types if API call fails
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch room inventory if we're not in profile loading state
    if (!hotelLoading && hotel) {
      fetchRoomInventory();
    }
  }, [hotelLoading, hotel]); // Dependency on hotel loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFacilityChange = (facility) => {
    const updatedFacilities = formData.facilities.includes(facility)
      ? formData.facilities.filter(f => f !== facility)
      : [...formData.facilities, facility];

    setFormData({
      ...formData,
      facilities: updatedFacilities
    });
  };

  const handlePaymentOptionChange = (option) => {
    const updatedOptions = formData.paymentOptions.includes(option)
      ? formData.paymentOptions.filter(o => o !== option)
      : [...formData.paymentOptions, option];

    setFormData({
      ...formData,
      paymentOptions: updatedOptions
    });
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      bankDetails: {
        ...formData.bankDetails,
        [name]: value
      }
    });
  };

  // Handle profile image upload
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPG, JPEG, or PNG)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should not exceed 5MB');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      setProfileImage(base64Image);
      setProfileImagePreview(base64Image);
      toast.success('Profile image selected successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  // Remove profile image
  const handleRemoveProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('profileImage');
    if (fileInput) fileInput.value = '';
  };

  // Handle gallery images upload
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate number of images (max 10 total)
    const currentImageCount = galleryImages.length + newGalleryImages.length;
    if (currentImageCount + files.length > 10) {
      toast.error(`You can only have up to 10 images in total. Currently you have ${currentImageCount} images.`);
      return;
    }

    // Validate each file
    const validFiles = [];
    for (const file of files) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type. Please use JPG or PNG.`);
        continue;
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }

      validFiles.push(file);
    }

    // Read valid files as base64
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        setNewGalleryImages(prev => [...prev, { preview: base64Image, data: base64Image }]);
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} image(s) added successfully`);
    }
  };

  // Remove existing gallery image
  const handleRemoveGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  // Remove new gallery image
  const handleRemoveNewGalleryImage = (index) => {
    setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.hotelName.trim()) errors.hotelName = 'Hotel name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Show loading state
        setIsLoading(true);
        
        // Combine existing and new gallery images
        const allGalleryImages = [
          ...galleryImages,
          ...newGalleryImages.map(img => img.data)
        ];
        
        // Convert form data to backend model structure
        const profileData = {
          hotelName: formData.hotelName,
          hotelAddress: formData.address,
          email: formData.email,
          phoneNumber: formData.phone,
          website: formData.website,
          description: formData.description,
          checkInTime: formData.checkInTime,
          checkOutTime: formData.checkOutTime,
          stars: formData.starRating,
          facilities: formData.facilities,
          paymentOptions: formData.paymentOptions,
          bankDetails: formData.bankDetails,
          // Add profile image if it was changed
          thumbnail: profileImage || hotel?.thumbnail || null,
          // Add all gallery images
          images: allGalleryImages
        };
        
        // Send data to backend using the context function
        await updateHotelProfile(profileData);
        console.log('Profile updated successfully');
        
        // Show success message
        toast.success('Profile updated successfully!');
        
        // Clear new images array after successful save
        setNewGalleryImages([]);
        
        // Exit editing mode
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setIsEditing(false);
  };

  // All available facilities for checkboxes
  const allFacilities = [
    'Wi-Fi', 'Swimming Pool', 'Restaurant', 'Bar', 'Spa', 'Gym', 
    'Conference Room', 'Room Service', 'Airport Shuttle', 'Parking', 
    'Air Conditioning', 'Hot Tub', 'Laundry', 'Beach Access', 'Breakfast'
  ];

  // All available payment options for checkboxes
  const allPaymentOptions = [
    'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'PayPal', 'Digital Wallet'
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hotel Profile</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-yellow-300 hover:bg-yellow-6400 text-black rounded-md flex items-center"
          >
            <span className="material-icons text-sm mr-1">edit</span>
            Edit Profile
          </button>
        )}
      </div>

      {isProfileLoading ? (
        // Loading state
        <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-lg text-gray-600">Loading hotel profile...</p>
          </div>
        </div>
      ) : isEditing ? (
        // Edit Form
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          {/* Profile Image Upload Section */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-medium mb-4">Profile Image</h2>
            <div className="flex items-center space-x-6">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                {profileImagePreview || hotel?.thumbnail || (hotel?.images && hotel.images.length > 0) ? (
                  <img
                    src={profileImagePreview || hotel?.thumbnail || hotel?.images[0]}
                    alt="Hotel Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center border-4 border-yellow-500 shadow-lg">
                    <span className="material-icons text-white text-5xl">business</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-grow">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
                <div className="space-y-2">
                  <div>
                    <label
                      htmlFor="profileImage"
                      className="inline-flex items-center px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-md cursor-pointer transition-colors"
                    >
                      <span className="material-icons text-sm mr-2">upload</span>
                      Upload Profile Image
                    </label>
                  </div>
                  {(profileImagePreview || hotel?.thumbnail) && (
                    <button
                      type="button"
                      onClick={handleRemoveProfileImage}
                      className="inline-flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                    >
                      <span className="material-icons text-sm mr-2">delete</span>
                      Remove Image
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square image, at least 400x400px. Max size: 5MB. Formats: JPG, PNG
                </p>
              </div>
            </div>
          </div>

          {/* Hotel Images Gallery Management */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <span className="material-icons text-yellow-600 mr-2">photo_library</span>
              Hotel Images Gallery
            </h2>
            
            {/* Upload new images */}
            <div className="mb-4">
              <input
                type="file"
                id="galleryImages"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                onChange={handleGalleryImagesChange}
                className="hidden"
              />
              <label
                htmlFor="galleryImages"
                className="inline-flex items-center px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-md cursor-pointer transition-colors"
              >
                <span className="material-icons text-sm mr-2">add_photo_alternate</span>
                Add More Images
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Max 10 images total. Each image max 5MB. Formats: JPG, PNG
              </p>
            </div>

            {/* Display existing and new images */}
            {(galleryImages.length > 0 || newGalleryImages.length > 0) ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Existing images */}
                {galleryImages.map((image, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <span className="material-icons text-sm">close</span>
                    </button>
                    {hotel?.thumbnail === image && (
                      <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <span className="material-icons text-xs mr-1">star</span>
                        Profile
                      </div>
                    )}
                  </div>
                ))}
                
                {/* New images */}
                {newGalleryImages.map((image, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={image.preview}
                      alt={`New Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-md border-2 border-green-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewGalleryImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <span className="material-icons text-sm">close</span>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <span className="material-icons text-gray-400 text-5xl mb-2">add_photo_alternate</span>
                <p className="text-gray-500">No images yet. Add some images to showcase your hotel.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              
              <div className="mb-4">
                <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Name*
                </label>
                <input
                  type="text"
                  id="hotelName"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.hotelName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                />
                {formErrors.hotelName && <p className="text-red-500 text-xs mt-1">{formErrors.hotelName}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone*
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Hotel Details</h2>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    id="checkInTime"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    id="checkOutTime"
                    name="checkOutTime"
                    value={formData.checkOutTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="starRating" className="block text-sm font-medium text-gray-700 mb-1">
                  Star Rating
                </label>
                <select
                  id="starRating"
                  name="starRating"
                  value={formData.starRating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>{rating} Stars</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Facilities</h2>
            <div className="grid grid-cols-3 gap-2">
              {allFacilities.map(facility => (
                <div key={facility} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`facility-${facility}`}
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`facility-${facility}`} className="ml-2 text-sm text-gray-700">
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Payment Options</h2>
            <div className="grid grid-cols-3 gap-2">
              {allPaymentOptions.map(option => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`payment-${option}`}
                    checked={formData.paymentOptions.includes(option)}
                    onChange={() => handlePaymentOptionChange(option)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`payment-${option}`} className="ml-2 text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Bank Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  id="accountName"
                  name="accountName"
                  value={formData.bankDetails.accountName}
                  onChange={handleBankDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleBankDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleBankDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.bankDetails.branch}
                  onChange={handleBankDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700 mb-1">
                  SWIFT Code
                </label>
                <input
                  type="text"
                  id="swiftCode"
                  name="swiftCode"
                  value={formData.bankDetails.swiftCode}
                  onChange={handleBankDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex space-x-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        // Profile View
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-start">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {hotel?.thumbnail || (hotel?.images && hotel.images.length > 0) ? (
                  <img 
                    src={hotel?.thumbnail || hotel?.images[0]} 
                    alt={formData.hotelName} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center border-4 border-yellow-500 shadow-lg ${
                    hotel?.thumbnail || (hotel?.images && hotel.images.length > 0) ? 'hidden' : 'flex'
                  }`}
                >
                  <span className="material-icons text-white text-5xl">business</span>
                </div>
              </div>
              
              <div className="ml-6 flex-1">
                <h2 className="text-2xl font-bold">{formData.hotelName}</h2>
                <div className="flex items-center mt-1">
                  {[...Array(formData.starRating)].map((_, i) => (
                    <span key={i} className="material-icons text-yellow-500">star</span>
                  ))}
                </div>
                <p className="text-gray-600 mt-2">{formData.description}</p>
              </div>
            </div>
          </div>

          {/* Hotel Images Gallery */}
          {hotel?.images && hotel.images.length > 0 && (
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <span className="material-icons text-yellow-600 mr-2">photo_library</span>
                Hotel Images ({hotel.images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {hotel.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={image}
                      alt={`Hotel Image ${index + 1}`}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                    {index === 0 && hotel?.thumbnail === image && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <span className="material-icons text-xs mr-1">star</span>
                        Profile
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => {
                          // Open image in new tab for full view
                          window.open(image, '_blank');
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        <span className="material-icons text-sm mr-1">open_in_new</span>
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="material-icons text-gray-500 mr-2">location_on</span>
                    <span>{formData.address}</span>
                  </div>
                  <div className="flex">
                    <span className="material-icons text-gray-500 mr-2">email</span>
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex">
                    <span className="material-icons text-gray-500 mr-2">phone</span>
                    <span>{formData.phone}</span>
                  </div>
                  <div className="flex">
                    <span className="material-icons text-gray-500 mr-2">language</span>
                    <span>{formData.website}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Hotel Details</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="material-icons text-gray-500 mr-2">access_time</span>
                    <div>
                      <p>Check-in: {formData.checkInTime}</p>
                      <p>Check-out: {formData.checkOutTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 mb-4">
                  <h3 className="text-lg font-medium">Room Types</h3>
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsLoading(true);
                      try {
                        // Get all rooms from the API
                        const rooms = await roomService.getAllRooms();
                        
                        // Group rooms by type and count them
                        const roomTypeMap = {};
                        
                        rooms.forEach(room => {
                          if (!roomTypeMap[room.type]) {
                            roomTypeMap[room.type] = 0;
                          }
                          roomTypeMap[room.type]++;
                        });
                        
                        // Convert to the format needed for formData
                        const roomTypesData = Object.entries(roomTypeMap).map(([name, count]) => ({
                          name,
                          count
                        }));
                        
                        // Update form data with real room types
                        setFormData(prevData => ({
                          ...prevData,
                          roomTypes: roomTypesData
                        }));
                        
                        console.log('Room types refreshed from database:', roomTypesData);
                      } catch (error) {
                        console.error('Error refreshing room inventory:', error);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="flex items-center text-sm text-yellow-600 hover:text-yellow-700"
                  >
                    <span className="material-icons text-sm mr-1">refresh</span>
                    Refresh
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {isLoading ? (
                    <div className="col-span-2 text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-500 mb-2"></div>
                      <p className="text-gray-600">Loading room inventory...</p>
                    </div>
                  ) : formData.roomTypes.length > 0 ? (
                    formData.roomTypes.map((room, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">{room.name}</p>
                        <p className="text-sm text-gray-600">{room.count} rooms</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-gray-600">No room inventory data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Facilities</h3>
              <div className="flex flex-wrap">
                {formData.facilities.map((facility, index) => (
                  <span 
                    key={index} 
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Payment Options</h3>
              <div className="flex flex-wrap">
                {formData.paymentOptions.map((option, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Bank Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Account Name</p>
                    <p className="font-medium">{formData.bankDetails.accountName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="font-medium">{formData.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bank Name</p>
                    <p className="font-medium">{formData.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="font-medium">{formData.bankDetails.branch}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SWIFT Code</p>
                    <p className="font-medium">{formData.bankDetails.swiftCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;