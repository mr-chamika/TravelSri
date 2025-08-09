package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class HotelProfileDto {
    
    private String _id;
    private String username;
    private String email;
    
    // Hotel Information Fields
    private String hotelName;
    private String name;
    private String hotelAddress;
    private String baseAreaLocation;
    private String city;
    private String district;
    private String postalCode;
    private String location;
    private String description;
    
    // Location data
    private Double latitude;
    private Double longitude;
    
    // Hotel details
    private String website;
    private Integer starRating;
    private int stars;
    private int ratings;
    private int reviewCount;
    
    // Contact Information Fields
    private String contactPerson;
    private String contactPosition;
    private String contactEmail;
    private String phoneNumber;
    private String mobileNumber;
    private String alternatePhoneNumber;
    private String emergencyContact;
    private String businessLicense;
    
    // Pricing information
    private int originalPrice;
    private int currentPrice;
    private int singlePrice;
    private int doublePrice;
    
    // Room availability
    private int availableSingle;
    private int availableDouble;
    private int maxSingle;
    private int maxDouble;
    
    // Images and documents
    private String thumbnail;
    private String[] images;
    private String[] hotelImagesPaths;
    
    // Hotel features
    private String[] freeFeatures;
    private String[] policies;
    private String specialOffer;
    private String[] roomTypes;
    private String[] facilities;
    
    // Account status
    private boolean isActive;
    private boolean isVerified;
    
    // Audit fields
    private String createdAt;
    private String updatedAt;
}
