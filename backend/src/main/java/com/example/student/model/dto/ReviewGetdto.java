package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Setter
@Getter
@Data
@Document(collection = "reviews")
public class ReviewGetdto {

    @Id
    private String _id;
    private String serviceId;
    private String text;
    private String authorId;
    private int stars;

}
