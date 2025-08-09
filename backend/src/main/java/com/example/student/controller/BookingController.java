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

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private IBookingService bookingService;

    @Autowired
    private IPaymentService paymentService;

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
}