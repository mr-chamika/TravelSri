package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "categories")
public class Categorydto {

    @Id
    private String _id;
    private String title;


    public Categorydto(String _id, String title) {
        this._id = _id;
        this.title = title;
    }

}
