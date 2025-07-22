package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Getter
@Setter
@Document(collection = "categories")
public class Category {

    @Id
    private String _id;
    private String image;
    private int members;
    private String title;
    private int price;

}
