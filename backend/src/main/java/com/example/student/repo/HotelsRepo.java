package com.example.student.repo;

import com.example.student.model.Hotel;
import com.example.student.model.dto.HotelViewdto;
import com.example.student.model.dto.THoteldto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelsRepo extends MongoRepository<Hotel,String> {

    @Query(
            value = "{ $and: [ " +
                    "{ 'location': {$regex: ?0, $options: 'i' } }, " +
                    "{ $expr: { $gte: [ { $add: [ '$availableSingle', '$availableDouble' ] }, ?1 ] } } " +
                    "] }",
            fields = "{ '_id': 1, 'name': 1, 'location': 1, 'distance': 1, 'ratings': 1, 'reviewCount': 1, 'thumbnail': 1, 'originalPrice': 1, 'currentPrice': 1, 'taxes': 1, 'priceDescription': 1, 'specialOffer': 1, 'freeFeatures': 1 }"
    )List<THoteldto> findAllHoteldtos(String location, int guests);

    // In HotelsRepo.java
    @Query(
            value = "{ '_id' : ?0 }",
            fields = "{ '_id':1,'images': 1, 'stars': 1, 'ratings': 1, 'reviewCount': 1, 'price': 1, 'name': 1, 'location': 1, 'description': 1, 'policies': 1, 'roomTypes': 1,'facilities': 1,'availableSingle': 1,'availableDouble': 1,'mobileNumber': 1 }"
    )
    Optional<HotelViewdto> findHotelViewdtoById(String id);


    @Query(
            value = "{ '$expr': { $gte: [ { $add: [ '$availableSingle', '$availableDouble' ] }, ?0 ] } }",
            fields = "{ '_id': 1, 'name': 1, 'location': 1, 'distance': 1, 'ratings': 1, 'reviewCount': 1, 'thumbnail': 1, 'originalPrice': 1, 'currentPrice': 1, 'taxes': 1, 'priceDescription': 1, 'specialOffer': 1, 'freeFeatures': 1,'mobileNumber': 1 }"
    )
    List<THoteldto> findAllSuggestHoteldtos(int guests);
}
