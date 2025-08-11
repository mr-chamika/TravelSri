// Make sure your Bookingdto.java has these fields:

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
    private String id;
    private String travelerId;
    private String providerId;
    private String providerType;
    private String serviceName;
    private String serviceDescription;
    private LocalDateTime serviceStartDate;
    private LocalDateTime serviceEndDate;
    private BigDecimal totalAmount;
    private String currency;
    private BigDecimal platformCommission;
    private BigDecimal providerConfirmationFee;
    private String status;
    private String paymentStatus;
    private LocalDateTime bookingTime;
    private LocalDateTime cancellationDeadline;
    private LocalDateTime refundDeadline;

    // PayHere fields
    private String payHereOrderId;
    private String payHerePaymentId;

    // Payout tracking
    private boolean confirmationFeePaid;
    private boolean finalPayoutPaid;
    private LocalDateTime confirmationFeePaidAt;
    private LocalDateTime finalPayoutPaidAt;

    // Provider interaction
    private LocalDateTime providerAcceptedAt;
    private String rejectionReason;
    private String cancellationReason;

    // Additional details
    private String specialRequests;
    private Integer numberOfGuests;
    private String languagePreference;
    private String guideType;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Computed fields (read-only)
    private String statusDescription;
    private String paymentStatusDescription;
    private boolean canBeCancelled;
    private boolean canBeRefunded;

    // Constructor for computed fields
    public String getStatusDescription() {
        if (status == null) return "Unknown";

        switch (status) {
            case "PENDING_PAYMENT":
                return "Waiting for payment";
            case "PENDING_PROVIDER_ACCEPTANCE":
                return "Waiting for provider to accept";
            case "CONFIRMED":
                return "Booking confirmed";
            case "COMPLETED":
                return "Service completed";
            case "CANCELLED_BY_TRAVELER":
                return "Cancelled by traveler";
            case "CANCELLED_BY_PROVIDER":
                return "Cancelled by provider";
            case "REFUNDED":
                return "Refunded";
            default:
                return status.replace("_", " ").toLowerCase();
        }
    }

    public String getPaymentStatusDescription() {
        if (paymentStatus == null) return "Unknown";

        switch (paymentStatus) {
            case "PENDING":
                return "Payment pending";
            case "SUCCESS":
                return "Payment successful";
            case "FAILED":
                return "Payment failed";
            case "REFUNDED":
                return "Fully refunded";
            case "PARTIALLY_REFUNDED":
                return "Partially refunded";
            default:
                return paymentStatus.replace("_", " ").toLowerCase();
        }
    }

    public boolean getCanBeCancelled() {
        return cancellationDeadline != null &&
                LocalDateTime.now().isBefore(cancellationDeadline) &&
                ("PENDING_PROVIDER_ACCEPTANCE".equals(status) || "CONFIRMED".equals(status));
    }

    public boolean getCanBeRefunded() {
        return refundDeadline != null &&
                LocalDateTime.now().isBefore(refundDeadline) &&
                "CONFIRMED".equals(status);
    }
}