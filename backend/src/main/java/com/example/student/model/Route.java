package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Data
@Document(collection = "routes")
public class Route {

    @Id
    private String _id;
    private String from;
    private String to;
    private String duration;
    private String thumbnail;
    private String date;
    private  int current;
    private  int max;
    private  int price;
    private String stats;
    private String mapRoute;

}
