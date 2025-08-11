package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class HotelPasswordResetDto {
    private String email;
    private String password;
}
