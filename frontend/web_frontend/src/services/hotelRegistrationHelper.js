// Sample code to demonstrate a proper hotel registration API call

// Import axios
import axios from 'axios';

// Define API base URL
const API_URL = 'http://localhost:8080';

/**
 * Function to register a new hotel
 * @param {Object} hotelData - Hotel registration data
 * @returns {Promise} - Promise with response data
 */
export const registerHotel = async (hotelData) => {
  try {
    // Ensure required fields are present
    if (!hotelData.username || !hotelData.email || !hotelData.password) {
      throw new Error('Username, email and password are required');
    }
    
    // Create minimal registration data with required fields
    const registrationData = {
      username: hotelData.username,
      email: hotelData.email,
      password: hotelData.password,
      hotelName: hotelData.hotelName || hotelData.name || 'Hotel',
      name: hotelData.hotelName || hotelData.name || 'Hotel',  // Required legacy field
      // Add other fields as needed
    };
    
    console.log('Sending hotel registration data:', registrationData);
    
    // Make API call
    const response = await axios.post(
      `${API_URL}/hotels/register`, 
      registrationData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
};

// Example usage
// registerHotel({
//   username: 'hoteluser1',
//   email: 'hotel1@example.com',
//   password: 'password123',
//   hotelName: 'Example Hotel'
// })
//   .then(data => console.log('Registration successful:', data))
//   .catch(err => console.error('Registration failed:', err));
