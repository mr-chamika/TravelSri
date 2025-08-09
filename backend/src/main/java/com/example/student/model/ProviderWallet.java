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
@Document(collection = "provider_wallets")
public class ProviderWallet {
    @Id
    private String _id;
    private String providerId;
    private BigDecimal totalEarnings; // Total earned from all bookings
    private BigDecimal availableBalance; // Available for withdrawal
    private BigDecimal pendingPayouts; // Money waiting to be transferred
    private BigDecimal totalWithdrawn; // Total withdrawn to bank
    private List<PayoutHistory> payoutHistory;
    private LocalDateTime lastUpdated;

    public String getId() {
        return _id;
    }
}