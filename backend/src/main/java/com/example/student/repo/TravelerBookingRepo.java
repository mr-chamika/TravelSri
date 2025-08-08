package com.example.student.repo;

import com.example.student.model.TravelerBooking;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TravelerBookingRepo extends MongoRepository<TravelerBooking, String> {


}
