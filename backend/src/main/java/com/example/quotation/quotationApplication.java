package com.example.quotation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class quotationApplication {

    public static void main(String[] args) {
        SpringApplication.run(quotationApplication.class, args);
    }
}