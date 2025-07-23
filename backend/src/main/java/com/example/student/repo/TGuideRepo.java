package com.example.student.repo;

import com.example.student.model.TGuide;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TGuideRepo extends MongoRepository<TGuide, String> {
    // Find guides by base city (case-insensitive)
    @Query("{'base_city': {$regex: ?0, $options: 'i'}}")
    List<TGuide> findByBaseCity(String baseCity);

    // Find guides by experience years (minimum experience)
    @Query("{'experience_years': {$gte: ?0}}")
    List<TGuide> findByMinExperienceYears(Integer minExperience);

    // Find guides by language (case-insensitive)
    @Query("{'languages': {$regex: ?0, $options: 'i'}}")
    List<TGuide> findByLanguage(String language);

    // Find guides by daily rate range
    @Query("{'daily_rate': {$gte: ?0, $lte: ?1}}")
    List<TGuide> findByDailyRateRange(Double minRate, Double maxRate);

    // Find guides by area of service (case-insensitive partial match)
    @Query("{'area_of_service': {$regex: ?0, $options: 'i'}}")
    List<TGuide> findByAreaOfService(String area);

    // Safety methods with validation
    default List<TGuide> safeFindByBaseCity(String baseCity) {
        if (baseCity == null || baseCity.trim().isEmpty()) {
            throw new IllegalArgumentException("Base city cannot be null or empty");
        }
        return findByBaseCity(baseCity);
    }

    default List<TGuide> safeFindByLanguage(String language) {
        if (language == null || language.trim().isEmpty()) {
            throw new IllegalArgumentException("Language cannot be null or empty");
        }
        return findByLanguage(language);
    }

    default List<TGuide> safeFindByMinExperienceYears(Integer minExperience) {
        if (minExperience == null || minExperience < 0) {
            throw new IllegalArgumentException("Minimum experience must be a non-negative number");
        }
        return findByMinExperienceYears(minExperience);
    }
}
