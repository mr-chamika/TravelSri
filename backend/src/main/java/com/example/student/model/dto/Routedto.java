package com.example.student.model.dto;

import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class Routedto {

    private String _id;
    private String from;
    private String to;
    private String thumbnail;
    private String duration;

    public Routedto(String _id, String from, String to, String thumbnail,String duration) {

        this._id = _id;
        this.from = from;
        this.to = to;
        this.thumbnail = thumbnail;
        this.duration = duration;

    }

}
