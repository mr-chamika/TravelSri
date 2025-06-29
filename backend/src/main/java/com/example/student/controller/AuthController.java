package com.example.student.controller;

import com.example.student.model.User;
import com.example.student.repo.UserRepository;
import com.example.student.dto.LoginRequest;
import com.example.student.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody User user) {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            return new AuthResponse("Email already exists", null);
        }
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return new AuthResponse("Signup successful", null);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        Optional<User> found = userRepository.findByEmail(loginRequest.getEmail());
        if (found.isPresent() && encoder.matches(loginRequest.getPassword(), found.get().getPassword())) {
            // You can generate a JWT token here if needed
            return new AuthResponse("Login successful", null);
        }
        return new AuthResponse("Invalid credentials", null);
    }
}