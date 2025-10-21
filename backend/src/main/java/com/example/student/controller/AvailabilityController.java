package com.example.student.controller;

import com.example.student.model.UnavailabilitySchedule;
import com.example.student.services.UnavailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080", "http://localhost:8081"})
public class AvailabilityController {

    @Autowired
    private UnavailabilityService unavailabilityService;

    // ✅ Updated existing create method with optional recurring parameters
    @PostMapping("/create-unavailability")
    public ResponseEntity<String> createUnavailability(
            @RequestParam String userId,
            @RequestParam String providerId,
            @RequestParam String providerType,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) String notes,
            // ✅ Added optional recurring parameters
            @RequestParam(required = false) String recurrencePattern, // "weekly", "monthly", "yearly"
            @RequestParam(required = false) Integer recurrenceCount,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date recurrenceEndDate) {

        try {
            // ✅ Enhanced service call with recurring support
            UnavailabilitySchedule created = unavailabilityService.createUnavailability(
                    userId, providerId, providerType, fromDate, toDate, reason, notes,
                    recurrencePattern, recurrenceCount, recurrenceEndDate
            );

            // ✅ Return different message based on recurring or not
            if (created.getIsRecurring() != null && created.getIsRecurring()) {
                return ResponseEntity.ok("Recurring unavailability schedule created successfully with pattern: " + recurrencePattern);
            } else {
                return ResponseEntity.ok("Unavailability schedule created successfully");
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating unavailability schedule: " + e.getMessage());
        }
    }

    // Rest of your existing methods remain unchanged...

    @GetMapping("/check-provider")
    public ResponseEntity<Boolean> checkUserProviderAvailability(
            @RequestParam String userId,
            @RequestParam String providerId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        boolean isAvailable = unavailabilityService.isUserProviderAvailable(userId, providerId, fromDate, toDate);
        return ResponseEntity.ok(isAvailable);
    }

    @GetMapping("/user-unavailable-guides")
    public ResponseEntity<List<String>> getUserUnavailableGuides(
            @RequestParam String userId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<String> unavailableGuides = unavailabilityService.getUserUnavailableProviders(userId, "guide", fromDate, toDate);
        return ResponseEntity.ok(unavailableGuides);
    }

    @GetMapping("/user-unavailable-vehicles")
    public ResponseEntity<List<String>> getUserUnavailableVehicles(
            @RequestParam String userId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<String> unavailableVehicles = unavailabilityService.getUserUnavailableProviders(userId, "vehicle", fromDate, toDate);
        return ResponseEntity.ok(unavailableVehicles);
    }

    @GetMapping("/user-schedules/{userId}")
    public ResponseEntity<List<UnavailabilitySchedule>> getUserUnavailabilitySchedules(
            @PathVariable String userId) {

        List<UnavailabilitySchedule> schedules = unavailabilityService.getUserUnavailabilitySchedules(userId);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/user-provider-schedule")
    public ResponseEntity<List<UnavailabilitySchedule>> getUserProviderUnavailability(
            @RequestParam String userId,
            @RequestParam String providerId) {

        List<UnavailabilitySchedule> schedules = unavailabilityService.getUserProviderUnavailability(userId, providerId);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/user-schedules-by-type")
    public ResponseEntity<List<UnavailabilitySchedule>> getUserUnavailabilityByType(
            @RequestParam String userId,
            @RequestParam String providerType) {

        List<UnavailabilitySchedule> schedules = unavailabilityService.getUserUnavailabilityByType(userId, providerType);
        return ResponseEntity.ok(schedules);
    }

    @PutMapping("/update-user-status")
    public ResponseEntity<String> updateUserUnavailabilityStatus(
            @RequestParam String userId,
            @RequestParam String unavailabilityId,
            @RequestParam String status) {

        try {
            unavailabilityService.updateUserUnavailabilityStatus(userId, unavailabilityId, status);
            return ResponseEntity.ok("Unavailability status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating status: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-user-unavailability")
    public ResponseEntity<String> deleteUserUnavailability(
            @RequestParam String userId,
            @RequestParam String unavailabilityId) {
        try {
            unavailabilityService.deleteUserUnavailability(userId, unavailabilityId);
            return ResponseEntity.ok("Unavailability record deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting record: " + e.getMessage());
        }
    }
}
