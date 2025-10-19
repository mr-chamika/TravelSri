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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
            List<String> base64Files,
            String userId,
            String userName,
            String userAvatar,
            Double latitude,
            Double longitude,
            String address,
            String city,
            String country) {

        try {
            System.out.println("📝 ===== CREATING TRAVEL POST =====");
            System.out.println("📄 Content: " + content);
            System.out.println("👤 User: " + userName + " (" + userId + ")");

            // Basic validation
            if ((title == null || title.trim().isEmpty()) && (content == null || content.trim().isEmpty())) {
                throw new IllegalArgumentException("Title or content is required");
            }
            if (userId == null || userId.trim().isEmpty()) {
                throw new IllegalArgumentException("User ID is required");
            }

            // Parse categories
            List<String> categoryList = new ArrayList<>();
            if (categories != null && !categories.trim().isEmpty()) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    String[] categoriesArray = objectMapper.readValue(categories, String[].class);
                    categoryList = Arrays.asList(categoriesArray);
                } catch (JsonProcessingException e) {
                    categoryList.add(categories); // fallback to single category
                }
            }

            // Store Base64 strings directly without file saving
            List<String> mediaFilesToSave = base64Files != null ? base64Files : new ArrayList<>();
            System.out.println("🖼️ Storing " + mediaFilesToSave.size() + " Base64 media files directly into DB");

            // Create post object
            Post post = new Post();
            post.setId(UUID.randomUUID().toString());
            post.setContent(content != null ? content.trim() : "");
            post.setCategories(categoryList);
            post.setUserId(userId);
            post.setUserName(userName != null ? userName : "Unknown User");
            post.setUserAvatar(userAvatar);
            post.setMediaFiles(mediaFilesToSave);  // store Base64 strings directly

            // Location info
            if (latitude != null && longitude != null) {
                post.setLatitude(latitude);
                post.setLongitude(longitude);
                post.setAddress(address);
                post.setCity(city);
                post.setCountry(country);
            }

            // Additional fields
            post.setLikes(new ArrayList<>());
            post.setLikeCount(0);
            post.setCreatedAt(LocalDateTime.now());
            post.setUpdatedAt(LocalDateTime.now());
            post.setActive(true);

            // Save post to database
            Post savedPost = postRepository.save(post);
            System.out.println("✅ Post saved with ID: " + savedPost.getId());
            System.out.println("📝 ===== POST CREATION COMPLETE =====");

            return savedPost;

        } catch (Exception e) {
            System.err.println("❌ Error creating post: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create post: " + e.getMessage(), e);
        }
    }


    private String detectFileExtension(byte[] fileData) {
        if (fileData.length < 4) return ".bin";

        // JPEG
        if (fileData[0] == (byte) 0xFF && fileData[1] == (byte) 0xD8) {
            return ".jpg";
        }
        // PNG
        if (fileData[0] == (byte) 0x89 && fileData[1] == 0x50 &&
                fileData[2] == 0x4E && fileData[3] == 0x47) {
            return ".png";
        }
        // GIF
        if (fileData[0] == 0x47 && fileData[1] == 0x49 && fileData[2] == 0x46) {
            return ".gif";
        }
        // MP4
        if (fileData.length >= 8) {
            String header = new String(fileData, 4, 4);
            if (header.equals("ftyp")) {
                return ".mp4";
            }
        }

        return ".jpg"; // default fallback
    }

    public Page<Post> getAllPosts(int page, int size) {
        System.out.println("📖 Getting all posts: page=" + page + ", size=" + size);
        Page<Post> posts = postRepository.findByActiveTrue(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        System.out.println("📖 Found " + posts.getContent().size() + " posts");
        return posts;
    }

    public Optional<Post> getPostById(String postId) {
        System.out.println("🔍 Getting post by ID: " + postId);
        Optional<Post> post = postRepository.findById(postId);
        if (post.isPresent()) {
            System.out.println("✅ Post found: " + postId);
            System.out.println("📄 Post mediaFiles: " + post.get().getMediaFiles());
        } else {
            System.out.println("❌ Post not found: " + postId);
        }
        return post;
    }

    public boolean toggleLike(String postId, String userId) {
        try {
            System.out.println("🔍 Searching for post with ID: " + postId);
            System.out.println("📊 Total posts in database: " + postRepository.count());

            String cleanId = postId;
            Optional<Post> optionalPost = postRepository.findById(cleanId);

            if (!optionalPost.isPresent()) {
                System.err.println("❌ No post found for ID: " + cleanId);
                List<Post> allPosts = postRepository.findAll();
                System.out.println("📋 Available post IDs:");
                allPosts.stream().limit(5).forEach(p -> System.out.println("  - " + p.getId()));
                throw new RuntimeException("Post not found with ID: " + cleanId);
            }

            Post post = optionalPost.get();

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

    // Add these methods to your PostService class

    public Post editPost(
            String postId,
            String content,
            String categories,
            List<String> base64Files,
            String userId,
            Double latitude,
            Double longitude,
            String address,
            String city,
            String country,
            boolean keepExistingMedia) {

        try {
            System.out.println("✏️ ===== EDITING TRAVEL POST =====");
            System.out.println("📄 Post ID: " + postId);
            System.out.println("👤 User: " + userId);
            System.out.println("📝 New content: " + content);
            System.out.println("🖼️ Keep existing media: " + keepExistingMedia);
            System.out.println("🖼️ New files count: " + (base64Files != null ? base64Files.size() : 0));

            // Find existing post
            Optional<Post> existingPostOpt = postRepository.findById(postId);
            if (!existingPostOpt.isPresent()) {
                throw new RuntimeException("Post not found with ID: " + postId);
            }

            Post existingPost = existingPostOpt.get();

            // Verify user ownership
            if (!existingPost.getUserId().equals(userId)) {
                throw new RuntimeException("You can only edit your own posts");
            }

            // Basic validation
            if (content == null || content.trim().isEmpty()) {
                throw new IllegalArgumentException("Content is required");
            }

            // Parse categories
            List<String> categoryList = new ArrayList<>();
            if (categories != null && !categories.trim().isEmpty()) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    String[] categoriesArray = objectMapper.readValue(categories, String[].class);
                    categoryList = Arrays.asList(categoriesArray);
                } catch (JsonProcessingException e) {
                    categoryList.add(categories); // fallback to single category
                }
            }

            // Handle media files
            List<String> finalMediaFiles = new ArrayList<>();

            // Keep existing media if requested
            if (keepExistingMedia && existingPost.getMediaFiles() != null) {
                finalMediaFiles.addAll(existingPost.getMediaFiles());
                System.out.println("📋 Keeping " + existingPost.getMediaFiles().size() + " existing media files");
            }

            // Add new media files
            if (base64Files != null && !base64Files.isEmpty()) {
                // Create upload directory if it doesn't exist
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                for (int i = 0; i < base64Files.size(); i++) {
                    String base64Data = base64Files.get(i);
                    if (base64Data != null && !base64Data.isEmpty()) {
                        try {
                            // For now, store Base64 directly (same as current implementation)
                            // You can implement file saving logic here if needed
                            finalMediaFiles.add(base64Data);
                            System.out.println("✅ Added new media file " + (i + 1));
                        } catch (Exception e) {
                            System.err.println("❌ Error processing new media file " + (i + 1) + ": " + e.getMessage());
                        }
                    }
                }
            }

            // Update post fields
            existingPost.setContent(content.trim());
            existingPost.setCategories(categoryList);
            existingPost.setMediaFiles(finalMediaFiles);

            // Update location info
            existingPost.setLatitude(latitude);
            existingPost.setLongitude(longitude);
            existingPost.setAddress(address);
            existingPost.setCity(city);
            existingPost.setCountry(country);

            // Update timestamp
            existingPost.setUpdatedAt(LocalDateTime.now());

            // Save updated post
            Post updatedPost = postRepository.save(existingPost);
            System.out.println("✅ Post updated successfully: " + updatedPost.getId());
            System.out.println("✏️ ===== POST EDITING COMPLETE =====");

            return updatedPost;

        } catch (Exception e) {
            System.err.println("❌ Error editing post: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to edit post: " + e.getMessage(), e);
        }
    }

    public boolean deletePost(String postId, String userId) {
        try {
            System.out.println("🗑️ ===== DELETING POST =====");
            System.out.println("📄 Post ID: " + postId);
            System.out.println("👤 Ignoring user ID check for debugging");

            // Find existing post
            Optional<Post> existingPostOpt = postRepository.findById(postId);
            if (!existingPostOpt.isPresent()) {
                System.err.println("❌ Post not found with ID: " + postId);
                return false;
            }

            Post existingPost = existingPostOpt.get();
            System.out.println("✅ Post found: " + postId);

            // Delete associated media files from disk (if any)
            if (existingPost.getMediaFiles() != null) {
                for (String mediaFile : existingPost.getMediaFiles()) {
                    try {
                        // Only delete if it looks like a filename (not Base64)
                        if (!mediaFile.startsWith("data:") && !mediaFile.contains("/9j/")) {
                            Path filePath = Paths.get(uploadDir).resolve(mediaFile);
                            if (Files.exists(filePath)) {
                                Files.delete(filePath);
                                System.out.println("🗑️ Deleted media file: " + mediaFile);
                            } else {
                                System.out.println("⚠️ Media file does not exist on disk: " + mediaFile);
                            }
                        } else {
                            System.out.println("ℹ️ Media file is Base64 string, skipping disk delete");
                        }
                    } catch (Exception e) {
                        System.err.println("⚠️ Error deleting media file " + mediaFile + ": " + e.getMessage());
                    }
                }
            } else {
                System.out.println("ℹ️ No media files to delete");
            }

            // Delete post from database
            postRepository.delete(existingPost);
            System.out.println("✅ Post deleted successfully: " + postId);
            System.out.println("🗑️ ===== POST DELETION COMPLETE =====");

            return true;

        } catch (Exception e) {
            System.err.println("❌ Error deleting post: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }


    public boolean softDeletePost(String postId, String userId) {
        try {
            System.out.println("🗃️ ===== SOFT DELETING POST =====");
            System.out.println("📄 Post ID: " + postId);
            System.out.println("👤 User: " + userId);

            // Find existing post
            Optional<Post> existingPostOpt = postRepository.findById(postId);
            if (!existingPostOpt.isPresent()) {
                throw new RuntimeException("Post not found with ID: " + postId);
            }

            Post existingPost = existingPostOpt.get();

            // Verify user ownership
            if (!existingPost.getUserId().equals(userId)) {
                throw new RuntimeException("You can only delete your own posts");
            }

            // Mark as inactive instead of deleting
            existingPost.setActive(false);
            existingPost.setUpdatedAt(LocalDateTime.now());

            // Save updated post
            postRepository.save(existingPost);
            System.out.println("✅ Post soft deleted (archived): " + postId);
            System.out.println("🗃️ ===== POST SOFT DELETION COMPLETE =====");

            return true;

        } catch (Exception e) {
            System.err.println("❌ Error soft deleting post: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to soft delete post: " + e.getMessage(), e);
        }
    }

    // Get user's posts
    public Page<Post> getUserPosts(String userId, int page, int size) {
        System.out.println("👤 Getting posts for user: " + userId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByUserIdAndActiveTrue(userId, pageable);
        System.out.println("📖 Found " + posts.getContent().size() + " posts for user: " + userId);
        return posts;
    }

}
