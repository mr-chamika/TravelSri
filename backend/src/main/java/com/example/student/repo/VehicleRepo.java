package com.example.student.repo;

import com.example.student.model.Category;
import com.example.student.model.Vehicle;
import com.example.student.model.dto.Driverdto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.sql.Driver;
import java.util.List;

@Repository
public interface VehicleRepo extends MongoRepository<Vehicle,String> {

    List<Driverdto> findByCatId(String id);
}
