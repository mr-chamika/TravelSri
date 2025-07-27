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
    private String fullName;
    private String email;
    private String pp;
    private String locpic;
    private String nicpic;
    private String nicPassport;
    private String mobileNumber;
    private String whatsappNumber;
    private String address;
    //private String role;
    private String gender;
    private String password;
    private String username;
    private String dob;
    private String Country;
    private String status;
    //private boolean isDarkMode;theme
   // private boolean isVisible;//account visible for other users or not
    //private boolean enterCredentials;//should enter username and pw every time login to app or not
    private boolean agreeTerms;
    private String cancellationPolicyPic;
    private String businessRegPic;
    //private String endTime;
    //private String startTime;
    private String daysPerWeek;
    private String businessAddress;
    private String description;
    //private String businessType;
    private String registrationNumber;
    //private String businessName;
    private String verified;//phone verified ("done", "pending" or "rejected" by admin)
    private String identified;//identity verified ("done", "pending" or "rejected" by admin)
    private int price;//charge per day
    private int stars;

    private String[] languages;
    private String location;
    private String images[];
    //guidetype
    //xp
    //specializatio(historical)
    //about me
    //daily rate

}