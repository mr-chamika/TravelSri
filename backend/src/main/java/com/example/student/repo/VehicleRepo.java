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

    List<Driverdto> findByCatId(String id);

    @Query("{ '_id' : ?0 }")
    Optional<Vehicledto> findVehicleById(String id);

}
