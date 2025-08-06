package com.example.student.controller;

import com.example.student.model.PendingTrip;
import com.example.student.services.IPendingTripservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/pendingTrip")
@CrossOrigin
public class PendingTripController {
    @Autowired
    private IPendingTripservice pendingTripservice; // Fixed typo

    @PostMapping("/create")
    public ResponseEntity<PendingTrip> createPendingTrip(@RequestBody PendingTrip pendingTrip) {
        try {
            if (pendingTrip == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            PendingTrip createdTrip = pendingTripservice.createPendingTrip(pendingTrip);
            return new ResponseEntity<>(createdTrip, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getall")
    public ResponseEntity<List<PendingTrip>> getAllPendingTrips() {
        try {
            List<PendingTrip> trips = pendingTripservice.getAllPendingTrips();
            return new ResponseEntity<>(trips, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PendingTrip> updatePendingTrip(
            @PathVariable("id") String ptId,
            @RequestBody PendingTrip pendingTrip) {
        try {
            if (pendingTrip == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            PendingTrip updatedTrip = pendingTripservice.updatePendingTrip(ptId, pendingTrip);
            return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deletePendingTrip(@PathVariable("id") String ptId) {
        try {
            boolean isDeleted = pendingTripservice.deletePendingTrip(ptId);
            if (isDeleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<PendingTrip> getPendingTripById(@PathVariable("id") String ptId) {
        try {
            if (ptId == null || ptId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Optional<PendingTrip> trip = pendingTripservice.getPendingTripById(ptId);

            if (trip.isPresent()) {
                return new ResponseEntity<>(trip.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}