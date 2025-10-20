package com.example.student.model.dto;

import java.util.List;

public class BookingListForVehicleDto {

    private String _id;  // MongoDB ObjectId as String
    private String serviceId;
    private String userId;
    private String type;
    private String thumbnail;
    private String title;
    private List<String> subtitle;
    private String location;
    private List<String> bookingDates;
    private int ratings;
    private boolean paymentStatus;
    private List<String> facilities;
    private int price;
    private String status;
    private String mobileNumber;

    // No-args constructor
    public BookingListForVehicleDto() {}

    // Getters and setters
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(List<String> subtitle) {
        this.subtitle = subtitle;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<String> getBookingDates() {
        return bookingDates;
    }

    public void setBookingDates(List<String> bookingDates) {
        this.bookingDates = bookingDates;
    }

    public int getRatings() {
        return ratings;
    }

    public void setRatings(int ratings) {
        this.ratings = ratings;
    }

    public boolean isPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(boolean paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public List<String> getFacilities() {
        return facilities;
    }

    public void setFacilities(List<String> facilities) {
        this.facilities = facilities;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public Object getPaymentStatus() {
        return paymentStatus;
    }
}
