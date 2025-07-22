package com.example.student.services;

import com.example.student.model.TVehicle;
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
    public TVehicle createVehicle(TVehicle TVehicle) {
        if (TVehicle == null) {
            throw new IllegalArgumentException("Vehicle cannot be null");
        }
        // Additional validation
        if (TVehicle.getRegistrationNumber() == null || TVehicle.getRegistrationNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Registration number is required");
        }
        if (TVehicle.getVehicleType() == null || TVehicle.getVehicleType().trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle type is required");
        }
        return vehicleRepo.save(TVehicle);
    }

    @Override
    public Optional<TVehicle> getVehicleById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle ID cannot be null or empty");
        }
        return vehicleRepo.findById(id);
    }

    @Override
    public List<TVehicle> getAllVehicles() {
        return vehicleRepo.findAll();
    }

    @Override
    public TVehicle updateVehicle(String id, TVehicle TVehicle) {
        if (TVehicle == null) {
            throw new IllegalArgumentException("Vehicle cannot be null");
        }
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle ID cannot be null or empty");
        }

        Optional<TVehicle> existingVehicle = vehicleRepo.findById(id);
        if (existingVehicle.isPresent()) {
            TVehicle TVehicleToUpdate = existingVehicle.get();

            // Update all fields
            TVehicleToUpdate.setVehicleType(TVehicle.getVehicleType());
            TVehicleToUpdate.setBrand(TVehicle.getBrand());
            TVehicleToUpdate.setModel(TVehicle.getModel());
            TVehicleToUpdate.setYear(TVehicle.getYear());
            TVehicleToUpdate.setRegistrationNumber(TVehicle.getRegistrationNumber());
            TVehicleToUpdate.setSeatingCapacity(TVehicle.getSeatingCapacity());
            TVehicleToUpdate.setFuelType(TVehicle.getFuelType());
            TVehicleToUpdate.setRentalPricePerDay(TVehicle.getRentalPricePerDay());
            TVehicleToUpdate.setPhoneNumber(TVehicle.getPhoneNumber());
            TVehicleToUpdate.setEmail(TVehicle.getEmail());
            TVehicleToUpdate.setBaseCity(TVehicle.getBaseCity());
            TVehicleToUpdate.setOwnerName(TVehicle.getOwnerName());
            TVehicleToUpdate.setOwnerPhoneNumber(TVehicle.getOwnerPhoneNumber());
            TVehicleToUpdate.setOwnerEmail(TVehicle.getOwnerEmail());
            TVehicleToUpdate.setOwnerAddress(TVehicle.getOwnerAddress());

            return vehicleRepo.save(TVehicleToUpdate);
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
    public List<TVehicle> getVehiclesByType(String vehicleType) {
        return vehicleRepo.safeFindByVehicleType(vehicleType);
    }

    @Override
    public List<TVehicle> getVehiclesByBaseCity(String baseCity) {
        return vehicleRepo.safeFindByBaseCity(baseCity);
    }

    @Override
    public List<TVehicle> getVehiclesBySeatingCapacity(Integer seatingCapacity) {
        return vehicleRepo.safeFindBySeatingCapacity(seatingCapacity);
    }

    @Override
    public List<TVehicle> getVehiclesByMinSeatingCapacity(Integer minCapacity) {
        if (minCapacity == null || minCapacity <= 0) {
            throw new IllegalArgumentException("Minimum capacity must be a positive number");
        }
        return vehicleRepo.findBySeatingCapacityGreaterThanEqual(minCapacity);
    }

    @Override
    public List<TVehicle> getVehiclesByMaxSeatingCapacity(Integer maxCapacity) {
        if (maxCapacity == null || maxCapacity <= 0) {
            throw new IllegalArgumentException("Maximum capacity must be a positive number");
        }
        return vehicleRepo.findBySeatingCapacityLessThanEqual(maxCapacity);
    }

    @Override
    public List<TVehicle> getVehiclesBySeatingCapacityRange(Integer minCapacity, Integer maxCapacity) {
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
    public List<TVehicle> getVehiclesByCityAndMinCapacity(String baseCity, Integer minCapacity) {
        if (baseCity == null || baseCity.trim().isEmpty()) {
            throw new IllegalArgumentException("Base city cannot be null or empty");
        }
        if (minCapacity == null || minCapacity <= 0) {
            throw new IllegalArgumentException("Minimum capacity must be a positive number");
        }
        return vehicleRepo.findByBaseCityAndSeatingCapacityGreaterThanEqual(baseCity, minCapacity);
    }

}
