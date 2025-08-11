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
        // Check if email already exists
        Optional<Hotel> existingByEmail = hotelsRepo.findByEmail(hotel.getEmail());
        if (existingByEmail.isPresent()) {
            return null; // Hotel with this email already exists
        }

        // Check if username already exists
        Optional<Hotel> existingByUsername = hotelsRepo.findByUsername(hotel.getUsername());
        if (existingByUsername.isPresent()) {
            return null; // Hotel with this username already exists
        }

        // Encrypt password
        String plainPassword = hotel.getPassword();
        String hashedPassword = passwordEncoder.encode(plainPassword);
        hotel.setPassword(hashedPassword);

        // Set default values
        hotel.setActive(false);
        hotel.setVerified(false);
        hotel.setCreatedAt(java.time.Instant.now().toString());
        hotel.setUpdatedAt(java.time.Instant.now().toString());

        // Initialize default values for numeric fields
        if (hotel.getRatings() == 0) hotel.setRatings(0);
        if (hotel.getReviewCount() == 0) hotel.setReviewCount(0);
        if (hotel.getOriginalPrice() == 0) hotel.setOriginalPrice(0);
        if (hotel.getCurrentPrice() == 0) hotel.setCurrentPrice(0);
        if (hotel.getSinglePrice() == 0) hotel.setSinglePrice(0);
        if (hotel.getDoublePrice() == 0) hotel.setDoublePrice(0);
        if (hotel.getAvailableSingle() == 0) hotel.setAvailableSingle(0);
        if (hotel.getAvailableDouble() == 0) hotel.setAvailableDouble(0);
        if (hotel.getMaxSingle() == 0) hotel.setMaxSingle(0);
        if (hotel.getMaxDouble() == 0) hotel.setMaxDouble(0);

        return hotelsRepo.save(hotel);
    }

    /**
     * Authenticate hotel login
     */
    public Hotel authenticateHotel(String username, String password) {
        Optional<Hotel> hotelOpt = hotelsRepo.findByUsername(username);
        
        if (hotelOpt.isPresent()) {
            Hotel hotel = hotelOpt.get();
            if (passwordEncoder.matches(password, hotel.getPassword())) {
                return hotel;
            }
        }
        
        return null; // Authentication failed
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
