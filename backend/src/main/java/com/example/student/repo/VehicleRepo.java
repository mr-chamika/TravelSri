package com.example.student.repo;

import com.example.student.model.Vehicle;
import com.example.student.model.dto.Vehicledto;
import com.example.student.model.dto.Driverdto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepo extends MongoRepository<Vehicle,String> {

    // Existing methods - keep original signatures
    List<Driverdto> findByCatId(String location, String language);

    @Query("{ '_id' : ?0 }")
    Optional<Vehicledto> findVehicleById(String id);

    // NEW: Fixed method signature for finding by category and location/language
    @Query("{ 'catId' : ?0, 'location' : { $regex: ?1, $options: 'i' }, 'languages' : { $in: [?2] } }")
    List<Vehicle> findByCatIdAndLocationAndLanguage(String catId, String location, String language);

    // NEW: Find vehicles by location (case insensitive)
    @Query("{ 'location' : { $regex: ?0, $options: 'i' } }")
    List<Vehicle> findByLocationContainingIgnoreCase(String location);

    // NEW: Find vehicles by language
    @Query("{ 'languages' : { $in: [?0] } }")
    List<Vehicle> findByLanguage(String language);

    // NEW: Find vehicles by location and language
    @Query("{ 'location' : { $regex: ?0, $options: 'i' }, 'languages' : { $in: [?1] } }")
    List<Vehicle> findByLocationAndLanguage(String location, String language);

    // NEW: Find available vehicles by date range (you can enhance this based on your booking logic)
    @Query("{ 'verified' : 'verified' }")
    List<Vehicle> findVerifiedVehicles();

    // NEW: Find vehicles by owner ID
    @Query("{ 'vehicleOwnerId' : ?0 }")
    List<Vehicle> findByVehicleOwnerId(String ownerId);

    // NEW: Find vehicles by category - different method name to avoid conflict
    @Query("{ 'catId' : ?0 }")
    List<Vehicle> findVehiclesByCategoryId(String catId);

    // NEW: Find vehicles with daily rate pricing
    @Query("{ 'dailyRate' : true }")
    List<Vehicle> findDailyRateVehicles();

    // NEW: Find vehicles with per km pricing
    @Query("{ 'perKm' : true }")
    List<Vehicle> findPerKmVehicles();

    // NEW: Find vehicles by price range (daily rate)
    @Query("{ 'dailyRate' : true, 'dailyRatePrice' : { $gte: ?0, $lte: ?1 } }")
    List<Vehicle> findByDailyRatePriceBetween(int minPrice, int maxPrice);

    // NEW: Find vehicles by price range (per km)
    @Query("{ 'perKm' : true, 'perKmPrice' : { $gte: ?0, $lte: ?1 } }")
    List<Vehicle> findByPerKmPriceBetween(int minPrice, int maxPrice);

    // NEW: Find vehicles by fuel type
    @Query("{ 'fuelType' : ?0 }")
    List<Vehicle> findByFuelType(String fuelType);

    // NEW: Find vehicles by gear type
    @Query("{ 'gearType' : ?0 }")
    List<Vehicle> findByGearType(String gearType);

    // NEW: Find vehicles with AC
    @Query("{ 'ac' : true }")
    List<Vehicle> findVehiclesWithAC();

    // NEW: Find vehicles by seat count
    @Query("{ 'seats' : { $gte: ?0 } }")
    List<Vehicle> findVehiclesWithMinSeats(int minSeats);

    // NEW: Find vehicles by door count
    @Query("{ 'doors' : ?0 }")
    List<Vehicle> findByDoors(int doors);

    // NEW: Complex search query for vehicle filtering
    @Query("{ " +
            "$and: [" +
            "{ $or: [ { 'location' : { $regex: ?0, $options: 'i' } }, { ?0 : { $exists: false } } ] }, " +
            "{ $or: [ { 'languages' : { $in: [?1] } }, { ?1 : { $exists: false } } ] }, " +
            "{ $or: [ { 'catId' : ?2 }, { ?2 : { $exists: false } } ] }, " +
            "{ $or: [ { 'ac' : ?3 }, { ?3 : { $exists: false } } ] }, " +
            "{ $or: [ { 'seats' : { $gte: ?4 } }, { ?4 : { $exists: false } } ] }, " +
            "{ 'verified' : 'verified' }" +
            "] " +
            "}")
    List<Vehicle> findVehiclesWithFilters(String location, String language, String catId, Boolean hasAC, Integer minSeats);

    // NEW: Search vehicles by multiple criteria
    @Query("{ " +
            "'location' : { $regex: ?0, $options: 'i' }, " +
            "'languages' : { $in: [?1] }, " +
            "'verified' : 'verified', " +
            "'seats' : { $gte: ?2 } " +
            "}")
    List<Vehicle> searchAvailableVehicles(String location, String language, int minSeats);

    // NEW: Get vehicle statistics
    @Query(value = "{ 'verified' : 'verified' }", count = true)
    long countVerifiedVehicles();

    @Query(value = "{ 'verified' : 'pending' }", count = true)
    long countPendingVehicles();

    @Query(value = "{ 'catId' : ?0 }", count = true)
    long countVehiclesByCategory(String catId);

    @Query(value = "{ 'location' : { $regex: ?0, $options: 'i' } }", count = true)
    long countVehiclesByLocation(String location);

    // NEW: Find top rated vehicles (you might need to add rating calculation logic)
    @Query(value = "{ 'verified' : 'verified' }", sort = "{ 'stars' : -1 }")
    List<Vehicle> findTopRatedVehicles();

    // NEW: Find recently added vehicles
    @Query(value = "{ 'verified' : 'verified' }", sort = "{ '_id' : -1 }")
    List<Vehicle> findRecentlyAddedVehicles();
}