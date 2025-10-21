package com.example.student.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/places")
@CrossOrigin  // ✅ EXACT SAME as PostController - no manual headers needed!
public class PlacesController {

    @Value("${google.places.api.key}")
    private String googlePlacesApiKey;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    private RestTemplate getRestTemplate() {
        return new RestTemplate();
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<?> getPlacesAutocomplete(
            @RequestParam String input,
            @RequestParam(defaultValue = "geocode") String types,
            @RequestParam(defaultValue = "en") String language) {

        try {
            System.out.println("🔍 Received request - Input: " + input + ", Types: " + types);

            if (input == null || input.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("status", "INVALID_REQUEST");
                errorResponse.put("error_message", "Input parameter is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            if (googlePlacesApiKey == null || googlePlacesApiKey.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("status", "CONFIGURATION_ERROR");
                errorResponse.put("error_message", "Google Places API key is not configured");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

            UriComponentsBuilder builder = UriComponentsBuilder
                    .fromHttpUrl("https://maps.googleapis.com/maps/api/place/autocomplete/json")
                    .queryParam("input", input.trim())
                    .queryParam("key", googlePlacesApiKey)
                    .queryParam("language", language);

            if (types != null && !types.trim().isEmpty()) {
                String cleanTypes = types.replace("|", ",");
                builder.queryParam("types", cleanTypes);
            }

            String url = builder.build().toUriString();

            System.out.println("📡 Making request to: " + url.replace(googlePlacesApiKey, "***API_KEY***"));

            RestTemplate restTemplate = getRestTemplate();
            String response = restTemplate.getForObject(url, String.class);

            if (response == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("status", "UNKNOWN_ERROR");
                errorResponse.put("error_message", "No response from Google Places API");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

            System.out.println("✅ Successfully received response from Google Places API");

            // ✅ NO manual CORS headers - let @CrossOrigin handle it
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error in autocomplete: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "INTERNAL_ERROR");
            errorResponse.put("error_message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/details")
    public ResponseEntity<?> getPlaceDetails(
            @RequestParam String placeId,
            @RequestParam(defaultValue = "geometry,formatted_address,address_components,name") String fields,
            @RequestParam(defaultValue = "en") String language) {

        try {
            System.out.println("🔍 Place details request for: " + placeId);

            if (placeId == null || placeId.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("status", "INVALID_REQUEST");
                errorResponse.put("error_message", "PlaceId parameter is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            if (googlePlacesApiKey == null || googlePlacesApiKey.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("status", "CONFIGURATION_ERROR");
                errorResponse.put("error_message", "Google Places API key is not configured");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

            String url = UriComponentsBuilder
                    .fromHttpUrl("https://maps.googleapis.com/maps/api/place/details/json")
                    .queryParam("place_id", placeId.trim())
                    .queryParam("key", googlePlacesApiKey)
                    .queryParam("fields", fields)
                    .queryParam("language", language)
                    .build()
                    .toUriString();

            System.out.println("📡 Making request to Google Places Details API");

            RestTemplate restTemplate = getRestTemplate();
            String response = restTemplate.getForObject(url, String.class);

            if (response == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("status", "UNKNOWN_ERROR");
                errorResponse.put("error_message", "No response from Google Places Details API");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

            System.out.println("✅ Successfully received response from Google Places Details API");

            // ✅ NO manual CORS headers - let @CrossOrigin handle it
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error in place details: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "INTERNAL_ERROR");
            errorResponse.put("error_message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        System.out.println("🏥 Health check requested");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Places API Proxy");
        response.put("timestamp", System.currentTimeMillis());
        response.put("api_key_configured", googlePlacesApiKey != null && !googlePlacesApiKey.trim().isEmpty());
        response.put("version", "1.0.0");

        // ✅ NO manual CORS headers - let @CrossOrigin handle it
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<?> testGooglePlacesApi() {
        try {
            System.out.println("🧪 Running API test...");
            return getPlacesAutocomplete("London", "geocode", "en");
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "TEST_FAILED");
            errorResponse.put("error_message", "Google Places API test failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
