package com.example.student.services;

import com.example.student.model.Traveler;
import com.example.student.repo.TravelerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class TravelerSignup {

    @Autowired
    private TravelerRepo travelerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Traveler registerNewUser(Traveler traveler) {

        String plainPassword = traveler.getPassword();

        String hashedPassword = passwordEncoder.encode(plainPassword);

        traveler.setPassword(hashedPassword);

        return travelerRepo.save(traveler);
    }
}