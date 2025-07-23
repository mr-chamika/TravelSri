package com.example.student.repo;

import com.example.student.model.Student;
import com.example.student.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepo extends MongoRepository<Vehicle, String> {


}
