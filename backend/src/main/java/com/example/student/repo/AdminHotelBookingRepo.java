package com.example.student.repo;

import com.example.student.model.AdminHotelBooking;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminHotelBookingRepo extends MongoRepository<AdminHotelBooking, String> {
}
