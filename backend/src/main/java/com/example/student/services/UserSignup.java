package com.example.student.services;

import com.example.student.model.User;
import com.example.student.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserSignup {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerNewUser(User user) {

        Optional<User> x = userRepo.findByEmail(user.getEmail());

        if (x.isPresent()) {

            return null;

        }
            String plainPassword = user.getPassword();

            String hashedPassword = passwordEncoder.encode(plainPassword);

            user.setPassword(hashedPassword);

            return userRepo.save(user);

    }
}