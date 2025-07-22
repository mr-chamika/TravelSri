package com.example.student.services;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class Hashingpw {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults()) // Apply the global CORS configuration
                .csrf(csrf -> csrf.disable()) // Disable CSRF, common for stateless APIs
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/user/signup",
                                "/user/login",
                                "/user/check-email",
                                "/user/profile",
                                "/user/reset-password",
                                "/traveler/routes-allshow",
                                "/traveler/routes-one",
                                "/traveler/hotels-all",
                                "/traveler/hotels-view",
                                "/traveler/reviews-view",
                                "/traveler/facis-view",
                                "/traveler/guides-all",
                                "/traveler/guides-view",
                                "/traveler/guides-reviews",
                                "/guide/groupTours",
                                "/guide/submitQuotation/**", // Fixed: Allow all submitQuotation endpoints
                                "/guide/submittedQuotation/**", // Fixed: Allow all submittedQuotation endpoints
                                "/vehicle/addVehicle",
                                "/vehicle/all",
                                "/vehicle/edit",
                                "vehicle/groupTours",
                                "vehicle/submittedQuotation/{ownerId}",
                                "vehicle/submitQuotation/{tourId}"
                        ).permitAll()
                        .anyRequest().authenticated() // Secure all other endpoints
                )
                .httpBasic(withDefaults()); // Use Basic Auth for the secured endpoints

        return http.build();
    }
}