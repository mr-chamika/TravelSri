package com.example.student.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "posts")
public class Post {
    @Id
    @Field("_id")
    private String id;
    private String content;
    private List<String> categories;

    // Author info (embedded)
    private String userId;
    private String userName;
    private String userAvatar;

    // Media files - store Base64 encoded strings
    private List<String> mediaFiles; // Store Base64 encoded media files

    // Location (embedded)
    private Double latitude;
    private Double longitude;
    private String address;
    private String city;
    private String country;

    // Engagement
    private List<String> likes; // User IDs who liked
    private int likeCount;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active = true;

    // Constructors
    public Post() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<String> getCategories() { return categories; }
    public void setCategories(List<String> categories) { this.categories = categories; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserAvatar() { return userAvatar; }
    public void setUserAvatar(String userAvatar) { this.userAvatar = userAvatar; }

    public List<String> getMediaFiles() { return mediaFiles; }
    public void setMediaFiles(List<String> mediaFiles) { this.mediaFiles = mediaFiles; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public List<String> getLikes() { return likes; }
    public void setLikes(List<String> likes) {
        this.likes = likes;
        this.likeCount = likes != null ? likes.size() : 0;
    }

    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    // Fix: Map Base64 data to mediaFiles field
    public void setMediaBase64(List<String> mediaBase64List) {
        this.mediaFiles = mediaBase64List;
    }
}
