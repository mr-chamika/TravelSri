package com.example.student.services;

import com.example.student.model.Guide;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface IGuideService {

    // Basic CRUD operations
    Guide createGuide(Guide guide);

    Optional<Guide> getGuideById(String id);

    List<Guide> getAllGuides();

    Guide updateGuide(String id, Guide guide);

    boolean deleteGuide(String id);

    // Custom search operations
    List<Guide> getGuidesByBaseCity(String baseCity);

    List<Guide> getGuidesByLanguage(String language);

    List<Guide> getGuidesByMinExperience(Integer minExperience);

    List<Guide> getGuidesByDailyRateRange(Double minRate, Double maxRate);

    List<Guide> getGuidesByAreaOfService(String area);
}
