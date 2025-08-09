package com.example.student.services;

import com.example.student.model.Item;
import com.example.student.repo.ItemsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShopItemService {

    @Autowired
    private ItemsRepo shopItemRepo;

    public List<Item> getAllShopItems() {
        return shopItemRepo.findAll();
    }

    public Optional<Item> getShopItemById(String id) {
        return shopItemRepo.findById(id);
    }

    public Item saveShopItem(Item shopItem) {
        return shopItemRepo.save(shopItem);
    }

    public List<Item> searchShopItemsByName(String name) {
        return shopItemRepo.findByNameContainingIgnoreCase(name);
    }

    public void deleteShopItem(String id) {
        shopItemRepo.deleteById(id);
    }

    // NEW: Method to get a list of items based on a shopId
    public List<Item> getItemsByShopId(String shopId) {
        return shopItemRepo.findByShopId(shopId);
    }
}