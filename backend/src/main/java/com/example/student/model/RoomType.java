package com.example.student.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "roomTypes")
public class RoomType {

    @Id
    private String _id;
    private String name;
    private int pricePerRoom;
    private int capacity;

}
