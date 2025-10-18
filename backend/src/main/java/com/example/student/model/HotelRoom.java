package com.example.student.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "hotelRooms")
public class HotelRoom {

    @Id
    private String id;
    
    private String hotelId;
    private String roomNumber;
    private String type;
    private String description;
    private int capacity;
    private double price;
    private String status;  // Available, Booked, Maintenance
    private List<String> amenities;
    private List<String> images;
    private String createdAt;
    private String updatedAt;

    // Default constructor
    public HotelRoom() {
    }

    // Full constructor
    public HotelRoom(String id, String hotelId, String roomNumber, String type, String description, 
                     int capacity, double price, String status, List<String> amenities, 
                     List<String> images, String createdAt, String updatedAt) {
        this.id = id;
        this.hotelId = hotelId;
        this.roomNumber = roomNumber;
        this.type = type;
        this.description = description;
        this.capacity = capacity;
        this.price = price;
        this.status = status;
        this.amenities = amenities;
        this.images = images;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "HotelRoom{" +
                "id='" + id + '\'' +
                ", hotelId='" + hotelId + '\'' +
                ", roomNumber='" + roomNumber + '\'' +
                ", type='" + type + '\'' +
                ", capacity=" + capacity +
                ", price=" + price +
                ", status='" + status + '\'' +
                '}';
    }
}
