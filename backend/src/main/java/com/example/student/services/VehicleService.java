package com.example.student.services;

import com.example.student.model.Vehicle;
import com.example.student.repo.VehicleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService implements IVehicleService {

    @Autowired
    private VehicleRepo vehicleRepo;

    @Override
    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicle == null) {
            throw new IllegalArgumentException("Vehicle cannot be null");
        }
        // Additional validation
        if (vehicle.getRegistrationNumber() == null || vehicle.getRegistrationNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Registration number is required");
        }
        if (vehicle.getVehicleType() == null || vehicle.getVehicleType().trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle type is required");
        }
        return vehicleRepo.save(vehicle);
    }

    @Override
    public Optional<Vehicle> getVehicleById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle ID cannot be null or empty");
        }
        return vehicleRepo.findById(id);
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepo.findAll();
    }

    @Override
    public Vehicle updateVehicle(String id, Vehicle vehicle) {
        if (vehicle == null) {
            throw new IllegalArgumentException("Vehicle cannot be null");
        }
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle ID cannot be null or empty");
        }

        Optional<Vehicle> existingVehicle = vehicleRepo.findById(id);
        if (existingVehicle.isPresent()) {
            Vehicle vehicleToUpdate = existingVehicle.get();

            // Update all fields
            vehicleToUpdate.setVehicleType(vehicle.getVehicleType());
            vehicleToUpdate.setBrand(vehicle.getBrand());
            vehicleToUpdate.setModel(vehicle.getModel());
            vehicleToUpdate.setYear(vehicle.getYear());
            vehicleToUpdate.setRegistrationNumber(vehicle.getRegistrationNumber());
            vehicleToUpdate.setSeatingCapacity(vehicle.getSeatingCapacity());
            vehicleToUpdate.setFuelType(vehicle.getFuelType());
            vehicleToUpdate.setRentalPricePerDay(vehicle.getRentalPricePerDay());
            vehicleToUpdate.setPhoneNumber(vehicle.getPhoneNumber());
            vehicleToUpdate.setEmail(vehicle.getEmail());
            vehicleToUpdate.setBaseCity(vehicle.getBaseCity());
            vehicleToUpdate.setOwnerName(vehicle.getOwnerName());
            vehicleToUpdate.setOwnerPhoneNumber(vehicle.getOwnerPhoneNumber());
            vehicleToUpdate.setOwnerEmail(vehicle.getOwnerEmail());
            vehicleToUpdate.setOwnerAddress(vehicle.getOwnerAddress());

            return vehicleRepo.save(vehicleToUpdate);
        }
        throw new RuntimeException("Vehicle not found with id: " + id);
    }

    @Override
    public boolean deleteVehicle(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle ID cannot be null or empty");
        }
        if (vehicleRepo.existsById(id)) {
            vehicleRepo.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Vehicle> getVehiclesByType(String vehicleType) {
        return vehicleRepo.safeFindByVehicleType(vehicleType);
    }

    @Override
    public List<Vehicle> getVehiclesByBaseCity(String baseCity) {
        return vehicleRepo.safeFindByBaseCity(baseCity);
    }

    @Override
    public List<Vehicle> getVehiclesBySeatingCapacity(Integer seatingCapacity) {
        return vehicleRepo.safeFindBySeatingCapacity(seatingCapacity);
    }

    @Override
    public List<Vehicle> getVehiclesByMinSeatingCapacity(Integer minCapacity) {
        if (minCapacity == null || minCapacity <= 0) {
            throw new IllegalArgumentException("Minimum capacity must be a positive number");
        }
        return vehicleRepo.findBySeatingCapacityGreaterThanEqual(minCapacity);
    }

    @Override
    public List<Vehicle> getVehiclesByMaxSeatingCapacity(Integer maxCapacity) {
        if (maxCapacity == null || maxCapacity <= 0) {
            throw new IllegalArgumentException("Maximum capacity must be a positive number");
        }
        return vehicleRepo.findBySeatingCapacityLessThanEqual(maxCapacity);
    }

    @Override
    public List<Vehicle> getVehiclesBySeatingCapacityRange(Integer minCapacity, Integer maxCapacity) {
        if (minCapacity == null || minCapacity <= 0) {
            throw new IllegalArgumentException("Minimum capacity must be a positive number");
        }
        if (maxCapacity == null || maxCapacity <= 0) {
            throw new IllegalArgumentException("Maximum capacity must be a positive number");
        }
        if (minCapacity > maxCapacity) {
            throw new IllegalArgumentException("Minimum capacity cannot be greater than maximum capacity");
        }
        return vehicleRepo.findBySeatingCapacityBetween(minCapacity, maxCapacity);
    }

    @Override
    public List<Vehicle> getVehiclesByCityAndMinCapacity(String baseCity, Integer minCapacity) {
        if (baseCity == null || baseCity.trim().isEmpty()) {
            throw new IllegalArgumentException("Base city cannot be null or empty");
        }
        if (minCapacity == null || minCapacity <= 0) {
            throw new IllegalArgumentException("Minimum capacity must be a positive number");
        }
        return vehicleRepo.findByBaseCityAndSeatingCapacityGreaterThanEqual(baseCity, minCapacity);
    }

}
