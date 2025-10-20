package com.example.student.controller;

import com.example.student.model.Vehicle;
import com.example.student.model.Booking;
import com.example.student.model.dto.BookingRequest;
import com.example.student.repo.VehicleRepo;
import com.example.student.services.IBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/vehicle")
public class VehicleController {

    @Autowired
    private VehicleRepo vehicleRepo;

    @Autowired
    private IBookingService bookingService;

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

    // NEW: Create vehicle booking endpoint
    @PostMapping("/book")
    public ResponseEntity<?> createVehicleBooking(@RequestBody VehicleBookingRequest request) {
        try {
            // Validate request
            if (request == null) {
                return new ResponseEntity<>("Request cannot be null", HttpStatus.BAD_REQUEST);
            }

            if (request.getVehicleId() == null || request.getVehicleId().trim().isEmpty()) {
                return new ResponseEntity<>("Vehicle ID is required", HttpStatus.BAD_REQUEST);
            }

            if (request.getTravelerId() == null || request.getTravelerId().trim().isEmpty()) {
                return new ResponseEntity<>("Traveler ID is required", HttpStatus.BAD_REQUEST);
            }

            // Check if vehicle exists
            Optional<Vehicle> vehicleOpt = vehicleRepo.findById(request.getVehicleId());
            if (vehicleOpt.isEmpty()) {
                return new ResponseEntity<>("Vehicle not found", HttpStatus.NOT_FOUND);
            }

            Vehicle vehicle = vehicleOpt.get();

            // Create booking request
            BookingRequest bookingRequest = new BookingRequest();
            bookingRequest.setTravelerId(request.getTravelerId());
            bookingRequest.setProviderId(vehicle.getVehicleOwnerId()); // Vehicle owner is the provider
            bookingRequest.setProviderType("vehicle");
            bookingRequest.setServiceName("Vehicle Rental - " + vehicle.getVehicleModel());
            bookingRequest.setServiceDescription(buildServiceDescription(request, vehicle));

            // Parse dates
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDateTime startDate = LocalDateTime.parse(request.getStartDate() + "T" +
                    (request.getPickupTime() != null ? convertTo24Hour(request.getPickupTime()) : "09:00"));
            LocalDateTime endDate = LocalDateTime.parse(request.getEndDate() + "T" +
                    (request.getPickupTime() != null ? convertTo24Hour(request.getPickupTime()) : "09:00"));

            bookingRequest.setServiceStartDate(startDate);
            bookingRequest.setServiceEndDate(endDate);

            // Calculate total amount
            BigDecimal totalAmount = calculateVehicleBookingAmount(request, vehicle);
            bookingRequest.setTotalAmount(totalAmount);
            bookingRequest.setCurrency("LKR");

            // Set additional vehicle-specific details
            bookingRequest.setSpecialRequests(request.getSpecialRequests());
            bookingRequest.setNumberOfGuests(request.getNumberOfPassengers());
            bookingRequest.setLanguagePreference(request.getLanguagePreference());
            bookingRequest.setContactInformation(request.getContactInformation());

            // Create the booking
            Booking booking = bookingService.createBooking(bookingRequest);

            return new ResponseEntity<>(booking, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Error creating vehicle booking: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // NEW: Get vehicle bookings for a traveler
    @GetMapping("/bookings/traveler/{travelerId}")
    public ResponseEntity<?> getVehicleBookingsForTraveler(@PathVariable String travelerId) {
        try {
            return new ResponseEntity<>(
                    bookingService.getBookingsByTraveler(travelerId).stream()
                            .filter(booking -> "vehicle".equals(booking.getProviderType()))
                            .collect(java.util.stream.Collectors.toList()),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving vehicle bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // NEW: Get vehicle bookings for a provider (vehicle owner)
    @GetMapping("/bookings/provider/{providerId}")
    public ResponseEntity<?> getVehicleBookingsForProvider(@PathVariable String providerId) {
        try {
            return new ResponseEntity<>(
                    bookingService.getBookingsByProvider(providerId).stream()
                            .filter(booking -> "vehicle".equals(booking.getProviderType()))
                            .collect(java.util.stream.Collectors.toList()),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving vehicle bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // NEW: Accept vehicle booking
    @PostMapping("/bookings/{bookingId}/accept")
    public ResponseEntity<?> acceptVehicleBooking(@PathVariable String bookingId,
                                                  @RequestParam String providerId) {
        try {
            Booking booking = bookingService.acceptBooking(bookingId, providerId);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error accepting vehicle booking: " + e.getMessage(),
                    HttpStatus.BAD_REQUEST);
        }
    }

    // NEW: Reject vehicle booking
    @PostMapping("/bookings/{bookingId}/reject")
    public ResponseEntity<?> rejectVehicleBooking(@PathVariable String bookingId,
                                                  @RequestParam String providerId,
                                                  @RequestParam(required = false) String reason) {
        try {
            Booking booking = bookingService.rejectBooking(bookingId, providerId);
            if (reason != null && !reason.trim().isEmpty()) {
                booking.setRejectionReason(reason);
                booking = bookingService.updateBooking(booking);
            }
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error rejecting vehicle booking: " + e.getMessage(),
                    HttpStatus.BAD_REQUEST);
        }
    }

    // Helper method to build service description
    private String buildServiceDescription(VehicleBookingRequest request, Vehicle vehicle) {
        StringBuilder description = new StringBuilder();
        description.append("Vehicle Rental: ").append(vehicle.getVehicleModel());
        description.append(" (").append(vehicle.getVehicleNumber()).append(")");

        if (request.getStartLocation() != null && request.getEndLocation() != null) {
            description.append(" | Route: ").append(request.getStartLocation())
                    .append(" to ").append(request.getEndLocation());
        }

        if (request.isOneWay()) {
            description.append(" | One-way trip");
        } else {
            description.append(" | Round trip");
        }

        return description.toString();
    }

    // Helper method to calculate booking amount
    private BigDecimal calculateVehicleBookingAmount(VehicleBookingRequest request, Vehicle vehicle) {
        BigDecimal baseAmount = BigDecimal.ZERO;

        // Calculate based on vehicle pricing model
        if (vehicle.isDailyRate()) {
            // Daily rate calculation
            long days = calculateDaysBetween(request.getStartDate(), request.getEndDate());
            if (days == 0) days = 1; // Minimum 1 day
            baseAmount = BigDecimal.valueOf(vehicle.getDailyRatePrice()).multiply(BigDecimal.valueOf(days));
        } else if (vehicle.isPerKm()) {
            // Per km calculation - this would need distance calculation
            // For now, using a base rate
            baseAmount = BigDecimal.valueOf(vehicle.getPerKmPrice() * 100); // Assuming 100km average
        }

        return baseAmount;
    }

    // Helper method to calculate days between dates
    private long calculateDaysBetween(String startDate, String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            java.time.LocalDate start = java.time.LocalDate.parse(startDate, formatter);
            java.time.LocalDate end = java.time.LocalDate.parse(endDate, formatter);
            return java.time.temporal.ChronoUnit.DAYS.between(start, end);
        } catch (Exception e) {
            return 1; // Default to 1 day if parsing fails
        }
    }

    // Helper method to convert 12-hour time to 24-hour format
    private String convertTo24Hour(String time12Hour) {
        try {
            DateTimeFormatter formatter12 = DateTimeFormatter.ofPattern("hh:mm a");
            DateTimeFormatter formatter24 = DateTimeFormatter.ofPattern("HH:mm");
            java.time.LocalTime time = java.time.LocalTime.parse(time12Hour, formatter12);
            return time.format(formatter24);
        } catch (Exception e) {
            return "09:00"; // Default time
        }
    }

    // Inner class for vehicle booking request
    public static class VehicleBookingRequest {
        private String vehicleId;
        private String travelerId;
        private String startDate;
        private String endDate;
        private String startLocation;
        private String endLocation;
        private String pickupTime;
        private boolean oneWay;
        private String languagePreference;
        private int numberOfPassengers;
        private String specialRequests;
        private String contactInformation;

        // Default constructor
        public VehicleBookingRequest() {}

        // Getters and setters
        public String getVehicleId() { return vehicleId; }
        public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

        public String getTravelerId() { return travelerId; }
        public void setTravelerId(String travelerId) { this.travelerId = travelerId; }

        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }

        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }

        public String getStartLocation() { return startLocation; }
        public void setStartLocation(String startLocation) { this.startLocation = startLocation; }

        public String getEndLocation() { return endLocation; }
        public void setEndLocation(String endLocation) { this.endLocation = endLocation; }

        public String getPickupTime() { return pickupTime; }
        public void setPickupTime(String pickupTime) { this.pickupTime = pickupTime; }

        public boolean isOneWay() { return oneWay; }
        public void setOneWay(boolean oneWay) { this.oneWay = oneWay; }

        public String getLanguagePreference() { return languagePreference; }
        public void setLanguagePreference(String languagePreference) { this.languagePreference = languagePreference; }

        public int getNumberOfPassengers() { return numberOfPassengers; }
        public void setNumberOfPassengers(int numberOfPassengers) { this.numberOfPassengers = numberOfPassengers; }

        public String getSpecialRequests() { return specialRequests; }
        public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

        public String getContactInformation() { return contactInformation; }
        public void setContactInformation(String contactInformation) { this.contactInformation = contactInformation; }
    }
}