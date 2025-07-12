package com.example.student.services;


import com.example.student.repo.TravelSriRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Emailtaken {

    @Autowired
    private TravelSriRepo travelSriRepo;

    public boolean isEmailRegistered(String email) {
        return travelSriRepo.findByEmail(email).isPresent();
    }
}