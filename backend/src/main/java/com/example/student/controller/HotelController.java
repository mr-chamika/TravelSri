package com.example.student.controller;

import com.example.student.model.Hotel;
import com.example.student.repo.HotelsRepo;
import com.example.student.services.JwtUtil;
import com.example.student.services.HotelService;
import com.example.student.services.HotelEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/hotels")
public class HotelController {

    @Autowired
    private HotelsRepo hotelsRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private HotelService hotelService;
    
    @Autowired
    private HotelEmailService hotelEmailService;

    // ========== REGISTRATION AND AUTHENTICATION ==========
    
    @PostMapping("/register")
    public ResponseEntity<?> registerHotel(@RequestBody Hotel hotel) {
        try {
            // Validate required fields
            if (hotel.getUsername() == null || hotel.getUsername().trim().isEmpty()) {
                return new ResponseEntity<>("Username is required", HttpStatus.BAD_REQUEST);
            }
            
            if (hotel.getEmail() == null || hotel.getEmail().trim().isEmpty()) {
                return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
            }
            
            if (hotel.getPassword() == null || hotel.getPassword().trim().isEmpty()) {
                return new ResponseEntity<>("Password is required", HttpStatus.BAD_REQUEST);
            }
            
            // Use service to register hotel
            Hotel savedHotel = hotelService.registerNewHotel(hotel);
            
            if (savedHotel != null) {
                return new ResponseEntity<>("Success", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Signup failed", HttpStatus.BAD_REQUEST);
            }
            
        } catch (Exception e) {
            return new ResponseEntity<>("Signup failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginHotel(@RequestBody Hotel hotel) {
        try {
            String username = hotel.getUsername();
            String password = hotel.getPassword();
            
            if (username == null || username.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Username is required");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            if (password == null || password.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Password is required");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Use service to authenticate hotel
            Hotel authenticatedHotel = hotelService.authenticateHotel(username, password);
            
            if (authenticatedHotel != null) {
                // Check if hotel is verified and active
                if (!authenticatedHotel.isVerified()) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Hotel account is not verified yet");
                    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
                }
                
                if (!authenticatedHotel.isActive()) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Hotel account is not active");
                    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
                }
                
                // Create UserDetails for JWT token generation
                UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                        authenticatedHotel.getUsername(),
                        authenticatedHotel.getPassword(),
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_HOTEL"))
                );
                
                // Generate JWT token
                String token = generateHotelToken(userDetails, authenticatedHotel);
                
                Map<String, String> responseBody = new HashMap<>();
                responseBody.put("token", token);
                return ResponseEntity.ok(responseBody);
                
            } else {
                Map<String, String> errorBody = new HashMap<>();
                errorBody.put("error", "Invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);
            }
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Login failed: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Helper method to convert Hotel to User for JWT token generation
    private com.example.student.model.User convertHotelToUser(Hotel hotel) {
        com.example.student.model.User user = new com.example.student.model.User();
        user.set_id(hotel.get_id());
        user.setEmail(hotel.getEmail());
        user.setUsername(hotel.getUsername());
        user.setRole("ROLE_HOTEL");
        return user;
    }
    
    // Simplified token generation for hotels
    private String generateHotelToken(UserDetails userDetails, Hotel hotel) {
        try {
            // Create a temporary User object for JWT generation
            com.example.student.model.User tempUser = new com.example.student.model.User();
            tempUser.set_id(hotel.get_id());
            tempUser.setEmail(hotel.getEmail());
            tempUser.setUsername(hotel.getUsername());
            tempUser.setRole("ROLE_HOTEL");
            
            return jwtUtil.generateToken(userDetails, tempUser);
        } catch (Exception e) {
            // Fallback: generate a simple token
            return "hotel-token-" + hotel.getUsername() + "-" + System.currentTimeMillis();
        }
    }

    // ========== EMAIL VALIDATION ==========
    
    @GetMapping("/check-email")
    public ResponseEntity<String> checkEmailAvailability(@RequestParam String email) {
        try {
            if (hotelEmailService.isEmailRegistered(email)) {
                return ResponseEntity.ok("Exists");
            } else {
                return ResponseEntity.ok("Available");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error");
        }
    }
    
    @GetMapping("/check-username")
    public ResponseEntity<String> checkUsernameAvailability(@RequestParam String username) {
        try {
            if (hotelEmailService.isUsernameRegistered(username)) {
                return ResponseEntity.ok("Exists");
            } else {
                return ResponseEntity.ok("Available");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error");
        }
    }
    
    // ========== PASSWORD RESET ==========
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> resetData) {
        try {
            String email = resetData.get("email");
            String newPassword = resetData.get("password");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required");
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password is required");
            }
            
            Optional<Hotel> hotelOpt = hotelsRepo.findAll().stream()
                    .filter(h -> email.equals(h.getEmail()))
                    .findFirst();
            
            if (hotelOpt.isPresent()) {
                Hotel hotel = hotelOpt.get();
                String hashedPassword = passwordEncoder.encode(newPassword);
                hotel.setPassword(hashedPassword);
                hotel.setUpdatedAt(java.time.Instant.now().toString());
                
                hotelsRepo.save(hotel);
                return ResponseEntity.ok("Success");
            }
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Password change failed");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Password change failed");
        }
    }

    // ========== HOTEL MANAGEMENT ==========
    
    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        try {
            List<Hotel> hotels = hotelsRepo.findAll();
            return new ResponseEntity<>(hotels, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getHotelById(@PathVariable String id) {
        try {
            Optional<Hotel> hotel = hotelsRepo.findById(id);
            
            if (hotel.isPresent()) {
                return new ResponseEntity<>(hotel.get(), HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Hotel not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch hotel: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Hotel>> getHotelProfile(@RequestParam String email) {
        try {
            Optional<Hotel> hotelOpt = hotelsRepo.findAll().stream()
                    .filter(h -> email.equals(h.getEmail()))
                    .findFirst();
            
            if (hotelOpt.isPresent()) {
                Map<String, Hotel> response = new HashMap<>();
                response.put("hotel", hotelOpt.get());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new HashMap<>());
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<>());
        }
    }
    
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getHotelProfileById(@PathVariable String id) {
        try {
            Optional<Hotel> hotel = hotelsRepo.findById(id);
            
            if (hotel.isPresent()) {
                Map<String, Hotel> response = new HashMap<>();
                response.put("hotel", hotel.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Hotel not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch hotel profile: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateHotel(@PathVariable String id, @RequestBody Hotel hotelDetails) {
        try {
            Optional<Hotel> optionalHotel = hotelsRepo.findById(id);
            
            if (optionalHotel.isPresent()) {
                Hotel existingHotel = optionalHotel.get();
                
                // Update hotel information
                if (hotelDetails.getHotelName() != null) existingHotel.setHotelName(hotelDetails.getHotelName());
                if (hotelDetails.getName() != null) existingHotel.setName(hotelDetails.getName());
                if (hotelDetails.getHotelAddress() != null) existingHotel.setHotelAddress(hotelDetails.getHotelAddress());
                if (hotelDetails.getBaseAreaLocation() != null) existingHotel.setBaseAreaLocation(hotelDetails.getBaseAreaLocation());
                if (hotelDetails.getCity() != null) existingHotel.setCity(hotelDetails.getCity());
                if (hotelDetails.getDistrict() != null) existingHotel.setDistrict(hotelDetails.getDistrict());
                if (hotelDetails.getPostalCode() != null) existingHotel.setPostalCode(hotelDetails.getPostalCode());
                if (hotelDetails.getLocation() != null) existingHotel.setLocation(hotelDetails.getLocation());
                if (hotelDetails.getDescription() != null) existingHotel.setDescription(hotelDetails.getDescription());
                
                // Update location coordinates
                if (hotelDetails.getLatitude() != null) existingHotel.setLatitude(hotelDetails.getLatitude());
                if (hotelDetails.getLongitude() != null) existingHotel.setLongitude(hotelDetails.getLongitude());
                
                // Update contact information
                if (hotelDetails.getContactPerson() != null) existingHotel.setContactPerson(hotelDetails.getContactPerson());
                if (hotelDetails.getContactPosition() != null) existingHotel.setContactPosition(hotelDetails.getContactPosition());
                if (hotelDetails.getContactEmail() != null) existingHotel.setContactEmail(hotelDetails.getContactEmail());
                if (hotelDetails.getPhoneNumber() != null) existingHotel.setPhoneNumber(hotelDetails.getPhoneNumber());
                if (hotelDetails.getMobileNumber() != null) existingHotel.setMobileNumber(hotelDetails.getMobileNumber());
                if (hotelDetails.getAlternatePhoneNumber() != null) existingHotel.setAlternatePhoneNumber(hotelDetails.getAlternatePhoneNumber());
                if (hotelDetails.getEmergencyContact() != null) existingHotel.setEmergencyContact(hotelDetails.getEmergencyContact());
                
                // Update business information
                if (hotelDetails.getWebsite() != null) existingHotel.setWebsite(hotelDetails.getWebsite());
                if (hotelDetails.getBusinessLicense() != null) existingHotel.setBusinessLicense(hotelDetails.getBusinessLicense());
                if (hotelDetails.getStarRating() != null) existingHotel.setStarRating(hotelDetails.getStarRating());
                if (hotelDetails.getStars() > 0) existingHotel.setStars(hotelDetails.getStars());
                
                // Update pricing
                if (hotelDetails.getOriginalPrice() > 0) existingHotel.setOriginalPrice(hotelDetails.getOriginalPrice());
                if (hotelDetails.getCurrentPrice() > 0) existingHotel.setCurrentPrice(hotelDetails.getCurrentPrice());
                if (hotelDetails.getSinglePrice() > 0) existingHotel.setSinglePrice(hotelDetails.getSinglePrice());
                if (hotelDetails.getDoublePrice() > 0) existingHotel.setDoublePrice(hotelDetails.getDoublePrice());
                
                // Update availability
                if (hotelDetails.getAvailableSingle() >= 0) existingHotel.setAvailableSingle(hotelDetails.getAvailableSingle());
                if (hotelDetails.getAvailableDouble() >= 0) existingHotel.setAvailableDouble(hotelDetails.getAvailableDouble());
                if (hotelDetails.getMaxSingle() >= 0) existingHotel.setMaxSingle(hotelDetails.getMaxSingle());
                if (hotelDetails.getMaxDouble() >= 0) existingHotel.setMaxDouble(hotelDetails.getMaxDouble());
                
                // Update timestamp
                existingHotel.setUpdatedAt(java.time.Instant.now().toString());
                
                Hotel updatedHotel = hotelsRepo.save(existingHotel);
                return new ResponseEntity<>(updatedHotel, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Hotel not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update hotel: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHotel(@PathVariable String id) {
        try {
            Optional<Hotel> hotel = hotelsRepo.findById(id);
            
            if (hotel.isPresent()) {
                hotelsRepo.deleteById(id);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Hotel deleted successfully");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Hotel not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete hotel: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ========== SEARCH AND FILTER ==========
    
    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(@RequestParam(required = false) String keyword) {
        try {
            List<Hotel> hotels = hotelsRepo.findAll();
            
            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchKeyword = keyword.toLowerCase();
                hotels = hotels.stream()
                        .filter(hotel -> 
                            (hotel.getName() != null && hotel.getName().toLowerCase().contains(searchKeyword)) ||
                            (hotel.getHotelName() != null && hotel.getHotelName().toLowerCase().contains(searchKeyword)) ||
                            (hotel.getLocation() != null && hotel.getLocation().toLowerCase().contains(searchKeyword)) ||
                            (hotel.getCity() != null && hotel.getCity().toLowerCase().contains(searchKeyword)) ||
                            (hotel.getDistrict() != null && hotel.getDistrict().toLowerCase().contains(searchKeyword)) ||
                            (hotel.getBaseAreaLocation() != null && hotel.getBaseAreaLocation().toLowerCase().contains(searchKeyword))
                        )
                        .collect(Collectors.toList());
            }
            
            return new ResponseEntity<>(hotels, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Hotel>> getHotelsByCity(@PathVariable String city) {
        try {
            List<Hotel> hotels = hotelsRepo.findAll().stream()
                    .filter(hotel -> hotel.getCity() != null && hotel.getCity().equalsIgnoreCase(city))
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(hotels, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/location/{location}")
    public ResponseEntity<List<Hotel>> getHotelsByLocation(@PathVariable String location) {
        try {
            List<Hotel> hotels = hotelsRepo.findAll().stream()
                    .filter(hotel -> hotel.getLocation() != null && hotel.getLocation().toLowerCase().contains(location.toLowerCase()))
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(hotels, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/stars/{stars}")
    public ResponseEntity<List<Hotel>> getHotelsByStars(@PathVariable int stars) {
        try {
            List<Hotel> hotels = hotelsRepo.findAll().stream()
                    .filter(hotel -> hotel.getStars() == stars || 
                            (hotel.getStarRating() != null && hotel.getStarRating() == stars))
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(hotels, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ========== HOTEL STATUS MANAGEMENT ==========
    
    @PatchMapping("/{id}/verify")
    public ResponseEntity<?> verifyHotel(@PathVariable String id) {
        try {
            Optional<Hotel> optionalHotel = hotelsRepo.findById(id);
            
            if (optionalHotel.isPresent()) {
                Hotel hotel = optionalHotel.get();
                hotel.setVerified(true);
                hotel.setUpdatedAt(java.time.Instant.now().toString());
                
                Hotel updatedHotel = hotelsRepo.save(hotel);
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Hotel verified successfully");
                response.put("hotel", updatedHotel);
                
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Hotel not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to verify hotel: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PatchMapping("/{id}/activate")
    public ResponseEntity<?> activateHotel(@PathVariable String id) {
        try {
            Optional<Hotel> optionalHotel = hotelsRepo.findById(id);
            
            if (optionalHotel.isPresent()) {
                Hotel hotel = optionalHotel.get();
                hotel.setActive(true);
                hotel.setUpdatedAt(java.time.Instant.now().toString());
                
                Hotel updatedHotel = hotelsRepo.save(hotel);
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Hotel activated successfully");
                response.put("hotel", updatedHotel);
                
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Hotel not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to activate hotel: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateHotel(@PathVariable String id) {
        try {
            Optional<Hotel> optionalHotel = hotelsRepo.findById(id);
            
            if (optionalHotel.isPresent()) {
                Hotel hotel = optionalHotel.get();
                hotel.setActive(false);
                hotel.setUpdatedAt(java.time.Instant.now().toString());
                
                Hotel updatedHotel = hotelsRepo.save(hotel);
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Hotel deactivated successfully");
                response.put("hotel", updatedHotel);
                
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Hotel not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to deactivate hotel: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ========== ADDITIONAL ENDPOINTS ==========
    
    @GetMapping("/verified")
    public ResponseEntity<List<Hotel>> getVerifiedHotels() {
        try {
            List<Hotel> hotels = hotelsRepo.findAll().stream()
                    .filter(Hotel::isVerified)
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(hotels, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Hotel>> getActiveHotels() {
        try {
            List<Hotel> hotels = hotelsRepo.findAll().stream()
                    .filter(Hotel::isActive)
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(hotels, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<Hotel>> getHotelsByPriceRange(
            @RequestParam int minPrice, 
            @RequestParam int maxPrice) {
        try {
            List<Hotel> hotels = hotelsRepo.findAll().stream()
                    .filter(hotel -> hotel.getCurrentPrice() >= minPrice && hotel.getCurrentPrice() <= maxPrice)
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(hotels, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
