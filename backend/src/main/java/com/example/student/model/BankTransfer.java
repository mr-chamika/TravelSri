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
@Document(collection = "bank_transfers")
public class BankTransfer {
    @Id
    private String _id;
    private String bookingId;
    private String providerId;
    private String providerBankAccountId;
    private BigDecimal amount;
    private String transferType; // "CONFIRMATION_FEE", "FINAL_PAYOUT"
    private String bankTransferReference; // Bank's transaction ID
    private String status; // "PENDING", "SUCCESS", "FAILED", "CANCELLED"
    private String failureReason;
    private LocalDateTime initiatedAt;
    private LocalDateTime completedAt;
    private String bankApiResponse; // Full bank API response

    public String getId() {
        return _id;
    }
}