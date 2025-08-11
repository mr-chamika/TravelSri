package com.example.student.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(collection = "payment_transactions")
public class PaymentTransaction {
    @Id
    private String _id;
    private String bookingId;
    private String payHereOrderId;
    private String payHerePaymentId;
    private String payHereRefundId;
    private String type; // PAYMENT, REFUND, PARTIAL_REFUND, CONFIRMATION_FEE_PAYOUT, FINAL_PAYOUT
    private BigDecimal amount;
    private String currency;
    private String status; // PENDING, SUCCESS, FAILED, CANCELLED
    private String reference;
    private String reason;
    private String payHereResponse;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getId() {
        return _id;
    }
}