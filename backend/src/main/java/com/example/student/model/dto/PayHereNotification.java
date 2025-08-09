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
public class PayHereNotification {
    private String merchantId;
    private String orderId;
    private String paymentId;
    private BigDecimal amount;
    private String currency;
    private String statusCode;
    private String md5sig;
    private String method;
    private String statusMessage;
    private String cardHolderName;
    private String cardNo;
}
