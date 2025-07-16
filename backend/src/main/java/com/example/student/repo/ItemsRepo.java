package com.example.student.repo;

import com.example.student.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemsRepo extends MongoRepository<Item,String> {

    @Query(
            value = "{ 'buyCount': {$gte: ?0} }",
            fields = "{ '_id': 1, 'shopId': 1, 'name': 1, 'price': 1, 'contact': 1, 'buyCount': 1,'image': 1}"
    )
List<Item> findByBuyCountIsGreaterThanEqual(int count);


    List<Item> findByShopId(String id);
    List<Item> findByNameContainingIgnoreCase(String keyword);

}
