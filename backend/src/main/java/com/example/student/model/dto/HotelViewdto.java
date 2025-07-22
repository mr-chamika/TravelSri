package com.example.student.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Setter
@Getter
public class HotelViewdto {

    private String _id;
    private List<String> images;
    private int stars;
    private int price;
    private String name;
    private String location;
    private String description;

    public HotelViewdto(String _id, List<String> images, int stars, String name,String location,String description,int price) {

        this._id = _id;
        this.images = images;
        this.stars = stars;
        this.price= price;
        this.name = name;
        this.location = location;
        this.description = description;

    }

}
