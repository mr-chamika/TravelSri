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
@Document(collection = "platform_wallet")
public class PlatformWallet {
    @Id
    private String _id;
    private BigDecimal totalBalance; // Total money in platform account
    private BigDecimal availableBalance; // Available for platform use
    private BigDecimal pendingPayouts; // Money waiting to be paid to providers
    private BigDecimal totalCommissionsEarned; // Platform's total earnings
    private BigDecimal totalRefundsProcessed; // Total refunds given
    private List<String> recentTransactions; // Recent transaction IDs
    private LocalDateTime lastUpdated;

    public String getId() {
        return _id;
    }
}