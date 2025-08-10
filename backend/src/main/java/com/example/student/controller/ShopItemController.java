package com.example.student.controller;

import com.example.student.model.Item;
import com.example.student.services.ShopItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<Item>> getAllShopItems() {
        List<Item> shopItems = service.getAllShopItems();
        return ResponseEntity.ok(shopItems);
    }

    // Endpoint to get a single shop item by ID
    @GetMapping("/view")
    public ResponseEntity<Item> getShopItemById(@RequestParam String id) {
        Optional<Item> shopItem = service.getShopItemById(id);
        if (shopItem.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(shopItem.get());
    }

    // Endpoint to add a new shop item (image upload temporarily removed)
    @PostMapping("/add")
    public ResponseEntity<Item> addShopItem(@RequestBody Item shopItem) {
        Item savedShopItem = service.saveShopItem(shopItem);
        return ResponseEntity.ok(savedShopItem);
    }

    @PutMapping("/update")
    public ResponseEntity<Item> updateShopItem(@RequestParam String id, @RequestBody Item shopItem) {
        Optional<Item> existingItemOpt = service.getShopItemById(id);
        if (existingItemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Item existingItem = existingItemOpt.get();

        // Update only the changeable fields, preserve ID and shopId
        existingItem.setName(shopItem.getName());
        existingItem.setPrice(shopItem.getPrice());
        existingItem.setCount(shopItem.getCount());
        existingItem.setDescription(shopItem.getDescription());
        existingItem.setImage(shopItem.getImage());

        // Don't touch ID or shopId - they remain unchanged

        Item updatedShopItem = service.saveShopItem(existingItem);
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
    public ResponseEntity<List<Item>> searchShopItems(@RequestParam String name) {
        List<Item> results = service.searchShopItemsByName(name);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/by-shop")
    public ResponseEntity<List<Item>> getItemsByShopId(@RequestParam String shopid) {
        System.out.println("🔥 ENDPOINT CALLED - Shop ID: " + shopid);
        System.out.println("🔥 Request reached controller successfully!");

        List<Item> items = service.getItemsByShopId(shopid);
        System.out.println("🔥 Found " + items.size() + " items");

        if (items.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(items);
    }

}