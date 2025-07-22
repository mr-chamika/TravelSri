package com.example.student.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Setter
@Getter
public class GuideViewdto {

    private String _id;
    private String pp;
    private int stars;
    private String username;
    private int price;
    private String verified;
    private String identified;
    private List<String> languages;
    private String location;
    private List<String> images;
    private String description;




    public GuideViewdto(String _id, String pp, int stars, int price, String username, String verified, String identified,List<String> languages,String location,List<String> images, String description) {

        this._id = _id;
        this.pp = pp;
        this.stars = stars;
        this.price = price;
        this.username = username;
        this.verified = verified;
        this.identified = identified;
        this.languages = languages;
        this.location = location;
        this.images = images;
        this.description = description;

    }

}
