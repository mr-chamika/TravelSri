package com.example.student.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data // Lombok annotation to automatically generate getters, setters, toString, etc.
@Document(collection = "shopItems") // Maps this class to a MongoDB collection named "shopItems"
public class ShopItem {

    @Id // Designates this field as the primary identifier for the document
    private String id; // Using 'id' instead of '_id' for better consistency with Spring Data
    private String itemName;
    private double price;
    private int availableNumber; // For "available number"
    private String description;
    // Image fields temporarily removed

    // You can add more fields as needed (e.g., String category)

}