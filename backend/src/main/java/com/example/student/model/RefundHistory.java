package com.example.student.model;

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
public class RefundHistory {
    private String refundId;
    private String bookingId;
    private BigDecimal amount;
    private String reason;
    private LocalDateTime refundedAt;
    private String payHereRefundId;
}