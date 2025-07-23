package com.example.student.repo;

import com.example.student.model.TVehicle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TVehicleRepo extends MongoRepository<TVehicle, String> {
    // Find vehicles by vehicle type (Car, Van, Bus)
    @Query("{'vehicle_type': {$regex: ?0, $options: 'i'}}")
    List<TVehicle> findByVehicleType(String vehicleType);

    // Find vehicles by base city
    @Query("{'base_city': {$regex: ?0, $options: 'i'}}")
    List<TVehicle> findByBaseCity(String baseCity);

    // Find vehicles by seating capacity (exact match)
    @Query("{'seating_capacity': ?0}")
    List<TVehicle> findBySeatingCapacity(Integer seatingCapacity);

    // Find vehicles by seating capacity greater than or equal to specified capacity
    @Query("{'seating_capacity': {$gte: ?0}}")
    List<TVehicle> findBySeatingCapacityGreaterThanEqual(Integer minCapacity);

    // Find vehicles by seating capacity less than or equal to specified capacity
    @Query("{'seating_capacity': {$lte: ?0}}")
    List<TVehicle> findBySeatingCapacityLessThanEqual(Integer maxCapacity);

    // Find vehicles by seating capacity range
    @Query("{'seating_capacity': {$gte: ?0, $lte: ?1}}")
    List<TVehicle> findBySeatingCapacityBetween(Integer minCapacity, Integer maxCapacity);

    // Find vehicles by base city and minimum seating capacity - ADDED
    @Query("{'base_city': {$regex: ?0, $options: 'i'}, 'seating_capacity': {$gte: ?1}}")
    List<TVehicle> findByBaseCityAndSeatingCapacityGreaterThanEqual(String baseCity, Integer minCapacity);


    // Safety methods with validation
    default List<TVehicle> safeFindByVehicleType(String vehicleType) {
        if (vehicleType == null || vehicleType.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle type cannot be null or empty");
        }
        return findByVehicleType(vehicleType);
    }

    default List<TVehicle> safeFindByBaseCity(String baseCity) {
        if (baseCity == null || baseCity.trim().isEmpty()) {
            throw new IllegalArgumentException("Base city cannot be null or empty");
        }
        return findByBaseCity(baseCity);
    }

    default List<TVehicle> safeFindBySeatingCapacity(Integer seatingCapacity) {
        if (seatingCapacity == null || seatingCapacity <= 0) {
            throw new IllegalArgumentException("Seating capacity must be a positive number");
        }
        return findBySeatingCapacity(seatingCapacity);
    }
}
