package com.example.student.services;

import com.example.student.repo.HotelsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HotelEmailService {

    @Autowired
    private HotelsRepo hotelsRepo;

    /**
     * Check if email is already registered for hotels
     */
    public boolean isEmailRegistered(String email) {
        return hotelsRepo.findByEmail(email).isPresent();
    }

    /**
     * Check if username is already registered for hotels
     */
    public boolean isUsernameRegistered(String username) {
        return hotelsRepo.findByUsername(username).isPresent();
    }
}
