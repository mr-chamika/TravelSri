package com.example.student.repo;

import com.example.student.model.TravelerBooking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TravelerBookingRepo extends MongoRepository<TravelerBooking, String> {


    List<TravelerBooking> findAllByUserId(String userId);
}
