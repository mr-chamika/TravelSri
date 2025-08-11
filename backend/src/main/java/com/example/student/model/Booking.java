package com.example.student.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(collection = "bookings")
public class Booking {
    @Id
    private String _id;

    // Basic booking information
    private String travelerId;
    private String providerId;
    private String providerType; // "guide", "vehicle", "hotel"
    private String serviceName;
    private String serviceDescription;
    private LocalDateTime serviceStartDate;
    private LocalDateTime serviceEndDate;

    // Financial information
    private BigDecimal totalAmount;
    private String currency = "USD";
    private BigDecimal platformCommission; // 5%
    private BigDecimal providerConfirmationFee; // 10%

    // Booking status and timeline
    private String status; // PENDING_PAYMENT, PENDING_PROVIDER_ACCEPTANCE, CONFIRMED, COMPLETED, CANCELLED, REFUNDED
    private LocalDateTime bookingTime;
    private LocalDateTime cancellationDeadline; // 20 hours from booking
    private LocalDateTime refundDeadline; // 2 days before service

    // PayHere payment related fields
    private String payHereOrderId;
    private String payHerePaymentId;
    private String payHereRefundId;
    private String paymentStatus; // PENDING, SUCCESS, FAILED, REFUNDED, PARTIALLY_REFUNDED
    private List<PaymentTransaction> transactions;

    // Provider interaction tracking
    private LocalDateTime providerAcceptedAt;
    private LocalDateTime providerRejectedAt;
    private String rejectionReason;
    private String cancellationReason;
    private String cancellationType; // TRAVELER_CANCELLED, PROVIDER_CANCELLED, SYSTEM_CANCELLED

    // Payout tracking
    private boolean confirmationFeePaid = false;
    private boolean finalPayoutPaid = false;
    private LocalDateTime confirmationFeePaidAt;
    private LocalDateTime finalPayoutPaidAt;
    private BigDecimal totalRefundAmount;
    private BigDecimal refundedToTraveler;
    private BigDecimal refundedToPlatform;

    // Additional booking details
    private String specialRequests;
    private String contactInformation;
    private Integer numberOfGuests;
    private String languagePreference;
    private String guideType; // "visit", "travel"

    // Review and rating
    private boolean reviewCompleted = false;
    private String reviewId;
    private Double rating;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Utility method for ID access
    public String getId() {
        return _id;
    }

    public void setId(String id) {
        this._id = id;
    }

    // Business logic utility methods
    public boolean isPaymentSuccessful() {
        return "SUCCESS".equals(this.paymentStatus);
    }

    public boolean isConfirmed() {
        return "CONFIRMED".equals(this.status);
    }

    public boolean isCompleted() {
        return "COMPLETED".equals(this.status);
    }

    public boolean isCancelled() {
        return this.status != null && (
                this.status.contains("CANCELLED") ||
                        "REFUNDED".equals(this.status)
        );
    }

    public boolean isPending() {
        return "PENDING_PAYMENT".equals(this.status) ||
                "PENDING_PROVIDER_ACCEPTANCE".equals(this.status);
    }

    public boolean needsConfirmationFeePayout() {
        return isPaymentSuccessful() &&
                isConfirmed() &&
                !confirmationFeePaid &&
                providerAcceptedAt != null &&
                providerAcceptedAt.isBefore(LocalDateTime.now().minusHours(20));
    }

    public boolean needsFinalPayout() {
        return isPaymentSuccessful() &&
                isCompleted() &&
                !finalPayoutPaid;
    }

    public boolean isWithinCancellationWindow() {
        return cancellationDeadline != null &&
                LocalDateTime.now().isBefore(cancellationDeadline);
    }

    public boolean isWithinRefundWindow() {
        return refundDeadline != null &&
                LocalDateTime.now().isBefore(refundDeadline);
    }

    public boolean canBeCancelledByTraveler() {
        return isPending() || (isConfirmed() && isWithinCancellationWindow());
    }

    public boolean canBeCancelledByProvider() {
        return "PENDING_PROVIDER_ACCEPTANCE".equals(this.status) ||
                (isConfirmed() && isWithinCancellationWindow());
    }

    public BigDecimal calculatePlatformRevenue() {
        if (platformCommission != null) {
            return platformCommission;
        }
        if (totalAmount != null) {
            return totalAmount.multiply(BigDecimal.valueOf(0.05)); // 5%
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal calculateConfirmationFee() {
        if (providerConfirmationFee != null) {
            return providerConfirmationFee;
        }
        if (totalAmount != null) {
            return totalAmount.multiply(BigDecimal.valueOf(0.10)); // 10%
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal calculateFinalPayout() {
        if (totalAmount != null) {
            return totalAmount.multiply(BigDecimal.valueOf(0.75)); // 75%
        }
        return BigDecimal.ZERO;
    }

    public String getBookingStatusDescription() {
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

    // Auto-set timestamps
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        this.updatedAt = now;

        // Set booking time if not set
        if (this.bookingTime == null) {
            this.bookingTime = now;
        }

        // Calculate cancellation deadline (20 hours from booking)
        if (this.cancellationDeadline == null) {
            this.cancellationDeadline = this.bookingTime.plusHours(20);
        }

        // Calculate refund deadline (2 days before service)
        if (this.refundDeadline == null && this.serviceStartDate != null) {
            this.refundDeadline = this.serviceStartDate.minusDays(2);
        }

        // Calculate commission amounts
        if (this.totalAmount != null) {
            if (this.platformCommission == null) {
                this.platformCommission = calculatePlatformRevenue();
            }
            if (this.providerConfirmationFee == null) {
                this.providerConfirmationFee = calculateConfirmationFee();
            }
        }
    }

    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}