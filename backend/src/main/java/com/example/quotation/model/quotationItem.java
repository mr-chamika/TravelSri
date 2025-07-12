package com.example.quotation.model;

import org.springframework.data.mongodb.core.mapping.Field;

public class quotationItem {

    @Field("item_name")
    private String itemName;

    @Field("description")
    private String description;

    @Field("quantity")
    private Integer quantity;

    @Field("unit_price")
    private Double unitPrice;

    @Field("total_price")
    private Double totalPrice;

    // Constructors
    public quotationItem() {
    }

    public quotationItem(String itemName, String description, Integer quantity, Double unitPrice) {
        this.itemName = itemName;
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = quantity * unitPrice;
    }

    // Getters and Setters
    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        if (this.unitPrice != null) {
            this.totalPrice = quantity * this.unitPrice;
        }
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
        if (this.quantity != null) {
            this.totalPrice = this.quantity * unitPrice;
        }
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
}