package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "hotels")
public class HotelViewdto {

    private String _id;
    private List<String> images;
    private int stars;
    private int ratings;//stars users give
    private int reviewCount;//reviewer can both post a review and give star rating when review
    private int price;
    private String name;
    private String location;
    private String description;
    private List<String> policies;
    private List<String> roomTypes;
    private List<String> facilities;
    private int availableSingle;//free single bed room slots
    private int availableDouble;//free double bed room slots
    private String mobileNumber;

    public HotelViewdto(String _id, List<String> images, int stars, int ratings,int reviewCount,int price, String name,String location,String description,List<String> policies,List<String> roomTypes,List<String> facilities,int availableSingle,int availableDouble,String mobileNumber ) {

        this._id = _id;
        this.images = images;
        this.stars = stars;
        this.ratings = ratings;
        this.reviewCount = reviewCount;
        this.price= price;
        this.name = name;
        this.location = location;
        this.description = description;
        this.policies = policies;
        this.roomTypes = roomTypes;
        this.facilities = facilities;
        this.availableSingle = availableSingle;
        this.availableDouble = availableDouble;
        this.mobileNumber = mobileNumber;

    }

}
