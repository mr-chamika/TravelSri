package com.example.student.services;


import com.example.student.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Emailtaken {

    @Autowired
    private UserRepo userRepo;

    public boolean isEmailRegistered(String email) {
        return userRepo.findByEmail(email).isPresent();
    }
}