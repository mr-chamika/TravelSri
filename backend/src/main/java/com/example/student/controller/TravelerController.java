package com.example.student.controller;

import com.example.student.model.*;
import com.example.student.model.dto.*;
import com.example.student.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;



import java.util.*;
import java.util.stream.Collectors;

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
    public ResponseEntity<List<THoteldto>> HotelsAll(@RequestParam String location,@RequestParam int guests ) {

        List<THoteldto> list = repo2.findAllHoteldtos(location,guests);
System.out.println(list);
        return ResponseEntity.ok(list);

    }

    @GetMapping("/hotel-all")
    public ResponseEntity<List<THoteldto>> HotelsAllSuggest(@RequestParam int guests ) {

        List<THoteldto> list = repo2.findAllSuggestHoteldtos(guests);

        return ResponseEntity.ok(list);

    }

    @GetMapping("/hotels-view")
    public ResponseEntity<HotelViewdto> HotelsData(@RequestParam String id) {

        Optional<HotelViewdto> list = repo2.findHotelViewdtoById(id);
        if (!list.isPresent()) {

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
    public ResponseEntity<List<Faci>> HotelFacilities(@RequestParam List<String> ids) {

        List<Faci> list = repo4.findAllById(ids);

        if (list.isEmpty()) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(list);

    }

    @Autowired
    private RoomTypeRepo roomtypeRepo;

    @GetMapping("/roomtypes-view")
    public ResponseEntity<List<RoomType>> HotelRoomType(@RequestParam List<String> ids) {

        List<RoomType> list = roomtypeRepo.findAllById(ids);

        if (list.isEmpty()) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(list);

    }

    @GetMapping("/guides-all")
            public ResponseEntity<?> GuidesAll(String location,String language) {
        List<Guidedto> list = userRepo.findAllGuidedtos(location,language);


        if (list.isEmpty()) {
            return ResponseEntity.badRequest().body("No guides found");
        }

        return ResponseEntity.ok(list);
    }

    @GetMapping("/guides-alls")
    public ResponseEntity<?> GuidesAlls(String language) {
        List<Guidedto> list = userRepo.findAllGuidedtoss(language);


        if (list.isEmpty()) {
            return ResponseEntity.badRequest().body("No guides found");
        }

        return ResponseEntity.ok(list);
    }


    @GetMapping("/guide-all")
    public ResponseEntity<List<Guidedto>> GuideAll() {
        List<Guidedto> list = userRepo.findAllGuidedto();

        return ResponseEntity.ok(list);
    }

    @GetMapping("/guides-view")
    public ResponseEntity<Optional<GuideViewdto>> Guide(@RequestParam String id) {
        Optional<GuideViewdto> list = userRepo.findData(id);


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

        List<User> list = storesRepo.findAllShops();

        return ResponseEntity.ok(list);

    }

    @GetMapping("/shop-items")
    public ResponseEntity<List<Item>> StoreItemsGet(@RequestParam String id) {

        List<Item> list = itemrepo.findByShopId(id);

        return ResponseEntity.ok(list);

    }

    @GetMapping("/shop-get")
    public ResponseEntity<Optional<User>> StoreGet(@RequestParam String id) {

        Optional<User> x = storesRepo.findById(id);

        return ResponseEntity.ok(x);

    }

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/review-create")
    public Review ReviewCreate(@RequestBody ReviewGetdto obj) {

        //find the review creator

        String userId = obj.getAuthorId().toString();

        Optional<User> newuser= userRepo.findById(userId);

        String pp = newuser.get().getPp();
        String country = newuser.get().getCountry();

        //find the merchant

        Optional <User> store = userRepo.findById(obj.getServiceId());
        User user = store.get();

        // Initialize if null
        if (user.getReviewCount() == null) user.setReviewCount(0);
        if (user.getStars() == null) user.setStars(0);

        // Current values
        int currentReviewCount = user.getReviewCount();
        int currentStars = user.getStars();

        // Update values
        int newReviewCount = currentReviewCount + 1;
        int newTotalStars = currentStars + obj.getStars();

        user.setReviewCount(newReviewCount);
        user.setStars(newTotalStars);


        userRepo.save(user);

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

    @GetMapping("/category-get")
    public ResponseEntity<List<Categorydto>> Categoryget() {

        List<Categorydto> list= categoryRepo.pfindAll();

        return ResponseEntity.ok(list);

    }

    @Autowired
    private VehicleRepo vehicleRepo;

    @GetMapping("/vehicle-get")
    public ResponseEntity<List<Driverdto>> VehiclesAll(String location,String language,String id) {

        List<Driverdto> list= vehicleRepo.findByCatId(location,language,id);

        return ResponseEntity.ok(list);

    }

    @GetMapping("/vehicle-gets")
    public ResponseEntity<List<Driverdto>> VehiclesAlls(String location,String language) {

        List<Driverdto> list= vehicleRepo.findByCatIds(location,language);

        return ResponseEntity.ok(list);

    }

    @GetMapping("/vehicle-data")
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

    @Autowired
    private CreatedRepo createdRepo;

    @PostMapping("/create-trip")//to add a service for day in the trip(hotel,guide,vehicle)
    public String createService(@RequestBody Map<String,Object> body){

        if(body.get("type").equals( "vehicle")) {

            Map<String, Object> order = (Map<String, Object>) body.get("order");//createdId,dayNumber,date,adults,children
            Map<String, Object> obj = (Map<String, Object>) body.get("obj");//date: order?.date,start: startLocation, end: endLocation, language: language, time: time, oneWay: isOneway,


            if (order.get("createdId") == "") {// if this is first day plan

                Created newCreatedTrip = new Created(

                        (String) body.get("userId"),
                        Integer.parseInt(order.get("adults").toString()),
                        Integer.parseInt(order.get("children").toString())

                );

                newCreatedTrip.getDates().add((String) order.get("date"));

                createdRepo.save(newCreatedTrip);

                SoloTrip x = new SoloTrip(

                        (String) body.get("serviceId"),
                        (String) obj.get("date"),
                        newCreatedTrip.get_id(),
                        Integer.parseInt(order.get("dayNumber").toString()),
                        (String) body.get("type"),
                        "pending"


                );
//storing vehicle booking data
                x.getBookingData().put("date",obj.get("date"));
                x.getBookingData().put("endLocation",obj.get("end"));
                x.getBookingData().put("startLocation",obj.get("start"));
                x.getBookingData().put("language",obj.get("language"));
                x.getBookingData().put("time",obj.get("time"));
                x.getBookingData().put("isOneWay",obj.get("oneWay"));

                soloTripRepo.save(x);
                return x.getCreatedId();

            } else {

                SoloTrip x = new SoloTrip(

                        (String) body.get("serviceId"),
                        (String) order.get("date"),
                        (String) order.get("createdId"),
                        Integer.parseInt(order.get("dayNumber").toString()),
                        (String) body.get("type"),
                        "pending"


                );

                //storing vehicle booking data
                x.getBookingData().put("date",obj.get("date"));
                x.getBookingData().put("endLocation",obj.get("end"));
                x.getBookingData().put("startLocation",obj.get("start"));
                x.getBookingData().put("language",obj.get("language"));
                x.getBookingData().put("time",obj.get("time"));
                x.getBookingData().put("isOneWay",obj.get("oneWay"));

                soloTripRepo.save(x);
                return x.getCreatedId();

            }
        }

        if(body.get("type").equals("guide")) {

            Map<String, Object> order = (Map<String, Object>) body.get("order");//createdId,dayNumber,date,adults,children
            Map<String, Object> obj = (Map<String, Object>) body.get("obj");//loc: destination ? destination : travelDescription, lan: lan, type: bookingType

            if (order.get("createdId") == "") {// if this is first day plan


                Created newCreatedTrip = new Created(

                        (String) body.get("userId"),
                        Integer.parseInt(order.get("adults").toString()),
                        Integer.parseInt(order.get("children").toString())

                );

                newCreatedTrip.getDates().add((String) order.get("date"));

                createdRepo.save(newCreatedTrip);

                SoloTrip x = new SoloTrip(

                        (String) body.get("serviceId"),
                        (String) order.get("date"),
                        newCreatedTrip.get_id(),
                        Integer.parseInt(order.get("dayNumber").toString()),
                        (String) body.get("type"),
                        "pending"


                );

                //storing guide booking data
                x.getBookingData().put("location",obj.get("loc"));
                x.getBookingData().put("language",obj.get("lan"));
                x.getBookingData().put("type",obj.get("type"));

                soloTripRepo.save(x);
                return x.getCreatedId();

            } else {

                SoloTrip x = new SoloTrip(

                        (String) body.get("serviceId"),
                        (String) order.get("date"),
                        (String) order.get("createdId"),
                        Integer.parseInt(order.get("dayNumber").toString()),
                        (String) body.get("type"),
                        "pending"


                );

                //storing guide booking data
                x.getBookingData().put("location",obj.get("loc"));
                x.getBookingData().put("language",obj.get("lan"));
                x.getBookingData().put("type",obj.get("type"));

                soloTripRepo.save(x);
                return x.getCreatedId();

            }
        }

        if(body.get("type").equals("hotel")) {

            Map<String, Object> order = (Map<String, Object>) body.get("order");//createdId,dayNumber,date,adults,children
            Map<String, Object> obj = (Map<String, Object>) body.get("obj");//id: hotelv._id,s: singleRoomsCount.toString(),d: doubleRoomsCount.toString(),

            if (order.get("createdId") == "") {// if this is first day plan

                Created newCreatedTrip = new Created(

                        (String) body.get("userId"),
                        Integer.parseInt(order.get("adults").toString()),
                        Integer.parseInt(order.get("children").toString())

                );

                newCreatedTrip.getDates().add((String) order.get("date"));

                createdRepo.save(newCreatedTrip);

                SoloTrip x = new SoloTrip(

                        (String) body.get("serviceId"),
                        (String) order.get("date"),
                        newCreatedTrip.get_id(),
                        Integer.parseInt(order.get("dayNumber").toString()),
                        (String) body.get("type"),
                        "pending"


                );

                //storing hotel booking data
                x.getBookingData().put("singleRooms",Integer.parseInt(obj.get("s").toString()));
                x.getBookingData().put("doubleRooms",Integer.parseInt(obj.get("d").toString()));
                x.getBookingData().put("guests",Integer.parseInt(order.get("adults").toString())+Integer.parseInt(order.get("children").toString()));

                Hotel hotel = hotelsRepo.findById(obj.get("id").toString()).get();

                if (hotel.getAvailableSingle() != 0) {
                    hotel.setAvailableSingle(hotel.getAvailableSingle() - Integer.parseInt(obj.get("s").toString()));
                }if (hotel.getAvailableDouble() != 0) {
                    hotel.setAvailableDouble(hotel.getAvailableDouble() - Integer.parseInt(obj.get("d").toString()));
                }

                hotelsRepo.save(hotel);

                soloTripRepo.save(x);
                return x.getCreatedId();

            } else {

                if(body.get("id").equals("")) {

                    SoloTrip x = new SoloTrip(

                            (String) body.get("serviceId"),
                            (String) order.get("date"),
                            (String) order.get("createdId"),
                            Integer.parseInt(order.get("dayNumber").toString()),
                            (String) body.get("type"),
                            "pending"


                    );

                    //storing hotel booking data
                    x.getBookingData().put("singleRooms", Integer.parseInt(obj.get("s").toString()));
                    x.getBookingData().put("doubleRooms", Integer.parseInt(obj.get("d").toString()));

                    soloTripRepo.save(x);
                    return x.getCreatedId();

                }else{

                    Optional<SoloTrip> y = soloTripRepo.findById(body.get("id").toString());
System.out.println("here"+body.get("id"));
                    if(y.isPresent()) {
                        System.out.println("this is y" + y.get());

                        y.get().getBookingData().put("singleRooms", Integer.parseInt(obj.get("s").toString()));
                        y.get().getBookingData().put("doubleRooms", Integer.parseInt(obj.get("d").toString()));

                        soloTripRepo.save(y.get());
                        return y.get().getCreatedId();
                    }
                }

            }
        }

        return "invalid service type";
    }

    @GetMapping("/trips-view")
    public ResponseEntity<List<Created>> GetShowTrip(@RequestParam String id) {

        //List<Solotripdto> list = soloTripRepo.findByCreatorId(id);

        List <Created> list = createdRepo.findByCreatorId(id);

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
    public ResponseEntity<?> GetOne(@RequestParam String id) {// this id is trip plan's id. not day plan's id

        List<SoloTrip> list = soloTripRepo.findByCreatedId(id);
System.out.println(list.getClass().isArray());
        return ResponseEntity.ok(list);

    }

    @Autowired
    private TravelerBookingRepo travelerBookingRepo;

    @Autowired
    private FaciRepo faciRepo;

    @PutMapping("/booking-cancel")
    public String bookingCancel(@RequestBody Map<String, Object> body) {

        TravelerBooking booking = travelerBookingRepo.findById(body.get("id").toString()).get();

        booking.setStatus("cancelled");

        travelerBookingRepo.save(booking);

        return "Booking cancelled";
    }

    @PostMapping("/create-booking")
    public String CreateBooking(@RequestBody TravelerBooking obj) {

        if(obj.getType().equals("vehicles")) {

            Vehicle vehicle = vehicleRepo.findById(obj.getServiceId()).get();
            Category category = categoryRepo.findById(vehicle.getCatId()).get();

            obj.setType("vehicle");

            if(obj.getThumbnail().isEmpty()) {

                obj.setThumbnail(vehicle.getImage());

            }
            if(obj.getTitle().equals("")) {

                obj.setTitle(vehicle.getFirstName() + " " + vehicle.getLastName() + " | " + vehicle.getVehicleModel() + " | " + category.getTitle() );

            }

            if(obj.getRatings() ==0 && vehicle.getStars()!=0 && vehicle.getReviewCount()!=0){

                obj.setRatings(Math.round(((float)vehicle.getStars()/vehicle.getReviewCount())*2*10)/10f);

            }

            if(obj.getStars()==0){

                obj.setStars(vehicle.getStars());

            }

            if(obj.getLocation()==null) {

                obj.setLocation(vehicle.getLocation());

            }

            if((obj.getFacilities() == null || obj.getFacilities().length == 0) && vehicle.getWhatsIncluded()!=null && vehicle.getWhatsIncluded().length>=2) {

                obj.setFacilities(vehicle.getWhatsIncluded());

            }

            if(obj.getPrice()==0 && vehicle.getDailyRatePrice()!=0){

                obj.setPrice(vehicle.getDailyRatePrice());

            }


            if(obj.getMobileNumber().equals("")){

                obj.setMobileNumber(vehicle.getPhone());

            }

            obj.setStatus("active");

            SoloTrip x = soloTripRepo.findById(obj.get_id()).get();
            x.setStatus("active");

            soloTripRepo.save(x);
        }

        if(obj.getType().equals("guides")) {

            User guide = userRepo.findById(obj.getServiceId()).get();

            obj.setType("guide");

            if(obj.getThumbnail().isEmpty()) {

                obj.setThumbnail(guide.getPp());

            }
            if(obj.getTitle().equals("")) {

                obj.setTitle(guide.getFirstName() + " " + guide.getLastName());

            }

            if(obj.getSubtitle().length==0 && guide.getTourStyles()!=null && guide.getTourStyles().length>=2) {

                obj.setSubtitle(new String[]{guide.getTourStyles()[0],guide.getTourStyles()[1]});

            }

            if(obj.getRatings() ==0 && guide.getStars()!=0 && guide.getReviewCount()!=0){

                obj.setRatings(Math.round(((float)guide.getStars()/guide.getReviewCount())*2*10)/10f);

            }


            if((obj.getFacilities() == null || obj.getFacilities().length == 0) && guide.getSpecializations()!=null && guide.getSpecializations().length>=2) {

                obj.setFacilities(guide.getSpecializations());

            }

            if(obj.getPrice()==0 && guide.getDailyRate()!=null){

                obj.setPrice(guide.getDailyRate());

            }

            if(obj.getMobileNumber().equals("")){

                obj.setMobileNumber(guide.getMobileNumber());

            }

            obj.setStatus("active");

            SoloTrip x = soloTripRepo.findById(obj.get_id()).get();
            x.setStatus("active");

            soloTripRepo.save(x);

        }

        if(obj.getType().equals("hotels")) {

            Hotel hotel = hotelsRepo.findById(obj.getServiceId()).get();

            obj.setType("hotel");

            if(obj.getThumbnail().isEmpty()) {

                obj.setThumbnail(hotel.getThumbnail());

            }
            if(obj.getTitle().equals("")) {

                obj.setTitle(hotel.getName());

            }

            obj.setLocation(hotel.getLocation());

            if(obj.getSubtitle().length==0) {

                String x = "";
                String y = "";

                if(obj.getSingleRooms() != 0){

                    x = obj.getSingleRooms()!=0 ? obj.getSingleRooms()+" single rooms":"";

                }if(obj.getDoubleRooms() != 0){

                    y = obj.getDoubleRooms()!=0 ? obj.getDoubleRooms()+" double rooms":"";

                }

                if(x!=null && y!=null){

                obj.setSubtitle(new String[]{x,y});

                }else if(x!=null && y==null){

                    obj.setSubtitle(new String[]{x});


                }else if(x==null && y!=null){

                    obj.setSubtitle(new String[]{y});

                }

            }

            if(obj.getRatings() ==0 && hotel.getStars()!=0 && hotel.getReviewCount()!=0){

                obj.setRatings(Math.round(((float)hotel.getStars()/hotel.getReviewCount())*2*10)/10f);

            }


            if((obj.getFacilities() == null || obj.getFacilities().length == 0) && hotel.getFacilities()!=null && hotel.getFacilities().length>=2) {

                List<String> list = new ArrayList<>();

                for(String id : hotel.getFacilities() ){

                    Faci x = faciRepo.findById(id).get();

                    list.add(x.getTitle());

                }

                obj.setFacilities(list.toArray(new String[0]));

            }

            if(obj.getPrice()==0 && hotel.getCurrentPrice()!=0){

                obj.setPrice(hotel.getCurrentPrice());

            }

            if(obj.getMobileNumber().equals("")){

                obj.setMobileNumber(hotel.getMobileNumber());

            }

            if(obj.getStars()==0){

                obj.setStars(hotel.getStars());

            }

            obj.setStatus("active");

            SoloTrip x = soloTripRepo.findById(obj.get_id()).get();
            x.setStatus("active");

            soloTripRepo.save(x);

        }

        TravelerBooking x = travelerBookingRepo.save(obj);

        if (x == null) {

            return "Booking is Failed";

        }

        if(obj.getType().equals("hotel")){

    Optional<Hotel> hotel = hotelsRepo.findById(obj.getServiceId());

    Hotel h = hotel.get();

    if(hotel.isPresent()) {

        if (obj.getSingleRooms() != 0) {
            h.setAvailableSingle(h.getAvailableSingle() - obj.getSingleRooms());
        }

        if (obj.getDoubleRooms() != 0) {
            h.setAvailableDouble(h.getAvailableDouble() - obj.getDoubleRooms());
        }

        hotelsRepo.save(h);

    }

        }
        return "Success";
    }

    // Add this method to your existing TravelerController.java

    @PostMapping("/create-hotel-booking")
    @Deprecated
    public ResponseEntity<?> CreateHotelBooking(@RequestBody Map<String, Object> legacyRequest) {
        // This endpoint now redirects to the new unified booking system
        try {

            Map<String, Object> response = new HashMap<>();
            response.put("deprecated", true);
            response.put("message", "This endpoint is deprecated. Please use /api/bookings/hotel/create for new hotel bookings with PayHere integration.");
            response.put("newEndpoint", "/api/bookings/hotel/create");
            response.put("paymentIntegration", "PayHere LKR only");
            response.put("features", List.of(
                    "Unified booking system",
                    "PayHere payment integration",
                    "Room type selection",
                    "Financial breakdown (5% commission, 10% confirmation fee, 75% payout)",
                    "Status management",
                    "Payout automation"
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Please use the new unified booking system: /api/bookings/hotel/create");
        }
    }



    @GetMapping("/bookings-all")
    public ResponseEntity<?> GetAllBookings(@RequestParam String userId) {

         List<TravelerBooking> list = travelerBookingRepo.findAllByUserId(userId);

        if(list.isEmpty()) {

            return ResponseEntity.badRequest().body("No Bookings Found");

        }

        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/trip")
    public String DeleteTrip(@RequestParam String id) {

        Optional<SoloTrip> x = soloTripRepo.findById(id);

        if(x.isPresent()) {

            Optional<TravelerBooking> y = travelerBookingRepo.findById(id);
            if(y.isPresent()) {

                travelerBookingRepo.delete(y.get());

            }

            soloTripRepo.delete(x.get());
            return "Success";

        }
        return "Delete Trip Failed";

    }
}
