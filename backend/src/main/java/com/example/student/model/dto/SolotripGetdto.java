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
    private int dayNumber;
    private String createdId;

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

    }
