package com.example.student.repo;

import com.example.student.model.HotelRoomInventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface HotelRoomInventoryRepo extends MongoRepository<HotelRoomInventory, String> {
    List<HotelRoomInventory> findByType(String type);
    List<HotelRoomInventory> findByStatus(String status);
    List<HotelRoomInventory> findByCapacityGreaterThanEqual(int capacity);
}
