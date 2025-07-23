# Installing Axios for HTTP Requests

You're seeing an error because the `axios` package is not installed in your project. This package is needed for making HTTP requests to your Spring Boot backend.

## Installation Steps

Run the following command in your project's root directory:

```bash
npm install axios
```

After installation is complete, restart your development server.

## Usage

Once installed, you can use axios to make HTTP requests to your backend:

```javascript
import axios from 'axios';

// Make a GET request
axios.get('/api/endpoint')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

// Make a POST request
axios.post('/api/endpoint', {
  key: 'value'
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error posting data:', error);
  });
```

## Alternative: Using Fetch API

If you prefer not to add another dependency, you can use the built-in Fetch API instead of axios:

```javascript
// Replace the axios code in chartService.js

// Instead of:
const response = await axios.get(`${API_BASE_URL}/charts/monthly-bookings`);
return response.data;

// Use:
const response = await fetch(`${API_BASE_URL}/charts/monthly-bookings`);
return await response.json();
```