package com.example.student.model.dto;

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
public class Vehicledto {

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
    private String vehicleNumber;


    public Vehicledto(String _id, String catId, String image, String verified, String name, String identified, int driverAge, List<String> images, String location, String phone, String vehicleNumber) {
        this._id = _id;
        this.catId = catId;
        this.image = image;
        this.verified = verified;
        this.name = name;
        this.identified = identified;
        this.driverAge = driverAge;
        this.images = images;
        this.location = location;
        this.phone = phone;
        this.vehicleNumber = vehicleNumber;
    }

}
