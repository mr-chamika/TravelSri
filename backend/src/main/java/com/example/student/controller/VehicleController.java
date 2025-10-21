package com.example.student.controller;

import com.example.student.model.Vehicle;
import com.example.student.model.Booking;
import com.example.student.model.User;
import com.example.student.model.dto.BookingListForGuideDto;
import com.example.student.model.dto.BookingListForVehicleDto;
import com.example.student.model.dto.BookingRequest;
import com.example.student.model.dto.Bookingdto;
import com.example.student.repo.TravelerBookingRepo;
import com.example.student.repo.VehicleRepo;
import com.example.student.repo.UserRepo;
import com.example.student.services.IBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/vehicle")
public class VehicleController {

    @Autowired
    private VehicleRepo vehicleRepo;

    @Autowired
    private IBookingService bookingService;

    @Autowired
    private TravelerBookingRepo newrepo;

    @Autowired
    private UserRepo userRepo;

    private static final Logger logger = LoggerFactory.getLogger(VehicleController.class);


    @PostMapping("/addVehicle")
    public ResponseEntity<String> AddVehicle(@RequestBody Vehicle vehicle) {
        Vehicle x = vehicleRepo.save(vehicle);
        if (x != null) {
            return ResponseEntity.ok("Successfully added.");
        }
        return ResponseEntity.badRequest().body("Failed");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepo.findAll();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/owner")
    public ResponseEntity<List<Vehicle>> getVehiclesByOwner(@RequestParam String vehicleOwnerId) {
        List<Vehicle> vehicles = vehicleRepo.findByVehicleOwnerId(vehicleOwnerId);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/edit")
    public ResponseEntity<Vehicle> getVehicleById(@RequestParam String id) {
        Optional<Vehicle> vehicle = vehicleRepo.findById(id);
        return vehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Booking related endpoints merged here

    @GetMapping("/bookings/provider/{providerId}")
    public ResponseEntity<?> getBookingsByServiceId(@PathVariable("providerId") String serviceId) {
        try {
            System.out.println("getBookingsByServiceId called with serviceId: " + serviceId);
            if (serviceId == null || serviceId.trim().isEmpty()) {
                return new ResponseEntity<>("Service ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            List<BookingListForVehicleDto> bookings = newrepo.findActiveVehicleBookingsByServiceId(serviceId);
            System.out.println("Bookings fetched: " + bookings.size());

            List<Map<String, Object>> response = new java.util.ArrayList<>();

            for (BookingListForVehicleDto booking : bookings) {
                // Fetch user info safely
                Optional<User> userOpt = userRepo.findById(booking.getUserId());
                String username = userOpt.map(User::getUsername).orElse("Unknown");
                String mobileNumber = userOpt.map(User::getMobileNumber).orElse("");

                Map<String, Object> bookingInfo = new java.util.HashMap<>();
                bookingInfo.put("bookingId", booking.get_id());
                bookingInfo.put("serviceId", booking.getServiceId());
                bookingInfo.put("userId", booking.getUserId());
                bookingInfo.put("title", booking.getTitle());
                bookingInfo.put("subtitle", booking.getSubtitle());
                bookingInfo.put("location", booking.getLocation());
                bookingInfo.put("bookingDates", booking.getBookingDates());
                bookingInfo.put("ratings", booking.getRatings());
                bookingInfo.put("paymentStatus", booking.getPaymentStatus());
                bookingInfo.put("facilities", booking.getFacilities());
                bookingInfo.put("price", booking.getPrice());
                bookingInfo.put("status", booking.getStatus());
                bookingInfo.put("username", username);
                bookingInfo.put("mobileNumber", mobileNumber);
                bookingInfo.put("thumbnail", booking.getThumbnail());

                response.add(bookingInfo);
            }

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid service ID: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving bookings: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("/bookings/provider/{providerId}/pending")
    public ResponseEntity<List<Bookingdto>> getPendingVehicleBookingRequests(@PathVariable("providerId") String providerId) {
        try {
            if (providerId == null || providerId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<Bookingdto> pendingBookings = bookingService.getBookingsByProvider(providerId).stream()
                    .filter(booking -> "vehicle".equals(booking.getProviderType()))
                    .filter(booking -> "PENDING_PROVIDER_ACCEPTANCE".equals(booking.getStatus()) &&
                            "SUCCESS".equals(booking.getPaymentStatus()))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(pendingBookings, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bookings/provider/{providerId}/confirmed")
    public ResponseEntity<List<Bookingdto>> getConfirmedVehicleBookings(@PathVariable("providerId") String providerId) {
        try {
            if (providerId == null || providerId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<Bookingdto> confirmedBookings = bookingService.getBookingsByProvider(providerId).stream()
                    .filter(booking -> "vehicle".equals(booking.getProviderType()))
                    .filter(booking -> "CONFIRMED".equals(booking.getStatus()))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(confirmedBookings, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/bookings/{bookingId}/accept")
    public ResponseEntity<Booking> acceptVehicleBookingRequest(
            @PathVariable("bookingId") String bookingId,
            @RequestParam("providerId") String providerId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty() ||
                    providerId == null || providerId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Booking acceptedBooking = bookingService.acceptBooking(bookingId, providerId);
            return new ResponseEntity<>(acceptedBooking, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else if (e.getMessage().contains("not authorized")) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/bookings/{bookingId}/reject")
    public ResponseEntity<Booking> rejectVehicleBookingRequest(
            @PathVariable("bookingId") String bookingId,
            @RequestParam("providerId") String providerId,
            @RequestParam(value = "reason", required = false) String reason) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty() ||
                    providerId == null || providerId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Booking rejectedBooking = bookingService.rejectBooking(bookingId, providerId);

            if (reason != null && !reason.trim().isEmpty()) {
                rejectedBooking.setRejectionReason(reason);
                bookingService.updateBooking(rejectedBooking);
            }

            return new ResponseEntity<>(rejectedBooking, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else if (e.getMessage().contains("not authorized")) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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

            Optional<Vehicle> vehicleOpt = vehicleRepo.findById(request.getVehicleId());
            if (vehicleOpt.isEmpty()) {
                return new ResponseEntity<>("Vehicle not found", HttpStatus.NOT_FOUND);
            }

            Vehicle vehicle = vehicleOpt.get();

            BookingRequest bookingRequest = new BookingRequest();
            bookingRequest.setTravelerId(request.getTravelerId());
            bookingRequest.setProviderId(vehicle.getVehicleOwnerId());
            bookingRequest.setProviderType("vehicle");
            bookingRequest.setServiceName("Vehicle Rental - " + vehicle.getVehicleModel());
            bookingRequest.setServiceDescription(buildServiceDescription(request, vehicle));

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDateTime startDate = LocalDateTime.parse(request.getStartDate() + "T" +
                    (request.getPickupTime() != null ? convertTo24Hour(request.getPickupTime()) : "09:00"));
            LocalDateTime endDate = LocalDateTime.parse(request.getEndDate() + "T" +
                    (request.getPickupTime() != null ? convertTo24Hour(request.getPickupTime()) : "09:00"));

            bookingRequest.setServiceStartDate(startDate);
            bookingRequest.setServiceEndDate(endDate);

            BigDecimal totalAmount = calculateVehicleBookingAmount(request, vehicle);
            bookingRequest.setTotalAmount(totalAmount);
            bookingRequest.setCurrency("LKR");

            bookingRequest.setSpecialRequests(request.getSpecialRequests());
            bookingRequest.setNumberOfGuests(request.getNumberOfPassengers());
            bookingRequest.setLanguagePreference(request.getLanguagePreference());
            bookingRequest.setContactInformation(request.getContactInformation());

            Booking booking = bookingService.createBooking(bookingRequest);

            return new ResponseEntity<>(booking, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Error creating vehicle booking: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bookings/traveler/{travelerId}")
    public ResponseEntity<?> getVehicleBookingsForTraveler(@PathVariable String travelerId) {
        try {
            return new ResponseEntity<>(
                    bookingService.getBookingsByTraveler(travelerId).stream()
                            .filter(booking -> "vehicle".equals(booking.getProviderType()))
                            .collect(Collectors.toList()),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving vehicle bookings: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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

    // Helper methods...

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

    private BigDecimal calculateVehicleBookingAmount(VehicleBookingRequest request, Vehicle vehicle) {
        BigDecimal baseAmount = BigDecimal.ZERO;

        if (vehicle.isDailyRate()) {
            long days = calculateDaysBetween(request.getStartDate(), request.getEndDate());
            if (days == 0) days = 1;
            baseAmount = BigDecimal.valueOf(vehicle.getDailyRatePrice()).multiply(BigDecimal.valueOf(days));
        } else if (vehicle.isPerKm()) {
            baseAmount = BigDecimal.valueOf(vehicle.getPerKmPrice() * 100);
        }

        return baseAmount;
    }

    private long calculateDaysBetween(String startDate, String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            java.time.LocalDate start = java.time.LocalDate.parse(startDate, formatter);
            java.time.LocalDate end = java.time.LocalDate.parse(endDate, formatter);
            return java.time.temporal.ChronoUnit.DAYS.between(start, end);
        } catch (Exception e) {
            return 1;
        }
    }

    private String convertTo24Hour(String time12Hour) {
        try {
            DateTimeFormatter formatter12 = DateTimeFormatter.ofPattern("hh:mm a");
            DateTimeFormatter formatter24 = DateTimeFormatter.ofPattern("HH:mm");
            java.time.LocalTime time = java.time.LocalTime.parse(time12Hour, formatter12);
            return time.format(formatter24);
        } catch (Exception e) {
            return "09:00";
        }
    }

    // Inner DTO class for vehicle booking request
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

        public VehicleBookingRequest() {}

        // Getters and setters for all fields omitted for brevity, add them as needed
        // ...

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
