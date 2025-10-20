package com.example.student.controller;

import com.example.student.model.Hotel;
import com.example.student.model.HotelRoom;
import com.example.student.repo.HotelsRepo;
import com.example.student.repo.HotelRoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/hotels")
public class HotelRoomController {

    @Autowired
    private HotelRoomRepo hotelRoomRepo;

    @Autowired
    private HotelsRepo hotelsRepo;

    // Get all rooms for a specific hotel
    @GetMapping("/{hotelId}/rooms")
    public ResponseEntity<?> getAllRoomsByHotelId(@PathVariable String hotelId) {
        try {
            // Check if hotel exists
            Optional<Hotel> hotelOpt = hotelsRepo.findById(hotelId);
            if (!hotelOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Hotel not found with id: " + hotelId);
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Get all rooms for the hotel
            List<HotelRoom> rooms = hotelRoomRepo.findByHotelId(hotelId);
            return new ResponseEntity<>(rooms, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error fetching rooms: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a specific room by ID
    @GetMapping("/{hotelId}/rooms/{roomId}")
    public ResponseEntity<?> getRoomById(@PathVariable String hotelId, @PathVariable String roomId) {
        try {
            // Check if hotel exists
            Optional<Hotel> hotelOpt = hotelsRepo.findById(hotelId);
            if (!hotelOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Hotel not found with id: " + hotelId);
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Get the room by ID and hotel ID
            Optional<HotelRoom> roomOpt = hotelRoomRepo.findById(roomId);
            if (!roomOpt.isPresent() || !roomOpt.get().getHotelId().equals(hotelId)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room not found or does not belong to the hotel");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(roomOpt.get(), HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error fetching room: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create a new room for a hotel
    @PostMapping("/{hotelId}/rooms")
    public ResponseEntity<?> createRoom(@PathVariable String hotelId, @RequestBody HotelRoom room) {
        try {
            // Check if hotel exists
            Optional<Hotel> hotelOpt = hotelsRepo.findById(hotelId);
            if (!hotelOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Hotel not found with id: " + hotelId);
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Set the hotel ID for the room
            room.setHotelId(hotelId);
            
            // Set timestamp
            room.setCreatedAt(new Date().toString());
            room.setUpdatedAt(new Date().toString());

            // Save the room
            HotelRoom savedRoom = hotelRoomRepo.save(room);
            return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error creating room: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update a room
    @PutMapping("/{hotelId}/rooms/{roomId}")
    public ResponseEntity<?> updateRoom(@PathVariable String hotelId, @PathVariable String roomId, @RequestBody HotelRoom roomDetails) {
        try {
            // Check if hotel exists
            Optional<Hotel> hotelOpt = hotelsRepo.findById(hotelId);
            if (!hotelOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Hotel not found with id: " + hotelId);
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Get the room by ID and hotel ID
            Optional<HotelRoom> roomOpt = hotelRoomRepo.findById(roomId);
            if (!roomOpt.isPresent() || !roomOpt.get().getHotelId().equals(hotelId)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room not found or does not belong to the hotel");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Update the room details
            HotelRoom existingRoom = roomOpt.get();
            
            if (roomDetails.getRoomNumber() != null) {
                existingRoom.setRoomNumber(roomDetails.getRoomNumber());
            }
            
            if (roomDetails.getType() != null) {
                existingRoom.setType(roomDetails.getType());
            }
            
            if (roomDetails.getDescription() != null) {
                existingRoom.setDescription(roomDetails.getDescription());
            }
            
            if (roomDetails.getCapacity() > 0) {
                existingRoom.setCapacity(roomDetails.getCapacity());
            }
            
            if (roomDetails.getPrice() > 0) {
                existingRoom.setPrice(roomDetails.getPrice());
            }
            
            if (roomDetails.getStatus() != null) {
                existingRoom.setStatus(roomDetails.getStatus());
            }
            
            if (roomDetails.getAmenities() != null) {
                existingRoom.setAmenities(roomDetails.getAmenities());
            }
            
            if (roomDetails.getImages() != null) {
                existingRoom.setImages(roomDetails.getImages());
            }
            
            // Update timestamp
            existingRoom.setUpdatedAt(new Date().toString());

            // Save the updated room
            HotelRoom updatedRoom = hotelRoomRepo.save(existingRoom);
            return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error updating room: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a room
    @DeleteMapping("/{hotelId}/rooms/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable String hotelId, @PathVariable String roomId) {
        try {
            // Check if hotel exists
            Optional<Hotel> hotelOpt = hotelsRepo.findById(hotelId);
            if (!hotelOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Hotel not found with id: " + hotelId);
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Get the room by ID and hotel ID
            Optional<HotelRoom> roomOpt = hotelRoomRepo.findById(roomId);
            if (!roomOpt.isPresent() || !roomOpt.get().getHotelId().equals(hotelId)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room not found or does not belong to the hotel");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Delete the room
            hotelRoomRepo.deleteById(roomId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Room deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error deleting room: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get rooms by status
    @GetMapping("/{hotelId}/rooms/status/{status}")
    public ResponseEntity<?> getRoomsByStatus(@PathVariable String hotelId, @PathVariable String status) {
        try {
            // Check if hotel exists
            Optional<Hotel> hotelOpt = hotelsRepo.findById(hotelId);
            if (!hotelOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Hotel not found with id: " + hotelId);
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Get rooms by status
            List<HotelRoom> rooms = hotelRoomRepo.findByHotelIdAndStatus(hotelId, status);
            return new ResponseEntity<>(rooms, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error fetching rooms by status: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get rooms by type
    @GetMapping("/{hotelId}/rooms/type/{type}")
    public ResponseEntity<?> getRoomsByType(@PathVariable String hotelId, @PathVariable String type) {
        try {
            // Check if hotel exists
            Optional<Hotel> hotelOpt = hotelsRepo.findById(hotelId);
            if (!hotelOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Hotel not found with id: " + hotelId);
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Get rooms by type
            List<HotelRoom> rooms = hotelRoomRepo.findByHotelIdAndType(hotelId, type);
            return new ResponseEntity<>(rooms, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error fetching rooms by type: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get rooms by capacity
    @GetMapping("/{hotelId}/rooms/capacity/{capacity}")
    public ResponseEntity<?> getRoomsByCapacity(@PathVariable String hotelId, @PathVariable int capacity) {
        try {
            // Check if hotel exists
            Optional<Hotel> hotelOpt = hotelsRepo.findById(hotelId);
            if (!hotelOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Hotel not found with id: " + hotelId);
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Get rooms by capacity
            List<HotelRoom> rooms = hotelRoomRepo.findByHotelIdAndCapacity(hotelId, capacity);
            return new ResponseEntity<>(rooms, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error fetching rooms by capacity: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all room types
    @GetMapping("/{hotelId}/rooms/types")
    public ResponseEntity<?> getAllRoomTypes(@PathVariable String hotelId) {
        try {
            // Check if hotel exists
            Optional<Hotel> hotelOpt = hotelsRepo.findById(hotelId);
            if (!hotelOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Hotel not found with id: " + hotelId);
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

            // Get all room types for the hotel
            List<HotelRoom> rooms = hotelRoomRepo.findByHotelId(hotelId);
            
            // Extract unique room types
            List<String> roomTypes = rooms.stream()
                .map(HotelRoom::getType)
                .distinct()
                .collect(Collectors.toList());
            
            return new ResponseEntity<>(roomTypes, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error fetching room types: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get hotel authenticated info - profile
    @GetMapping("/me")
    public ResponseEntity<?> getHotelProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract token from header - just return OK for now to test connection
            // In a real implementation, you would validate the token and return the hotel profile
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Authenticated API connection working");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error accessing authenticated endpoint: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
