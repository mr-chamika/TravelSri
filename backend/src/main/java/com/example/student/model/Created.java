package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Data
@Document(collection = "created")
public class Created {


    public Created(String creatorId,int adults,int children) {

        this.creatorId = creatorId;
        this.adults = adults;
        this.children = children;


    }

    @Id
    private String _id;
    private String creatorId;
    private List<String> dates = new ArrayList<>();
    private int adults;
    private int children;

}
