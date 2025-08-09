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
public class PayoutHistory {
    private String payoutId;
    private BigDecimal amount;
    private String payoutType; // "CONFIRMATION_FEE", "FINAL_PAYOUT"
    private String status;
    private LocalDateTime paidAt;
    private String bankTransferReference;
}