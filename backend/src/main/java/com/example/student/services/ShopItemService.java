package com.example.student.services;

import com.example.student.model.ShopItem;
import com.example.student.repo.ShopItemRepo; // Import the new ShopItemRepo
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // Marks this class as a Spring Service
public class ShopItemService {

    @Autowired
    private ShopItemRepo shopItemRepo; // Autowire the new ShopItemRepo

    // Method to get all shop items
    public List<ShopItem> getAllShopItems() {
        return shopItemRepo.findAll();
    }

    // Method to get a single shop item by ID
    public Optional<ShopItem> getShopItemById(String id) {
        return shopItemRepo.findById(id);
    }


    // Method to save (create or update) a shop item
    public ShopItem saveShopItem(ShopItem shopItem) {
        return shopItemRepo.save(shopItem);
    }

    // Method to search shop items by name (case-insensitive)
    public List<ShopItem> searchShopItemsByName(String name) {
        return shopItemRepo.findByItemNameContainingIgnoreCase(name);
    }

    // Method to delete a shop item by ID
    public void deleteShopItem(String id) {
        shopItemRepo.deleteById(id);
    }
}