package com.example.student.services;

import com.example.student.model.Hotel;
import com.example.student.repo.HotelsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    @Autowired
    private HotelsRepo hotelsRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register a new hotel with validation and password encryption
     */
    public Hotel registerNewHotel(Hotel hotel) {
        // Debug logging
        System.out.println("Registering new hotel: username=" + hotel.getUsername() + ", email=" + hotel.getEmail());
        
        // Validate required fields - prevent NullPointerException
        if (hotel.getUsername() == null || hotel.getUsername().trim().isEmpty()) {
            System.out.println("Hotel registration failed: username is null or empty");
            return null;
        }
        
        if (hotel.getEmail() == null || hotel.getEmail().trim().isEmpty()) {
            System.out.println("Hotel registration failed: email is null or empty");
            return null;
        }
        
        if (hotel.getPassword() == null || hotel.getPassword().trim().isEmpty()) {
            System.out.println("Hotel registration failed: password is null or empty");
            return null;
        }
        
        // Check if email already exists
        Optional<Hotel> existingByEmail = hotelsRepo.findByEmail(hotel.getEmail());
        if (existingByEmail.isPresent()) {
            System.out.println("Hotel registration failed: email already exists");
            return null; // Hotel with this email already exists
        }

        // Check if username already exists
        Optional<Hotel> existingByUsername = hotelsRepo.findByUsername(hotel.getUsername());
        if (existingByUsername.isPresent()) {
            System.out.println("Hotel registration failed: username already exists");
            return null; // Hotel with this username already exists
        }

        // Encrypt password
        String plainPassword = hotel.getPassword();
        String hashedPassword = passwordEncoder.encode(plainPassword);
        hotel.setPassword(hashedPassword);

        // Set default values - automatically verify and activate for better user experience
        hotel.setActive(true);  // Set to true so users can log in immediately
        hotel.setVerified(true); // Set to true so users can log in immediately
        hotel.setCreatedAt(java.time.Instant.now().toString());
        hotel.setUpdatedAt(java.time.Instant.now().toString());

    // Initialize default values for numeric fields (handle possible nulls)
    if (hotel.getRatings() == null) hotel.setRatings(0);
    if (hotel.getReviewCount() == null) hotel.setReviewCount(0);
    if (hotel.getOriginalPrice() == null) hotel.setOriginalPrice(0);
    if (hotel.getCurrentPrice() == null) hotel.setCurrentPrice(0);
    if (hotel.getSinglePrice() == null) hotel.setSinglePrice(0);
    if (hotel.getDoublePrice() == null) hotel.setDoublePrice(0);
    if (hotel.getAvailableSingle() == null) hotel.setAvailableSingle(0);
    if (hotel.getAvailableDouble() == null) hotel.setAvailableDouble(0);
    if (hotel.getMaxSingle() == null) hotel.setMaxSingle(0);
    if (hotel.getMaxDouble() == null) hotel.setMaxDouble(0);

        return hotelsRepo.save(hotel);
    }

    /**
     * Authenticate hotel login
     */
    public Hotel authenticateHotel(String username, String password) {
        // Debug logging
        System.out.println("Authenticating hotel: " + username);
        
        // Find the hotel by username
        Optional<Hotel> hotelOpt = hotelsRepo.findByUsername(username);
        
        if (!hotelOpt.isPresent()) {
            System.out.println("Authentication failed: Hotel with username " + username + " not found");
            return null;
        }

//        System.out.println("hotel>>>>", hotelOpt.stream().count());
        
        Hotel hotel = hotelOpt.get();

        System.out.println("Hotel authenticated: >>>>>" + hotel);
        
        // Check if the password matches
        System.out.println("password: " + password);
        boolean passwordMatches = passwordEncoder.matches(password, hotel.getPassword());
        System.out.println("Password matches: " + passwordMatches);
        if (passwordMatches) {
            System.out.println("Authentication successful for: " + username);
            System.out.println("function called<<<<");
            // Check verification and active status for debugging
            if (!hotel.isVerified()) {
                System.out.println("Note: Hotel " + username + " is not yet verified");
            }
            
            if (!hotel.isActive()) {
                System.out.println("Note: Hotel " + username + " is not active");
            }
            
            return hotel;
        } else {
            System.out.println("Authentication failed: Invalid password for " + username);
            return null;
        }
    }

    /**
     * Find hotel by email
     */
    public Optional<Hotel> findByEmail(String email) {
        return hotelsRepo.findByEmail(email);
    }

    /**
     * Find hotel by username
     */
    public Optional<Hotel> findByUsername(String username) {
        return hotelsRepo.findByUsername(username);
    }

    /**
     * Update hotel password
     */
    public boolean updatePassword(String email, String newPassword) {
        Optional<Hotel> hotelOpt = hotelsRepo.findByEmail(email);
        
        if (hotelOpt.isPresent()) {
            Hotel hotel = hotelOpt.get();
            String hashedPassword = passwordEncoder.encode(newPassword);
            hotel.setPassword(hashedPassword);
            hotel.setUpdatedAt(java.time.Instant.now().toString());
            
            hotelsRepo.save(hotel);
            return true;
        }
        
        return false;
    }

    /**
     * Verify hotel account
     */
    public boolean verifyHotel(String id) {
        Optional<Hotel> hotelOpt = hotelsRepo.findById(id);
        
        if (hotelOpt.isPresent()) {
            Hotel hotel = hotelOpt.get();
            hotel.setVerified(true);
            hotel.setUpdatedAt(java.time.Instant.now().toString());
            
            hotelsRepo.save(hotel);
            return true;
        }
        
        return false;
    }

    /**
     * Activate hotel account
     */
    public boolean activateHotel(String id) {
        Optional<Hotel> hotelOpt = hotelsRepo.findById(id);
        
        if (hotelOpt.isPresent()) {
            Hotel hotel = hotelOpt.get();
            hotel.setActive(true);
            hotel.setUpdatedAt(java.time.Instant.now().toString());
            
            hotelsRepo.save(hotel);
            return true;
        }
        
        return false;
    }

    /**
     * Deactivate hotel account
     */
    public boolean deactivateHotel(String id) {
        Optional<Hotel> hotelOpt = hotelsRepo.findById(id);
        
        if (hotelOpt.isPresent()) {
            Hotel hotel = hotelOpt.get();
            hotel.setActive(false);
            hotel.setUpdatedAt(java.time.Instant.now().toString());
            
            hotelsRepo.save(hotel);
            return true;
        }
        
        return false;
    }

    /**
     * Get all hotels
     */
    public List<Hotel> getAllHotels() {
        return hotelsRepo.findAll();
    }

    /**
     * Get verified hotels
     */
    public List<Hotel> getVerifiedHotels() {
        return hotelsRepo.findByVerifiedTrue();
    }

    /**
     * Get active hotels
     */
    public List<Hotel> getActiveHotels() {
        return hotelsRepo.findByActiveTrue();
    }

    /**
     * Search hotels by keyword
     */
    public List<Hotel> searchHotels(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return hotelsRepo.findAll();
        }
        return hotelsRepo.searchByKeyword(keyword);
    }

    /**
     * Find hotels by city
     */
    public List<Hotel> findHotelsByCity(String city) {
        return hotelsRepo.findByCity(city);
    }

    /**
     * Find hotels by location
     */
    public List<Hotel> findHotelsByLocation(String location) {
        return hotelsRepo.findByLocationContaining(location);
    }

    /**
     * Find hotels by star rating
     */
    public List<Hotel> findHotelsByStars(int stars) {
        return hotelsRepo.findByStarRating(stars);
    }

    /**
     * Find hotels by price range
     */
    public List<Hotel> findHotelsByPriceRange(int minPrice, int maxPrice) {
        return hotelsRepo.findByCurrentPriceBetween(minPrice, maxPrice);
    }

    /**
     * Update hotel information
     */
    public Hotel updateHotel(String id, Hotel hotelDetails) {
        Optional<Hotel> optionalHotel = hotelsRepo.findById(id);
        
        if (optionalHotel.isPresent()) {
            Hotel existingHotel = optionalHotel.get();
            
            // Update hotel information (only if not null)
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
            
            return hotelsRepo.save(existingHotel);
        }
        
        return null;
    }

    /**
     * Delete hotel
     */
    public boolean deleteHotel(String id) {
        Optional<Hotel> hotelOpt = hotelsRepo.findById(id);
        
        if (hotelOpt.isPresent()) {
            hotelsRepo.deleteById(id);
            return true;
        }
        
        return false;
    }

    /**
     * Check if email is already registered
     */
    public boolean isEmailRegistered(String email) {
        return hotelsRepo.findByEmail(email).isPresent();
    }

    /**
     * Check if username is already registered
     */
    public boolean isUsernameRegistered(String username) {
        return hotelsRepo.findByUsername(username).isPresent();
    }
}
