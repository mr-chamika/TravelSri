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
@Document(collection = "money_flows")
public class MoneyFlow {
    @Id
    private String _id;
    private String bookingId;
    private String fromEntity; // "TRAVELER", "PLATFORM", "PROVIDER"
    private String toEntity; // "TRAVELER", "PLATFORM", "PROVIDER"
    private String fromEntityId; // Specific ID
    private String toEntityId; // Specific ID
    private BigDecimal amount;
    private String flowType; // "PAYMENT", "REFUND", "CONFIRMATION_FEE", "FINAL_PAYOUT", "COMMISSION"
    private String description;
    private String status; // "COMPLETED", "PENDING", "FAILED"
    private String transactionReference; // PayHere or bank reference
    private LocalDateTime createdAt;

    public String getId() {
        return _id;
    }
}
