package com.example.student.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentSessionRequest {
    private String bookingId;
    private BigDecimal amount;
    private String currency;
    private String description;
    private String returnUrl;
}