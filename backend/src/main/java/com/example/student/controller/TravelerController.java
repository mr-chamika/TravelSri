package com.example.student.controller;

import com.example.student.model.*;
import com.example.student.model.dto.*;
import com.example.student.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/traveler")
public class TravelerController {

    @Autowired
    private RoutesRepo repo;

    @GetMapping("/routes-allshow")

    public ResponseEntity<List<Routedto>> RoutesAllshow() {

        List<Routedto> list = repo.findAllRoutedtos();

        return ResponseEntity.ok(list);

    }

    @Autowired
    private LocationsRepo repo1;

    @GetMapping("/routes-one")

    public ResponseEntity<List<Location>> RoutesOne(@RequestParam String id) {

        List<Location> items = repo1.findByRouteIdContaining(id);
        if (items.isEmpty()) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(items);

    }

    @Autowired
    private HotelsRepo repo2;

    @GetMapping("/hotels-all")
    public ResponseEntity<List<Hoteldto>> HotelsAll() {

        List<Hoteldto> list = repo2.findAllHoteldtos();

        return ResponseEntity.ok(list);

    }

    @GetMapping("/hotels-view")
    public ResponseEntity<HotelViewdto> HotelsData(@RequestParam String id) {

        Optional<HotelViewdto> list = repo2.findHotelViewdtoById(id);

        if (list.isEmpty()) {
            return ResponseEntity.notFound().build();


        }

        return ResponseEntity.ok(list.get());

    }

    @Autowired
    private ReviewRepo repo3;

    @GetMapping("/reviews-view")
    public ResponseEntity<List<Review>> HotelReview(@RequestParam String id) {

        List<Review> list = repo3.findByServiceId(id);

        if (list.isEmpty()) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(list);

    }

    @Autowired
    private FaciRepo repo4;

    @GetMapping("/facis-view")
    public ResponseEntity<List<Faci>> HotelFacilities(@RequestParam String id) {

        List<Faci> list = repo4.findByHotelIdContaining(id);

        if (list.isEmpty()) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(list);

    }

    @Autowired
    private GuidesRepo repo5;


    @GetMapping("/guides-all")
            public ResponseEntity<List<Guidedto>> GuidesAll(String location,String language) {
        List<Guidedto> list = repo5.findAllGuidedtos(location,language);


//        if (list.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }

        return ResponseEntity.ok(list);
    }

    @GetMapping("/guides-view")
    public ResponseEntity<Optional<GuideViewdto>> Guide(@RequestParam String id) {
        Optional<GuideViewdto> list = repo5.findData(id);


        if (list.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(list);
    }

    @GetMapping("/guides-reviews")
    public ResponseEntity<List<Review>> GuideReview(@RequestParam String id) {

        List<Review> list = repo3.findByServiceId(id);

        if (list.isEmpty()) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(list);

    }

    @Autowired
    private ItemsRepo itemrepo;

    @GetMapping("/items-top")
    public ResponseEntity<List<Item>> TopItems(@RequestParam int count) {

        List<Item> list = itemrepo.findByBuyCountIsGreaterThanEqual(count);

        return ResponseEntity.ok(list);

    }

    @Autowired
    private StoresRepo storesRepo;

    @GetMapping("/shops-get")
    public ResponseEntity<List<Store>> StoreGet() {

        List<Store> list = storesRepo.findAll();

        return ResponseEntity.ok(list);

    }

    @GetMapping("/shop-items")
    public ResponseEntity<List<Item>> StoreItemsGet(@RequestParam String id) {

        List<Item> list = itemrepo.findByShopId(id);

        return ResponseEntity.ok(list);

    }

    @GetMapping("/shop-reviews")
    public ResponseEntity<List<Review>> StoreReviewsGet(@RequestParam String id) {

        List<Review> list = repo3.findByServiceId(id);

        return ResponseEntity.ok(list);

    }

    @GetMapping("/shop-get")
    public ResponseEntity<Optional<Store>> StoreGet(@RequestParam String id) {

        Optional<Store> x = storesRepo.findById(id);

        return ResponseEntity.ok(x);

    }

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/review-create")
    public Review ReviewCreate(@RequestBody ReviewGetdto obj) {

        String userId = obj.getAuthorId().toString();

        Optional<User> newuser= userRepo.findById(userId);
        String pp = newuser.get().getPp();
        String country = newuser.get().getCountry();

        Review newReview = new Review(
                obj.getServiceId(),
                obj.getText(),
                newuser.get().getUsername(),
                country,
                pp,
                obj.getStars()
        );

       return repo3.save(newReview);

    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(@RequestParam String keyword) {
        List<Store> matchingStores = storesRepo.findByNameContainingIgnoreCase(keyword);
        List<Item> matchingItems = itemrepo.findByNameContainingIgnoreCase(keyword);

        Map<String, Object> response = new HashMap<>();
        response.put("stores", matchingStores);
        response.put("items", matchingItems);

        return ResponseEntity.ok(response);
    }


}
