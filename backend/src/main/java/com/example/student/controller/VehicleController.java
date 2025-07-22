package com.example.student.controller;

import com.example.student.model.Vehicle;
import com.example.student.services.IVehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/vehicle")
@CrossOrigin(origins = "*")
public class VehicleController {

    @Autowired
    private IVehicleService vehicleService;

    // Create new vehicle
    @PostMapping("/create")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        try {
            if (vehicle == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            Vehicle createdVehicle = vehicleService.createVehicle(vehicle);
            return new ResponseEntity<>(createdVehicle, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all vehicles
    @GetMapping("/getall")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicle by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable("id") String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Optional<Vehicle> vehicle = vehicleService.getVehicleById(id);

            if (vehicle.isPresent()) {
                return new ResponseEntity<>(vehicle.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete vehicle
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deleteVehicle(@PathVariable("id") String id) {
        try {
            boolean isDeleted = vehicleService.deleteVehicle(id);
            if (isDeleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles by type (Car, Van, Bus)
    @GetMapping("/type/{vehicleType}")
    public ResponseEntity<List<Vehicle>> getVehiclesByType(@PathVariable("vehicleType") String vehicleType) {
        try {
            List<Vehicle> vehicles = vehicleService.getVehiclesByType(vehicleType);
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles by base city
    @GetMapping("/city/{baseCity}")
    public ResponseEntity<List<Vehicle>> getVehiclesByBaseCity(@PathVariable("baseCity") String baseCity) {
        try {
            List<Vehicle> vehicles = vehicleService.getVehiclesByBaseCity(baseCity);
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles by exact seating capacity
    @GetMapping("/capacity/{seatingCapacity}")
    public ResponseEntity<List<Vehicle>> getVehiclesBySeatingCapacity(@PathVariable("seatingCapacity") Integer seatingCapacity) {
        try {
            List<Vehicle> vehicles = vehicleService.getVehiclesBySeatingCapacity(seatingCapacity);
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles with minimum seating capacity
    @GetMapping("/capacity/min/{minCapacity}")
    public ResponseEntity<List<Vehicle>> getVehiclesByMinSeatingCapacity(@PathVariable("minCapacity") Integer minCapacity) {
        try {
            List<Vehicle> vehicles = vehicleService.getVehiclesByMinSeatingCapacity(minCapacity);
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles with maximum seating capacity
    @GetMapping("/capacity/max/{maxCapacity}")
    public ResponseEntity<List<Vehicle>> getVehiclesByMaxSeatingCapacity(@PathVariable("maxCapacity") Integer maxCapacity) {
        try {
            List<Vehicle> vehicles = vehicleService.getVehiclesByMaxSeatingCapacity(maxCapacity);
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles within seating capacity range
    @GetMapping("/capacity/range")
    public ResponseEntity<List<Vehicle>> getVehiclesBySeatingCapacityRange(
            @RequestParam("min") Integer minCapacity,
            @RequestParam("max") Integer maxCapacity) {
        try {
            List<Vehicle> vehicles = vehicleService.getVehiclesBySeatingCapacityRange(minCapacity, maxCapacity);
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles by base city and minimum seating capacity
    @GetMapping("/city/{baseCity}/capacity/min/{minCapacity}")
    public ResponseEntity<List<Vehicle>> getVehiclesByCityAndMinCapacity(
            @PathVariable("baseCity") String baseCity,
            @PathVariable("minCapacity") Integer minCapacity) {
        try {
            List<Vehicle> vehicles = vehicleService.getVehiclesByCityAndMinCapacity(baseCity, minCapacity);
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable("id") String id, @RequestBody Vehicle vehicle) {
        try {
            if (id == null || id.trim().isEmpty() || vehicle == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicle);
            return new ResponseEntity<>(updatedVehicle, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}


