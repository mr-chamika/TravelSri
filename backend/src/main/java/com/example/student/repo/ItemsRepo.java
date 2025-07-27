package com.example.student.repo;

import com.example.student.model.ShopItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopItemRepo extends MongoRepository<ShopItem, String> {

    // You can add custom query methods if needed, for example:

    // Find items by name containing a string (case-insensitive)
    List<ShopItem> findByItemNameContainingIgnoreCase(String itemName);

    // Find items by price range
    List<ShopItem> findByPriceBetween(double minPrice, double maxPrice);

    // Find items with available stock
    List<ShopItem> findByAvailableNumberGreaterThan(int minStock);

    // Find items by exact price
    List<ShopItem> findByPrice(double price);
}