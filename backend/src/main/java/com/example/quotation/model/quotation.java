package com.example.quotation.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "quotations")
public class quotation {

    @Id
    private String id;

    @Field("quotation_number")
    private String quotationNumber;

    @Field("customer_name")
    private String customerName;

    @Field("customer_email")
    private String customerEmail;

    @Field("customer_phone")
    private String customerPhone;

    @Field("quotation_date")
    private LocalDateTime quotationDate;

    @Field("valid_until")
    private LocalDateTime validUntil;

    @Field("items")
    private List<quotationItem> items;

    @Field("total_amount")
    private Double totalAmount;

    @Field("status")
    private String status; // DRAFT, SENT, ACCEPTED, REJECTED

    @Field("notes")
    private String notes;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public quotation() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public quotation(String quotationNumber, String customerName, String customerEmail) {
        this();
        this.quotationNumber = quotationNumber;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.quotationDate = LocalDateTime.now();
        this.status = "DRAFT";
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuotationNumber() {
        return quotationNumber;
    }

    public void setQuotationNumber(String quotationNumber) {
        this.quotationNumber = quotationNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public LocalDateTime getQuotationDate() {
        return quotationDate;
    }

    public void setQuotationDate(LocalDateTime quotationDate) {
        this.quotationDate = quotationDate;
    }

    public LocalDateTime getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDateTime validUntil) {
        this.validUntil = validUntil;
    }

    public List<quotationItem> getItems() {
        return items;
    }

    public void setItems(List<quotationItem> items) {
        this.items = items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}