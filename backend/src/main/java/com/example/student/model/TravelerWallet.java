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
@Document(collection = "traveler_wallets")
public class TravelerWallet {
    @Id
    private String _id;
    private String travelerId;
    private BigDecimal totalSpent; // Total amount spent on bookings
    private BigDecimal totalRefunded; // Total refunds received
    private BigDecimal currentBalance; // Current wallet balance (if any)
    private List<RefundHistory> refundHistory;
    private LocalDateTime lastUpdated;

    public String getId() {
        return _id;
    }
}