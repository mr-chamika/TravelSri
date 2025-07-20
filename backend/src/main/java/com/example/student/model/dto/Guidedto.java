package com.example.student.model.dto;

import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class Guidedto {

    private String _id;
    private String pp;
    private String username;
    private int stars;
    private int price;
    private String verified;
    private String identified;

    public Guidedto(String _id,String pp,int stars,int price,String username,String verified, String identified) {

        this._id = _id;
        this.pp = pp;
        this.stars = stars;
        this.price = price;
        this.username = username;
        this.verified = verified;
        this.identified = identified;

    }

}
