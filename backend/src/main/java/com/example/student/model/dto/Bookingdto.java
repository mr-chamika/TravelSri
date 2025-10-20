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
public class Bookingdto {
    // Basic booking information
    private String id;
    private String travelerId;
    private String providerId;
    private String providerType; // "guide", "vehicle", "hotel"
    private String serviceName;
    private String serviceDescription;
    private LocalDateTime serviceStartDate;
    private LocalDateTime serviceEndDate;

    // Financial information
    private BigDecimal totalAmount;
    private String currency;
    private BigDecimal platformCommission; // 5%
    private BigDecimal providerConfirmationFee; // 10%

    // Booking status and timeline
    private String status;
    private String paymentStatus;
    private LocalDateTime bookingTime;
    private LocalDateTime cancellationDeadline; // 20 hours from booking
    private LocalDateTime refundDeadline; // 2 days before service

    // PayHere payment related fields
    private String payHereOrderId;
    private String payHerePaymentId;

    // Provider interaction tracking
    private LocalDateTime providerAcceptedAt;
    private String rejectionReason;
    private String cancellationReason;

    // Payout tracking
    private boolean confirmationFeePaid;
    private boolean finalPayoutPaid;

    // Additional booking details
    private String specialRequests;
    private Integer numberOfGuests;
    private String languagePreference;
    private String guideType; // "visit", "travel"

    // Hotel-specific fields
    private String checkInDate;
    private String checkOutDate;
    private Integer numberOfRooms;
    private Integer numberOfNights;
    private String[] selectedRoomTypes;
    private String hotelName;
    private String hotelLocation;
    private Integer adults;
    private Integer children;

    // Vehicle-specific fields
    private String pickupLocation;
    private String dropoffLocation;
    private String pickupTime;
    private Boolean oneWayTrip;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Helper methods
    public boolean isHotelBooking() {
        return "hotel".equals(this.providerType);
    }

    public boolean isGuideBooking() {
        return "guide".equals(this.providerType);
    }

    public boolean isVehicleBooking() {
        return "vehicle".equals(this.providerType);
    }

    public boolean isPaymentSuccessful() {
        return "SUCCESS".equals(this.paymentStatus);
    }

    public boolean isConfirmed() {
        return "CONFIRMED".equals(this.status);
    }

    public boolean isCompleted() {
        return "COMPLETED".equals(this.status);
    }

    public boolean isPending() {
        return "PENDING_PAYMENT".equals(this.status) ||
                "PENDING_PROVIDER_ACCEPTANCE".equals(this.status);
    }
}
