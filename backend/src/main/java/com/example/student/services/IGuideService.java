package com.example.student.services;

import com.example.student.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface IGuideService {

    User createGuide(User TGuide);

    // Basic CRUD operations

    Optional<User> getGuideById(String id);

    List<User> getAllGuides();

    User updateGuide(String id, User TGuide);

    boolean deleteGuide(String id);

    // Custom search operations
    List<User> getGuidesByBaseCity(String baseCity);

    List<User> getGuidesByLanguage(String language);

    List<User> getGuidesByMinExperience(Integer minExperience);

    List<User> getGuidesByDailyRateRange(Double minRate, Double maxRate);

    List<User> getGuidesByAreaOfService(String area);
}
