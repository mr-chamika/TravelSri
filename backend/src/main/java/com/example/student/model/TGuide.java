package com.example.student.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "tguides")
public class TGuide {
    @Id
    private String id;

    @Field("name")
    private String name;

    @Field("languages")
    private List<String> languages;

    @Field("experience_years")
    private Integer experienceYears;

    @Field("contact_number")
    private String contactNumber;

    @Field("email")
    private String email;

    @Field("base_city")
    private String baseCity;

    @Field("area_of_service")
    private String areaOfService;

    @Field("daily_rate")
    private Double dailyRate;
}
