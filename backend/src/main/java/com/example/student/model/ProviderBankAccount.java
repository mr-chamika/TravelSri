package com.example.student.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(collection = "provider_bank_accounts")
public class ProviderBankAccount {
    @Id
    private String _id;
    private String providerId;
    private String bankName; // "Sampath Bank", "HNB", "Commercial Bank"
    private String branchName;
    private String branchCode;
    private String accountNumber;
    private String accountHolderName;
    private String accountType; // "SAVINGS", "CURRENT"
    private boolean verified; // KYC verification status
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime verifiedAt;

    public String getId() {
        return _id;
    }
}