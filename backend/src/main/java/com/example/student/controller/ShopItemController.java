package com.example.student.controller;

import com.example.student.model.ShopItem;
import com.example.student.services.ShopItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/shopitems")
public class ShopItemController {

    @Autowired
    private ShopItemService service;

    // Endpoint to get all shop items
    @GetMapping("/all")
    public ResponseEntity<List<ShopItem>> getAllShopItems() {
        List<ShopItem> shopItems = service.getAllShopItems();
        return ResponseEntity.ok(shopItems);
    }

    // Endpoint to get a single shop item by ID
    @GetMapping("/view")
    public ResponseEntity<ShopItem> getShopItemById(@RequestParam String id) {
        Optional<ShopItem> shopItem = service.getShopItemById(id);
        if (shopItem.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(shopItem.get());
    }

    // Endpoint to add a new shop item (image upload temporarily removed)
    @PostMapping("/add")
    public ResponseEntity<ShopItem> addShopItem(@RequestBody ShopItem shopItem) {
        ShopItem savedShopItem = service.saveShopItem(shopItem);
        return ResponseEntity.ok(savedShopItem);
    }

    // Endpoint to update an existing shop item (image upload temporarily removed)
    @PutMapping("/update")
    public ResponseEntity<ShopItem> updateShopItem(@RequestParam String id, @RequestBody ShopItem shopItem) {
        if (service.getShopItemById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        shopItem.setId(id);
        ShopItem updatedShopItem = service.saveShopItem(shopItem);
        return ResponseEntity.ok(updatedShopItem);
    }

    // Endpoint to delete a shop item
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteShopItem(@RequestParam String id) {
        if (service.getShopItemById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteShopItem(id);
        return ResponseEntity.ok().build();
    }

    // Search endpoint for itemName (case-insensitive)
    @GetMapping("/search")
    public ResponseEntity<List<ShopItem>> searchShopItems(@RequestParam String name) {
        List<ShopItem> results = service.searchShopItemsByName(name);
        return ResponseEntity.ok(results);
    }
}