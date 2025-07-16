package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Data
@Document(collection = "stores")
public class Store {

    @Id
    private String _id;
    private String name;
    private String location;
    private String phone;
    private int stars;
    private String image;

}
