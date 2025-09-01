package com.example.student.model;

import lombok.*;
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
@Getter
@Setter
public class PaymentTransaction {
    @Id
    private String _id;
    private String transactionId;
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

    // Custom getter for MongoDB _id
    public String getId() {
        return _id;
    }

    // Custom setter for MongoDB _id
    public void setId(String id) {
        this._id = id;
    }

    public String getPaymentId() {
        return this.payHerePaymentId;
    }

    public void setPaymentId(String paymentId) {
        this.payHerePaymentId = paymentId;
    }

    public String getOrderId() {
        return this.payHereOrderId;
    }

    public void setOrderId(String orderId) {
        this.payHereOrderId = orderId;
    }

}