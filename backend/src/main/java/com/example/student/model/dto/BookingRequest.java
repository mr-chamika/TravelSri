package com.example.student.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingRequest {
    // Core booking fields
    private String travelerId;
    private String providerId;
    private String providerType; // "guide", "vehicle", "hotel"
    private String serviceName;
    private String serviceDescription;
    private LocalDateTime serviceStartDate;
    private LocalDateTime serviceEndDate;
    private BigDecimal totalAmount;

    // Common fields
    private String currency = "LKR"; // Default currency
    private String specialRequests;
    private Integer numberOfGuests;
    private String languagePreference;
    private String contactInformation;
    private String bookingType; // "solo", "group"
    private String paymentMethod;
    private String notes;

    // Guide-specific fields
    private String guideType; // "visit", "travel"
    private String tourType;
    private String[] preferredLanguages;

    // Vehicle-specific fields
    private String pickupLocation;
    private String dropoffLocation;
    private String pickupTime;
    private Boolean oneWayTrip;

    // Hotel-specific fields (enhanced)
    private String hotelId; // Hotel service ID
    private Integer numberOfRooms;
    private Integer numberOfNights;
    private String[] roomTypes; // Array of selected room types
    private String checkInDate; // Check-in date string
    private String checkOutDate; // Check-out date string
    private String[] selectedFacilities; // Selected hotel facilities
    private String mealPlan; // Breakfast, half-board, full-board, etc.
    private String roomPreferences; // Non-smoking, sea view, etc.
    private Integer adults; // Number of adult guests
    private Integer children; // Number of child guests
    private String[] bookingDates; // For compatibility with existing system
    private String thumbnail; // Hotel image
    private String title; // Hotel name
    private String[] subtitle; // Room details array
    private String location; // Hotel location
    private Integer stars; // Hotel star rating
    private Double ratings; // Hotel ratings
    private Boolean paymentStatus; // Payment status
    private String[] facilities; // All hotel facilities
    private String status; // Booking status
    private String mobileNumber; // Contact number

    // Validation methods
    public void validateForGuideBooking() {
        if ("guide".equals(this.providerType)) {
            if (providerId == null || providerId.trim().isEmpty()) {
                throw new IllegalArgumentException("Guide ID is required for guide bookings");
            }
            if (serviceStartDate == null || serviceEndDate == null) {
                throw new IllegalArgumentException("Service start and end dates are required for guide bookings");
            }
            if (numberOfGuests == null || numberOfGuests <= 0) {
                throw new IllegalArgumentException("Number of guests must be greater than 0");
            }
        }
    }

    public void validateForHotelBooking() {
        if ("hotel".equals(this.providerType)) {
            if (providerId == null || providerId.trim().isEmpty()) {
                throw new IllegalArgumentException("Hotel ID is required for hotel bookings");
            }
            if (numberOfRooms == null || numberOfRooms <= 0) {
                throw new IllegalArgumentException("Number of rooms must be greater than 0");
            }
            if (checkInDate == null || checkOutDate == null) {
                throw new IllegalArgumentException("Check-in and check-out dates are required");
            }
            if (numberOfGuests == null || numberOfGuests <= 0) {
                throw new IllegalArgumentException("Number of guests must be greater than 0");
            }
            if (numberOfNights == null || numberOfNights <= 0) {
                throw new IllegalArgumentException("Number of nights must be greater than 0");
            }
            // Validate total guest capacity
            if (adults == null) adults = numberOfGuests;
            if (children == null) children = 0;
            if (adults + children != numberOfGuests) {
                throw new IllegalArgumentException("Adult and children count must equal total guests");
            }
        }
    }

    public void validateForVehicleBooking() {
        if ("vehicle".equals(this.providerType)) {
            if (providerId == null || providerId.trim().isEmpty()) {
                throw new IllegalArgumentException("Vehicle ID is required for vehicle bookings");
            }
            if (pickupLocation == null || pickupLocation.trim().isEmpty()) {
                throw new IllegalArgumentException("Pickup location is required for vehicle bookings");
            }
            if (pickupTime == null || pickupTime.trim().isEmpty()) {
                throw new IllegalArgumentException("Pickup time is required for vehicle bookings");
            }
            if (numberOfGuests == null || numberOfGuests <= 0) {
                throw new IllegalArgumentException("Number of passengers must be greater than 0");
            }
        }
    }

    // General validation method
    public void validate() {
        // Common validations
        if (travelerId == null || travelerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Traveler ID is required");
        }
        if (providerType == null || providerType.trim().isEmpty()) {
            throw new IllegalArgumentException("Provider type is required");
        }
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Total amount must be greater than 0");
        }
        if (!"LKR".equals(currency)) {
            throw new IllegalArgumentException("Only LKR currency is supported");
        }

        // Provider-specific validations
        switch (providerType.toLowerCase()) {
            case "guide":
                validateForGuideBooking();
                break;
            case "hotel":
                validateForHotelBooking();
                break;
            case "vehicle":
                validateForVehicleBooking();
                break;
            default:
                throw new IllegalArgumentException("Unsupported provider type: " + providerType);
        }
    }

    // Helper methods for hotel bookings
    public void setHotelBookingDefaults() {
        if ("hotel".equals(this.providerType)) {
            if (this.paymentStatus == null) this.paymentStatus = false;
            if (this.status == null) this.status = "pending_payment";
            if (this.currency == null) this.currency = "LKR";

            // Set booking dates array for compatibility
            if (this.checkInDate != null && this.checkOutDate != null) {
                this.bookingDates = new String[]{this.checkInDate, this.checkOutDate};
            }

            // Set service dates from check-in/out dates
            if (this.serviceStartDate == null && this.checkInDate != null) {
                try {
                    this.serviceStartDate = LocalDateTime.parse(this.checkInDate + "T15:00:00"); // 3 PM check-in
                } catch (Exception e) {
                    // Handle parsing error
                }
            }
            if (this.serviceEndDate == null && this.checkOutDate != null) {
                try {
                    this.serviceEndDate = LocalDateTime.parse(this.checkOutDate + "T11:00:00"); // 11 AM check-out
                } catch (Exception e) {
                    // Handle parsing error
                }
            }
        }
    }

    // Helper method to get room count
    public Integer getTotalRoomCount() {
        if (roomTypes != null) {
            return roomTypes.length;
        }
        return numberOfRooms != null ? numberOfRooms : 0;
    }

    // Helper method for facilities
    public String[] getAllFacilities() {
        if (selectedFacilities != null) {
            return selectedFacilities;
        }
        return facilities != null ? facilities : new String[0];
    }
}
