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
    private String travelerId;
    private String providerId;
    private String providerType; // "guide", "vehicle", "hotel"
    private String serviceName;
    private String serviceDescription;
    private LocalDateTime serviceStartDate;
    private LocalDateTime serviceEndDate;
    private BigDecimal totalAmount;
    private BigDecimal platformCommission; // 5%
    private BigDecimal providerConfirmationFee; // 10%
    private String status; // PENDING_PAYMENT, PENDING_PROVIDER_ACCEPTANCE, CONFIRMED, etc.
    private LocalDateTime bookingTime;
    private LocalDateTime cancellationDeadline; // 20 hours from booking
    private LocalDateTime refundDeadline; // 2 days before service

    // PayHere payment related fields
    private String payHereOrderId;
    private String payHerePaymentId;
    private String paymentStatus; // PENDING, SUCCESS, FAILED, REFUNDED, PARTIALLY_REFUNDED
    private List<PaymentTransaction> transactions;

    // Payout tracking
    private boolean confirmationFeePaid;
    private boolean finalPayoutPaid;
    private LocalDateTime confirmationFeePaidAt;
    private LocalDateTime finalPayoutPaidAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getId() {
        return _id;
    }
}