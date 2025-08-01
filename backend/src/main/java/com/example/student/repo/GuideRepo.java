package com.example.student.repo;

import com.example.student.model.User;
import com.example.student.model.dto.GuideViewdto;
import com.example.student.model.dto.Guidedto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuideRepo extends MongoRepository<User, String> {

    // Find guides by base city (case-insensitive)
    @Query("{'base_city': {$regex: ?0, $options: 'i'}, 'role': 'guide'}")
    List<User> findByBaseCity(String baseCity);

    // Find guides by experience years (minimum experience)
    @Query("{'experience_years': {$gte: ?0}, 'role': 'guide'}")
    List<User> findByMinExperienceYears(Integer minExperience);

    // Find guides by language (case-insensitive)
    @Query("{'languages': {$regex: ?0, $options: 'i'}, 'role': 'guide'}")
    List<User> findByLanguage(String language);

    // Find guides by daily rate range
    @Query("{'daily_rate': {$gte: ?0, $lte: ?1}, 'role': 'guide'}")
    List<User> findByDailyRateRange(Double minRate, Double maxRate);

    // Find guides by area of service (case-insensitive partial match)
    @Query("{'area_of_service': {$regex: ?0, $options: 'i'}, 'role': 'guide'}")
    List<User> findByAreaOfService(String area);

    // Safety methods with validation (No changes needed here)
    default List<User> safeFindByBaseCity(String baseCity) {
        if (baseCity == null || baseCity.trim().isEmpty()) {
            throw new IllegalArgumentException("Base city cannot be null or empty");
        }
        return findByBaseCity(baseCity);
    }

    default List<User> safeFindByLanguage(String language) {
        if (language == null || language.trim().isEmpty()) {
            throw new IllegalArgumentException("Language cannot be null or empty");
        }
        return findByLanguage(language);
    }

    default List<User> safeFindByMinExperienceYears(Integer minExperience) {
        if (minExperience == null || minExperience < 0) {
            throw new IllegalArgumentException("Minimum experience must be a non-negative number");
        }
        return findByMinExperienceYears(minExperience);
    }

    @Query(
            value = "{ $and: [ { 'location': ?0 }, { 'languages': { $in: [?1] } }, { 'role': 'guide' } ] }",
            fields = "{ '_id': 1, 'pp': 1, 'stars': 1, 'price': 1, 'username': 1, 'verified': 1, 'identified': 1,'languages':1,'location':1,'images': 1 ,'description': 1}"
    )
    List<Guidedto> findAllGuidedtos(String location, String language);

    @Query(
            value = "{ '_id': ?0, 'role': 'guide' }",
            fields = "{ '_id': 1, 'pp': 1, 'stars': 1, 'price': 1, 'username': 1, 'verified': 1, 'identified': 1 ,'languages': 1,'location': 1,'images':1,'description': 1}"
    )
    Optional<GuideViewdto> findData(String id);
}