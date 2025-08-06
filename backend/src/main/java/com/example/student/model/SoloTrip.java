package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.List;

@Getter
@Setter
@Data
@Document(collection = "trips")
public class SoloTrip {


    public SoloTrip(String routeId,String creatorId, String hotelId, int adults, int children, int nights, int doubleBeds, int singleBeds, List<String> hdatesBooked, String hlocation, int hprice, String guideId, List<String> gdatesBooked, String glocation, String glanguage, int gprice, String carId, List<String> cdatesBooked, String clanguage, String endLocation, String startLocation, String bookedTime, int cprice,String thumbnail,String start,String destination,String status,String startDate,String map) {
        this.creatorId = creatorId;
        this.routeId = routeId;

        // Hotel fields
        this.hotelId = hotelId;
        this.adults = adults;
        this.children = children;
        this.nights = nights;
        this.doubleBeds = doubleBeds;
        this.singleBeds = singleBeds;
        this.hdatesBooked = hdatesBooked;
        this.hlocation = hlocation;
        this.hprice = hprice;

        // Guide fields
        this.guideId = guideId;
        this.gdatesBooked = gdatesBooked;
        this.glocation = glocation;
        this.glanguage = glanguage;
        this.gprice = gprice;

        // Car fields
        this.carId = carId;
        this.cdatesBooked = cdatesBooked;
        this.clanguage = clanguage;
        this.endLocation = endLocation;
        this.startLocation = startLocation;
        this.bookedTime = bookedTime;
        this.cprice = cprice;

        this.thumbnail = thumbnail;
        this.start = start;
        this.destination = destination;
        this.status = status;
        this.startDate = startDate;
        this.map = map;

    }

    @Id
    private String _id;
    private String creatorId;
    //route selection
    private String routeId;

    //hotel selection
    private String hotelId;
    private int adults;
    private int children;
    private int nights;
    private int doubleBeds;
    private int singleBeds;
    private List<String> hdatesBooked;
    private String hlocation;
    private int hprice;

    //guide selection
    private String guideId;
    private List<String> gdatesBooked;
    private String glocation;
    private String glanguage;
    private int gprice;


    //car details
    private String carId;
    private List<String> cdatesBooked;
    private String clanguage;
    private String endLocation;
    private String startLocation;
    private String bookedTime;
    private int cprice;

    //other
    private String thumbnail;
    private String start;
    private String destination;
    //private List<String> images;
    private String status;//"confirmed","pending","cancel"
    private String startDate;//vehicle booked date
    private String map;


}
