package com.example.student.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(collection = "money_flows")
public class MoneyFlow {

    @Id
    @Field("fromEntityId")
    private String fromEntityId;
    private String toEntityId; // Specific ID
    private String flowType; // "PAYMENT", "REFUND", "CONFIRMATION_FEE", "FINAL_PAYOUT", "COMMISSION"
    private String description;
    private String status; // "COMPLETED", "PENDING", "FAILED"
    private String transactionReference; // PayHere or bank reference



    //here the things want money devide function
    private String bookingId;
    private String fromEntity; // "TRAVELER", "PLATFORM", "PROVIDER"
    private String toEntity; // "TRAVELER", "PLATFORM", "PROVIDER"
    private BigDecimal amount;
    private BigDecimal comission; //system comission
    private BigDecimal providerAmount;
    private LocalDateTime createdAt;

//    public String getId() {
//        return _id;
//    }
}
