package com.example.student.dto;

import com.example.student.model.HotelAvailability;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelAvailabilityRequest {
    private List<HotelAvailability> availability;
}
