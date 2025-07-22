package com.example.student.services;

import com.example.student.model.TGuide;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface IGuideService {

    // Basic CRUD operations
    TGuide createGuide(TGuide TGuide);

    Optional<TGuide> getGuideById(String id);

    List<TGuide> getAllGuides();

    TGuide updateGuide(String id, TGuide TGuide);

    boolean deleteGuide(String id);

    // Custom search operations
    List<TGuide> getGuidesByBaseCity(String baseCity);

    List<TGuide> getGuidesByLanguage(String language);

    List<TGuide> getGuidesByMinExperience(Integer minExperience);

    List<TGuide> getGuidesByDailyRateRange(Double minRate, Double maxRate);

    List<TGuide> getGuidesByAreaOfService(String area);
}
