package com.example.student.services;

import com.example.student.model.Traveler;
import com.example.student.repo.TravelSriRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class TravelerSignup {

    @Autowired
    private TravelSriRepo travelSriRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Traveler registerNewUser(Traveler traveler) {

        String plainPassword = traveler.getPassword();

        String hashedPassword = passwordEncoder.encode(plainPassword);

        traveler.setPassword(hashedPassword);

        return travelSriRepo.save(traveler);
    }
}