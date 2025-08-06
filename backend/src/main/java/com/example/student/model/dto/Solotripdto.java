package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Setter
@Getter
@Data
@Document(collection = "trips")
public class Solotripdto {
    @Id
    private String _id;
    private String thumbnail;
    private String destination;

    public Solotripdto(String _id,String thumbnail, String destination) {

        this._id = _id;
        this.thumbnail = thumbnail;
        this.destination = destination;

    }
}
