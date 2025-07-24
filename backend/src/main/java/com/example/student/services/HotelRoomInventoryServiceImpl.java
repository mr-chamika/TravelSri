package com.example.student.services;

import com.example.student.exception.ResourceNotFoundException;
import com.example.student.model.HotelRoomInventory;
import com.example.student.repo.HotelRoomInventoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelRoomInventoryServiceImpl implements HotelRoomInventoryService {

    @Autowired
    private HotelRoomInventoryRepo roomRepo;

    @Override
    public HotelRoomInventory saveRoom(HotelRoomInventory room) {
        return roomRepo.save(room);
    }

    @Override
    public List<HotelRoomInventory> getAllRooms() {
        return roomRepo.findAll();
    }

    @Override
    public HotelRoomInventory getRoomById(String id) {
        Optional<HotelRoomInventory> roomOpt = roomRepo.findById(id);
        return roomOpt.orElse(null);
    }

    @Override
    public HotelRoomInventory updateRoom(HotelRoomInventory room) {
        if (roomRepo.existsById(room.getId())) {
            return roomRepo.save(room);
        }
        return null;
    }

    @Override
    public boolean deleteRoom(String id) {
        if (roomRepo.existsById(id)) {
            roomRepo.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<HotelRoomInventory> getRoomsByType(String type) {
        return roomRepo.findByType(type);
    }

    @Override
    public List<HotelRoomInventory> getRoomsByStatus(String status) {
        return roomRepo.findByStatus(status);
    }

    @Override
    public List<HotelRoomInventory> getRoomsByCapacity(int capacity) {
        return roomRepo.findByCapacityGreaterThanEqual(capacity);
    }
}
