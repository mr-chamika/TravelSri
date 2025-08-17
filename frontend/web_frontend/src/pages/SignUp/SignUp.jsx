import React, { useState, useEffect } from 'react';

// Flash Message Component
const FlashMessage = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
                 type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
                 'bg-yellow-100 border-yellow-400 text-yellow-700';
  
  const iconName = type === 'success' ? 'check_circle' : 
                  type === 'error' ? 'error' : 'info';
  
  return (
    <div 
      className={`border ${bgColor} px-4 py-3 rounded-md relative mb-4 animate-in slide-in-from-right duration-300 shadow-lg`}
      role="alert"
      style={{ zIndex: 1000 }}
    >
      <div className="flex items-center pr-6">
        <span className="material-icons mr-2">{iconName}</span>
        <span className="block text-sm font-medium">{message}</span>
      </div>
      <button 
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
        onClick={onClose}
      >
        <span className="material-icons text-sm cursor-pointer hover:text-gray-700">close</span>
      </button>
    </div>
  );
};

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ show: false, type: '', message: '' });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Function to handle redirect to login page
  const handleLoginRedirect = (e) => {
    e.preventDefault();
    // You can replace this with your own navigation logic
    window.location.href = '/login';
    // Or for a more integrated approach without page reload:
    // document.getElementById('loginContainer').style.display = 'block';
    // document.getElementById('signupContainer').style.display = 'none';
  };
  
  // Function to show a flash message
  const showFlash = (type, message) => {
    // First hide any existing message to trigger animation for the new one
    setFlashMessage({ show: false, type: '', message: '' });
    
    // Small delay to ensure state update before showing new message
    setTimeout(() => {
      setFlashMessage({ show: true, type, message });
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setFlashMessage({ show: false, type: '', message: '' });
      }, 5000);
    }, 10);
  };
  
  // Function to add a new room type
  const addNewRoomType = () => {
    const newRoomTypes = [...(formData.roomTypes || []), { type: '', count: 1, price: '' }];
    setFormData({...formData, roomTypes: newRoomTypes});
    
    // Scroll to the new room type after it's added to the DOM
    setTimeout(() => {
      const newRoomIndex = newRoomTypes.length - 1;
      const newRoomElement = document.getElementById(`room-type-${newRoomIndex}`);
      if (newRoomElement) {
        newRoomElement.scrollIntoView({ behavior: 'smooth' });
        // Add a temporary background highlight animation using Tailwind classes
        newRoomElement.classList.add('bg-yellow-100');
        setTimeout(() => {
          newRoomElement.classList.remove('bg-yellow-100');
          newRoomElement.classList.add('transition-colors', 'duration-1000');
        }, 100);
      }
    }, 100);
  };
  
  // State to track loading status of images
  const [imageLoading, setImageLoading] = useState(false);
  
  // Function to load Google Maps API script
  const loadGoogleMapsScript = () => {
    // For testing purposes - simulate the Maps API being loaded
    setMapLoaded(true);
    return;
    
    /* Uncomment this when you have an API key
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    // Note: Replace YOUR_API_KEY with a valid Google Maps API key
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
    */
  };

  // Load Google Maps API when component mounts
  useEffect(() => {
    loadGoogleMapsScript();
  }, []);
  
  // Function to handle map location selection
  const handleLocationSelect = (place) => {
    if (!place || !place.geometry) {
      showFlash('error', 'Unable to process this location. Please try another.');
      return;
    }

    try {
      const { lat, lng } = place.geometry.location;
      
      // Extract address components
      let address = '';
      let city = '';
      let district = '';
      let postalCode = '';
      
      if (place.address_components && Array.isArray(place.address_components)) {
        for (const component of place.address_components) {
          const componentType = component.types[0];
  
          if (componentType === 'street_number') {
            address = `${component.long_name} `;
          } else if (componentType === 'route') {
            address += component.long_name;
          } else if (componentType === 'locality' || componentType === 'postal_town') {
            city = component.long_name;
          } else if (componentType === 'administrative_area_level_2') {
            district = component.long_name;
          } else if (componentType === 'postal_code') {
            postalCode = component.long_name;
          }
        }
      }
  
      // For testing - ensure we always have some values
      const latValue = typeof lat === 'function' ? lat() : (lat || 7.8731);
      const lngValue = typeof lng === 'function' ? lng() : (lng || 80.7718);
  
      // Update form data with location information
      // Try to extract area name from address components or formatted address
      let baseArea = '';
      if (place.address_components && Array.isArray(place.address_components)) {
        // Look for neighborhood, sublocality, or landmark in address components
        const areaComponent = place.address_components.find(component => 
          component.types.some(type => ['neighborhood', 'sublocality', 'sublocality_level_1', 'landmark'].includes(type))
        );
        if (areaComponent) {
          baseArea = areaComponent.long_name;
        }
      }
      
      // If no specific area found, try to use the formatted address parts
      if (!baseArea && place.formatted_address) {
        const addressParts = place.formatted_address.split(',');
        if (addressParts.length > 1) {
          baseArea = addressParts[1].trim();
        }
      }
      
      setFormData(prev => ({
        ...prev,
        hotelAddress: address || place.formatted_address.split(',')[0] || prev.hotelAddress || '',
        baseAreaLocation: baseArea || prev.baseAreaLocation || '',
        city: city || prev.city || '',
        district: district || prev.district || '',
        postalCode: postalCode || prev.postalCode || '',
        location: {
          lat: latValue,
          lng: lngValue
        }
      }));
      
      setSelectedLocation({
        lat: latValue,
        lng: lngValue,
        address: place.formatted_address
      });
      
      showFlash('success', 'Location selected successfully!');
      
      // Don't close map automatically for testing
      // setShowMap(false);
    } catch (error) {
      console.error("Error processing location:", error);
      showFlash('error', 'Error selecting location. Please try again.');
    }
  };
  
  // Debug function to help with image troubleshooting
  const debugImage = (file, dataUrl) => {
    console.log('Image processed:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      dataUrlLength: dataUrl ? dataUrl.length : 0,
      dataUrlStart: dataUrl ? dataUrl.substring(0, 50) + '...' : 'none'
    });
  };
  
  // Function to handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageLoading(true);
    
    // Validate files
    const validFiles = files.filter(file => {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        showFlash('error', `${file.name} is not a valid image type. Only JPG, JPEG and PNG are allowed.`);
        return false;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showFlash('error', `${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Create file reader for image previews
    const processFiles = async () => {
      const imagesToAdd = [];
      
      // Process each file and create a preview
      for (const file of validFiles) {
        try {
          // Create a promise to read the file
          const imageDataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => {
              console.error('Error reading file:', e);
              reject(new Error('Failed to read image file'));
            };
            reader.readAsDataURL(file);
          });
          
          // Debug the image data
          debugImage(file, imageDataUrl);
          
          // Add the file with its data URL preview
          imagesToAdd.push({
            file,
            preview: imageDataUrl,
            name: file.name
          });
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          showFlash('error', `Failed to process ${file.name}. Please try again.`);
        }
      }
      
      // Add all processed images to form data
      setFormData({
        ...formData,
        hotelImages: [...(formData.hotelImages || []), ...imagesToAdd]
      });
      
      if (imagesToAdd.length > 0) {
        showFlash('success', `${imagesToAdd.length} image${imagesToAdd.length > 1 ? 's' : ''} added successfully!`);
      }
      
      setImageLoading(false);
    };
    
    // Start processing the files
    processFiles();
  };
  
  // Function to remove an image
  const removeImage = (index) => {
    const newImages = [...formData.hotelImages];
    
    // Remove from array
    newImages.splice(index, 1);
    setFormData({...formData, hotelImages: newImages});
    
    // Show feedback
    showFlash('info', 'Image removed');
  };
  
  // Function to handle document uploads
  const [documentLoading, setDocumentLoading] = useState(false);
  
  const handleDocumentUpload = (e, documentType) => {
    const file = e.target.files[0]; // Only allow one file per document type
    if (!file) return;
    
    setDocumentLoading(true);
    
    // Validate file
    const validDocTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validDocTypes.includes(file.type)) {
      showFlash('error', `${file.name} is not a valid document type. Allowed formats: PDF, JPG, PNG, DOC, DOCX`);
      setDocumentLoading(false);
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showFlash('error', `${file.name} is too large. Maximum size is 10MB.`);
      setDocumentLoading(false);
      return;
    }
    
    // Process the document
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const documentData = {
        file,
        name: file.name,
        preview: e.target.result,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      
      // Update form data based on document type
      const newBusinessDocuments = { ...formData.businessDocuments };
      
      if (documentType === 'otherDocuments') {
        newBusinessDocuments.otherDocuments = [...(newBusinessDocuments.otherDocuments || []), documentData];
      } else {
        newBusinessDocuments[documentType] = documentData;
      }
      
      setFormData({
        ...formData,
        businessDocuments: newBusinessDocuments
      });
      
      setDocumentLoading(false);
      showFlash('success', `${file.name} uploaded successfully!`);
    };
    
    reader.onerror = () => {
      setDocumentLoading(false);
      showFlash('error', `Failed to upload ${file.name}. Please try again.`);
    };
    
    reader.readAsDataURL(file);
  };
  
  // Function to remove a document
  const removeDocument = (documentType, index = null) => {
    const newBusinessDocuments = { ...formData.businessDocuments };
    
    if (documentType === 'otherDocuments' && index !== null) {
      newBusinessDocuments.otherDocuments = newBusinessDocuments.otherDocuments.filter((_, i) => i !== index);
    } else {
      newBusinessDocuments[documentType] = null;
    }
    
    setFormData({
      ...formData,
      businessDocuments: newBusinessDocuments
    });
    
    showFlash('info', 'Document removed');
  };
  
  // Function to preview a document
  const previewDocument = (documentType, index = null) => {
    let document;
    
    if (documentType === 'otherDocuments' && index !== null) {
      document = formData.businessDocuments?.otherDocuments?.[index];
    } else {
      document = formData.businessDocuments?.[documentType];
    }
    
    if (!document || !document.preview) {
      showFlash('error', 'Document preview not available');
      return;
    }
    
    // For PDF files, open in a new tab
    if (document.type === 'application/pdf') {
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`
          <iframe 
            src="${document.preview}" 
            width="100%" 
            height="100%" 
            style="border:none;position:absolute;top:0;left:0;right:0;bottom:0">
          </iframe>
        `);
      } else {
        showFlash('error', 'Unable to open preview. Please check your popup blocker settings.');
      }
      return;
    }
    
    // For images, create a modal preview
    if (document.type.startsWith('image/')) {
      // Create modal element
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '9999';
      modal.style.padding = '20px';
      
      // Create image element
      const img = document.createElement('img');
      img.src = document.preview;
      img.style.maxWidth = '90%';
      img.style.maxHeight = '90%';
      img.style.objectFit = 'contain';
      img.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
      
      // Create close button
      const closeBtn = document.createElement('span');
      closeBtn.textContent = '×';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '20px';
      closeBtn.style.right = '30px';
      closeBtn.style.color = 'white';
      closeBtn.style.fontSize = '40px';
      closeBtn.style.fontWeight = 'bold';
      closeBtn.style.cursor = 'pointer';
      closeBtn.onclick = () => document.body.removeChild(modal);
      
      // Create filename text
      const fileNameText = document.createElement('div');
      fileNameText.textContent = document.name;
      fileNameText.style.color = 'white';
      fileNameText.style.position = 'absolute';
      fileNameText.style.bottom = '20px';
      fileNameText.style.left = '0';
      fileNameText.style.right = '0';
      fileNameText.style.textAlign = 'center';
      fileNameText.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      fileNameText.style.padding = '10px';
      fileNameText.style.fontSize = '14px';
      
      // Add elements to modal
      modal.appendChild(img);
      modal.appendChild(closeBtn);
      modal.appendChild(fileNameText);
      
      // Add modal to document body
      document.body.appendChild(modal);
      
      // Close when clicking outside the image
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      };
      return;
    }
    
    // For other document types, try to open in a new tab
    // This might not work for all document types and browsers
    try {
      window.open(document.preview, '_blank');
    } catch (error) {
      showFlash('error', 'Unable to preview this document type');
    }
  };
  
  // No need to clean up data URLs when component unmounts
  // They will be garbage collected automatically
  useEffect(() => {
    // Initialize any required data
    return () => {
      // Cleanup function if needed
    };
  }, []);
  
  // Function to validate a room type field
  const validateRoomTypeField = (index, field, value) => {
    // Clear any existing errors
    if (errors.roomTypeFields) {
      const newErrors = {...errors};
      if (newErrors.roomTypeFields[`${index}-${field}`]) {
        delete newErrors.roomTypeFields[`${index}-${field}`];
        setErrors(newErrors);
      }
    }
    
    // Validate
    let isValid = true;
    let message = '';
    
    switch (field) {
      case 'type':
        if (!value) {
          isValid = false;
          message = 'Room type is required';
        }
        break;
        
      case 'price':
        if (!value) {
          isValid = false;
          message = 'Price is required';
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          isValid = false;
          message = 'Price must be a positive number';
        }
        break;
        
      case 'count':
        if (!value) {
          isValid = false;
          message = 'Room count is required';
        } else if (isNaN(value) || parseInt(value) <= 0) {
          isValid = false;
          message = 'Count must be a positive number';
        }
        break;
        
      default:
        break;
    }
    
    if (!isValid) {
      const newErrors = {...errors};
      if (!newErrors.roomTypeFields) {
        newErrors.roomTypeFields = {};
      }
      newErrors.roomTypeFields[`${index}-${field}`] = message;
      setErrors(newErrors);
    }
    
    return isValid;
  };
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    hotelName: '',
    hotelAddress: '',
    baseAreaLocation: '',
    contactPerson: '',
    contactPosition: '',
    contactEmail: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    emergencyContact: '',
    businessLicense: '',
    city: '',
    district: '',
    postalCode: '',
    location: null, // For storing lat/lng coordinates
    website: '',
    starRating: '',
    hotelImages: [],
    businessDocuments: {
      businessRegistration: null,
      taxCertificate: null,
      hotelCertification: null,
      healthAndSafety: null,
      otherDocuments: []
    },
    roomTypes: [],
    acceptTerms: false,
    acceptPrivacyPolicy: false
  });
  const [errors, setErrors] = useState({
    roomTypeFields: {}
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers and underscores';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Hotel details validation
    if (!formData.hotelName) newErrors.hotelName = 'Hotel name is required';
    if (!formData.hotelAddress) newErrors.hotelAddress = 'Hotel address is required';
    if (!formData.baseAreaLocation) newErrors.baseAreaLocation = 'Base area location is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.district) newErrors.district = 'District is required';
    
    // Contact information validation
    if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactPosition) newErrors.contactPosition = 'Contact position is required';
    if (!formData.contactEmail) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Contact email is invalid';
    }
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    
    // Location validation - we'll just show a warning if location is not set
    if (!formData.location) {
      // This is not a blocking error but we'll display a warning
      showFlash('info', 'Consider selecting your exact hotel location on the map for better visibility to customers');
    } else {
      // For testing - log the location that would be sent to the backend
      console.log('Location data ready for backend:', {
        coordinates: formData.location,
        address: formData.hotelAddress,
        city: formData.city,
        district: formData.district,
        postalCode: formData.postalCode
      });
    }
    
    // Room types validation
    const addedRooms = formData.roomTypes.filter(room => room.added);
    if (addedRooms.length === 0) {
      newErrors.roomTypes = 'At least one room type must be added';
      // Scroll to room types section when submitting
      setTimeout(() => {
        document.getElementById('room-types-section').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    
    // Hotel images validation
    if (!formData.hotelImages || formData.hotelImages.length === 0) {
      newErrors.hotelImages = 'Please upload at least one image of your property';
    }
    
    // Business verification validation
    if (!formData.businessDocuments?.businessCertificate) {
      newErrors.businessCertificate = 'Business certificate is required';
      // Scroll to business verification section when submitting if there's an error
      setTimeout(() => {
        // Find the business verification heading by iterating through all h2 elements
        const headings = document.querySelectorAll('h2.text-lg.font-semibold.text-gray-700');
        for (const heading of headings) {
          if (heading.textContent === 'Business Verification') {
            heading.scrollIntoView({ behavior: 'smooth' });
            break;
          }
        }
      }, 100);
    }
    
    // Terms and conditions
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    if (!formData.acceptPrivacyPolicy) {
      newErrors.acceptPrivacyPolicy = 'You must accept the privacy policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Show loading state
        showFlash('info', 'Submitting registration...');
        
        // Prepare form data for submission to backend
        const submissionData = {
          // Account Information
          username: formData.username,
          email: formData.email,
          password: formData.password,
          
          // Hotel Information
          hotelName: formData.hotelName,
          hotelAddress: formData.hotelAddress,
          baseAreaLocation: formData.baseAreaLocation,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode,
          
          // Location data
          latitude: formData.location ? formData.location.lat : null,
          longitude: formData.location ? formData.location.lng : null,
          
          // Hotel details
          website: formData.website,
          starRating: formData.starRating ? parseInt(formData.starRating) : null,
          
          // Contact Information
          contactPerson: formData.contactPerson,
          contactPosition: formData.contactPosition,
          contactEmail: formData.contactEmail,
          phoneNumber: formData.phoneNumber,
          alternatePhoneNumber: formData.alternatePhoneNumber,
          emergencyContact: formData.emergencyContact,
          businessLicense: formData.businessLicense,
          
          // Business Documents (store file paths - in production, upload files first)
          businessRegistrationDocPath: formData.businessDocuments?.businessRegistration?.name || null,
          taxCertificateDocPath: formData.businessDocuments?.taxCertificate?.name || null,
          hotelCertificationDocPath: formData.businessDocuments?.hotelCertification?.name || null,
          healthAndSafetyDocPath: formData.businessDocuments?.healthAndSafety?.name || null,
          otherDocumentsPaths: formData.businessDocuments?.otherDocuments?.map(doc => doc.name) || [],
          
          // Hotel Images (store file names - in production, upload files first)
          hotelImagesPaths: formData.hotelImages?.map(img => img.name) || [],
          
          // Room Types (convert to JSON strings for storage)
          roomTypeDetails: formData.roomTypes?.filter(room => room.added).map(room => JSON.stringify({
            type: room.type,
            count: room.count,
            price: room.price,
            occupancy: room.occupancy,
            bedConfiguration: room.beds,
            amenities: room.amenities || []
          })) || [],
          
          // Terms and Conditions
          acceptTerms: formData.acceptTerms,
          acceptPrivacyPolicy: formData.acceptPrivacyPolicy,
          
          // Set defaults for backend fields
          name: formData.hotelName, // Map to existing 'name' field
          location: `${formData.city}, ${formData.district}`, // Map to existing 'location' field
          mobileNumber: formData.phoneNumber, // Map to existing 'mobileNumber' field
          description: `Hotel located in ${formData.baseAreaLocation}, ${formData.city}`, // Default description
          stars: formData.starRating ? parseInt(formData.starRating) : 0,
          ratings: 0,
          reviewCount: 0,
          originalPrice: 0,
          currentPrice: 0,
          singlePrice: 0,
          doublePrice: 0,
          availableSingle: 0,
          availableDouble: 0,
          maxSingle: 0,
          maxDouble: 0,
          images: [],
          unavailable: [],
          distance: "",
          taxes: "",
          priceDescription: "",
          freeFeatures: [],
          policies: [],
          specialOffer: "",
          roomTypes: [],
          facilities: []
        };
        
        // Log the submission data for debugging
        console.log('Submitting hotel registration data:', submissionData);
        
        // Make API call to backend
        const response = await fetch('http://localhost:8080/hotels/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });
        
        // Handle response based on status and content type
        let result;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            result = await response.json();
          } catch (jsonError) {
            console.error('JSON parsing error:', jsonError);
            result = { error: 'Invalid response from server' };
          }
        } else {
          // Handle non-JSON responses
          const textResponse = await response.text();
          if (response.ok) {
            result = { message: textResponse || 'Success' };
          } else {
            result = { error: textResponse || `Server error (${response.status})` };
          }
        }
        
        if (response.ok) {
          showFlash('success', 'Registration successful! Your hotel has been registered. You will be redirected to login.');
          
          // Redirect to login page after a delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          showFlash('error', result.error || 'Registration failed. Please try again.');
        }
        
      } catch (error) {
        console.error('Registration error:', error);
        showFlash('error', 'Network error. Please check your connection and try again.');
      }
    } else {
      // Show error message
      showFlash('error', 'Please correct the errors in the form before submitting.');
      
      // Scroll to the first error
      const firstErrorElement = document.querySelector('.text-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-white to-yellow-50 p-4 relative">
      {/* Flash Message - Fixed position at the top right */}
      {flashMessage.show && (
        <div className="fixed top-4 right-4 w-80 z-50">
          <FlashMessage
            type={flashMessage.type}
            message={flashMessage.message}
            onClose={() => setFlashMessage({ show: false, type: '', message: '' })}
          />
        </div>
      )}
      
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 my-8">
        
        {/* Logo and title */}
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="TravelSri Logo" className="w-12 h-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Join TravelSri Partner Network</h1>
          <p className="text-sm text-gray-500">Register your hotel and start receiving bookings</p>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Account Information</h2>
          
          {/* Email field */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email Address*</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 pl-10 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="you@example.com"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 material-icons">email</span>
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          
          {/* Username field */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username*</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 pl-10 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="Choose a username"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 material-icons">person</span>
            </div>
            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password*</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pl-10 pr-10 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  placeholder="••••••••"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 material-icons">lock</span>
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-yellow-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-icons text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password*</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pl-10 pr-10 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  placeholder="••••••••"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 material-icons">lock</span>
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-yellow-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-icons text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Hotel Information</h2>
          
          {/* Hotel name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Hotel Name*</label>
            <div className="relative">
              <input
                type="text"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
                className={`w-full px-4 py-2 pl-10 border ${
                  errors.hotelName ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="Your Hotel Name"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 material-icons">business</span>
            </div>
            {errors.hotelName && <p className="mt-1 text-xs text-red-500">{errors.hotelName}</p>}
          </div>
          
          {/* Star Rating */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Star Rating</label>
            <div className="relative">
              <select
                name="starRating"
                value={formData.starRating}
                onChange={handleChange}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Star Rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
              <span className="absolute left-3 top-2.5 text-gray-400 material-icons">star</span>
            </div>
          </div>
          
          {/* Address fields with Google Maps */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Hotel Location*</label>
              <button
                type="button"
                onClick={() => {
                  const newValue = !showMap;
                  setShowMap(newValue);
                  if (newValue) {
                    // When opening map, let the user know it's in test mode
                    showFlash('info', 'Test mode: Select a location from the options or search for a place');
                  }
                }}
                className="text-sm text-yellow-600 hover:text-yellow-800 flex items-center"
              >
                <span className="material-icons text-sm mr-1">{showMap ? 'close' : 'map'}</span>
                {showMap ? 'Close Map' : 'Select on Map (Test Mode)'}
              </button>
            </div>
            
            {showMap && mapLoaded && (
              <div className="mb-4 relative">
                <div className="border border-gray-300 rounded-md overflow-hidden bg-gray-100" style={{ height: '300px', width: '100%' }} id="map">
                  {/* Mock map interface for testing */}
                  <div className="p-4 h-full flex flex-col">
                    <div className="mb-4">
                      <input
                        id="autocomplete-input"
                        type="text"
                        placeholder="Search for a location..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        defaultValue={selectedLocation?.address || ''}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            // Mock location search for testing
                            const searchValue = e.target.value;
                            if (searchValue) {
                              const mockPlace = {
                                formatted_address: searchValue,
                                geometry: {
                                  location: {
                                    lat: () => 7.8731 + Math.random() * 0.1,
                                    lng: () => 80.7718 + Math.random() * 0.1
                                  }
                                },
                                address_components: [
                                  {
                                    long_name: searchValue.split(',')[0]?.trim() || '',
                                    types: ['route']
                                  },
                                  {
                                    long_name: searchValue.split(',')[1]?.trim() || 'Colombo',
                                    types: ['locality']
                                  },
                                  {
                                    long_name: searchValue.split(',')[2]?.trim() || 'Western Province',
                                    types: ['administrative_area_level_2']
                                  },
                                  {
                                    long_name: searchValue.split(',')[3]?.trim() || '00100',
                                    types: ['postal_code']
                                  }
                                ]
                              };
                              handleLocationSelect(mockPlace);
                            }
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 relative bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                      {/* Mock map image background */}
                      <div className="absolute inset-0 bg-cover bg-center opacity-40"
                           style={{ backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=Sri+Lanka&zoom=7&size=600x400&maptype=roadmap')` }}>
                      </div>
                      
                      {selectedLocation ? (
                        <div className="text-center z-10 bg-white bg-opacity-80 p-3 rounded-md shadow-md">
                          <div className="text-sm mb-2">
                            <span className="font-medium">Selected Location:</span> {selectedLocation.address}
                          </div>
                          <div className="text-xs text-gray-600">
                            Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                          </div>
                          <button
                            type="button"
                            className="mt-2 text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            onClick={() => {
                              // Mock selecting a random location nearby
                              const mockPlace = {
                                formatted_address: `${formData.hotelAddress === "hoteladmin@travelsri.com" ? "123 Main St" : (formData.hotelAddress || '123 Main St')}, ${formData.city || 'Colombo'}, ${formData.district || 'Western Province'}`,
                                geometry: {
                                  location: {
                                    lat: () => 7.8731 + Math.random() * 0.1,
                                    lng: () => 80.7718 + Math.random() * 0.1
                                  }
                                },
                                address_components: [
                                  {
                                    long_name: formData.hotelAddress === "hoteladmin@travelsri.com" ? "123 Main St" : (formData.hotelAddress || '123 Main St'),
                                    types: ['route']
                                  },
                                  {
                                    long_name: formData.city || 'Colombo',
                                    types: ['locality']
                                  },
                                  {
                                    long_name: formData.district || 'Western Province',
                                    types: ['administrative_area_level_2']
                                  },
                                  {
                                    long_name: formData.postalCode || '00100',
                                    types: ['postal_code']
                                  }
                                ]
                              };
                              handleLocationSelect(mockPlace);
                            }}
                          >
                            Update Location
                          </button>
                        </div>
                      ) : (
                        <div className="text-center z-10 bg-white bg-opacity-80 p-4 rounded-md shadow-md">
                          <div className="text-gray-600 mb-2">Click the buttons below to select a test location</div>
                          <div className="flex flex-wrap gap-2 justify-center">
                            <button
                              type="button"
                              className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                              onClick={() => {
                                const mockPlace = {
                                  formatted_address: "Galle Face Hotel, 2 Galle Road, Colombo 00300",
                                  geometry: {
                                    location: {
                                      lat: () => 6.9271,
                                      lng: () => 79.8425
                                    }
                                  },
                                  address_components: [
                                    { long_name: "2 Galle Road", types: ['route'] },
                                    { long_name: "Colombo", types: ['locality'] },
                                    { long_name: "Colombo District", types: ['administrative_area_level_2'] },
                                    { long_name: "00300", types: ['postal_code'] }
                                  ]
                                };
                                handleLocationSelect(mockPlace);
                              }}
                            >
                              Colombo
                            </button>
                            <button
                              type="button"
                              className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                              onClick={() => {
                                const mockPlace = {
                                  formatted_address: "Hotel Road, Kandy 20000",
                                  geometry: {
                                    location: {
                                      lat: () => 7.2906,
                                      lng: () => 80.6337
                                    }
                                  },
                                  address_components: [
                                    { long_name: "Hotel Road", types: ['route'] },
                                    { long_name: "Kandy", types: ['locality'] },
                                    { long_name: "Kandy District", types: ['administrative_area_level_2'] },
                                    { long_name: "20000", types: ['postal_code'] }
                                  ]
                                };
                                handleLocationSelect(mockPlace);
                              }}
                            >
                              Kandy
                            </button>
                            <button
                              type="button"
                              className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                              onClick={() => {
                                const mockPlace = {
                                  formatted_address: "Beach Road, Negombo 11500",
                                  geometry: {
                                    location: {
                                      lat: () => 7.2095,
                                      lng: () => 79.8369
                                    }
                                  },
                                  address_components: [
                                    { long_name: "Beach Road", types: ['route'] },
                                    { long_name: "Negombo", types: ['locality'] },
                                    { long_name: "Gampaha District", types: ['administrative_area_level_2'] },
                                    { long_name: "11500", types: ['postal_code'] }
                                  ]
                                };
                                handleLocationSelect(mockPlace);
                              }}
                            >
                              Negombo
                            </button>
                            <button
                              type="button"
                              className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                              onClick={() => {
                                const mockPlace = {
                                  formatted_address: "Resort Road, Galle 80000",
                                  geometry: {
                                    location: {
                                      lat: () => 6.0535,
                                      lng: () => 80.2210
                                    }
                                  },
                                  address_components: [
                                    { long_name: "Resort Road", types: ['route'] },
                                    { long_name: "Galle", types: ['locality'] },
                                    { long_name: "Galle District", types: ['administrative_area_level_2'] },
                                    { long_name: "80000", types: ['postal_code'] }
                                  ]
                                };
                                handleLocationSelect(mockPlace);
                              }}
                            >
                              Galle
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>This is a test map interface until API key is available</span>
                      <span>Click buttons or search to simulate location selection</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Hotel Address*</label>
              <div className="relative">
                <input
                  type="text"
                  name="hotelAddress"
                  value={formData.hotelAddress === "hoteladmin@travelsri.com" ? "" : formData.hotelAddress}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pl-10 border ${
                    errors.hotelAddress ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  placeholder="Street address"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 material-icons">location_on</span>
              </div>
              {errors.hotelAddress && <p className="mt-1 text-xs text-red-500">{errors.hotelAddress}</p>}
              
              {selectedLocation && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p className="text-xs text-yellow-800 flex items-center">
                    <span className="material-icons text-xs mr-1">check_circle</span>
                    Location selected successfully
                  </p>
                </div>
              )}
            </div>
            
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">City*</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="City"
              />
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">District*</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.district ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="District"
              />
              {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Postal Code"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Base Area Location*</label>
            <div className="relative">
              <input
                type="text"
                name="baseAreaLocation"
                value={formData.baseAreaLocation || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2 pl-10 border ${
                  errors.baseAreaLocation ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="Nearby landmark or popular area"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 material-icons">place</span>
            </div>
            {errors.baseAreaLocation && <p className="mt-1 text-xs text-red-500">{errors.baseAreaLocation}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Enter a well-known area or landmark near your hotel to help guests understand your location better.
            </p>
          </div>

           <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Room Information</h2>
          
          {/* Room Types Section */}
          <div id="room-types-section" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-700">Select Room Types Available</p>
              <button 
                type="button" 
                onClick={addNewRoomType}
                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-sm font-medium rounded-md transition flex items-center"
              >
                <span className="material-icons text-sm mr-1">add</span>
                Add Room Type 
              </button>
            </div>
            
            {/* Room Types List */}
            {(formData.roomTypes || []).map((room, index) => (
              <div key={index} id={`room-type-${index}`} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Room Type #{index + 1}</h3>
                  <button 
                    type="button" 
                    onClick={() => {
                      const newRoomTypes = formData.roomTypes.filter((_, i) => i !== index);
                      setFormData({...formData, roomTypes: newRoomTypes});
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <span className="material-icons text-sm">delete</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Room Type</label>
                    <select
                      name={`roomType-${index}`}
                      value={room.type}
                      onChange={(e) => {
                        const newRoomTypes = [...formData.roomTypes];
                        newRoomTypes[index].type = e.target.value;
                        setFormData({...formData, roomTypes: newRoomTypes});
                        validateRoomTypeField(index, 'type', e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select Type</option>
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                      <option value="Family">Family</option>
                      <option value="Executive">Executive</option>
                      <option value="Presidential">Presidential</option>
                      <option value="Villa">Villa</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Cottage">Cottage</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.roomTypeFields && errors.roomTypeFields[`${index}-type`] && (
                      <p className="mt-1 text-xs text-red-500">{errors.roomTypeFields[`${index}-type`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Number of Rooms</label>
                    <input
                      type="number"
                      min="1"
                      name={`roomCount-${index}`}
                      value={room.count}
                      onChange={(e) => {
                        const newRoomTypes = [...formData.roomTypes];
                        newRoomTypes[index].count = e.target.value;
                        setFormData({...formData, roomTypes: newRoomTypes});
                        validateRoomTypeField(index, 'count', e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {errors.roomTypeFields && errors.roomTypeFields[`${index}-count`] && (
                      <p className="mt-1 text-xs text-red-500">{errors.roomTypeFields[`${index}-count`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Avg. Price per Night (LKR)</label>
                    <input
                      type="number"
                      min="0"
                      name={`roomPrice-${index}`}
                      value={room.price}
                      onChange={(e) => {
                        const newRoomTypes = [...formData.roomTypes];
                        newRoomTypes[index].price = e.target.value;
                        setFormData({...formData, roomTypes: newRoomTypes});
                        validateRoomTypeField(index, 'price', e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="0.00"
                    />
                    {errors.roomTypeFields && errors.roomTypeFields[`${index}-price`] && (
                      <p className="mt-1 text-xs text-red-500">{errors.roomTypeFields[`${index}-price`]}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Max Occupancy</label>
                    <select
                      name={`roomOccupancy-${index}`}
                      value={room.occupancy || ''}
                      onChange={(e) => {
                        const newRoomTypes = [...formData.roomTypes];
                        newRoomTypes[index].occupancy = e.target.value;
                        setFormData({...formData, roomTypes: newRoomTypes});
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select Occupancy</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5+ People</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Bed Configuration</label>
                    <select
                      name={`roomBeds-${index}`}
                      value={room.beds || ''}
                      onChange={(e) => {
                        const newRoomTypes = [...formData.roomTypes];
                        newRoomTypes[index].beds = e.target.value;
                        setFormData({...formData, roomTypes: newRoomTypes});
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select Bed Type</option>
                      <option value="1 Single">1 Single Bed</option>
                      <option value="2 Singles">2 Single Beds</option>
                      <option value="1 Double">1 Double Bed</option>
                      <option value="1 Queen">1 Queen Bed</option>
                      <option value="1 King">1 King Bed</option>
                      <option value="1 Double 1 Single">1 Double & 1 Single</option>
                      <option value="Other">Other Configuration</option>
                    </select>
                    {errors.roomTypeFields && errors.roomTypeFields[`${index}-beds`] && (
                      <p className="mt-1 text-xs text-red-500">{errors.roomTypeFields[`${index}-beds`]}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Room Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['AC', 'TV', 'WiFi', 'Fridge', 'Safe', 'Balcony', 'Sea View', 'Mini Bar'].map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={room.amenities?.includes(amenity) || false}
                          onChange={(e) => {
                            const newRoomTypes = [...formData.roomTypes];
                            if (!newRoomTypes[index].amenities) {
                              newRoomTypes[index].amenities = [];
                            }
                            
                            if (e.target.checked) {
                              newRoomTypes[index].amenities.push(amenity);
                            } else {
                              newRoomTypes[index].amenities = newRoomTypes[index].amenities
                                .filter(a => a !== amenity);
                            }
                            
                            setFormData({...formData, roomTypes: newRoomTypes});
                          }}
                          className="rounded border-gray-300 focus:ring-yellow-400"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Add button for this room type */}
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    {room.added && 
                      <span className="flex items-center text-green-600 text-sm">
                        <span className="material-icons text-sm mr-1">check_circle</span>
                        Room type details saved
                      </span>
                    }
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      // Validate room data
                      let isValid = true;
                      let errorMessage = "";
                      
                      if (!room.type) {
                        errorMessage = "Please select a room type";
                        isValid = false;
                      } else if (!room.price) {
                        errorMessage = "Please enter room price";
                        isValid = false;
                      } else if (parseFloat(room.price) <= 0) {
                        errorMessage = "Price must be greater than zero";
                        isValid = false;
                      } else if (!room.count || parseInt(room.count) <= 0) {
                        errorMessage = "Number of rooms must be greater than zero";
                        isValid = false;
                      }
                      
                      if (!isValid) {
                        showFlash('error', errorMessage);
                        return;
                      }
                      
                      // Mark as added
                      const newRoomTypes = [...formData.roomTypes];
                      newRoomTypes[index].added = true;
                      
                      // Add timestamp to know when it was added
                      newRoomTypes[index].addedAt = new Date().toISOString();
                      
                      // Create a new empty room type if this is the last one in the list
                      if (index === formData.roomTypes.length - 1) {
                        addNewRoomType();
                      } else {
                        setFormData({...formData, roomTypes: newRoomTypes});
                      }
                      
                      // Show success message with more details
                      showFlash('success', `${room.type} room type added successfully! ${room.count} rooms at ${room.price} LKR per night.`);
                    }}
                    className={`px-4 py-1.5 ${room.added ? 'bg-gray-300' : 'bg-yellow-400 hover:bg-yellow-500'} text-sm font-medium rounded-md transition flex items-center`}
                    disabled={room.added}
                  >
                    <span className="material-icons text-sm mr-1">{room.added ? 'done' : 'save'}</span>
                    {room.added ? 'Added' : 'Save Room Type Details'}
                  </button>
                </div>
              </div>
            ))}
            
            {(formData.roomTypes || []).length === 0 && (
              <div className="text-center p-6 border border-dashed rounded-lg">
                <span className="material-icons text-4xl text-gray-400">hotel</span>
                <p className="mt-2 text-gray-500">No room types added yet. Click "Add Room Type" to begin.</p>
              </div>
            )}
            
            {errors.roomTypes && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                <div className="flex items-center">
                  <span className="material-icons text-sm mr-2">error</span>
                  {errors.roomTypes}
                </div>
                <p className="mt-1 ml-5">Please add at least one room type by clicking the "Add Room Type" button above.</p>
              </div>
            )}
          </div>
          
          {/* Hotel Images Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Hotel Images</h2>
            <div className="mt-4">
              <p className="font-medium text-gray-700 mb-2">Upload Images of Your Property</p>
              <p className="text-sm text-gray-500 mb-4">Upload high-quality images of your hotel to attract more guests. Allowed formats: JPG, PNG (max 5MB each).</p>
              
              {/* Image upload input */}
              <div className="mb-4">
                <label 
                  htmlFor="hotel-images" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-yellow-400 transition-all duration-200"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="material-icons text-2xl text-gray-500 mb-2">cloud_upload</span>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">JPG or PNG (MAX. 5MB per image)</p>
                  </div>
                  <input 
                    id="hotel-images" 
                    type="file" 
                    multiple 
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              
              {/* Image preview section */}
              <div>
                {imageLoading && (
                  <div className="text-center p-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                    <p className="mt-2 text-sm text-gray-500">Processing images...</p>
                  </div>
                )}
                
                {formData.hotelImages && formData.hotelImages.length > 0 ? (
                  <div>
                    <p className="font-medium text-sm text-gray-700 mb-2">
                      Uploaded Images ({formData.hotelImages.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.hotelImages.map((image, index) => (
                        <div 
                          key={index} 
                          className="relative group border border-gray-200 rounded-lg overflow-hidden transform transition duration-300 ease-in-out bg-gray-50 shadow-sm"
                        >
                          {image.preview && image.preview.startsWith('data:image/') ? (
                            <img 
                              src={image.preview} 
                              alt={`Hotel image ${index + 1}`} 
                              className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                // Handle image loading errors
                                console.error(`Error displaying image: ${image.name}`);
                                e.target.src = 'https://via.placeholder.com/100x100?text=Image+Error';
                              }}
                            />
                          ) : (
                            <div className="w-full h-24 flex items-center justify-center bg-gray-100">
                              <span className="material-icons text-gray-400">image_not_supported</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 pointer-events-none"></div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                          >
                            <span className="material-icons text-sm text-red-500">delete</span>
                          </button>
                          <div className="absolute bottom-1 left-1 right-1 text-xs bg-white bg-opacity-75 p-1 truncate">
                            {image.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    <span className="material-icons text-2xl text-gray-400">photo_library</span>
                    <p className="mt-2 text-gray-500">No images uploaded yet.</p>
                  </div>
                )}
                
                {errors.hotelImages && (
                  <div className="p-3 mt-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    <div className="flex items-center">
                      <span className="material-icons text-sm mr-2">error</span>
                      {errors.hotelImages}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Contact Information</h2>
          
          <p className="text-sm text-gray-600 mb-4">
            Please provide details of the primary contact person who will manage your hotel's partnership with TravelSri.
          </p>
          
          {/* Primary Contact Person */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 mb-4">
            <h3 className="font-medium text-gray-800 mb-3">Primary Contact Person</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Contact Person Name*</label>
                <div className="relative">
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 pl-10 border ${
                      errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    placeholder="Full Name"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 material-icons">person</span>
                </div>
                {errors.contactPerson && <p className="mt-1 text-xs text-red-500">{errors.contactPerson}</p>}
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Position/Designation*</label>
                <div className="relative">
                  <input
                    type="text"
                    name="contactPosition"
                    value={formData.contactPosition}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 pl-10 border ${
                      errors.contactPosition ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    placeholder="e.g. Hotel Manager, Owner"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 material-icons">work</span>
                </div>
                {errors.contactPosition && <p className="mt-1 text-xs text-red-500">{errors.contactPosition}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Contact Email*</label>
                <div className="relative">
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail || (formData.hotelAddress === "hoteladmin@travelsri.com" ? "hoteladmin@travelsri.com" : "")}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 pl-10 border ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    placeholder="contact@example.com"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 material-icons">email</span>
                </div>
                {errors.contactEmail && <p className="mt-1 text-xs text-red-500">{errors.contactEmail}</p>}
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Primary Phone Number*</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 pl-10 border ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    placeholder="+94 123 456 7890"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 material-icons">phone</span>
                </div>
                {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>}
              </div>
            </div>
          </div>
          
          {/* Additional Contact Information */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-3">Additional Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Alternate Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="alternatePhoneNumber"
                    value={formData.alternatePhoneNumber} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="+94 123 456 7890"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 material-icons">phone_alt</span>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Emergency Contact</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="+94 123 456 7890"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 material-icons">contact_phone</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Hotel Website(Optional)</label>
                <div className="relative">
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="https://www.yourhotel.com"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 material-icons">language</span>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Business License Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="businessLicense"
                    value={formData.businessLicense}
                    onChange={handleChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="License Number"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 material-icons">badge</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 bg-yellow-50 p-3 rounded-md border border-yellow-100">
              <div className="flex items-start">
                <span className="material-icons text-yellow-600 mr-2 mt-0.5">info</span>
                <p className="text-sm text-yellow-700">
                  Adding complete contact information helps us verify your business faster and ensures smooth communication throughout our partnership.
                </p>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Business Verification</h2>
          
          <div className="mt-4 space-y-6">
            <p className="text-sm text-gray-600">
              Upload the necessary documents to verify your hotel business. All documents must be in PDF, JPG, PNG, or DOC/DOCX format and less than 10MB.
            </p>
            
            {/* Business Certificate */}
            <div className={`border ${errors.businessCertificate ? 'border-red-300' : 'border-gray-200'} rounded-lg p-4`}>
              <h3 className="font-medium text-gray-800 mb-2">Business Certificate*</h3>
              <p className="text-sm text-gray-600 mb-3">Upload your business registration certificate issued by relevant authorities.</p>
              
              {formData.businessDocuments?.businessCertificate ? (
                <div className="relative bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex items-center cursor-pointer" onClick={() => previewDocument('businessCertificate')}>
                    <div className="p-2 bg-yellow-100 rounded-md">
                      <span className="material-icons text-yellow-600">
                        {formData.businessDocuments.businessCertificate.type.includes('pdf') ? 'picture_as_pdf' : 
                         formData.businessDocuments.businessCertificate.type.includes('image') ? 'image' : 'description'}
                      </span>
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.businessDocuments.businessCertificate.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round(formData.businessDocuments.businessCertificate.size / 1024)} KB • 
                        {new Date(formData.businessDocuments.businessCertificate.uploadedAt).toLocaleDateString()}
                      </p>
                      <div className="text-xs text-yellow-600 mt-1 flex items-center">
                        <span className="material-icons text-xs mr-1">visibility</span>
                        Click to preview
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDocument('businessCertificate');
                      }}
                      className="bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
                    errors.businessCertificate ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                  } border-dashed rounded-lg cursor-pointer hover:bg-gray-100`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className={`material-icons ${
                        errors.businessCertificate ? 'text-red-400' : 'text-gray-400'
                      } text-2xl mb-1`}>upload_file</span>
                      <p className={`mb-2 text-sm ${
                        errors.businessCertificate ? 'text-red-500' : 'text-gray-500'
                      } text-center`}>
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG or DOC (MAX. 10MB)</p>
                    </div>
                    <input 
                      type="file"
                      className="hidden"
                      onChange={(e) => handleDocumentUpload(e, 'businessCertificate')}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    />
                  </label>
                  {errors.businessCertificate && (
                    <p className="mt-2 text-sm text-red-600">
                      <span className="material-icons text-xs align-middle mr-1">error</span>
                      {errors.businessCertificate}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Tax Registration */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Tax Registration Document</h3>
              <p className="text-sm text-gray-600 mb-3">Upload your tax registration or VAT document.</p>
              
              {formData.businessDocuments?.taxRegistration ? (
                <div className="relative bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-md">
                      <span className="material-icons text-yellow-600">description</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.businessDocuments.taxRegistration.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round(formData.businessDocuments.taxRegistration.size / 1024)} KB • 
                        {new Date(formData.businessDocuments.taxRegistration.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeDocument('taxRegistration')}
                      className="ml-auto bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="material-icons text-gray-400 text-2xl mb-1">upload_file</span>
                      <p className="mb-2 text-sm text-gray-500 text-center">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG or DOC (MAX. 10MB)</p>
                    </div>
                    <input 
                      type="file"
                      className="hidden"
                      onChange={(e) => handleDocumentUpload(e, 'taxRegistration')}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    />
                  </label>
                </div>
              )}
            </div>
            
            {/* Insurance Document */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Insurance Document</h3>
              <p className="text-sm text-gray-600 mb-3">Upload your business insurance document.</p>
              
              {formData.businessDocuments?.insuranceDocument ? (
                <div className="relative bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-md">
                      <span className="material-icons text-yellow-600">description</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.businessDocuments.insuranceDocument.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round(formData.businessDocuments.insuranceDocument.size / 1024)} KB • 
                        {new Date(formData.businessDocuments.insuranceDocument.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeDocument('insuranceDocument')}
                      className="ml-auto bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="material-icons text-gray-400 text-2xl mb-1">upload_file</span>
                      <p className="mb-2 text-sm text-gray-500 text-center">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG or DOC (MAX. 10MB)</p>
                    </div>
                    <input 
                      type="file"
                      className="hidden"
                      onChange={(e) => handleDocumentUpload(e, 'insuranceDocument')}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    />
                  </label>
                </div>
              )}
            </div>
            
            {/* Other Documents */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Other Supporting Documents</h3>
              <p className="text-sm text-gray-600 mb-3">Upload any additional documents that may help verify your business (optional).</p>
              
              {formData.businessDocuments?.otherDocuments && formData.businessDocuments.otherDocuments.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.businessDocuments.otherDocuments.map((doc, index) => (
                    <div key={index} className="relative bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-md">
                          <span className="material-icons text-yellow-600">description</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(doc.size / 1024)} KB • 
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeDocument('otherDocuments', index)}
                          className="ml-auto bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="material-icons text-gray-400 text-2xl mb-1">upload_file</span>
                    <p className="mb-2 text-sm text-gray-500 text-center">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG or DOC (MAX. 10MB)</p>
                  </div>
                  <input 
                    type="file"
                    className="hidden"
                    onChange={(e) => handleDocumentUpload(e, 'otherDocuments')}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />
                </label>
              </div>
            </div>
            
            {documentLoading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                <span className="ml-2 text-gray-600">Uploading document...</span>
              </div>
            )}
          </div>
          
          

           <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Account Information</h2>
          
          {/* Username field */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username*</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 pl-10 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="Type a username"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 material-icons">person</span>
            </div>
            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            <p className="mt-1 text-xs text-gray-500">
              This will be your unique identifier for logging into your account
            </p>
          </div>
          
          {/* Email field */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email Address*</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                className={`w-full px-4 py-2 pl-10 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="hotel@travelsri.com"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 material-icons">email</span>
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password*</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`w-full px-4 py-2 pl-10 pr-10 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  placeholder="Password"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 material-icons">lock</span>
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-yellow-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-icons text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password*</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pl-10 pr-10 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  placeholder="Confirm Password"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 material-icons">lock</span>
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-yellow-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-icons text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Terms and privacy */}
          <div className="space-y-2 pt-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className={`w-4 h-4 rounded ${
                    errors.acceptTerms ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-yellow-400`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="text-gray-700">
                  I accept the <a href="#" className="text-yellow-500 hover:underline">Terms and Conditions</a>*
                </label>
                {errors.acceptTerms && <p className="mt-1 text-xs text-red-500">{errors.acceptTerms}</p>}
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="acceptPrivacyPolicy"
                  checked={formData.acceptPrivacyPolicy}
                  onChange={handleChange}
                  className={`w-4 h-4 rounded ${
                    errors.acceptPrivacyPolicy ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-yellow-400`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="text-gray-700">
                  I accept the <a href="#" className="text-yellow-500 hover:underline">Privacy Policy</a>*
                </label>
                {errors.acceptPrivacyPolicy && <p className="mt-1 text-xs text-red-500">{errors.acceptPrivacyPolicy}</p>}
              </div>
            </div>
          </div>
          
          
          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md transition"
            >
              Register Your Hotel
            </button>
          </div>
        </form>


        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" onClick={handleLoginRedirect} className="text-yellow-500 hover:underline font-medium">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
