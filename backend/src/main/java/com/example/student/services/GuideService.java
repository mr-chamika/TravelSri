package com.example.student.services;

import com.example.student.model.Guide;
import com.example.student.repo.GuideRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GuideService implements IGuideService{
    @Autowired
    private GuideRepo guideRepo;

    @Override
    public Guide createGuide(Guide guide) {
        if (guide == null) {
            throw new IllegalArgumentException("Guide cannot be null");
        }
        // Additional validation
        if (guide.getName() == null || guide.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Guide name is required");
        }
        if (guide.getContactNumber() == null || guide.getContactNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Contact number is required");
        }
        if (guide.getBaseCity() == null || guide.getBaseCity().trim().isEmpty()) {
            throw new IllegalArgumentException("Base city is required");
        }
        return guideRepo.save(guide);
    }

    @Override
    public Optional<Guide> getGuideById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        return guideRepo.findById(id);
    }

    @Override
    public List<Guide> getAllGuides() {
        return guideRepo.findAll();
    }

    @Override
    public Guide updateGuide(String id, Guide guide) {
        if (guide == null) {
            throw new IllegalArgumentException("Guide cannot be null");
        }
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }

        Optional<Guide> existingGuide = guideRepo.findById(id);
        if (existingGuide.isPresent()) {
            Guide guideToUpdate = existingGuide.get();

            // Update all fields
            guideToUpdate.setName(guide.getName());
            guideToUpdate.setLanguages(guide.getLanguages());
            guideToUpdate.setExperienceYears(guide.getExperienceYears());
            guideToUpdate.setContactNumber(guide.getContactNumber());
            guideToUpdate.setEmail(guide.getEmail());
            guideToUpdate.setBaseCity(guide.getBaseCity());
            guideToUpdate.setAreaOfService(guide.getAreaOfService());
            guideToUpdate.setDailyRate(guide.getDailyRate());

            return guideRepo.save(guideToUpdate);
        }
        throw new RuntimeException("Guide not found with id: " + id);
    }

    @Override
    public boolean deleteGuide(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        if (guideRepo.existsById(id)) {
            guideRepo.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Guide> getGuidesByBaseCity(String baseCity) {
        return guideRepo.safeFindByBaseCity(baseCity);
    }

    @Override
    public List<Guide> getGuidesByLanguage(String language) {
        return guideRepo.safeFindByLanguage(language);
    }

    @Override
    public List<Guide> getGuidesByMinExperience(Integer minExperience) {
        return guideRepo.safeFindByMinExperienceYears(minExperience);
    }

    @Override
    public List<Guide> getGuidesByDailyRateRange(Double minRate, Double maxRate) {
        if (minRate == null || minRate < 0) {
            throw new IllegalArgumentException("Minimum rate must be a non-negative number");
        }
        if (maxRate == null || maxRate < 0) {
            throw new IllegalArgumentException("Maximum rate must be a non-negative number");
        }
        if (minRate > maxRate) {
            throw new IllegalArgumentException("Minimum rate cannot be greater than maximum rate");
        }
        return guideRepo.findByDailyRateRange(minRate, maxRate);
    }

    @Override
    public List<Guide> getGuidesByAreaOfService(String area) {
        if (area == null || area.trim().isEmpty()) {
            throw new IllegalArgumentException("Area of service cannot be null or empty");
        }
        return guideRepo.findByAreaOfService(area);
    }

}
