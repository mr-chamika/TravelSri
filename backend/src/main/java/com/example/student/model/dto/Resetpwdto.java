package com.example.student.model.dto;

import lombok.Data;

@Data
public class Resetpwdto {

    private String password;
    private String email;

    Resetpwdto(String email,String password) {

        this.password = password;
        this.email = email;

    }

}
