package com.example.student.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "locations")
public class Location {

    @Id
    private String _id;
    private String[] routeId;
    private String name;
    private String description;
    private String image;

}
