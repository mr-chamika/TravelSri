package com.example.student.services;

import com.example.student.model.HotelRoomInventory;
import java.util.List;

public interface HotelRoomInventoryService {
    HotelRoomInventory saveRoom(HotelRoomInventory room);
    List<HotelRoomInventory> getAllRooms();
    HotelRoomInventory getRoomById(String id);
    HotelRoomInventory updateRoom(HotelRoomInventory room);
    boolean deleteRoom(String id);
    List<HotelRoomInventory> getRoomsByType(String type);
    List<HotelRoomInventory> getRoomsByStatus(String status);
    List<HotelRoomInventory> getRoomsByCapacity(int capacity);
}
