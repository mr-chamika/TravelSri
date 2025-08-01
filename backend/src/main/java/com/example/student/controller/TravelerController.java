package com.example.student.controller;

import com.example.student.model.*;
import com.example.student.model.dto.*;
import com.example.student.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/traveler")
public class TravelerController {

    @Autowired
    private RoutesRepo repo;
    @Autowired
    private HotelsRepo hotelsRepo;

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
    private GuideRepo repo5;


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
    public ResponseEntity<List<User>> StoreGet() {

        List<User> list = storesRepo.findAll();

        return ResponseEntity.ok(list);

    }

    @GetMapping("/shop-items")
    public ResponseEntity<List<Item>> StoreItemsGet(@RequestParam String id) {

        List<Item> list = itemrepo.findByShopId(id);

        return ResponseEntity.ok(list);

    }

    @GetMapping("/shop-get")
    public ResponseEntity<Optional<User>> StoreGet(@RequestParam String id) {

        Optional<User> x = storesRepo.findStoreById(id);

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
        List<User> matchingStores = storesRepo.findByBusinessNameContainingIgnoreCase(keyword);
        List<Item> matchingItems = itemrepo.findByNameContainingIgnoreCase(keyword);

        Map<String, Object> response = new HashMap<>();
        response.put("stores", matchingStores);
        response.put("items", matchingItems);

        return ResponseEntity.ok(response);
    }

    @Autowired
    private CategoryRepo categoryRepo;

    @GetMapping("/vehicles-all")
    public ResponseEntity<List<Category>> CategoryAll() {

        List<Category> list= categoryRepo.findAll();

        return ResponseEntity.ok(list);

    }

    @Autowired
    private VehicleRepo vehicleRepo;

    @GetMapping("/driver-get")
    public ResponseEntity<List<Driverdto>> VehiclesAll(String id) {

        List<Driverdto> list= vehicleRepo.findByCatId(id);

        return ResponseEntity.ok(list);

    }

    @GetMapping("/driver-data")
    public ResponseEntity<?> VehicleData(String id) {

        Optional<Vehicledto> list = vehicleRepo.findVehicleById(id);

        if (list.isEmpty()) {

            return ResponseEntity.ok("Data Not Found");
        }

    return ResponseEntity.ok(list.get());

    }

    @GetMapping("/get-reviews")
    public ResponseEntity<List<Review>> GetReviews(@RequestParam String id) {

        List<Review> list = repo3.findByServiceId(id);

        return ResponseEntity.ok(list);

    }

    @Autowired
    private SoloTripRepo soloTripRepo;

    @PostMapping("/create-trip")
    public String CreateTrip(@RequestBody SolotripGetdto obj){

       Optional <Route> r = repo.findById(obj.getRouteId());

        SoloTrip x = new SoloTrip(
                obj.getRouteId(),
                obj.getCreatorId(),
                obj.getHotelId(),
                obj.getAdults(),
                obj.getChildren(),
                obj.getNights(),
                obj.getDoubleBeds(),
                obj.getSingleBeds(),
                obj.getHdatesBooked(),
                obj.getHlocation(),
                obj.getHprice(),
                obj.getGuideId(),
                obj.getGdatesBooked(),
                obj.getGlocation(),
                obj.getGlanguage(),
                obj.getGprice(),
                obj.getCarId(),
                obj.getCdatesBooked(),
                obj.getClanguage(),
                obj.getEndLocation(),
                obj.getStartLocation(),
                obj.getBookedTime(),
                obj.getCprice(),
                r.get().getThumbnail(),
                r.get().getFrom(),
                r.get().getTo(),
                "pending",
                obj.getCdatesBooked().get(0),
r.get().getMapRoute()
                );

        soloTripRepo.save(x);
        return "success";
    }

    @GetMapping("/trips-view")
    public ResponseEntity<List<Solotripdto>> GetShowTrip(@RequestParam String id) {

        List<Solotripdto> list = soloTripRepo.findByCreatorId(id);

        return ResponseEntity.ok(list);

    }


    @GetMapping("/map")
    public ResponseEntity<?> GetMap(@RequestParam String id) {

        Optional <Route> x = repo.findById(id);

        if(x.isEmpty()) {

            return ResponseEntity.ok("Data Not Found");

        }

        Map<String, Object> map = new HashMap<>();
        map.put("uri", x.get().getMapRoute());

        return ResponseEntity.ok( map);

    }

    @GetMapping("/trip-one")
    public ResponseEntity<?> GetOne(@RequestParam String id) {

        Optional<SoloTrip> solotrip = soloTripRepo.findById(id);
        Optional<Hotel> hotel = hotelsRepo.findById(solotrip.get().getHotelId());
        Optional<User> guide = repo5.findById(solotrip.get().getGuideId());
        Optional<Vehicledto> vehicle = vehicleRepo.findVehicleById(solotrip.get().getCarId());

        if(hotel.isEmpty() || vehicle.isEmpty() || guide.isEmpty()) {

            return ResponseEntity.ok("Data Not Found");

        }

        SoloTrip x = solotrip.get();
        Hotel h = hotel.get();
        User g = guide.get();
        Vehicledto v = vehicle.get();

        Optional<Category> cat = categoryRepo.findById(v.getCatId());
        Category c = cat.get();


SolotripViewdto s = new SolotripViewdto(
        x.get_id(),
        x.getCreatorId(),
        x.getRouteId(),
        x.getHotelId(),
        h.getName(),
        x.getHlocation(),
        x.getHprice(),
        x.getGuideId(),
        x.getGlocation(),
        x.getGprice(),
        g.getUsername(),
        x.getCarId(),
        x.getCprice(),
        v.getName(),
        c.getTitle(),
        x.getStart(),
        x.getDestination(),
        x.getStatus(),
        x.getStartDate(),
        x.getMap()


);

        return ResponseEntity.ok(s);

    }

}
