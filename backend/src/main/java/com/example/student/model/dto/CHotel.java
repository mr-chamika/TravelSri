package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Setter
@Getter
@Data
@Document(collection = "hotels")
public class CHotel {

    @Id
    private String _id;
    private String thumbnail;
    private int stars;
    private int price;
    private int singlePrice;
    private int doublePrice;
    private String name;
    private String[] images;
    private String[] unavailable;//unavailable days in a week
    private String location;
    private int availableSingle;
    private int availableDouble;
    private  String description;

}
