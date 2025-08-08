package com.example.student.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
//traveler,guide,vehicleowner,store
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(collection = "users")
public class User {

    @Id
    private String _id;
    private String firstName;
    private String lastName;
    private String email;
    private String pp;
    private String locpic;
    private String identitypic1;//sides of nic or passport
    private String identitypic2;
    private String nicPassport;//nic no or passport no
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
    private boolean enterCredentials;//should enter username and pw every time login to app or not

    //services
    private String verified;//phone verified ("done", "pending" or "rejected" by admin)
    private String identified;//identity verified ("done", "pending" or "rejected" by admin)
    private String description;
    private String[] daysPerWeek;
    private String registrationNumber;
    private String businessRegPic1;
    private String businessRegPic2;
    private Integer reviewCount;
    private Integer stars;
    private String currency;

    //store
    private String businessName;
    private String businessAddress;
    private String endTime;
    private String startTime;

    //guide
    private String[] languages;
    private String location;
    private String[] images;
    private String guideType;//travel with me or visit
    private Integer experience;
    private String specialization;
    private Integer dailyRate;//charge per day
    private String bio;//about me
    private String responseTime;
    private Integer ResponseRate;



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