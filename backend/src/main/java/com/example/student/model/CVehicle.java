package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Getter
@Setter
@Document(collection = "vehicles")
public class CVehicle {

    @Id
    private String _id;
    private String catId;
    private String image;
    private String verified;
    private String name;
    private String identified;
    private int driverAge;
    private List<String> images;
    private String location;
    private String phone;
    private int price;
    private int stars;
    private String vehicleNumber;



}
