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
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [marker, setMarker] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
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
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyApf662eX5O6bPf0iiXkMidkcytrIgOSzM&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  };

  // Load Google Maps API when component mounts
  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  // Initialize Google Maps when API is loaded and map should be shown
  useEffect(() => {
    if (mapLoaded && showMap && window.google && !map) {
      initializeMap();
    }
  }, [mapLoaded, showMap]);

  // Initialize mini map when location is selected
  useEffect(() => {
    if (selectedLocation && mapLoaded && window.google) {
      const timer = setTimeout(() => {
        const miniMapElement = document.getElementById('mini-map');
        if (miniMapElement) {
          const miniMap = new window.google.maps.Map(miniMapElement, {
            center: { lat: selectedLocation.lat, lng: selectedLocation.lng },
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            gestureHandling: 'cooperative',
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });
          
          new window.google.maps.Marker({
            position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
            map: miniMap,
            title: selectedLocation.address,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 32)
            }
          });
        }
      }, 100); // Small delay to ensure DOM is ready
      
      return () => clearTimeout(timer);
    }
  }, [selectedLocation, mapLoaded]);

  // Function to initialize Google Maps
  const initializeMap = () => {
    const mapContainer = document.getElementById('google-map');
    if (!mapContainer) return;

    // Default center on Sri Lanka
    const defaultCenter = { lat: 7.8731, lng: 80.7718 };
    
    // Create map
    const newMap = new window.google.maps.Map(mapContainer, {
      center: selectedLocation || defaultCenter,
      zoom: selectedLocation ? 15 : 8,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    setMap(newMap);

    // Initialize autocomplete
    const autocompleteInput = document.getElementById('autocomplete-input');
    if (autocompleteInput) {
      const newAutocomplete = new window.google.maps.places.Autocomplete(autocompleteInput, {
        componentRestrictions: { country: 'lk' }, // Restrict to Sri Lanka
        fields: ['formatted_address', 'geometry', 'address_components', 'name'],
        types: ['establishment', 'geocode']
      });

      newAutocomplete.addListener('place_changed', () => {
        const place = newAutocomplete.getPlace();
        handleLocationSelect(place);
      });

      setAutocomplete(newAutocomplete);
    }

    // Add click listener to map
    newMap.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      // Reverse geocode to get address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          handleLocationSelect(results[0]);
        } else {
          // If reverse geocoding fails, create a basic place object
          const basicPlace = {
            formatted_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            geometry: {
              location: { lat: () => lat, lng: () => lng }
            },
            address_components: []
          };
          handleLocationSelect(basicPlace);
        }
      });
    });

    // If there's already a selected location, show it on the map
    if (selectedLocation) {
      updateMapMarker(newMap, selectedLocation);
    }
  };

  // Function to update map marker
  const updateMapMarker = (mapInstance, location) => {
    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Create new marker
    const newMarker = new window.google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: mapInstance,
      title: location.address || 'Selected Location',
      animation: window.google.maps.Animation.DROP,
    });

    setMarker(newMarker);

    // Center map on marker
    mapInstance.setCenter({ lat: location.lat, lng: location.lng });
    mapInstance.setZoom(15);
  };
  
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
  
      // Get lat/lng values (handle both function and direct access)
      const latValue = typeof lat === 'function' ? lat() : lat;
      const lngValue = typeof lng === 'function' ? lng() : lng;
  
      // Update form data with location information (baseAreaLocation should be filled manually)
      setFormData(prev => ({
        ...prev,
        hotelAddress: address || place.formatted_address?.split(',')[0] || prev.hotelAddress || '',
        // baseAreaLocation: left for manual input - not auto-filled
        city: city || prev.city || '',
        district: district || prev.district || '',
        postalCode: postalCode || prev.postalCode || '',
        location: {
          lat: latValue,
          lng: lngValue
        }
      }));
      
      const newLocation = {
        lat: latValue,
        lng: lngValue,
        address: place.formatted_address || `${latValue.toFixed(6)}, ${lngValue.toFixed(6)}`
      };
      
      setSelectedLocation(newLocation);
      
      // Update map marker if map is initialized
      if (map) {
        updateMapMarker(map, newLocation);
      }
      
      showFlash('success', 'Location selected successfully!');
      
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
      // Location data ready for backend submission
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
                    // When opening map, let the user know about real map functionality
                    showFlash('info', 'Click on the map or search to select your hotel location. Real-time Google Maps data.');
                  }
                }}
                className="text-sm text-yellow-600 hover:text-yellow-800 flex items-center"
              >
                <span className="material-icons text-sm mr-1">{showMap ? 'close' : 'map'}</span>
                {showMap ? 'Close Map' : 'Select on Map'}
              </button>
            </div>
            
            {showMap && !mapLoaded && (
              <div className="mb-4 relative">
                <div className="border border-gray-300 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: '400px', width: '100%' }}>
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Loading Google Maps...</p>
                    <p className="text-gray-500 text-xs mt-1">Please wait while we load the interactive map</p>
                  </div>
                </div>
              </div>
            )}
            
            {showMap && mapLoaded && (
              <div className="mb-4 relative">
                <div className="border border-gray-300 rounded-md overflow-hidden bg-gray-100" style={{ height: '400px', width: '100%' }}>
                  {/* Google Maps Search Box */}
                  <div className="absolute top-3 left-3 right-3 z-10">
                    <input
                      id="autocomplete-input"
                      type="text"
                      placeholder="Search for your hotel location..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                    />
                  </div>
                  
                  {/* Google Maps Container */}
                  <div id="google-map" style={{ height: '100%', width: '100%' }}></div>
                  
                  {/* Map Controls */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    {selectedLocation && (
                      <div className="bg-white bg-opacity-95 p-3 rounded-md shadow-lg">
                        <div className="text-sm mb-2">
                          <span className="font-medium">Selected Location:</span> {selectedLocation.address}
                        </div>
                        <div className="text-xs text-gray-600">
                          Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <button
                            type="button"
                            className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            onClick={() => {
                              if (map && selectedLocation) {
                                map.setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
                                map.setZoom(17);
                              }
                            }}
                          >
                            Zoom to Location
                          </button>
                          <button
                            type="button"
                            className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                            onClick={() => {
                              setShowMap(false);
                              showFlash('success', 'Location saved! You can reopen the map to select a different location.');
                            }}
                          >
                            Use This Location
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Click on the map or search to select your hotel location</span>
                  <span>Sri Lanka locations only</span>
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
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  {/* Header */}
                  <div className="bg-green-50 px-4 py-3 border-b border-green-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="material-icons text-green-600 text-sm mr-2">location_on</span>
                        <h4 className="text-sm font-semibold text-green-800">Selected Hotel Location</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMap(true);
                          showFlash('info', 'Map opened! Click on the map or search to select a new location.');
                          // Scroll to map after a brief delay
                          setTimeout(() => {
                            const mapSection = document.querySelector('#google-map');
                            if (mapSection) {
                              mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }, 300);
                        }}
                        className="text-xs text-green-600 hover:text-green-800 flex items-center transition-colors"
                      >
                        <span className="material-icons text-xs mr-1">edit</span>
                        Change Location
                      </button>
                    </div>
                  </div>
                  
                  {/* Location Details */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Address Information */}
                      <div>
                        <div className="mb-3">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                          <p className="text-sm text-gray-800 mt-1">{selectedLocation.address}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="font-medium text-gray-500 uppercase tracking-wide">Latitude</label>
                            <p className="text-gray-700 mt-1">{selectedLocation.lat.toFixed(6)}</p>
                          </div>
                          <div>
                            <label className="font-medium text-gray-500 uppercase tracking-wide">Longitude</label>
                            <p className="text-gray-700 mt-1">{selectedLocation.lng.toFixed(6)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <span className="material-icons text-xs mr-1">info</span>
                          This location will be visible to customers searching for hotels in your area
                        </div>
                      </div>
                      
                      {/* Mini Map Display */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Map Preview</label>
                        <div className="relative border border-gray-200 rounded-md overflow-hidden" style={{ height: '150px' }}>
                          <div id="mini-map" style={{ height: '100%', width: '100%' }}></div>
                          
                          {/* Map Overlay Controls */}
                          <div className="absolute top-2 right-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (window.google && selectedLocation) {
                                  // Create or update mini map
                                  const miniMapElement = document.getElementById('mini-map');
                                  if (miniMapElement) {
                                    const miniMap = new window.google.maps.Map(miniMapElement, {
                                      center: { lat: selectedLocation.lat, lng: selectedLocation.lng },
                                      zoom: 15,
                                      mapTypeControl: false,
                                      streetViewControl: false,
                                      fullscreenControl: false,
                                      zoomControl: true,
                                      gestureHandling: 'cooperative'
                                    });
                                    
                                    new window.google.maps.Marker({
                                      position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
                                      map: miniMap,
                                      title: selectedLocation.address,
                                      icon: {
                                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                          </svg>
                                        `),
                                        scaledSize: new window.google.maps.Size(32, 32),
                                        anchor: new window.google.maps.Point(16, 32)
                                      }
                                    });
                                  }
                                }
                              }}
                              className="bg-white bg-opacity-90 p-1 rounded shadow-sm hover:bg-opacity-100 transition-all"
                              title="Refresh Map"
                            >
                              <span className="material-icons text-sm text-gray-600">refresh</span>
                            </button>
                          </div>
                          
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-700 text-center">
                              Click and drag to explore • Scroll to zoom
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  I accept the <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-yellow-500 hover:underline focus:outline-none"
                  >
                    Terms and Conditions
                  </button>*
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
                  I accept the <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-yellow-500 hover:underline focus:outline-none"
                  >
                    Privacy Policy
                  </button>*
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
      
      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #facc15 70%, #eab308 100%)'
        }}>
          <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="bg-yellow-500 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center">
                <span className="material-icons text-white mr-2">privacy_tip</span>
                <h2 className="text-xl font-bold text-white">TravelSri Privacy Policy</h2>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                
                {/* Introduction */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Privacy Policy Overview</h3>
                  <p className="text-gray-600 leading-relaxed">
                    At TravelSri, we are committed to protecting your privacy and ensuring the security of your personal 
                    information. This Privacy Policy explains how we collect, use, store, and protect your data when you 
                    use our platform as a hotel partner or guest.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-3">
                    <strong>Last Updated:</strong> August 19, 2025 | <strong>Effective Date:</strong> August 19, 2025
                  </p>
                </div>

                {/* Section 1 - Information We Collect */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Information We Collect</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>1.1 Hotel Partner Information:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Business registration details and licensing information</li>
                      <li>Hotel contact information (name, address, phone, email)</li>
                      <li>Banking and payment details for transaction processing</li>
                      <li>Property photos, descriptions, and promotional content</li>
                      <li>Room availability, pricing, and booking preferences</li>
                      <li>Quality ratings, reviews, and performance metrics</li>
                    </ul>
                    
                    <p><strong>1.2 Guest Information (Collected on Behalf of Hotels):</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Personal details (name, contact information, identification)</li>
                      <li>Booking preferences and travel history</li>
                      <li>Payment information and transaction records</li>
                      <li>Communication records and support interactions</li>
                      <li>Website usage data and browsing patterns</li>
                    </ul>
                    
                    <p><strong>1.3 Technical Information:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>IP addresses, browser types, and device information</li>
                      <li>Location data (for mapping and local services)</li>
                      <li>Cookies and similar tracking technologies</li>
                      <li>Platform usage analytics and performance data</li>
                    </ul>
                  </div>
                </div>

                {/* Section 2 - How We Use Your Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">2. How We Use Your Information</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>2.1 Service Provision:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Process and manage hotel registrations and partnerships</li>
                      <li>Facilitate booking transactions and payment processing</li>
                      <li>Provide customer support and resolve disputes</li>
                      <li>Maintain platform functionality and user accounts</li>
                    </ul>
                    
                    <p><strong>2.2 Business Operations:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Verify hotel credentials and ensure service quality</li>
                      <li>Generate reports and analytics for business insights</li>
                      <li>Improve platform features and user experience</li>
                      <li>Conduct research and development activities</li>
                    </ul>
                    
                    <p><strong>2.3 Marketing and Communication:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Send booking confirmations and service updates</li>
                      <li>Promote hotel properties and special offers</li>
                      <li>Conduct customer satisfaction surveys</li>
                      <li>Provide personalized recommendations and content</li>
                    </ul>
                    
                    <p><strong>2.4 Legal and Compliance:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Comply with legal obligations and regulatory requirements</li>
                      <li>Prevent fraud, abuse, and unauthorized access</li>
                      <li>Resolve legal disputes and enforce our terms</li>
                      <li>Maintain records for audit and compliance purposes</li>
                    </ul>
                  </div>
                </div>

                {/* Section 3 - Information Sharing */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Information Sharing and Disclosure</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>3.1 Hotel Partners:</strong> Guest booking information is shared with relevant hotels to facilitate service delivery and guest accommodation.</p>
                    
                    <p><strong>3.2 Service Providers:</strong> We may share information with trusted third-party service providers who assist in:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Payment processing and financial transactions</li>
                      <li>Technical infrastructure and platform maintenance</li>
                      <li>Customer support and communication services</li>
                      <li>Marketing and advertising activities</li>
                      <li>Legal and compliance consulting</li>
                    </ul>
                    
                    <p><strong>3.3 Legal Requirements:</strong> We may disclose information when required by law, court order, or government regulation.</p>
                    
                    <p><strong>3.4 Business Transfers:</strong> Information may be transferred in connection with mergers, acquisitions, or business asset sales.</p>
                    
                    <p><strong>3.5 We Do NOT:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Sell personal information to third parties for profit</li>
                      <li>Share data with unauthorized external organizations</li>
                      <li>Use information for purposes unrelated to our services</li>
                    </ul>
                  </div>
                </div>

                {/* Section 4 - Data Security */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Data Security and Protection</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>4.1 Security Measures:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>SSL/TLS encryption for data transmission</li>
                      <li>Secure database storage with access controls</li>
                      <li>Regular security audits and vulnerability assessments</li>
                      <li>Employee training on data protection best practices</li>
                      <li>Multi-factor authentication for sensitive accounts</li>
                    </ul>
                    
                    <p><strong>4.2 Access Controls:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Limited access to personal data on a need-to-know basis</li>
                      <li>User authentication and authorization systems</li>
                      <li>Regular monitoring of data access and usage</li>
                      <li>Immediate revocation of access for former employees</li>
                    </ul>
                    
                    <p><strong>4.3 Incident Response:</strong> In case of a data breach, we will notify affected parties and relevant authorities within 72 hours as required by law.</p>
                  </div>
                </div>

                {/* Section 5 - Data Retention */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Data Retention and Storage</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>5.1 Retention Periods:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Hotel partner data: Retained during active partnership + 7 years for legal/tax purposes</li>
                      <li>Guest booking data: Retained for 5 years or as required by hospitality regulations</li>
                      <li>Financial records: Retained for 7 years for accounting and audit purposes</li>
                      <li>Marketing data: Retained until consent is withdrawn or account is deactivated</li>
                      <li>Technical logs: Retained for 2 years for security and troubleshooting</li>
                    </ul>
                    
                    <p><strong>5.2 Data Disposal:</strong> When retention periods expire, data is securely deleted or anonymized using industry-standard methods.</p>
                    
                    <p><strong>5.3 Backup Systems:</strong> Data backups are maintained for business continuity but are subject to the same retention and security policies.</p>
                  </div>
                </div>

                {/* Section 6 - Your Rights */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">6. Your Privacy Rights</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>6.1 Access Rights:</strong> You can request access to personal information we hold about you.</p>
                    
                    <p><strong>6.2 Correction Rights:</strong> You can request correction of inaccurate or incomplete information.</p>
                    
                    <p><strong>6.3 Deletion Rights:</strong> You can request deletion of your personal information (subject to legal retention requirements).</p>
                    
                    <p><strong>6.4 Portability Rights:</strong> You can request a copy of your data in a commonly used, machine-readable format.</p>
                    
                    <p><strong>6.5 Objection Rights:</strong> You can object to certain types of data processing, particularly for marketing purposes.</p>
                    
                    <p><strong>6.6 Consent Withdrawal:</strong> You can withdraw consent for data processing at any time (where processing is based on consent).</p>
                    
                    <p><strong>To Exercise Rights:</strong> Contact us at privacy@travelsri.com or use the contact details provided below.</p>
                  </div>
                </div>

                {/* Section 7 - Cookies and Tracking */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">7. Cookies and Tracking Technologies</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>7.1 Types of Cookies We Use:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
                      <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                      <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                      <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness</li>
                    </ul>
                    
                    <p><strong>7.2 Cookie Management:</strong> You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect platform functionality.</p>
                    
                    <p><strong>7.3 Third-Party Tools:</strong> We use analytics tools (like Google Analytics) and social media plugins that may set their own cookies.</p>
                  </div>
                </div>

                {/* Section 8 - International Transfers */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">8. International Data Transfers</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>8.1 Data Location:</strong> Your data is primarily stored on servers located in Sri Lanka and may be transferred to other countries for processing.</p>
                    
                    <p><strong>8.2 Transfer Safeguards:</strong> When transferring data internationally, we ensure adequate protection through:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Adequacy decisions by relevant data protection authorities</li>
                      <li>Standard contractual clauses approved by regulatory bodies</li>
                      <li>Certification schemes and codes of conduct</li>
                      <li>Binding corporate rules for intra-group transfers</li>
                    </ul>
                    
                    <p><strong>8.3 Legal Basis:</strong> International transfers are based on legitimate business interests and adequate safeguards to protect your rights.</p>
                  </div>
                </div>

                {/* Section 9 - Children's Privacy */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">9. Children's Privacy Protection</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>9.1 Age Restrictions:</strong> Our services are not intended for children under 18 years of age. Hotel partners must be legally authorized business entities.</p>
                    
                    <p><strong>9.2 Parental Consent:</strong> If we become aware that we have collected information from a child under 18, we will take steps to delete such information.</p>
                    
                    <p><strong>9.3 Family Bookings:</strong> When processing bookings that include minors, we collect only information necessary for accommodation services.</p>
                  </div>
                </div>

                {/* Section 10 - Updates and Changes */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">10. Policy Updates and Changes</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>10.1 Policy Updates:</strong> We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.</p>
                    
                    <p><strong>10.2 Notification:</strong> Significant changes will be communicated through:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Email notifications to registered hotel partners</li>
                      <li>Prominent notices on our platform</li>
                      <li>Updated effective dates on this policy</li>
                    </ul>
                    
                    <p><strong>10.3 Continued Use:</strong> Continued use of our services after policy updates constitutes acceptance of the revised terms.</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Data Protection Officer:</strong><br/>
                      TravelSri Privacy Team<br/>
                      Email: privacy@travelsri.com<br/>
                      Phone: +94 11 123 4567
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Business Address:</strong><br/>
                      TravelSri (Pvt) Ltd<br/>
                      123 Business District<br/>
                      Colombo 01, Sri Lanka
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Response Time:</strong> We will respond to privacy-related inquiries within 30 days of receipt.
                    </p>
                  </div>
                </div>

                {/* Reading Completion Notice */}
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <div className="flex items-center text-yellow-800">
                    <span className="material-icons mr-2">info</span>
                    <p className="text-sm">
                      <strong>Important:</strong> Please read all sections above completely before accepting this Privacy Policy.
                      The Accept and Cancel buttons are below this notice.
                    </p>
                  </div>
                </div>

                {/* Action Buttons - Inside Scrollable Content */}
                <div className="mt-8 border-t pt-6 bg-gray-50 px-6 py-6 rounded-lg">
                  <div className="text-sm text-gray-600 mb-4 text-center">
                    <span className="flex items-center justify-center">
                      <span className="material-icons text-xs mr-1">security</span>
                      By accepting, you acknowledge reading and agreeing to our Privacy Policy
                    </span>
                  </div>
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={() => setShowPrivacyModal(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, acceptPrivacyPolicy: true }));
                        setShowPrivacyModal(false);
                        showFlash('success', 'Privacy Policy accepted successfully!');
                      }}
                      className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors font-medium flex items-center"
                    >
                      <span className="material-icons text-sm mr-1">check_circle</span>
                      Accept Privacy Policy
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #facc15 70%, #eab308 100%)'
        }}>
          <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="bg-yellow-400 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center">
                <span className="material-icons text-black mr-2">description</span>
                <h2 className="text-xl font-bold text-black">TravelSri Terms and Conditions</h2>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-black hover:text-gray-700 transition-colors"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                
                {/* Introduction */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Agreement Overview</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Welcome to TravelSri! These Terms and Conditions ("Agreement") govern the relationship between 
                    TravelSri Platform ("TravelSri", "we", "us") and your hotel property ("Hotel", "you", "Partner") 
                    for the use of our online tourism platform and booking services.
                  </p>
                </div>

                {/* Section 1 - Service Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Service Description</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>1.1 Platform Services:</strong> TravelSri provides an online platform connecting hotels with travelers seeking accommodation in Sri Lanka.</p>
                    <p><strong>1.2 Booking Management:</strong> We facilitate online reservations, payment processing, and customer communication.</p>
                    <p><strong>1.3 Marketing Support:</strong> Your hotel will be featured on our platform with photos, descriptions, and booking capabilities.</p>
                    <p><strong>1.4 Customer Support:</strong> We provide 24/7 customer support for booking inquiries and issues.</p>
                  </div>
                </div>

                {/* Section 2 - Hotel Obligations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Hotel Partner Obligations</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>2.1 Accurate Information:</strong> Provide truthful, accurate, and current information about your property, rooms, amenities, and services.</p>
                    <p><strong>2.2 Availability Management:</strong> Maintain real-time room availability and pricing on our platform.</p>
                    <p><strong>2.3 Service Standards:</strong> Deliver services as described and maintain quality standards consistent with your property classification.</p>
                    <p><strong>2.4 Legal Compliance:</strong> Operate in compliance with all applicable local laws, tourism regulations, and safety standards.</p>
                    <p><strong>2.5 Documentation:</strong> Maintain valid business registration, tourism licenses, and insurance coverage.</p>
                    <p><strong>2.6 Guest Relations:</strong> Provide professional service to all guests booked through TravelSri platform.</p>
                  </div>
                </div>

                {/* Section 3 - Booking and Payment Terms */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Booking and Payment Terms</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>3.1 Reservation Acceptance:</strong> All bookings made through TravelSri are binding once confirmed.</p>
                    <p><strong>3.2 Payment Processing:</strong> TravelSri will collect payments from guests and remit to hotels according to agreed schedules.</p>
                    <p><strong>3.3 Commission Structure:</strong> Hotels agree to pay TravelSri a commission percentage as specified in the partnership agreement.</p>
                    <p><strong>3.4 Cancellation Policy:</strong> Hotels must honor the cancellation policies displayed on the platform.</p>
                    <p><strong>3.5 No-Show Policy:</strong> Hotels may charge guests for no-shows according to stated policies.</p>
                    <p><strong>3.6 Payment Schedule:</strong> Payments will be processed within 7-14 business days after guest checkout.</p>
                  </div>
                </div>

                {/* Section 4 - TravelSri Responsibilities */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">4. TravelSri Platform Responsibilities</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>4.1 Platform Maintenance:</strong> Maintain a functional, secure online booking platform.</p>
                    <p><strong>4.2 Marketing Services:</strong> Promote partner hotels through digital marketing and SEO optimization.</p>
                    <p><strong>4.3 Secure Transactions:</strong> Provide secure payment processing and data protection.</p>
                    <p><strong>4.4 Customer Support:</strong> Handle guest inquiries, booking modifications, and dispute resolution.</p>
                    <p><strong>4.5 Reporting:</strong> Provide detailed booking reports and performance analytics.</p>
                    <p><strong>4.6 Technology Support:</strong> Offer technical assistance for platform usage and integration.</p>
                  </div>
                </div>

                {/* Section 5 - Content and Intellectual Property */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Content and Intellectual Property</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>5.1 Hotel Content:</strong> Hotels grant TravelSri rights to use provided photos, descriptions, and promotional materials.</p>
                    <p><strong>5.2 Content Quality:</strong> All content must be high-quality, accurate, and professionally appropriate.</p>
                    <p><strong>5.3 Platform Rights:</strong> TravelSri retains ownership of platform technology, design, and proprietary systems.</p>
                    <p><strong>5.4 User Reviews:</strong> Guest reviews and ratings will be displayed transparently on the platform.</p>
                    <p><strong>5.5 Content Moderation:</strong> TravelSri reserves the right to moderate and remove inappropriate content.</p>
                  </div>
                </div>

                {/* Section 6 - Data Protection and Privacy */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">6. Data Protection and Privacy</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>6.1 Guest Data:</strong> Guest personal information will be handled according to our Privacy Policy.</p>
                    <p><strong>6.2 Data Security:</strong> Both parties will maintain appropriate security measures for customer data.</p>
                    <p><strong>6.3 Data Usage:</strong> Hotel and guest data will only be used for legitimate business purposes.</p>
                    <p><strong>6.4 Compliance:</strong> All data handling will comply with applicable privacy laws and regulations.</p>
                    <p><strong>6.5 Data Sharing:</strong> Guest contact information will be shared only as necessary for service delivery.</p>
                  </div>
                </div>

                {/* Section 7 - Quality Standards */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">7. Quality Standards and Performance</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>7.1 Service Quality:</strong> Hotels must maintain consistent service standards and guest satisfaction ratings.</p>
                    <p><strong>7.2 Facility Standards:</strong> Properties must meet basic safety, cleanliness, and operational standards.</p>
                    <p><strong>7.3 Response Times:</strong> Hotels must respond to booking confirmations within 24 hours.</p>
                    <p><strong>7.4 Performance Monitoring:</strong> TravelSri may monitor service quality through guest feedback and reviews.</p>
                    <p><strong>7.5 Improvement Requirements:</strong> Hotels may be required to address recurring quality issues.</p>
                  </div>
                </div>

                {/* Section 8 - Liability and Insurance */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">8. Liability and Insurance</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>8.1 Hotel Liability:</strong> Hotels are fully responsible for guest safety, property damage, and service delivery.</p>
                    <p><strong>8.2 Platform Liability:</strong> TravelSri's liability is limited to platform-related technical issues only.</p>
                    <p><strong>8.3 Insurance Requirements:</strong> Hotels must maintain adequate liability insurance coverage.</p>
                    <p><strong>8.4 Guest Claims:</strong> Hotels will handle and resolve guest complaints and damage claims directly.</p>
                    <p><strong>8.5 Indemnification:</strong> Hotels indemnify TravelSri against claims arising from hotel operations.</p>
                  </div>
                </div>

                {/* Section 9 - Termination */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">9. Agreement Termination</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>9.1 Termination Rights:</strong> Either party may terminate this agreement with 30 days written notice.</p>
                    <p><strong>9.2 Immediate Termination:</strong> TravelSri may terminate immediately for breach of terms or quality issues.</p>
                    <p><strong>9.3 Post-Termination:</strong> Existing bookings will be honored, and final payments processed.</p>
                    <p><strong>9.4 Data Return:</strong> Upon termination, all shared data will be returned or destroyed as requested.</p>
                    <p><strong>9.5 Outstanding Obligations:</strong> Financial obligations will survive termination until fully settled.</p>
                  </div>
                </div>

                {/* Section 10 - Dispute Resolution */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">10. Dispute Resolution</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>10.1 Communication:</strong> Disputes should first be addressed through direct communication.</p>
                    <p><strong>10.2 Mediation:</strong> Unresolved disputes will be subject to mediation procedures.</p>
                    <p><strong>10.3 Governing Law:</strong> This agreement is governed by the laws of Sri Lanka.</p>
                    <p><strong>10.4 Jurisdiction:</strong> Disputes will be resolved in the appropriate courts of Sri Lanka.</p>
                    <p><strong>10.5 Language:</strong> English will be the primary language for all legal proceedings.</p>
                  </div>
                </div>

                {/* Agreement Details */}
                <div className="border-t pt-6 mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                      <strong>Last Updated:</strong> August 19, 2025<br/>
                      <strong>Version:</strong> 1.0<br/>
                      <strong>Contact:</strong> legal@travelsri.com | +94 11 123 4567
                    </p>
                  </div>
                </div>

                {/* Reading Completion Notice */}
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-yellow-800">
                    <span className="material-icons mr-2">info</span>
                    <p className="text-sm">
                      <strong>Important:</strong> Please read all sections above completely before accepting these terms and conditions.
                      The Accept and Cancel buttons are below this notice.
                    </p>
                  </div>
                </div>

                {/* Action Buttons - Inside Scrollable Content */}
                <div className="mt-8 border-t pt-6 bg-gray-50 px-6 py-6 rounded-lg">
                  <div className="text-sm text-gray-600 mb-4 text-center">
                    <span className="flex items-center justify-center">
                      <span className="material-icons text-xs mr-1">assignment</span>
                      By accepting, you agree to all terms and conditions stated above
                    </span>
                  </div>
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={() => setShowTermsModal(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, acceptTerms: true }));
                        setShowTermsModal(false);
                        showFlash('success', 'Terms and Conditions accepted successfully!');
                      }}
                      className="px-6 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors font-medium flex items-center"
                    >
                      <span className="material-icons text-sm mr-1">check_circle</span>
                      Accept Terms
                    </button>
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

export default SignupPage;
