package com.example.student.repo;

import com.example.student.model.HotelRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRoomRepo extends MongoRepository<HotelRoom, String> {
    List<HotelRoom> findByHotelId(String hotelId);
    List<HotelRoom> findByHotelIdAndStatus(String hotelId, String status);
    List<HotelRoom> findByHotelIdAndType(String hotelId, String type);
    List<HotelRoom> findByHotelIdAndCapacity(String hotelId, int capacity);
}
