package com.example.student.controller;

import com.example.student.model.*;
import com.example.student.model.dto.HotelViewdto;
import com.example.student.model.dto.Hoteldto;
import com.example.student.model.dto.Routedto;
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
}
