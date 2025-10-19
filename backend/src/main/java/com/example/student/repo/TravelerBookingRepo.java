package com.example.student.repo;

import com.example.student.model.Booking;
import com.example.student.model.TravelerBooking;
import com.example.student.model.dto.BookingListForGuideDto;
import com.example.student.model.dto.Bookingdto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TravelerBookingRepo extends MongoRepository<TravelerBooking, String> {


    List<TravelerBooking> findAllByUserId(String userId);

    @Query(
            value = "{'serviceId': ?0}",
            fields = "{'location': 1,'bookingDates': 1,'price': 1,'userId': 1,'_id': 1,'status': 1, 'mobileNumber': 1}"
    )
    List<BookingListForGuideDto> findByServiceId(String serviceId);

}
