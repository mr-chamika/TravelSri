package com.example.student.config;

import com.example.student.model.HotelRoomInventory;
import com.example.student.repo.HotelRoomInventoryRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Configuration
public class DataInitializer {

    @Autowired
    private HotelRoomInventoryRepo roomRepo;

    @Bean
    CommandLineRunner initHotelRoomData() {
        return args -> {
            // Data initialization is no longer needed since we're using the UI to add rooms
            // The database will be populated through the application's user interface
            System.out.println("Hotel room inventory data initialization skipped - use UI to add rooms");
        };
    }
}
