package com.example.student.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(collection = "users")
public class Traveler {

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
    private String role;
    private String gender;
    private String password;
    private String username;
    private String dob;
    private String Country;
    private String status;
    private boolean isDarkMode;//theme
    private boolean isVisible;//account visible for other users or not
    private boolean enterCredentials;//should enter username and pw every time login to app or not
    private boolean agreeTerms;
    private Boolean confirmCondition;
    private String cancellationPolicyPic;
    private String businessRegPic;
    private String endTime;
    private String startTime;
    private String daysPerWeek;
    private String businessAddress;
    private String description;
    private String businessType;
    private String registrationNumber;
    private String businessName;




    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {return username;}

    public String getId(){
        return _id;
    }

}