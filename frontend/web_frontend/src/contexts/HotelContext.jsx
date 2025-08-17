import React, { createContext, useState, useEffect, useContext } from 'react';
import hotelProfileService from '../services/hotelProfileService';

// Create the context
const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch the hotel profile
  const fetchHotelProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if we're logged in as a hotel
      const token = localStorage.getItem('hotelAuthToken');
      if (!token) {
        console.log('No authentication token found');
        // Redirect to login page if no token
        window.location.href = '/login';
        return;
      }
      
      // Get user data from localStorage - try both potential sources
      const userData = localStorage.getItem('user') || localStorage.getItem('hotelUserData');
      if (!userData) {
        console.log('No user data found in localStorage');
        setHotel(null);
        setLoading(false);
        // Redirect to login if no user data
        window.location.href = '/login';
        return;
      }
      
      let userObj;
      try {
        userObj = JSON.parse(userData);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        setHotel(null);
        setLoading(false);
        // Redirect to login if user data is invalid
        window.location.href = '/login';
        return;
      }
      
      // Use a default role if none is present
      const role = userObj?.role || 'guest';
      console.log('User role:', role);
      
      if (role !== 'hotel') {
        console.log('User is not a hotel. Current role:', role);
        setHotel(null);
        setLoading(false);
        // Redirect to appropriate dashboard based on role
        if (role === 'admin') {
          window.location.href = '/admin';
        } else if (role === 'user') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/login';
        }
        return;
      }
      
      // Setup fallback data in case API call fails
      const fallbackData = {
        hotelName: userObj.hotelName || 'Hotel Name',
        email: userObj.email || '',
        description: 'Your hotel description will appear here once loaded.',
        // Add other default fields as needed
      };
      
      try {
        // Fetch hotel profile - make multiple attempts with different methods if needed
        let hotelProfile = await hotelProfileService.getProfile();
        
        // If profile is null or empty, try fetching by username
        if (!hotelProfile && userObj.username) {
          try {
            hotelProfile = await hotelProfileService.getHotelByUsername(userObj.username);
          } catch (usernameError) {
            console.error('Failed to get profile by username:', usernameError);
          }
        }
        
        setHotel(hotelProfile || fallbackData);
        
        // If we got data but it's missing some fields, enrich it with fallback data
        if (hotelProfile && (!hotelProfile.hotelName || !hotelProfile.email)) {
          setHotel(prevHotel => ({
            ...prevHotel,
            hotelName: prevHotel.hotelName || fallbackData.hotelName,
            email: prevHotel.email || fallbackData.email
          }));
        }
      } catch (profileError) {
        console.error('Error fetching hotel profile from API:', profileError);
        // Use fallback data if API call fails
        setHotel(fallbackData);
        setError('Failed to load complete profile data. Some features may be limited.');
      }
    } catch (err) {
      console.error('Error in fetchHotelProfile:', err);
      setError('Failed to initialize hotel profile');
      // Set a minimal hotel object to prevent UI errors
      setHotel({ 
        hotelName: 'Hotel Admin',
        email: '',
        description: 'Profile data could not be loaded.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile when the component mounts
  useEffect(() => {
    fetchHotelProfile();
  }, []);

  // Update the hotel profile
  const updateHotelProfile = async (profileData) => {
    try {
      const updatedProfile = await hotelProfileService.updateProfile(profileData);
      setHotel(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating hotel profile:', err);
      throw err;
    }
  };

  // Context value
  const value = {
    hotel,
    loading,
    error,
    fetchHotelProfile,
    updateHotelProfile,
  };

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
};

// Custom hook to use the hotel context
export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};

export default HotelContext;
