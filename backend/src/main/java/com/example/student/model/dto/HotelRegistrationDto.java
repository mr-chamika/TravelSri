package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class HotelRegistrationDto {
    
    // Account Information Fields
    private String username;
    private String email;
    private String password;
    
    // Hotel Information Fields
    private String hotelName;
    private String hotelAddress;
    private String baseAreaLocation;
    private String city;
    private String district;
    private String postalCode;
    
    // Location data (from map selection)
    private Double latitude;
    private Double longitude;
    
    // Hotel details
    private String website;
    private Integer starRating;
    private String description;
    
    // Contact Information Fields
    private String contactPerson;
    private String contactPosition;
    private String contactEmail;
    private String phoneNumber;
    private String mobileNumber;
    private String alternatePhoneNumber;
    private String emergencyContact;
    private String businessLicense;
    
    // Business Documents (stored as file paths or URLs)
    private String businessRegistrationDocPath;
    private String taxCertificateDocPath;
    private String hotelCertificationDocPath;
    private String healthAndSafetyDocPath;
    private String[] otherDocumentsPaths;
    
    // Hotel Images
    private String[] hotelImagesPaths;
    
    // Room Types
    private String[] roomTypeDetails;
    
    // Terms and Conditions
    private boolean acceptTerms;
    private boolean acceptPrivacyPolicy;
    
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
}
