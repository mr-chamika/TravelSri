package com.example.student.repo;

import com.example.student.model.AdminHotelBooking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AdminHotelBookingRepo extends MongoRepository<AdminHotelBooking, String> {
    List<AdminHotelBooking> findByHotelId(String hotelId);
}
