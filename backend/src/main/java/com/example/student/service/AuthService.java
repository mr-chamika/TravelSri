package com.example.student.service;

import com.example.student.model.User;
import com.example.student.repo.UserRepository;
import com.example.student.dto.LoginRequest;
import com.example.student.dto.SignUpRequest;
import com.example.student.dto.AuthResponse;
import com.example.student.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmailAndIsActive(
                loginRequest.getEmail(), true);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (encoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String jwt = jwtUtils.generateJwtToken(user.getEmail());

                AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getPhone()
                );

                return new AuthResponse("Success", jwt, userInfo);
            }
        }
        return null;
    }

    public AuthResponse registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already taken!");
        }

        // Create new user account
        User user = new User(signUpRequest.getName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getRole());

        user.setPhone(signUpRequest.getPhone());
        user.setAddress(signUpRequest.getAddress());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        String jwt = jwtUtils.generateJwtToken(user.getEmail());

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone()
        );

        return new AuthResponse("Success", jwt, userInfo);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}