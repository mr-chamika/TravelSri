// server.js - Node.js Backend
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting to prevent API abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

// Cache for frequently searched places (optional optimization)
const placeCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Helper function to clean and validate input
const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().substring(0, 100); // Limit to 100 characters
};

// API endpoint for place suggestions
app.get('/api/places/search', async (req, res) => {
  try {
    const { query, country = 'lk' } = req.query;
    
    // Validate input
    const sanitizedQuery = sanitizeInput(query);
    if (sanitizedQuery.length < 2) {
      return res.json({
        success: true,
        predictions: [],
        message: 'Query too short'
      });
    }

    // Check cache first
    const cacheKey = `${sanitizedQuery}_${country}`;
    const cached = placeCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return res.json({
        success: true,
        predictions: cached.data,
        cached: true
      });
    }

    // Validate API key
    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Google Places API key not configured'
      });
    }

    // Make request to Google Places API with proper types parameter
    const response = await axios.get(GOOGLE_PLACES_URL, {
      params: {
        input: sanitizedQuery,
        components: `country:${country}`,
        // Removed types parameter entirely for broader, more reliable results
        key: GOOGLE_PLACES_API_KEY
      },
      timeout: 5000 // 5 second timeout
    });

    const { data } = response;

    if (data.status === 'OK') {
      // Format the response for frontend
      const formattedPredictions = data.predictions.map(prediction => ({
        place_id: prediction.place_id,
        description: prediction.description,
        main_text: prediction.structured_formatting.main_text,
        secondary_text: prediction.structured_formatting.secondary_text || '',
        types: prediction.types
      }));

      // Cache the results
      placeCache.set(cacheKey, {
        data: formattedPredictions,
        timestamp: Date.now()
      });

      res.json({
        success: true,
        predictions: formattedPredictions,
        cached: false
      });
    } else {
      console.error('Google Places API error:', data.status, data.error_message);
      res.status(400).json({
        success: false,
        error: data.error_message || 'Invalid request to Google Places API'
      });
    }

  } catch (error) {
    console.error('Places search error:', error.message);
    
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      res.status(408).json({
        success: false,
        error: 'Request timeout - please try again'
      });
    } else if (error.response?.status === 429) {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded - please try again later'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Places API server is running',
    timestamp: new Date().toISOString()
  });
});

// Popular places endpoint (fallback data)
app.get('/api/places/popular', (req, res) => {
  const { country = 'lk' } = req.query;
  
  const popularPlaces = {
    lk: [
      { name: 'Kandy', description: 'Kandy, Sri Lanka' },
      { name: 'Galle', description: 'Galle, Sri Lanka' },
      { name: 'Ella', description: 'Ella, Sri Lanka' },
      { name: 'Sigiriya', description: 'Sigiriya, Sri Lanka' },
      { name: 'Nuwara Eliya', description: 'Nuwara Eliya, Sri Lanka' },
      { name: 'Yala National Park', description: 'Yala National Park, Sri Lanka' },
      { name: 'Mirissa', description: 'Mirissa, Sri Lanka' },
      { name: 'Unawatuna', description: 'Unawatuna, Sri Lanka' },
      { name: 'Anuradhapura', description: 'Anuradhapura, Sri Lanka' },
      { name: 'Polonnaruwa', description: 'Polonnaruwa, Sri Lanka' }
    ]
  };

  res.json({
    success: true,
    places: popularPlaces[country] || []
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Places API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/places/search?query=kandy`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

module.exports = app;