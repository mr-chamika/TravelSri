package com.example.student.repo;

import com.example.student.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
//public interface ShopItemRepo extends MongoRepository<ShopItem, String> {
public interface ItemsRepo extends MongoRepository<Item,String> {

    // You can add custom query methods if needed, for example:

    // Find items by name containing a string (case-insensitive)
    //List<Item> findByNameContainingIgnoreCase(String itemName);

    // Find items by price range
    List<Item> findByPriceBetween(double minPrice, double maxPrice);

    // Find items with available stock
    List<Item> findByCountGreaterThan(int minStock);

    // Find items by exact price
    List<Item> findByPrice(double price);

    @Query(
            value = "{ 'buyCount': {$gte: ?0} }",
            fields = "{ '_id': 1, 'shopId': 1, 'name': 1, 'price': 1, 'contact': 1, 'buyCount': 1,'image': 1}"
    )
    List<Item> findByBuyCountIsGreaterThanEqual(int count);


    List<Item> findByShopId(String id);
    List<Item> findByNameContainingIgnoreCase(String keyword);

}