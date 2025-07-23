package com.example.student.controller;

import com.example.student.model.TVehicle;
import com.example.student.services.IVehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/vehicle")
@CrossOrigin
public class TVehicleController {

    @Autowired
    private IVehicleService vehicleService;

    // Create new vehicle
    @PostMapping("/create")
    public ResponseEntity<TVehicle> createVehicle(@RequestBody TVehicle TVehicle) {
        try {
            if (TVehicle == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            TVehicle createdTVehicle = vehicleService.createVehicle(TVehicle);
            return new ResponseEntity<>(createdTVehicle, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all vehicles
    @GetMapping("/getall")
    public ResponseEntity<List<TVehicle>> getAllVehicles() {
        try {
            List<TVehicle> TVehicles = vehicleService.getAllVehicles();
            return new ResponseEntity<>(TVehicles, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicle by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<TVehicle> getVehicleById(@PathVariable("id") String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Optional<TVehicle> vehicle = vehicleService.getVehicleById(id);

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
    public ResponseEntity<List<TVehicle>> getVehiclesByType(@PathVariable("vehicleType") String vehicleType) {
        try {
            List<TVehicle> TVehicles = vehicleService.getVehiclesByType(vehicleType);
            return new ResponseEntity<>(TVehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles by base city
    @GetMapping("/city/{baseCity}")
    public ResponseEntity<List<TVehicle>> getVehiclesByBaseCity(@PathVariable("baseCity") String baseCity) {
        try {
            List<TVehicle> TVehicles = vehicleService.getVehiclesByBaseCity(baseCity);
            return new ResponseEntity<>(TVehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles by exact seating capacity
    @GetMapping("/capacity/{seatingCapacity}")
    public ResponseEntity<List<TVehicle>> getVehiclesBySeatingCapacity(@PathVariable("seatingCapacity") Integer seatingCapacity) {
        try {
            List<TVehicle> TVehicles = vehicleService.getVehiclesBySeatingCapacity(seatingCapacity);
            return new ResponseEntity<>(TVehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles with minimum seating capacity
    @GetMapping("/capacity/min/{minCapacity}")
    public ResponseEntity<List<TVehicle>> getVehiclesByMinSeatingCapacity(@PathVariable("minCapacity") Integer minCapacity) {
        try {
            List<TVehicle> TVehicles = vehicleService.getVehiclesByMinSeatingCapacity(minCapacity);
            return new ResponseEntity<>(TVehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles with maximum seating capacity
    @GetMapping("/capacity/max/{maxCapacity}")
    public ResponseEntity<List<TVehicle>> getVehiclesByMaxSeatingCapacity(@PathVariable("maxCapacity") Integer maxCapacity) {
        try {
            List<TVehicle> TVehicles = vehicleService.getVehiclesByMaxSeatingCapacity(maxCapacity);
            return new ResponseEntity<>(TVehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles within seating capacity range
    @GetMapping("/capacity/range")
    public ResponseEntity<List<TVehicle>> getVehiclesBySeatingCapacityRange(
            @RequestParam("min") Integer minCapacity,
            @RequestParam("max") Integer maxCapacity) {
        try {
            List<TVehicle> TVehicles = vehicleService.getVehiclesBySeatingCapacityRange(minCapacity, maxCapacity);
            return new ResponseEntity<>(TVehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get vehicles by base city and minimum seating capacity
    @GetMapping("/city/{baseCity}/capacity/min/{minCapacity}")
    public ResponseEntity<List<TVehicle>> getVehiclesByCityAndMinCapacity(
            @PathVariable("baseCity") String baseCity,
            @PathVariable("minCapacity") Integer minCapacity) {
        try {
            List<TVehicle> TVehicles = vehicleService.getVehiclesByCityAndMinCapacity(baseCity, minCapacity);
            return new ResponseEntity<>(TVehicles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TVehicle> updateVehicle(@PathVariable("id") String id, @RequestBody TVehicle TVehicle) {
        try {
            if (id == null || id.trim().isEmpty() || TVehicle == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            TVehicle updatedTVehicle = vehicleService.updateVehicle(id, TVehicle);
            return new ResponseEntity<>(updatedTVehicle, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}


