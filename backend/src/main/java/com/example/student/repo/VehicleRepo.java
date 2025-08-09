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

    @Query(
            value = "{$and: [ { 'location': { $regex: ?0, $options: 'i' } }, { 'languages': { $regex: ?1, $options: 'i' } }]}",
            fields = "{ '_id': 1, 'vehicleModel': 1, 'catId': 1, 'doors': 1, 'seats': 1, 'gearType': 1, 'mileage': 1, 'image': 1, 'location': 1, 'stars': 1, 'reviewCount': 1, 'dailyRatePrice': 1, 'duration': 1}"
    )
    List<Driverdto> findByCatId(String location,String language);

    @Query("{ '_id' : ?0 }")
    Optional<Vehicledto> findVehicleById(String id);

}
