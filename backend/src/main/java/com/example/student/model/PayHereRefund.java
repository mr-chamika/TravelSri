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
@Document(collection = "payhere_refunds")
public class PayHereRefund {
    @Id
    private String _id;
    private String bookingId;
    private String travelerId;
    private String originalPaymentId; // PayHere payment ID
    private BigDecimal refundAmount;
    private String refundReason;
    private String payHereRefundId; // PayHere's refund transaction ID
    private String status; // "PENDING", "SUCCESS", "FAILED"
    private String payHereResponse; // Full PayHere response
    private LocalDateTime initiatedAt;
    private LocalDateTime completedAt;

    public String getId() {
        return _id;
    }
}