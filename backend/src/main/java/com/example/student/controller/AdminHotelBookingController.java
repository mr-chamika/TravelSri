package com.example.student.controller;

import com.example.student.model.AdminHotelBooking;
import com.example.student.services.AdminHotelBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin-hotel-bookings")
// CORS is now handled by SecurityConfig
public class AdminHotelBookingController {

    @Autowired
    private AdminHotelBookingService bookingService;
    
    // Debug endpoint to check authentication
    @GetMapping("/test-auth")
    public ResponseEntity<String> testAuth() {
        return ResponseEntity.ok("Authentication successful");
    }

    @PostMapping
    public AdminHotelBooking createBooking(@RequestBody AdminHotelBooking booking) {
        return bookingService.saveBooking(booking);
    }

    @GetMapping
    public List<AdminHotelBooking> getAllBookings(@RequestParam(required = false) String hotelId) {
        if (hotelId != null && !hotelId.isEmpty()) {
            // If hotelId is provided, filter bookings by hotel
            return bookingService.getBookingsByHotelId(hotelId);
        } else {
            // Otherwise return all bookings
            return bookingService.getAllBookings();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AdminHotelBooking> getBookingById(@PathVariable String id) {
        AdminHotelBooking booking = bookingService.getBookingById(id);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AdminHotelBooking> updateBooking(@PathVariable String id, @RequestBody AdminHotelBooking booking) {
        booking.setId(id); // ensure the ID is set correctly
        AdminHotelBooking updatedBooking = bookingService.updateBooking(booking);
        return ResponseEntity.ok(updatedBooking);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        boolean deleted = bookingService.deleteBooking(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
