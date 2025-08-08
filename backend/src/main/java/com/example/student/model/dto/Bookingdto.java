package com.example.student.model.dto;

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
public class Bookingdto {
    private String _id;
    private String serviceName;
    private String providerType;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime serviceStartDate;
    private LocalDateTime bookingTime;
}
