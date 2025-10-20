package com.example.student.repo;

import com.example.student.model.Booking;
import com.example.student.model.TravelerBooking;
import com.example.student.model.dto.Bookingdto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TravelerBookingRepo extends MongoRepository<TravelerBooking, String> {


    List<TravelerBooking> findAllByUserId(String userId);

    @Query("{'serviceId': ?0}")
    List<Bookingdto> findByServiceId(String serviceId);

}
