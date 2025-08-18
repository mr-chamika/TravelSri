import axios from 'axios';

// Set the base URL to your backend API
const API_URL = 'http://localhost:8080/api/pendingTrip';

// Create a service for managing pending trips
const pendingTripService = {
  /**
   * Get all pending trips
   * @returns {Promise<Array>} Array of pending trip objects
   */
  getAllPendingTrips: async () => {
    try {
      const response = await axios.get(`${API_URL}/getall`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending trips:', error);
      throw error;
    }
  },
  
  /**
   * Get a pending trip by ID
   * @param {string} id - The ID of the pending trip
   * @returns {Promise<Object>} The pending trip object
   */
  getPendingTripById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pending trip with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new pending trip
   * @param {Object} tripData - The data for the new pending trip
   * @returns {Promise<Object>} The created pending trip object
   */
  createPendingTrip: async (tripData) => {
    try {
      const response = await axios.post(`${API_URL}/create`, tripData);
      return response.data;
    } catch (error) {
      console.error('Error creating pending trip:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing pending trip
   * @param {string} id - The ID of the pending trip to update
   * @param {Object} tripData - The updated data for the pending trip
   * @returns {Promise<Object>} The updated pending trip object
   */
  updatePendingTrip: async (id, tripData) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, tripData);
      return response.data;
    } catch (error) {
      console.error(`Error updating pending trip with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a pending trip
   * @param {string} id - The ID of the pending trip to delete
   * @returns {Promise<boolean>} True if deletion was successful
   */
  deletePendingTrip: async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting pending trip with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Map backend pending trip data to the format expected by the front end
   * @param {Object} backendTripData - The pending trip data from the backend
   * @returns {Object} The formatted trip data for the frontend
   */
  mapPendingTripToGroupPackage: (backendTripData) => {
    // Create a list of destinations (assuming startLocation and endLocation)
    const destinations = [];
    if (backendTripData.startLocation) {
      destinations.push(backendTripData.startLocation);
    }
    if (backendTripData.endLocation && backendTripData.endLocation !== backendTripData.startLocation) {
      destinations.push(backendTripData.endLocation);
    }
    if (backendTripData.path) {
      // If path contains additional locations, split by commas or another separator
      const pathLocations = backendTripData.path.split(',').map(loc => loc.trim());
      destinations.push(...pathLocations);
    }
    
    // Calculate travel dates based on the start date and number of days
    // Handle Java LocalDate objects from the backend
    let travelStartDate, travelEndDate;
    
    // Convert Java LocalDate to JavaScript Date
    if (backendTripData.date) {
      if (typeof backendTripData.date === 'string') {
        // If it's already a string (ISO format), use it directly
        travelStartDate = backendTripData.date;
      } else if (backendTripData.date.year && backendTripData.date.month && backendTripData.date.day) {
        // Java LocalDate format with year, month, day properties
        const year = backendTripData.date.year;
        const month = backendTripData.date.month - 1; // JavaScript months are 0-indexed
        const day = backendTripData.date.day;
        
        // Create a JavaScript Date object and then convert to ISO string
        const dateObj = new Date(year, month, day);
        travelStartDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
      } else {
        // Fallback
        travelStartDate = new Date().toISOString().split('T')[0]; // Today's date
      }
    } else {
      travelStartDate = new Date().toISOString().split('T')[0]; // Today's date
    }
    
    // Default to start date
    travelEndDate = travelStartDate;
    
    // Calculate end date if duration is provided
    if (backendTripData.numberOfDates && backendTripData.numberOfDates > 1) {
      try {
        // Parse the start date string into a Date object
        const startDate = new Date(travelStartDate);
        
        // Create a new date by adding the duration
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (backendTripData.numberOfDates - 1));
        
        // Format back to ISO string YYYY-MM-DD
        travelEndDate = endDate.toISOString().split('T')[0];
      } catch (err) {
        console.error('Error calculating end date:', err);
        // Keep the default (same as start date)
      }
    }
    
    // Extract route path details
    const pathDetails = backendTripData.path || '';
    
    // Generate a concise summary for the route if path exists but no specific description
    let routePathDescription = '';
    if (pathDetails && !backendTripData.descriptionAboutPath) {
      const locations = pathDetails.split(',').map(loc => loc.trim());
      if (locations.length > 1) {
        const keyStops = locations.length <= 3 ? 
          locations.join(', ') : 
          `${locations[0]}, ${locations[Math.floor(locations.length/2)]}, ${locations[locations.length-1]}`;
        routePathDescription = `Journey with ${locations.length} stops. Key locations include ${keyStops}.`;
      } else if (locations.length === 1) {
        routePathDescription = `Direct route with a stop at ${locations[0]}.`;
      } else {
        routePathDescription = 'Direct journey between origin and destination.';
      }
    }
    
    // Format pickup time if available
    let formattedPickupTime = '';
    if (backendTripData.pickupTime) {
      try {
        // Check if pickupTime is an object with hour and minute properties (Java LocalTime)
        if (typeof backendTripData.pickupTime === 'object' && 
            backendTripData.pickupTime.hour !== undefined && 
            backendTripData.pickupTime.minute !== undefined) {
          const hour = backendTripData.pickupTime.hour.toString().padStart(2, '0');
          const minute = backendTripData.pickupTime.minute.toString().padStart(2, '0');
          formattedPickupTime = `${hour}:${minute}`;
        } else if (typeof backendTripData.pickupTime === 'string') {
          formattedPickupTime = backendTripData.pickupTime;
        }
      } catch (err) {
        console.error('Error formatting pickup time:', err);
      }
    }

    // Return the mapped object
    return {
      id: backendTripData.ptId,
      packageCode: `PT-${backendTripData.ptId.substring(0, 6)}`, // Create a shortened package code
      packageName: backendTripData.title || 'Unnamed Trip',
      description: backendTripData.descriptionAboutStartLocation || 'No description available',
      destinations: [...new Set(destinations)], // Remove duplicates
      activities: [], // No direct mapping for activities in the backend data
      duration: backendTripData.numberOfDates || 1,
      travelStartDate: travelStartDate,
      travelEndDate: travelEndDate,
      maxGroupSize: backendTripData.numberOfSeats || 10,
      createdAt: new Date().toISOString(), // Using current date as creation date
      createdBy: 'Travel Guide',
      travelGuideIncluded: true, // Assuming guide is included since guide ID is present
      transportIncluded: backendTripData.vehicleId ? true : false,
      guideId: backendTripData.guideId,
      vehicleId: backendTripData.vehicleId,
      
      // Location information with detailed descriptions
      startLocation: backendTripData.startLocation || 'Not specified',
      startLocationDescription: backendTripData.descriptionAboutStartLocation || 'No description available for this location.',
      
      endLocation: backendTripData.endLocation || 'Not specified',
      // Generate a description for end location if none provided
      endLocationDescription: backendTripData.descriptionAboutEndLocation || 
        `Destination location for the trip from ${backendTripData.startLocation || 'starting point'}.`,
      
      // Use the start location as the pickup location if none is specified
      pickupLocation: backendTripData.pickupLocation || backendTripData.startLocation || 'Not specified',
      pickupLocationDescription: backendTripData.descriptionAboutPickupLocation || 
        (formattedPickupTime ? `Pickup at ${formattedPickupTime}` : ''),
      
      // Path and timing information
      path: pathDetails,
      pickupTime: formattedPickupTime,
      routePathDescription: backendTripData.descriptionAboutPath || routePathDescription
    };
  }
};

export default pendingTripService;
