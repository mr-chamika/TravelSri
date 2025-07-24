package com.example.student.controller;

import com.example.student.model.HotelRoomInventory;
import com.example.student.services.HotelRoomInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotel-rooms")
public class HotelRoomInventoryController {

    @Autowired
    private HotelRoomInventoryService roomService;

    @PostMapping
    public HotelRoomInventory createRoom(@RequestBody HotelRoomInventory room) {
        return roomService.saveRoom(room);
    }

    @GetMapping
    public List<HotelRoomInventory> getAllRooms() {
        return roomService.getAllRooms();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HotelRoomInventory> getRoomById(@PathVariable String id) {
        HotelRoomInventory room = roomService.getRoomById(id);
        if (room != null) {
            return ResponseEntity.ok(room);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HotelRoomInventory> updateRoom(@PathVariable String id, @RequestBody HotelRoomInventory room) {
        room.setId(id); // ensure the ID is set correctly
        HotelRoomInventory updatedRoom = roomService.updateRoom(room);
        if (updatedRoom != null) {
            return ResponseEntity.ok(updatedRoom);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String id) {
        boolean deleted = roomService.deleteRoom(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/type/{type}")
    public List<HotelRoomInventory> getRoomsByType(@PathVariable String type) {
        return roomService.getRoomsByType(type);
    }
    
    @GetMapping("/status/{status}")
    public List<HotelRoomInventory> getRoomsByStatus(@PathVariable String status) {
        return roomService.getRoomsByStatus(status);
    }
    
    @GetMapping("/capacity/{capacity}")
    public List<HotelRoomInventory> getRoomsByCapacity(@PathVariable int capacity) {
        return roomService.getRoomsByCapacity(capacity);
    }
}
