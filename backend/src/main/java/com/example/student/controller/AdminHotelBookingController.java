package com.example.student.controller;

import com.example.student.model.AdminHotelBooking;
import com.example.student.services.AdminHotelBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-hotel-bookings")
@CrossOrigin(origins = "http://localhost:5173") // adjust to match your frontend port
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
}
