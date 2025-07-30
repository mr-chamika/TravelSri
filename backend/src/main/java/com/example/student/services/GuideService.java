package com.example.student.services;

import com.example.student.model.Guide;
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
    public Guide createGuide(Guide TGuide) {
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
        return TGuideRepo.save(TGuide);
    }


    @Override
    public Optional<Guide> getGuideById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        return TGuideRepo.findById(id);
    }

    @Override
    public List<Guide> getAllGuides() {
        return TGuideRepo.findAll();
    }

    @Override
    public Guide updateGuide(String id, Guide TGuide) {
        if (TGuide == null) {
            throw new IllegalArgumentException("Guide cannot be null");
        }
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }

        Optional<Guide> existingGuide = TGuideRepo.findById(id);
        if (existingGuide.isPresent()) {
            Guide TGuideToUpdate = existingGuide.get();

            // Update all fields
            TGuideToUpdate.setFirstName(TGuide.getFirstName());
            TGuideToUpdate.setLastName(TGuide.getLastName());
            TGuideToUpdate.setLanguages(TGuide.getLanguages());
            TGuideToUpdate.setExperience(TGuide.getExperience());
            TGuideToUpdate.setMobileNumber(TGuide.getMobileNumber());
            TGuideToUpdate.setEmail(TGuide.getEmail());
            TGuideToUpdate.setLocation(TGuide.getLocation());
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
    public List<Guide> getGuidesByBaseCity(String baseCity) {
        return TGuideRepo.safeFindByBaseCity(baseCity);
    }

    @Override
    public List<Guide> getGuidesByLanguage(String language) {
        return TGuideRepo.safeFindByLanguage(language);
    }

    @Override
    public List<Guide> getGuidesByMinExperience(Integer minExperience) {
        return TGuideRepo.safeFindByMinExperienceYears(minExperience);
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
        return TGuideRepo.findByDailyRateRange(minRate, maxRate);
    }

    @Override
    public List<Guide> getGuidesByAreaOfService(String area) {
        if (area == null || area.trim().isEmpty()) {
            throw new IllegalArgumentException("Area of service cannot be null or empty");
        }
        return TGuideRepo.findByAreaOfService(area);
    }

}
