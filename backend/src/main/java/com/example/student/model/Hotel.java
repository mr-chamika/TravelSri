package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Setter
@Getter
@Data
@Document(collection = "hotels")
public class Hotel{

    @Id
    private String _id;
    private String thumbnail;
    private int stars;//no of stars the hotel got
    private int ratings;//stars users give
    private int reviewCount;//reviewer can both post a review and give star rating when review

    //ratings = (stars/reviewCount)*(10/5) 5 is no of stars we offer

    private int singlePrice;
    private int doublePrice;
    private String name;
    private String[] images;
    private String[] unavailable;//unavailable days in a week
    private String location;
    private String distance;//distance from given above location
    private int availableSingle;//free single bed room slots
    private int availableDouble;//free double bed room slots
    private int maxSingle;//maximum single bed rooms
    private int maxDouble;//maximum double bed rooms
    private  String description;

    private String taxes;
    private String priceDescription;//priceDescription: '1 Night',
    private String[] freeFeatures;//freeFeatures: ["Free cancellation", "No prepayment needed"]
    private String[] policies;
}
