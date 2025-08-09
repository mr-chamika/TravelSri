package com.example.student.model.dto;

import lombok.*;

import java.util.List;

@Data
public class GuideViewdto {

    private String _id;
    private String firstName;
    private String lastName;
    private String description;
    private String location;
    private String experience;
    private int stars;
    private int reviewCount;
    private int dailyRate;
    private String pp; // Profile Picture
    private String verified;
    private String identified;
    private List<String> specializations;
    private String responseTime;
    private String responseRate;
    private String mobileNumber;
    private List<String> languages;
    private List<String> images;
    private String bio;
    private List<String> education;
    private List<String> certifications;
    private List<String> whyChooseMe;
    private List<String> tourStyles;
    private List<String> awards;
    private List<String> daysPerWeek;

    GuideViewdto(String _id, String firstName, String lastName, String description, String location, String experience, int stars, int reviewCount, int dailyRate, String pp, String verified, String identified, List<String> specializations, String responseTime, String responseRate, String mobileNumber, List<String> languages, List<String> images, String bio, List<String> education, List<String> certifications, List<String> whyChooseMe, List<String> tourStyles, List<String> awards, List<String> daysPerWeek){

        this._id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.location = location;
        this.experience = experience;
        this.stars = stars;
        this.reviewCount = reviewCount;
        this.dailyRate = dailyRate;
        this.pp = pp;
        this.verified = verified;
        this.identified = identified;
        this.specializations = specializations;
        this.responseTime = responseTime;
        this.responseRate = responseRate;
        this.mobileNumber = mobileNumber;
        this.languages = languages;
        this.images = images;
        this.bio = bio;
        this.education = education;
        this.certifications = certifications;
        this.whyChooseMe = whyChooseMe;
        this.tourStyles = tourStyles;
        this.awards = awards;
        this.daysPerWeek = daysPerWeek;

    }

}