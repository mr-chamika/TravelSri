package com.example.student.repo;

import com.example.student.model.Hotel;
import com.example.student.model.dto.HotelViewdto;
import com.example.student.model.dto.THoteldto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelsRepo extends MongoRepository<Hotel,String> {

    @Query(
            value = "{ $and: [ " +
                    "{ 'location': {$regex: ?0, $options: 'i' } }, " +
                    "{ $expr: { $gte: [ { $add: [ '$availableSingle', '$availableDouble' ] }, ?1 ] } } " +
                    "] }",
            fields = "{ '_id': 1, 'name': 1, 'location': 1, 'distance': 1, 'ratings': 1, 'reviewCount': 1, 'thumbnail': 1, 'originalPrice': 1, 'currentPrice': 1, 'taxes': 1, 'priceDescription': 1, 'specialOffer': 1, 'freeFeatures': 1 }"
    )List<THoteldto> findAllHoteldtos(String location, int guests);

    // In HotelsRepo.java
    @Query(
            value = "{ '_id' : ?0 }",
            fields = "{ '_id':1,'images': 1, 'stars': 1, 'ratings': 1, 'reviewCount': 1, 'price': 1, 'name': 1, 'location': 1, 'description': 1, 'policies': 1, 'roomTypes': 1,'facilities': 1,'availableSingle': 1,'availableDouble': 1,'mobileNumber': 1 }"
    )
    Optional<HotelViewdto> findHotelViewdtoById(String id);

    @Query(
            value = "{ '$expr': { $gte: [ { $add: [ '$availableSingle', '$availableDouble' ] }, ?0 ] } }",
            fields = "{ '_id': 1, 'name': 1, 'location': 1, 'distance': 1, 'ratings': 1, 'reviewCount': 1, 'thumbnail': 1, 'originalPrice': 1, 'currentPrice': 1, 'taxes': 1, 'priceDescription': 1, 'specialOffer': 1, 'freeFeatures': 1,'mobileNumber': 1 }"
    )
    List<THoteldto> findAllSuggestHoteldtos(int guests);

    // New methods for HotelController functionality
    
    // Find hotel by email
    Optional<Hotel> findByEmail(String email);
    
    // Find hotel by username
    Optional<Hotel> findByUsername(String username);
    
    // Find hotels by city
    @Query("{ 'city': { $regex: ?0, $options: 'i' } }")
    List<Hotel> findByCity(String city);
    
    // Find hotels by location (contains search)
    @Query("{ 'location': { $regex: ?0, $options: 'i' } }")
    List<Hotel> findByLocationContaining(String location);
    
    // Find hotels by star rating
    @Query("{ $or: [ { 'stars': ?0 }, { 'starRating': ?0 } ] }")
    List<Hotel> findByStarRating(int stars);
    
    // Find verified hotels
    @Query("{ 'isVerified': true }")
    List<Hotel> findByVerifiedTrue();
    
    // Find active hotels
    @Query("{ 'isActive': true }")
    List<Hotel> findByActiveTrue();
    
    // Find hotels by price range
    @Query("{ 'currentPrice': { $gte: ?0, $lte: ?1 } }")
    List<Hotel> findByCurrentPriceBetween(int minPrice, int maxPrice);
    
    // Search hotels by keyword (name, location, city, district)
    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'hotelName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'location': { $regex: ?0, $options: 'i' } }, " +
           "{ 'city': { $regex: ?0, $options: 'i' } }, " +
           "{ 'district': { $regex: ?0, $options: 'i' } }, " +
           "{ 'baseAreaLocation': { $regex: ?0, $options: 'i' } } " +
           "] }")
    List<Hotel> searchByKeyword(String keyword);
    
    // Find hotels near coordinates (for location-based search)
    @Query("{ 'latitude': { $gte: ?0, $lte: ?1 }, 'longitude': { $gte: ?2, $lte: ?3 } }")
    List<Hotel> findByLocationBounds(double minLat, double maxLat, double minLng, double maxLng);
}
