package com.example.student.controller;

import com.example.student.model.Vehicle;
import com.example.student.repo.VehicleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/vehicle")
public class VehicleController {

    @Autowired
    private VehicleRepo vehicleRepo;

    @PostMapping("/addVehicle")
    public ResponseEntity<String> AddVehicle(@RequestBody Vehicle vehicle){

        Vehicle x = vehicleRepo.save(vehicle);

        if(x != null){

            return ResponseEntity.ok("Successfully added.");

        }

        return ResponseEntity.badRequest().body("Failed");
    }
    @GetMapping("/all")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepo.findAll();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/edit")
    public ResponseEntity<Vehicle> getVehicleById(@RequestParam String id) {
        Optional<Vehicle> vehicle = vehicleRepo.findById(id);
        return vehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

}



