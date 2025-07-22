package com.example.student.services;

import com.example.student.model.TGuide;
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
    public TGuide createGuide(TGuide TGuide) {
        if (TGuide == null) {
            throw new IllegalArgumentException("Guide cannot be null");
        }
        // Additional validation
        if (TGuide.getName() == null || TGuide.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Guide name is required");
        }
        if (TGuide.getContactNumber() == null || TGuide.getContactNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Contact number is required");
        }
        if (TGuide.getBaseCity() == null || TGuide.getBaseCity().trim().isEmpty()) {
            throw new IllegalArgumentException("Base city is required");
        }
        return guideRepo.save(TGuide);
    }

    @Override
    public Optional<TGuide> getGuideById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        return guideRepo.findById(id);
    }

    @Override
    public List<TGuide> getAllGuides() {
        return guideRepo.findAll();
    }

    @Override
    public TGuide updateGuide(String id, TGuide TGuide) {
        if (TGuide == null) {
            throw new IllegalArgumentException("Guide cannot be null");
        }
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }

        Optional<TGuide> existingGuide = guideRepo.findById(id);
        if (existingGuide.isPresent()) {
            TGuide TGuideToUpdate = existingGuide.get();

            // Update all fields
            TGuideToUpdate.setName(TGuide.getName());
            TGuideToUpdate.setLanguages(TGuide.getLanguages());
            TGuideToUpdate.setExperienceYears(TGuide.getExperienceYears());
            TGuideToUpdate.setContactNumber(TGuide.getContactNumber());
            TGuideToUpdate.setEmail(TGuide.getEmail());
            TGuideToUpdate.setBaseCity(TGuide.getBaseCity());
            TGuideToUpdate.setAreaOfService(TGuide.getAreaOfService());
            TGuideToUpdate.setDailyRate(TGuide.getDailyRate());

            return guideRepo.save(TGuideToUpdate);
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
    public List<TGuide> getGuidesByBaseCity(String baseCity) {
        return guideRepo.safeFindByBaseCity(baseCity);
    }

    @Override
    public List<TGuide> getGuidesByLanguage(String language) {
        return guideRepo.safeFindByLanguage(language);
    }

    @Override
    public List<TGuide> getGuidesByMinExperience(Integer minExperience) {
        return guideRepo.safeFindByMinExperienceYears(minExperience);
    }

    @Override
    public List<TGuide> getGuidesByDailyRateRange(Double minRate, Double maxRate) {
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
    public List<TGuide> getGuidesByAreaOfService(String area) {
        if (area == null || area.trim().isEmpty()) {
            throw new IllegalArgumentException("Area of service cannot be null or empty");
        }
        return guideRepo.findByAreaOfService(area);
    }

}
