package com.example.student.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "travelers")
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

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getId(){
        return _id;
    }

}