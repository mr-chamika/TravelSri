package com.example.student.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.and())
            .authorizeHttpRequests(authz -> authz
                    .requestMatchers("/auth/**", "/shopitems/all", "/shopitems/view", "/shopitems/search", "/shopitems/add", "/shopitems/update", "/shopitems/delete").permitAll()
                    .anyRequest().authenticated()
            );

        return http.build();
    }
}