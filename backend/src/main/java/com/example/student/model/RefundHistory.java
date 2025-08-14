package com.example.student.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.math.BigDecimal;

/**
 * Model representing refund history entry in traveler wallet
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RefundHistory {

    /**
     * Unique refund ID
     */
    private String refundId;

    /**
     * Associated booking ID
     */
    private String bookingId;

    /**
     * Refund amount
     */
    private BigDecimal refundAmount;

    /**
     * Reason for refund
     */
    private String refundReason;

    /**
     * Type of refund (FULL, PARTIAL, CANCELLATION, CHARGEBACK)
     */
    private String refundType;

    /**
     * PayHere refund reference ID
     */
    private String payHereRefundId;

    /**
     * Status of refund (PENDING, COMPLETED, FAILED)
     */
    private String status;

    /**
     * Date when refund was requested
     */
    private LocalDateTime refundDate;

    /**
     * Date when refund was processed
     */
    private LocalDateTime processedDate;

    /**
     * Additional notes about the refund
     */
    private String notes;

    /**
     * Currency of the refund
     */
    private String currency;

    /**
     * Original payment reference
     */
    private String originalPaymentReference;

    /**
     * Processing method (AUTO, MANUAL)
     */
    private String processingMethod;

    // Constructor for quick creation with essential fields
    public RefundHistory(String bookingId, BigDecimal refundAmount, String refundReason, String refundType) {
        this.bookingId = bookingId;
        this.refundAmount = refundAmount;
        this.refundReason = refundReason;
        this.refundType = refundType;
        this.refundDate = LocalDateTime.now();
        this.status = "PENDING";
        this.currency = "LKR"; // Default currency
        this.processingMethod = "AUTO";
    }

    // Constructor with PayHere reference
    public RefundHistory(String bookingId, BigDecimal refundAmount, String refundReason,
                         String refundType, String payHereRefundId) {
        this(bookingId, refundAmount, refundReason, refundType);
        this.payHereRefundId = payHereRefundId;
    }

    /**
     * Mark refund as completed
     */
    public void markAsCompleted() {
        this.status = "COMPLETED";
        this.processedDate = LocalDateTime.now();
    }

    /**
     * Mark refund as failed
     */
    public void markAsFailed(String reason) {
        this.status = "FAILED";
        this.processedDate = LocalDateTime.now();
        this.notes = reason;
    }

    /**
     * Check if refund is completed
     */
    public boolean isCompleted() {
        return "COMPLETED".equals(this.status);
    }

    /**
     * Check if refund is pending
     */
    public boolean isPending() {
        return "PENDING".equals(this.status);
    }

    /**
     * Check if refund failed
     */
    public boolean isFailed() {
        return "FAILED".equals(this.status);
    }

    /**
     * Get refund type description
     */
    public String getRefundTypeDescription() {
        if (refundType == null) return "Unknown";

        switch (refundType) {
            case "FULL":
                return "Full Refund";
            case "PARTIAL":
                return "Partial Refund";
            case "CANCELLATION":
                return "Cancellation Refund";
            case "CHARGEBACK":
                return "Chargeback";
            default:
                return refundType;
        }
    }

    /**
     * Get status description
     */
    public String getStatusDescription() {
        if (status == null) return "Unknown";

        switch (status) {
            case "PENDING":
                return "Refund Pending";
            case "COMPLETED":
                return "Refund Completed";
            case "FAILED":
                return "Refund Failed";
            default:
                return status;
        }
    }

    /**
     * Get processing duration in hours (if completed)
     */
    public Long getProcessingDurationHours() {
        if (refundDate != null && processedDate != null) {
            return java.time.Duration.between(refundDate, processedDate).toHours();
        }
        return null;
    }

    /**
     * Check if refund is recent (within last 7 days)
     */
    public boolean isRecent() {
        if (refundDate != null) {
            return refundDate.isAfter(LocalDateTime.now().minusDays(7));
        }
        return false;
    }

    @Override
    public String toString() {
        return String.format("RefundHistory{id='%s', booking='%s', amount=%s %s, type='%s', status='%s', date=%s}",
                refundId, bookingId, refundAmount, currency, refundType, status, refundDate);
    }
}