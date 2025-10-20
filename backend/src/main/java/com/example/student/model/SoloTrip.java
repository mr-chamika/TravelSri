package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Data
@Document(collection = "trips")
public class SoloTrip {


    public SoloTrip(String serviceId,String date,String createdId,int dayNumber,String type,String status) {

        this.serviceId = serviceId;
        this.date = date;
        this.createdId = createdId;
        this.dayNumber=dayNumber;
        this.type = type;
        this.status = status;

    }

    @Id
    private String _id;
    private String serviceId;
    private String date;
    private String type;
    private int dayNumber;
    private String createdId;
    private String status;
    private Map<String, Object> bookingData = new HashMap<>();

}
