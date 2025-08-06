package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import java.util.List;

@Getter
@Setter
@Data
@Document(collection = "trips")
public class SolotripViewdto {


    public SolotripViewdto(String _id,String creatorId,String routeId, String hotelId,String hotel, String hlocation, int hprice, String guideId, String glocation, int gprice,String guide, String carId, int cprice,String driver,String category,String start,String destination,String status,String startDate,String map) {

        this._id = _id;
        this.creatorId = creatorId;
        this.routeId = routeId;

        // Hotel fields
        this.hotelId = hotelId;
        this.hotel = hotel;
        this.hlocation = hlocation;
        this.hprice = hprice;

        // Guide fields
        this.guideId = guideId;
        this.glocation = glocation;
        this.gprice = gprice;
        this.guide = guide;

        // Car fields
        this.carId = carId;
        this.cprice = cprice;
        this.driver = driver;
        this.category = category;

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
    private String hotel;
    private String hlocation;
    private int hprice;

    //guide selection
    private String guideId;
    private String glocation;
    private int gprice;
    private String guide;


    //car details
    private String carId;
    private int cprice;
    private String driver;
    private String category;

    //other
    private String start;
    private String destination;
    //private List<String> images;
    private String status;//"confirmed","pending","cancel"
    private String startDate;//vehicle booked date
    private String map;


}
