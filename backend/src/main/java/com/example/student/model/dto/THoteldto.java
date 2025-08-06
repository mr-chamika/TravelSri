package com.example.student.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Setter
@Getter
public class THoteldto {

    private String _id;
    private String name;
    private String location;
    private String distance;
    private int ratings;
    private int reviewCount;
    private String thumbnail;
    int originalPrice;
    int currentPrice;
    String taxes;
    String priceDescription;
    String specialOffer;//if available
    List<String> freeFeatures;

    public THoteldto(
            String _id,
            String name,
            String location,
            String distance,
            int ratings,
            int reviewCount,
            String thumbnail,
            int originalPrice,
            int currentPrice,
            String taxes,
            String priceDescription,
            String specialOffer,//if available
            List<String> freeFeatures

    ) {

        this._id = _id;
        this.name = name;
        this.location = location;
        this.distance = distance;
        this.ratings = ratings;
        this.reviewCount = reviewCount;
        this.thumbnail = thumbnail;
        this.originalPrice = originalPrice;
        this.currentPrice = currentPrice;
        this.taxes = taxes;
        this.priceDescription = priceDescription;
        this.specialOffer = specialOffer;
        this.freeFeatures = freeFeatures;

    }

}
