package com.example.student.services;

import com.example.student.model.User;
import com.example.student.repo.GuideRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

@Service
public class GuideService implements IGuideService{
    @Autowired
    private GuideRepo GuideRepo;

    // Add this line to inject MongoTemplate
    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public User createGuide(User TGuide) {
        if (TGuide == null) {
            throw new IllegalArgumentException("Guide cannot be null");
        }
        // Additional validation
        if (TGuide.getFirstName() == null && TGuide.getLastName() == null || TGuide.getFirstName().trim().isEmpty() && TGuide.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Guide name is required");
        }
        if (TGuide.getMobileNumber() == null || TGuide.getMobileNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Contact number is required");
        }
        if (TGuide.getLocation() == null || TGuide.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Base city is required");
        }
        return GuideRepo.save(TGuide);
    }


    @Override
    public Optional<User> getGuideById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        return GuideRepo.findById(id);
    }

    @Override
    public List<User> getAllGuides() {
        return GuideRepo.findAll();
    }

    @Override
    public User updateGuide(String id, User TGuide) {
        if (TGuide == null) {
            throw new IllegalArgumentException("Guide cannot be null");
        }
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }

        Optional<User> existingGuide = GuideRepo.findById(id);
        if (existingGuide.isPresent()) {
            User TGuideToUpdate = existingGuide.get();

            // Update all fields
            TGuideToUpdate.setFirstName(TGuide.getFirstName());
            TGuideToUpdate.setLastName(TGuide.getLastName());
            TGuideToUpdate.setLanguages(TGuide.getLanguages());
            TGuideToUpdate.setExperience(TGuide.getExperience());
            TGuideToUpdate.setMobileNumber(TGuide.getMobileNumber());
            TGuideToUpdate.setEmail(TGuide.getEmail());
            TGuideToUpdate.setLocation(TGuide.getLocation());
            TGuideToUpdate.setDailyRate(TGuide.getDailyRate());

            return GuideRepo.save(TGuideToUpdate);
        }
        throw new RuntimeException("Guide not found with id: " + id);
    }

    @Override
    public boolean deleteGuide(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        if (GuideRepo.existsById(id)) {
            GuideRepo.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<User> getGuidesByBaseCity(String baseCity) {
        return GuideRepo.safeFindByBaseCity(baseCity);
    }

    @Override
    public List<User> getGuidesByLanguage(String language) {
        return GuideRepo.safeFindByLanguage(language);
    }

    @Override
    public List<User> getGuidesByMinExperience(Integer minExperience) {
        return GuideRepo.safeFindByMinExperienceYears(minExperience);
    }

    @Override
    public List<User> getGuidesByDailyRateRange(Double minRate, Double maxRate) {
        if (minRate == null || minRate < 0) {
            throw new IllegalArgumentException("Minimum rate must be a non-negative number");
        }
        if (maxRate == null || maxRate < 0) {
            throw new IllegalArgumentException("Maximum rate must be a non-negative number");
        }
        if (minRate > maxRate) {
            throw new IllegalArgumentException("Minimum rate cannot be greater than maximum rate");
        }
        return GuideRepo.findByDailyRateRange(minRate, maxRate);
    }

    @Override
    public List<User> getGuidesByAreaOfService(String area) {
        if (area == null || area.trim().isEmpty()) {
            throw new IllegalArgumentException("Area of service cannot be null or empty");
        }
        return GuideRepo.findByAreaOfService(area);
    }

    @Override
    public List<User> searchGuides(String location, String language, String guideType,
                                   String verified, Integer minExperience, Double maxDailyRate, Double minRating) {

        // Build dynamic query using MongoDB Query and Criteria
        Query query = new Query();

        // Filter by location (case-insensitive partial match)
        if (location != null && !location.trim().isEmpty()) {
            query.addCriteria(Criteria.where("location").regex(location, "i"));
        }

        // Filter by language (check if language is in the languages array)
        if (language != null && !language.trim().isEmpty()) {
            query.addCriteria(Criteria.where("languages").in(language));
        }

        // Filter by guide type
        if (guideType != null && !guideType.trim().isEmpty()) {
            query.addCriteria(Criteria.where("guideType").is(guideType));
        }

        // Filter by verification status
        if (verified != null && !verified.trim().isEmpty()) {
            query.addCriteria(Criteria.where("verified").is(verified));
        }

        // Filter by minimum experience
        if (minExperience != null) {
            query.addCriteria(Criteria.where("experience").gte(minExperience));
        }

        // Filter by maximum daily rate
        if (maxDailyRate != null) {
            query.addCriteria(Criteria.where("dailyRate").lte(maxDailyRate));
        }

        // Filter by minimum rating
        if (minRating != null) {
            query.addCriteria(Criteria.where("stars").gte(minRating));
        }

        // Add sorting by rating (highest first) and then by experience
        query.with(Sort.by(Sort.Direction.DESC, "stars", "experience"));

        // Execute query
        return mongoTemplate.find(query, User.class);
    }
}