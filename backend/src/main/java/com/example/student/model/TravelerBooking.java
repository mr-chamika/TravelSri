package com.example.student.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Document(collection = "bookings")
public class TravelerBooking {

    @Id
    private String _id;
    private String serviceId;
    private String userId;
    private String type; // hotel, guide, vehicle
    private String thumbnail;
    private String title;
    private String[] subtitle; // Room details, guide services, etc.
    private String location;
    private String[] bookingDates;
    private Integer stars;
    private double ratings;
    private boolean paymentStatus;
    private Integer guests;
    private String[] facilities;
    private int price;
    private String status; // pending_payment, confirmed, cancelled, etc.
    private String mobileNumber;

    // NEW: PayHere integration fields
    private String payHereOrderId;
    private String payHerePaymentId;
    private String currency = "LKR";

    // NEW: Enhanced status tracking
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime bookingTime;
    private LocalDateTime cancellationDeadline;
    private String cancellationReason;

    // NEW: Financial tracking
    private BigDecimal platformCommission;
    private BigDecimal providerConfirmationFee;
    private boolean confirmationFeePaid = false;
    private boolean finalPayoutPaid = false;

    // Constructor
    public TravelerBooking() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.currency = "LKR";
    }

    // Helper methods
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public BigDecimal calculateFinalPayout() {
        if (platformCommission == null || providerConfirmationFee == null) {
            return BigDecimal.valueOf(price * 0.75); // 75% default
        }
        BigDecimal total = BigDecimal.valueOf(price);
        return total.subtract(platformCommission).subtract(providerConfirmationFee);
    }

    public String getId() {
        return _id;
    }
}