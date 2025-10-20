package com.example.student.repo;

import com.example.student.model.Booking;
import com.example.student.model.TravelerBooking;
import com.example.student.model.dto.BookingListForGuideDto;
import com.example.student.model.dto.BookingListForVehicleDto;
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

    @Query(
            value = "{ 'serviceId': ?0, 'status': 'active', 'type': 'vehicle' }",
            fields = "{ '_id': 1, 'serviceId': 1, 'userId': 1, 'type': 1, 'thumbnail': 1, 'title': 1, 'subtitle': 1, 'location': 1, 'bookingDates': 1, 'ratings': 1, 'paymentStatus': 1, 'facilities': 1, 'price': 1, 'status': 1, 'mobileNumber': 1 }"
    )
    List<BookingListForVehicleDto> findActiveVehicleBookingsByServiceId(String serviceId);


}
