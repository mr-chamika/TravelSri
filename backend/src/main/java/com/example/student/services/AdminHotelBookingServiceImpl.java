package com.example.student.services;

import com.example.student.model.AdminHotelBooking;
import com.example.student.repo.AdminHotelBookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminHotelBookingServiceImpl implements AdminHotelBookingService {

    @Autowired
    private AdminHotelBookingRepo bookingRepo;

    @Override
    public AdminHotelBooking saveBooking(AdminHotelBooking booking) {
        return bookingRepo.save(booking);
    }

    @Override
    public List<AdminHotelBooking> getAllBookings() {
        return bookingRepo.findAll();
    }
}
