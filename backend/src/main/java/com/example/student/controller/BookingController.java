package com.example.student.controller;

import com.example.student.model.Booking;
import com.example.student.model.dto.BookingRequest;
import com.example.student.model.dto.Bookingdto;
import com.example.student.services.IBookingService;
import com.example.student.services.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private IBookingService bookingService;

    @Autowired
    private IPaymentService paymentService;

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    // Add this constructor for debugging
    public BookingController() {
        System.out.println("🔥 BookingController CREATED!");
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            if (request == null) {
                return new ResponseEntity<>("Request cannot be null", HttpStatus.BAD_REQUEST);
            }

            Booking booking = bookingService.createBooking(request);
            return new ResponseEntity<>(booking, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid request: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating booking: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getBooking(@PathVariable("id") String bookingId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty()) {
                return new ResponseEntity<>("Booking ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            Optional<Booking> booking = bookingService.getBookingById(bookingId);
            if (booking.isPresent()) {
                return new ResponseEntity<>(booking.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid booking ID: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving booking: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/traveler/{travelerId}")
    public ResponseEntity<?> getTravelerBookings(@PathVariable("travelerId") String travelerId) {
        try {
            if (travelerId == null || travelerId.trim().isEmpty()) {
                return new ResponseEntity<>("Traveler ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            List<Bookingdto> bookings = bookingService.getBookingsByTraveler(travelerId); // Now returns Bookingdto
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid traveler ID: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving bookings: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<?> getProviderBookings(@PathVariable("providerId") String providerId) {
        try {
            if (providerId == null || providerId.trim().isEmpty()) {
                return new ResponseEntity<>("Provider ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            List<Bookingdto> bookings = bookingService.getBookingsByProvider(providerId); // Now returns Bookingdto
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid provider ID: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving bookings: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Rest of the methods remain the same...
    @PostMapping("/{bookingId}/accept")
    public ResponseEntity<?> acceptBooking(@PathVariable("bookingId") String bookingId,
                                           @RequestParam("providerId") String providerId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty()) {
                return new ResponseEntity<>("Booking ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }
            if (providerId == null || providerId.trim().isEmpty()) {
                return new ResponseEntity<>("Provider ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            Booking booking = bookingService.acceptBooking(bookingId, providerId);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Error accepting booking: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{bookingId}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable("bookingId") String bookingId,
                                           @RequestParam("providerId") String providerId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty()) {
                return new ResponseEntity<>("Booking ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }
            if (providerId == null || providerId.trim().isEmpty()) {
                return new ResponseEntity<>("Provider ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            Booking booking = bookingService.rejectBooking(bookingId, providerId);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Error rejecting booking: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable("bookingId") String bookingId,
                                           @RequestParam("travelerId") String travelerId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty()) {
                return new ResponseEntity<>("Booking ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }
            if (travelerId == null || travelerId.trim().isEmpty()) {
                return new ResponseEntity<>("Traveler ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            Booking booking = bookingService.cancelBooking(bookingId, travelerId);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Error cancelling booking: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{bookingId}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable("bookingId") String bookingId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty()) {
                return new ResponseEntity<>("Booking ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            Booking booking = bookingService.completeBooking(bookingId);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Error completing booking: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //hotel bookings

    @PostMapping("/hotel/create")
    public ResponseEntity<?> createHotelBooking(@RequestBody BookingRequest request) {
        try {
            logger.info("Creating hotel booking with PayHere integration");

            if (request == null) {
                return ResponseEntity.badRequest().body("Request cannot be null");
            }

            // Set hotel-specific defaults and validate
            request.setProviderType("hotel");
            request.setCurrency("LKR");
            request.setHotelBookingDefaults();
            request.validateForHotelBooking();

            // Create the booking using existing service
            Booking booking = bookingService.createBooking(request);

            // Return booking with payment-ready status
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("bookingId", booking.getId());
            response.put("amount", booking.getTotalAmount());
            response.put("currency", "LKR");
            response.put("status", booking.getStatus());
            response.put("paymentStatus", booking.getPaymentStatus());
            response.put("message", "Hotel booking created successfully. Proceed to payment.");
            response.put("requiresPayment", true);
            response.put("providerType", "hotel");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("Invalid hotel booking request: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid hotel booking request: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating hotel booking: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error creating hotel booking: " + e.getMessage());
        }
    }

    /**
     * Get hotel bookings for traveler
     * GET /api/bookings/hotel/traveler/{travelerId}
     */
    @GetMapping("/hotel/traveler/{travelerId}")
    public ResponseEntity<?> getTravelerHotelBookings(@PathVariable("travelerId") String travelerId) {
        try {
            if (travelerId == null || travelerId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Traveler ID cannot be null or empty");
            }

            List<Bookingdto> allBookings = bookingService.getBookingsByTraveler(travelerId);

            // Filter for hotel bookings only
            List<Bookingdto> hotelBookings = allBookings.stream()
                    .filter(booking -> "hotel".equals(booking.getProviderType()))
                    .collect(Collectors.toList());

            if (hotelBookings.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "No hotel bookings found", "bookings", hotelBookings));
            }

            return ResponseEntity.ok(Map.of("bookings", hotelBookings, "count", hotelBookings.size()));
        } catch (Exception e) {
            logger.error("Error retrieving hotel bookings: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error retrieving hotel bookings: " + e.getMessage());
        }
    }

    /**
     * Get hotel bookings for hotel provider
     * GET /api/bookings/hotel/provider/{providerId}
     */
    @GetMapping("/hotel/provider/{providerId}")
    public ResponseEntity<?> getHotelProviderBookings(@PathVariable("providerId") String providerId) {
        try {
            List<Bookingdto> allBookings = bookingService.getBookingsByProvider(providerId);

            // Filter for hotel bookings only
            List<Bookingdto> hotelBookings = allBookings.stream()
                    .filter(booking -> "hotel".equals(booking.getProviderType()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of("bookings", hotelBookings, "count", hotelBookings.size()));
        } catch (Exception e) {
            logger.error("Error retrieving hotel provider bookings: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error retrieving hotel provider bookings: " + e.getMessage());
        }
    }

    /**
     * Accept hotel booking
     * POST /api/bookings/hotel/{bookingId}/accept
     */
    @PostMapping("/hotel/{bookingId}/accept")
    public ResponseEntity<?> acceptHotelBooking(@PathVariable("bookingId") String bookingId,
                                                @RequestParam("providerId") String providerId) {
        try {
            // Validate it's a hotel booking
            Optional<Booking> bookingOpt = bookingService.getBookingById(bookingId);
            if (bookingOpt.isPresent() && !"hotel".equals(bookingOpt.get().getProviderType())) {
                return ResponseEntity.badRequest().body("Invalid booking type for hotel operation");
            }

            Booking booking = bookingService.acceptBooking(bookingId, providerId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "booking", booking,
                    "message", "Hotel booking accepted successfully"
            ));
        } catch (Exception e) {
            logger.error("Error accepting hotel booking: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error accepting hotel booking: " + e.getMessage());
        }
    }

    /**
     * Reject hotel booking
     * POST /api/bookings/hotel/{bookingId}/reject
     */
    @PostMapping("/hotel/{bookingId}/reject")
    public ResponseEntity<?> rejectHotelBooking(@PathVariable("bookingId") String bookingId,
                                                @RequestParam("providerId") String providerId) {
        try {
            Optional<Booking> bookingOpt = bookingService.getBookingById(bookingId);
            if (bookingOpt.isPresent() && !"hotel".equals(bookingOpt.get().getProviderType())) {
                return ResponseEntity.badRequest().body("Invalid booking type for hotel operation");
            }

            Booking booking = bookingService.rejectBooking(bookingId, providerId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "booking", booking,
                    "message", "Hotel booking rejected"
            ));
        } catch (Exception e) {
            logger.error("Error rejecting hotel booking: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error rejecting hotel booking: " + e.getMessage());
        }
    }

    /**
     * Complete hotel booking (after guest checkout)
     * POST /api/bookings/hotel/{bookingId}/complete
     */
    @PostMapping("/hotel/{bookingId}/complete")
    public ResponseEntity<?> completeHotelBooking(@PathVariable("bookingId") String bookingId) {
        try {
            Optional<Booking> bookingOpt = bookingService.getBookingById(bookingId);
            if (bookingOpt.isPresent() && !"hotel".equals(bookingOpt.get().getProviderType())) {
                return ResponseEntity.badRequest().body("Invalid booking type for hotel operation");
            }

            Booking booking = bookingService.completeBooking(bookingId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "booking", booking,
                    "message", "Hotel stay completed successfully"
            ));
        } catch (Exception e) {
            logger.error("Error completing hotel booking: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error completing hotel booking: " + e.getMessage());
        }
    }

}