package com.example.student.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "shopItems")
public class ShopItem {

    @Id
    private String id;
    private String itemName;
    private double price;
    private int availableNumber;
    private String description;
    private String imageUrl; // Add this field to save the image URL to the database
}