package com.example.student;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.example.student")
public class StudentApplication {

	public static void main(String[] args) {

		// Load the .env file before starting Spring
		Dotenv dotenv = Dotenv.load();

		// Set each variable from .env as a system property
		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});

		SpringApplication.run(StudentApplication.class, args);
		System.out.println("Application running ......");

	}

}
