package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Data
@Document(collection="hotels")
public class THoteldto {

    private String _id;
    private String name;
    private String location;
    private String distance;
    private int ratings;
    private int reviewCount;
    private String thumbnail;
    private int originalPrice;
    private int currentPrice;
    private String taxes;
    private String priceDescription;
    private String specialOffer;//if available
    private List<String> freeFeatures;
    private String mobileNumber;

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
            List<String> freeFeatures,
            String mobileNumber

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
        this.mobileNumber = mobileNumber;

    }

}
