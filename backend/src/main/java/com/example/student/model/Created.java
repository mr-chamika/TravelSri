package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Data
@Document(collection = "created")
public class Created {


    public Created(String creatorId) {

        this.creatorId = creatorId;

    }

    @Id
    private String _id;
    private String creatorId;



}
