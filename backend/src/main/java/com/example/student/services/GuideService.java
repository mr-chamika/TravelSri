package com.example.student.services;

import com.example.student.model.TGuide;
import com.example.student.repo.TGuideRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GuideService implements IGuideService{
    @Autowired
    private TGuideRepo TGuideRepo;

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
        return TGuideRepo.save(TGuide);
    }

    @Override
    public Optional<TGuide> getGuideById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        return TGuideRepo.findById(id);
    }

    @Override
    public List<TGuide> getAllGuides() {
        return TGuideRepo.findAll();
    }

    @Override
    public TGuide updateGuide(String id, TGuide TGuide) {
        if (TGuide == null) {
            throw new IllegalArgumentException("Guide cannot be null");
        }
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }

        Optional<TGuide> existingGuide = TGuideRepo.findById(id);
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

            return TGuideRepo.save(TGuideToUpdate);
        }
        throw new RuntimeException("Guide not found with id: " + id);
    }

    @Override
    public boolean deleteGuide(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        if (TGuideRepo.existsById(id)) {
            TGuideRepo.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<TGuide> getGuidesByBaseCity(String baseCity) {
        return TGuideRepo.safeFindByBaseCity(baseCity);
    }

    @Override
    public List<TGuide> getGuidesByLanguage(String language) {
        return TGuideRepo.safeFindByLanguage(language);
    }

    @Override
    public List<TGuide> getGuidesByMinExperience(Integer minExperience) {
        return TGuideRepo.safeFindByMinExperienceYears(minExperience);
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
        return TGuideRepo.findByDailyRateRange(minRate, maxRate);
    }

    @Override
    public List<TGuide> getGuidesByAreaOfService(String area) {
        if (area == null || area.trim().isEmpty()) {
            throw new IllegalArgumentException("Area of service cannot be null or empty");
        }
        return TGuideRepo.findByAreaOfService(area);
    }

}
