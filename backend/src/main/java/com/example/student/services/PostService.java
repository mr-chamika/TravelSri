package com.example.student.services;

import com.example.student.model.Post;
import com.example.student.repo.PostRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Value("${app.file.upload-dir:./uploads/posts}")
    private String uploadDir;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Post createPost(
            String title,
            String content,
            String categories,
            List<MultipartFile> files,
            String userId,
            String userName,
            String userAvatar,
            Double latitude,
            Double longitude,
            String address,
            String city,
            String country) {

        try {
            System.out.println("📝 Creating simple travel post...");

            // Basic validation
            if ((title == null || title.trim().isEmpty()) &&
                    (content == null || content.trim().isEmpty())) {
                throw new IllegalArgumentException("Title or content is required");
            }

            if (userId == null || userId.trim().isEmpty()) {
                throw new IllegalArgumentException("User ID is required");
            }

            // Create upload directory
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Handle file uploads (simplified)
            List<String> mediaFiles = new ArrayList<>();
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = saveFile(file);
                        mediaFiles.add(fileName);
                    }
                }
            }

            // Parse categories
            List<String> categoryList = new ArrayList<>();
            if (categories != null && !categories.trim().isEmpty()) {
                try {
                    String[] categoriesArray = objectMapper.readValue(categories, String[].class);
                    categoryList = Arrays.asList(categoriesArray);
                } catch (JsonProcessingException e) {
                    categoryList.add(categories); // Use as single category if JSON parsing fails
                }
            }

            // Create and save post
            Post post = new Post();
            post.setId(UUID.randomUUID().toString());
            post.setTitle(title != null ? title.trim() : "");
            post.setContent(content != null ? content.trim() : "");
            post.setCategories(categoryList);
            post.setUserId(userId);
            post.setUserName(userName != null ? userName : "Unknown User");
            post.setUserAvatar(userAvatar);
            post.setMediaFiles(mediaFiles);

            // Set location if provided
            if (latitude != null && longitude != null) {
                post.setLatitude(latitude);
                post.setLongitude(longitude);
                post.setAddress(address);
                post.setCity(city);
                post.setCountry(country);
            }

            post.setLikes(new ArrayList<>());
            post.setLikeCount(0);
            post.setCreatedAt(LocalDateTime.now());
            post.setUpdatedAt(LocalDateTime.now());
            post.setActive(true);

            Post savedPost = postRepository.save(post);
            System.out.println("✅ Travel post created: " + savedPost.getId());
            return savedPost;

        } catch (Exception e) {
            System.err.println("❌ Error creating post: " + e.getMessage());
            throw new RuntimeException("Failed to create post: " + e.getMessage(), e);
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        String fileName = "travel_" + System.currentTimeMillis() + "_" +
                UUID.randomUUID().toString().substring(0, 8) +
                getFileExtension(file.getOriginalFilename());

        Path targetLocation = Paths.get(uploadDir).resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    private String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return "";
    }

    public Page<Post> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return postRepository.findByActiveTrue(pageable);
    }

    public boolean toggleLike(String postId, String userId) {
        try {
            // Add debugging
            System.out.println("🔍 Searching for post with ID: " + postId);
            System.out.println("📊 Total posts in database: " + postRepository.count());

            // Sanitize the ID
            String cleanId = postId;

            Optional<Post> optionalPost = postRepository.findById(cleanId);

            if (!optionalPost.isPresent()) {
                System.err.println("❌ No post found for ID: " + cleanId);
                // List some IDs for debugging
                List<Post> allPosts = postRepository.findAll();
                System.out.println("📋 Available post IDs:");
                allPosts.stream().limit(5).forEach(p -> System.out.println("  - " + p.getId()));
                throw new RuntimeException("Post not found with ID: " + cleanId);
            }

            Post post = optionalPost.get();
            System.out.println("✅ Post found: " + post.getTitle());

            List<String> likes = post.getLikes();
            if (likes == null) {
                likes = new ArrayList<>();
            }

            boolean isLiked;
            if (likes.contains(userId)) {
                likes.remove(userId);
                isLiked = false;
                System.out.println("👎 User " + userId + " unliked post " + cleanId);
            } else {
                likes.add(userId);
                isLiked = true;
                System.out.println("👍 User " + userId + " liked post " + cleanId);
            }

            post.setLikes(likes);
            post.setLikeCount(likes.size());
            post.setUpdatedAt(LocalDateTime.now());
            postRepository.save(post);

            return isLiked;

        } catch (Exception e) {
            System.err.println("❌ Error in toggleLike: " + e.getMessage());
            throw e;
        }
    }

}
