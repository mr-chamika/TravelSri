package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.dto.BookingRequest;
import com.example.student.model.dto.Bookingdto;

import java.util.List;
import java.util.Optional;

public interface IBookingService {
    Booking createBooking(BookingRequest request);
    Optional<Booking> getBookingById(String bookingId);
    List<Bookingdto> getBookingsByTraveler(String travelerId); // Changed to Bookingdto
    List<Bookingdto> getBookingsByProvider(String providerId); // Changed to Bookingdto
    Booking acceptBooking(String bookingId, String providerId);
    Booking rejectBooking(String bookingId, String providerId);
    Booking cancelBooking(String bookingId, String travelerId);
    Booking completeBooking(String bookingId);
}