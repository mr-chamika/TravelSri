package com.example.student.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "HotelRoomInventory")
public class HotelRoomInventory {
    @Id
    private String id;
    private String number;
    private String type;
    private String status;
    private double price;
    private int capacity;
    private String description;
    private List<String> amenities;
}
