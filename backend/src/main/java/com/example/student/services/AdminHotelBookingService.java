package com.example.student.services;

import com.example.student.model.AdminHotelBooking;
import java.util.List;

public interface AdminHotelBookingService {
    AdminHotelBooking saveBooking(AdminHotelBooking booking);
    List<AdminHotelBooking> getAllBookings();
    AdminHotelBooking getBookingById(String id);
    AdminHotelBooking updateBooking(AdminHotelBooking booking);
    boolean deleteBooking(String id);
}
