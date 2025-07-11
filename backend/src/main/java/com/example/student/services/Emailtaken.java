package com.example.student.services;


import com.example.student.repo.TravelerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Emailtaken {

    @Autowired
    private TravelerRepo travelerRepo;

    public boolean isEmailRegistered(String email) {
        return travelerRepo.findByEmail(email).isPresent();
    }
}