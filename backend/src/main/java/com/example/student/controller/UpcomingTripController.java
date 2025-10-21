package com.example.student.controller;

import com.example.student.model.UpcomingTrip;
import com.example.student.services.IUpcomingTripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/upcomingTrip")
@CrossOrigin
public class UpcomingTripController {

    @Autowired
    private IUpcomingTripService upcomingTripService;

    // Create upcoming trip
    @PostMapping("/create")
    public ResponseEntity<UpcomingTrip> createUpcomingTrip(@RequestBody UpcomingTrip upcomingTrip) {
        try {
            if (upcomingTrip == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            UpcomingTrip createdTrip = upcomingTripService.createUpcomingTrip(upcomingTrip);
            return new ResponseEntity<>(createdTrip, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all upcoming trips
    @GetMapping("/getall")
    public ResponseEntity<List<UpcomingTrip>> getAllUpcomingTrips() {
        try {
            List<UpcomingTrip> trips = upcomingTripService.getAllUpcomingTrips();
            return new ResponseEntity<>(trips, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update upcoming trip
    @PutMapping("/update/{id}")
    public ResponseEntity<UpcomingTrip> updateUpcomingTrip(
            @PathVariable("id") String upcomingTripId,
            @RequestBody UpcomingTrip upcomingTrip) {
        try {
            if (upcomingTrip == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            UpcomingTrip updatedTrip = upcomingTripService.updateUpcomingTrip(upcomingTripId, upcomingTrip);
            return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete upcoming trip by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deleteUpcomingTrip(@PathVariable("id") String upcomingTripId) {
        try {
            boolean isDeleted = upcomingTripService.deleteUpcomingTrip(upcomingTripId);
            if (isDeleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get upcoming trip by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<UpcomingTrip> getUpcomingTripById(@PathVariable("id") String upcomingTripId) {
        try {
            if (upcomingTripId == null || upcomingTripId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Optional<UpcomingTrip> trip = upcomingTripService.getUpcomingTripById(upcomingTripId);

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

    // Get upcoming trip by original pending trip ID
    @GetMapping("/getByOriginalPendingTripId/{originalPendingTripId}")
    public ResponseEntity<UpcomingTrip> getUpcomingTripByOriginalPendingTripId(
            @PathVariable("originalPendingTripId") String originalPendingTripId) {
        try {
            if (originalPendingTripId == null || originalPendingTripId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Optional<UpcomingTrip> trip = upcomingTripService.getUpcomingTripByOriginalPendingTripId(originalPendingTripId);

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

    // Get upcoming trips by status
    @GetMapping("/getByStatus/{status}")
    public ResponseEntity<List<UpcomingTrip>> getUpcomingTripsByStatus(@PathVariable("status") String status) {
        try {
            if (status == null || status.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<UpcomingTrip> trips = upcomingTripService.getUpcomingTripsByStatus(status);
            return new ResponseEntity<>(trips, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get upcoming trips by payment status
    @GetMapping("/getByPaymentStatus/{paymentStatus}")
    public ResponseEntity<List<UpcomingTrip>> getUpcomingTripsByPaymentStatus(
            @PathVariable("paymentStatus") String paymentStatus) {
        try {
            if (paymentStatus == null || paymentStatus.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<UpcomingTrip> trips = upcomingTripService.getUpcomingTripsByPaymentStatus(paymentStatus);
            return new ResponseEntity<>(trips, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get upcoming trips by customer ID
    @GetMapping("/getByCustomerId/{customerId}")
    public ResponseEntity<List<UpcomingTrip>> getUpcomingTripsByCustomerId(
            @PathVariable("customerId") String customerId) {
        try {
            if (customerId == null || customerId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<UpcomingTrip> trips = upcomingTripService.getUpcomingTripsByCustomerId(customerId);
            return new ResponseEntity<>(trips, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get active upcoming trips
    @GetMapping("/getActive")
    public ResponseEntity<List<UpcomingTrip>> getActiveUpcomingTrips() {
        try {
            List<UpcomingTrip> trips = upcomingTripService.getActiveUpcomingTrips();
            return new ResponseEntity<>(trips, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get upcoming trips by date range
    @GetMapping("/getByDateRange")
    public ResponseEntity<List<UpcomingTrip>> getUpcomingTripsByDateRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            if (startDate == null || endDate == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<UpcomingTrip> trips = upcomingTripService.getUpcomingTripsByDateRange(startDate, endDate);
            return new ResponseEntity<>(trips, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Check if upcoming trip exists for pending trip
    @GetMapping("/exists/{originalPendingTripId}")
    public ResponseEntity<Boolean> existsByOriginalPendingTripId(
            @PathVariable("originalPendingTripId") String originalPendingTripId) {
        try {
            if (originalPendingTripId == null || originalPendingTripId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            boolean exists = upcomingTripService.existsByOriginalPendingTripId(originalPendingTripId);
            return new ResponseEntity<>(exists, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update trip status
    @PatchMapping("/updateStatus/{id}")
    public ResponseEntity<UpcomingTrip> updateTripStatus(
            @PathVariable("id") String upcomingTripId,
            @RequestParam("status") String newStatus) {
        try {
            if (newStatus == null || newStatus.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            UpcomingTrip updatedTrip = upcomingTripService.updateTripStatus(upcomingTripId, newStatus);
            return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update payment status
    @PatchMapping("/updatePaymentStatus/{id}")
    public ResponseEntity<UpcomingTrip> updatePaymentStatus(
            @PathVariable("id") String upcomingTripId,
            @RequestParam("paymentStatus") String newPaymentStatus) {
        try {
            if (newPaymentStatus == null || newPaymentStatus.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            UpcomingTrip updatedTrip = upcomingTripService.updatePaymentStatus(upcomingTripId, newPaymentStatus);
            return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Calculate and update total costs
    @PatchMapping("/recalculateCosts/{id}")
    public ResponseEntity<UpcomingTrip> calculateAndUpdateTotalCosts(
            @PathVariable("id") String upcomingTripId) {
        try {
            UpcomingTrip updatedTrip = upcomingTripService.calculateAndUpdateTotalCosts(upcomingTripId);
            return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Mark trip as completed
    @PatchMapping("/markCompleted/{id}")
    public ResponseEntity<UpcomingTrip> markTripAsCompleted(@PathVariable("id") String upcomingTripId) {
        try {
            UpcomingTrip updatedTrip = upcomingTripService.markTripAsCompleted(upcomingTripId);
            return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Cancel upcoming trip
    @PatchMapping("/cancel/{id}")
    public ResponseEntity<UpcomingTrip> cancelUpcomingTrip(
            @PathVariable("id") String upcomingTripId,
            @RequestParam("reason") String reason) {
        try {
            // Get the existing trip
            Optional<UpcomingTrip> existingTrip = upcomingTripService.getUpcomingTripById(upcomingTripId);

            if (existingTrip.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            UpcomingTrip trip = existingTrip.get();

            // Update the trip status and add cancellation details
            trip.setTripStatus("Cancelled");
            trip.setCancellationReason(reason);
            trip.setCancelledAt(LocalDateTime.now());
            trip.setUpdatedAt(LocalDateTime.now());

            // Save the updated trip
            UpcomingTrip updatedTrip = upcomingTripService.updateUpcomingTrip(upcomingTripId, trip);

            return ResponseEntity.ok(updatedTrip);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update WhatsApp link
    @PatchMapping("/updateWhatsappLink/{id}")
    public ResponseEntity<UpcomingTrip> updateWhatsappLink(
            @PathVariable("id") String upcomingTripId,
            @RequestParam("whatsappLink") String whatsappLink) {
        try {
            if (whatsappLink == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            UpcomingTrip updatedTrip = upcomingTripService.updateWhatsappLink(upcomingTripId, whatsappLink);
            return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}