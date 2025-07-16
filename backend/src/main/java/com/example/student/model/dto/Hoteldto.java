package com.example.student.model.dto;

import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class Hoteldto {

    private String _id;
    private String thumbnail;
    private int stars;
    private int singlePrice;
    private int doublePrice;
    private int availableSingle;
    private int availableDouble;
    private String name;

    public Hoteldto(String _id,String thumbnail,int stars,int singlePrice,int doublePrice,String name, int availableSingle,int availableDouble) {

        this._id = _id;
        this.thumbnail = thumbnail;
        this.stars = stars;
        this.singlePrice = singlePrice;
        this.availableSingle = availableSingle;
        this.doublePrice = doublePrice;
        this.availableDouble = availableDouble;
        this.name = name;

    }

}
