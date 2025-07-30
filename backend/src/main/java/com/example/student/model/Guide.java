package com.example.student.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(collection = "guides")
public class Guide {

    @Id
    private String _id;
    private String firstName;
    private String lastName;
    private String email;
    private String pp;
    private String nicpic;
    private String nicPassport;
    private String mobileNumber;
    private String whatsappNumber;
    private String address;
    private String role;
    private String gender;
    private String password;
    private String username;
    private String dob;
    private String status;
    private boolean enterCredentials;//should enter username and pw every time login to app or not
    private String licensePic1;
    private String licensePic2;
    private String daysPerWeek;
    private String description;
    private String licenseNumber;
    private String verified;//phone verified ("done", "pending" or "rejected" by admin)
    private String identified;//identity verified ("done", "pending" or "rejected" by admin)
    private int dailyRate;//charge per day

    private String[] languages;
    private String location;
    private String images[];
    private String guideType;
    private int experience;
    private String specialization;
    private String bio;

}