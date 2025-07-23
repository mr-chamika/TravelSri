package com.example.student.services;


import com.example.student.model.TVehicle;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface IVehicleService {

    // Basic CRUD operations
    TVehicle createVehicle(TVehicle TVehicle);

    Optional<TVehicle> getVehicleById(String id);

    List<TVehicle> getAllVehicles();

    TVehicle updateVehicle(String id, TVehicle TVehicle);

    boolean deleteVehicle(String id);

    // Custom search operations
    List<TVehicle> getVehiclesByType(String vehicleType);

    List<TVehicle> getVehiclesByBaseCity(String baseCity);

    List<TVehicle> getVehiclesBySeatingCapacity(Integer seatingCapacity);

    List<TVehicle> getVehiclesByMinSeatingCapacity(Integer minCapacity);

    List<TVehicle> getVehiclesByMaxSeatingCapacity(Integer maxCapacity);

    List<TVehicle> getVehiclesBySeatingCapacityRange(Integer minCapacity, Integer maxCapacity);

    List<TVehicle> getVehiclesByCityAndMinCapacity(String baseCity, Integer minCapacity);
}
