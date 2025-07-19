package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Data
@Document(collection = "items")
public class Item {

    @Id
    private String _id;
    private String shopId;
    private String name;
    private int price;
    private String contact;
    private int buyCount;
    private String image;

}
