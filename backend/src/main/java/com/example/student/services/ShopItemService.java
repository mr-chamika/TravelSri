package com.example.student.services;

import com.example.student.model.Item;
import com.example.student.repo.ItemsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // Marks this class as a Spring Service
public class ShopItemService {

    @Autowired
    private ItemsRepo shopItemRepo; // Autowire the new ShopItemRepo

    // Method to get all shop items
    public List<Item> getAllShopItems() {
        return shopItemRepo.findAll();
    }

    // Method to get a single shop item by ID
    public Optional<Item> getShopItemById(String id) {
        return shopItemRepo.findById(id);
    }


    // Method to save (create or update) a shop item
    public Item saveShopItem(Item shopItem) {
        return shopItemRepo.save(shopItem);
    }

    // Method to search shop items by name (case-insensitive)
    public List<Item> searchShopItemsByName(String name) {
        return shopItemRepo.findByNameContainingIgnoreCase(name);
    }

    // Method to delete a shop item by ID
    public void deleteShopItem(String id) {
        shopItemRepo.deleteById(id);
    }
}