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

    @Id String _id;
    String fullName;
    String email;
        String phone;
    String address;
    String role;
    String gender;
    String password;
    String username;

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