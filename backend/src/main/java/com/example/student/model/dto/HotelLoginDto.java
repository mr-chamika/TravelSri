package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class HotelLoginDto {
    private String username;
    private String password;
}
