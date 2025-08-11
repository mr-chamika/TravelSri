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
public class PayHereCheckoutRequest {
    private String merchantId;
    private String orderId;
    private BigDecimal amount;
    private String currency;
    private String items;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private String returnUrl;
    private String cancelUrl;
    private String notifyUrl;
    private String hash;
}