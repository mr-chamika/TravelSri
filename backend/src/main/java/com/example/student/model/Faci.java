package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Setter
@Getter
@Data
@Document(collection = "hotelFacilities")
public class Faci{

    @Id
    private String _id;
    private String title;
    private String image;

}
