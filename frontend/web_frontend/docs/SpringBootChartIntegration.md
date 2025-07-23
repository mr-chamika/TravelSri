# Chart.js Integration with Spring Boot Backend

Since your backend is built with Java Spring Boot, we should handle the chart integration properly within that ecosystem. The approach outlined below will work better with your technology stack.

## Frontend Chart Dependencies

Your frontend still needs the Chart.js libraries. Since you're using a Spring Boot backend with a React frontend, you need to install:

```bash
npm install chart.js@^4.4.0 react-chartjs-2@^5.2.0
```

## API Communication

For making HTTP requests to your Spring Boot backend, you have two options:

### Option 1: Use the Fetch API (Built-in)

```javascript
// Example using native fetch API
const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/charts/monthly-bookings');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setChartData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
```

### Option 2: Use Axios (Recommended for more complex applications)

First, install axios:

```bash
npm install axios
```

Then use it in your code:

```javascript
import axios from 'axios';

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/charts/monthly-bookings');
    setChartData(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
```

## Backend Integration

### REST Endpoints for Chart Data

Create REST controllers in your Spring Boot application to serve data to your charts:

```java
@RestController
@RequestMapping("/api/charts")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}) // Add your frontend URLs
public class ChartDataController {

    @Autowired
    private BookingService bookingService;
    
    @GetMapping("/monthly-bookings")
    public ResponseEntity<List<BookingStats>> getMonthlyBookingStats() {
        List<BookingStats> stats = bookingService.getMonthlyBookingStats();
        return ResponseEntity.ok(stats);
    }
    
    // More endpoints...
}
```

### CORS Configuration

Make sure your Spring Boot application has proper CORS configuration to allow requests from your frontend:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
```

## Testing Your Integration

1. **Start Your Spring Boot Backend**:
   ```bash
   ./mvnw spring-boot:run
   ```

2. **Start Your React Frontend**:
   ```bash
   npm run dev
   ```

3. **Test API Endpoints with Postman or cURL**:
   ```bash
   curl http://localhost:8080/api/charts/monthly-bookings
   ```

4. **Use Browser DevTools** to monitor:
   - Network requests to your backend
   - Any CORS errors
   - Response data format

## Troubleshooting

### CORS Issues

If you see errors like "Access to fetch at '...' from origin '...' has been blocked by CORS policy":

1. Check that your Spring Boot CORS configuration is correct
2. Verify that the frontend URL matches the allowed origins
3. Ensure your backend runs on a different port than your frontend

### API 404 Errors

If endpoints return 404:

1. Double check your controller mappings
2. Verify the full URL path (including context path if any)
3. Check that Spring Boot has properly registered your controller

### Data Format Issues

If you get data but charts don't display:

1. Check the structure of your API response
2. Ensure response format matches what Chart.js expects
3. Look for type conversion issues (strings vs numbers)

## Development Without Backend

During frontend development, you can use the mock methods provided in the `ChartService`:

```javascript
// Instead of:
const data = await ChartService.getMonthlyBookingStats();

// Use mock data:
const data = await ChartService.getMockMonthlyBookingStats();
```

When your backend is ready, simply switch to the real API methods.