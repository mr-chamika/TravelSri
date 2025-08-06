package com.example.student.controller;

import com.example.student.model.AdminHotelBooking;
import com.example.student.services.AdminHotelBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-hotel-bookings")
// CORS is now handled by SecurityConfig
public class AdminHotelBookingController {

    @Autowired
    private AdminHotelBookingService bookingService;

    @PostMapping
    public AdminHotelBooking createBooking(@RequestBody AdminHotelBooking booking) {
        return bookingService.saveBooking(booking);
    }

    @GetMapping
    public List<AdminHotelBooking> getAllBookings() {
        return bookingService.getAllBookings();
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
