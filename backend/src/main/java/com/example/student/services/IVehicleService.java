package com.example.student.services;


import com.example.student.model.Vehicle;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface IVehicleService {

    // Basic CRUD operations
    Vehicle createVehicle(Vehicle vehicle);

    Optional<Vehicle> getVehicleById(String id);

    List<Vehicle> getAllVehicles();

    Vehicle updateVehicle(String id, Vehicle vehicle);

    boolean deleteVehicle(String id);

    // Custom search operations
    List<Vehicle> getVehiclesByType(String vehicleType);

    List<Vehicle> getVehiclesByBaseCity(String baseCity);

    List<Vehicle> getVehiclesBySeatingCapacity(Integer seatingCapacity);

    List<Vehicle> getVehiclesByMinSeatingCapacity(Integer minCapacity);

    List<Vehicle> getVehiclesByMaxSeatingCapacity(Integer maxCapacity);

    List<Vehicle> getVehiclesBySeatingCapacityRange(Integer minCapacity, Integer maxCapacity);

    List<Vehicle> getVehiclesByCityAndMinCapacity(String baseCity, Integer minCapacity);
}
