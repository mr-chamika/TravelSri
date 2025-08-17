package com.example.student.services;

import com.example.student.model.AdminHotelBooking;
import com.example.student.repo.AdminHotelBookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    
    @Override
    public List<AdminHotelBooking> getBookingsByHotelId(String hotelId) {
        return bookingRepo.findByHotelId(hotelId);
    }
    
    @Override
    public AdminHotelBooking getBookingById(String id) {
        Optional<AdminHotelBooking> bookingOpt = bookingRepo.findById(id);
        return bookingOpt.orElse(null);
    }
    
    @Override
    public AdminHotelBooking updateBooking(AdminHotelBooking booking) {
        if (bookingRepo.existsById(booking.getId())) {
            return bookingRepo.save(booking);
        }
        return null;
    }
    
    @Override
    public boolean deleteBooking(String id) {
        if (bookingRepo.existsById(id)) {
            bookingRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
