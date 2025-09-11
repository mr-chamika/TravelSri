package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Setter
@Getter
@Data
@Document(collection = "trips")
public class SolotripGetdto {

    //route selection
    private String routeId;
    private String creatorId;
    private String date;

    //hotel selection
    private String hotelId;
    private int adults;
    private int children;
    private int doubleBeds;
    private int singleBeds;
    private int hprice;

    //guide selection
    private String guideId;
    private String type;
    private String glocation;
    private String glanguage;
    private int gprice;


    //car details
    private String carId;
    private String clanguage;
    private String endLocation;
    private String startLocation;
    private String bookedTime;
    private int cprice;
    private boolean isOneway;

    public SolotripGetdto(String routeId,String creatorId,String date, String hotelId, int adults, int children, int doubleBeds, int singleBeds, int hprice, String guideId,String type, String glocation, String glanguage, int gprice, String carId, String clanguage, String endLocation, String startLocation, String bookedTime, int cprice, boolean isOneway) {
        this.routeId = routeId;
        this.creatorId = creatorId;
this.date = date;
        // Hotel fields
        this.hotelId = hotelId;
        this.adults = adults;
        this.children = children;
        this.doubleBeds = doubleBeds;
        this.singleBeds = singleBeds;
        this.hprice = hprice;

        // Guide fields
        this.guideId = guideId;
        this.type = type;
        this.glocation = glocation;
        this.glanguage = glanguage;
        this.gprice = gprice;

        // Car fields
        this.carId = carId;
        this.clanguage = clanguage;
        this.endLocation = endLocation;
        this.startLocation = startLocation;
        this.bookedTime = bookedTime;
        this.cprice = cprice;
        this.isOneway = isOneway;
    }
}
