package com.example.student.model;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Setter
@Getter
@Data
@Builder
@Document(collection = "hotels")
public class Hotel{

    @Id
    private String _id;
    private String thumbnail;
    private Integer stars;//no of stars the hotel got
    private Integer ratings;//stars users give
    private Integer reviewCount;//reviewer can both post a review and give star rating when review
    Integer originalPrice;
    Integer currentPrice;
    //ratings = (stars/reviewCount)*(10/5) 5 is no of stars we offer

    private Integer singlePrice;
    private Integer doublePrice;
    private String name;
    private String[] images;
    private String[] unavailable;//unavailable days in a week
    private String location;
    private String distance;//distance from given above location
    private Integer availableSingle;//free single bed room slots
    private Integer availableDouble;//free double bed room slots
    private Integer maxSingle;//maximum single bed rooms
    private Integer maxDouble;//maximum double bed rooms
    private  String description;
    //theekshana
    private String mobileNumber;

    private String taxes;
    private String priceDescription;//priceDescription: '1 Night',
    private String[] freeFeatures;//freeFeatures: ["Free cancellation", "No prepayment needed"]
    private String[] policies;
    private String specialOffer;//if available
    private String[] roomTypes;//["id for singlebedroom","id for double bedroom"]
    private String[] facilities;//["id for facility pool","id for sea view"]

    //theekshana

    // New fields from web signup form
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
    
    // Contact Information Fields
    private String contactPerson;
    private String contactPosition;
    private String contactEmail;
    private String phoneNumber;
    private String alternatePhoneNumber;
    private String emergencyContact;
    private String businessLicense;
    
    // Business Documents (stored as file paths or URLs)
    private String businessRegistrationDocPath;
    private String taxCertificateDocPath;
    private String hotelCertificationDocPath;
    private String healthAndSafetyDocPath;
    private String[] otherDocumentsPaths;
    
    // Hotel Images (additional to existing images array)
    private String[] hotelImagesPaths;
    
    // Room Types (for storing room type details from signup)
    private String[] roomTypeDetails; // JSON strings containing room type info
    
    // Terms and Conditions
    private boolean acceptTerms;
    private boolean acceptPrivacyPolicy;
    
    // Account status fields
    private boolean isActive;
    private boolean isVerified;
    
    // Audit fields
    private String createdAt;
    private String updatedAt;

}
