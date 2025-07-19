package com.example.student.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "routes")
public class Route {

    @Id
    private String _id;
    private String from;
    private String to;
    private String duration;
    private String thumbnail;

}
