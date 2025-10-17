package com.example.student.controller;

import com.example.student.model.Post;
import com.example.student.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.Base64;
import java.io.IOException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin
public class PostController {

    @Autowired
    private PostService postService;

    @Value("${app.file.upload-dir:./uploads/posts}")
    private String uploadDir;

    @GetMapping("/getPosts/{userId}")
    public ResponseEntity<Map<String, Object>> getPosts(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            System.out.println("👤 Getting posts for user: " + userId);
            System.out.println("📋 Page: " + page + ", Size: " + size);

            // Get posts only for the specified userId from path
            Page<Post> posts = postService.getUserPosts(userId, page, size);

            System.out.println("📊 Found " + posts.getContent().size() + " posts for user: " + userId);

            // Transform posts to include decoded media files as Base64
            List<Map<String, Object>> transformedPosts = posts.getContent().stream()
                    .map(this::transformPostWithDecodedMedia)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("content", transformedPosts);
            response.put("totalPages", posts.getTotalPages());
            response.put("totalElements", posts.getTotalElements());
            response.put("size", posts.getSize());
            response.put("number", posts.getNumber());
            response.put("userId", userId); // Include userId in response for clarity

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error fetching posts for user " + userId + ": " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error fetching posts for user: " + e.getMessage());
            errorResponse.put("content", new ArrayList<>());
            errorResponse.put("totalPages", 0);
            errorResponse.put("totalElements", 0);
            errorResponse.put("size", size);
            errorResponse.put("number", page);
            errorResponse.put("userId", userId);

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }


    @PostMapping("create")
    public ResponseEntity<?> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "userId", required = false) String paramUserId,
            @RequestParam("userName") String userName,
            @RequestParam(value = "userAvatar", required = false) String userAvatar,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "country", required = false) String country,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {

        try {
            // Prioritize header userId over parameter userId
            String effectiveUserId = headerUserId != null ? headerUserId : paramUserId;

            System.out.println("📝 Creating post - Header UserId: " + headerUserId + ", Param UserId: " + paramUserId);
            System.out.println("🎯 Effective UserId: " + effectiveUserId);

            // Validate userId is provided
            if (effectiveUserId == null || effectiveUserId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("User ID is required (either in header X-User-Id or parameter userId)");
            }

            // File size validations (unchanged from your existing code)
            if (files != null && !files.isEmpty()) {
                long totalSize = files.stream().mapToLong(MultipartFile::getSize).sum();
                long maxSize = 200 * 1024 * 1024; // 200MB

                if (totalSize > maxSize) {
                    return ResponseEntity.badRequest().body("Total file size exceeds 200MB limit");
                }

                for (MultipartFile file : files) {
                    long fileSize = file.getSize();
                    if (fileSize > 50 * 1024 * 1024) { // 50MB per file
                        return ResponseEntity.badRequest().body("Individual file size exceeds 50MB limit: " + file.getOriginalFilename());
                    }
                }
            }

            // Convert files to Base64 encoded strings (unchanged from your existing code)
            List<String> base64Files = null;
            if (files != null && !files.isEmpty()) {
                base64Files = files.stream().map(file -> {
                    try {
                        byte[] bytes = file.getBytes();
                        return Base64.getEncoder().encodeToString(bytes);
                    } catch (IOException e) {
                        throw new RuntimeException("Error encoding file " + file.getOriginalFilename());
                    }
                }).collect(Collectors.toList());
            }

            // Use effective userId from header or parameter
            Post post = postService.createPost(title, content, tags, base64Files, effectiveUserId, userName, userAvatar,
                    latitude, longitude, address, city, country);

            return ResponseEntity.ok(post);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating post: " + e.getMessage());
        }
    }


    private Map<String, Object> transformPostWithDecodedMedia(Post post) {
        Map<String, Object> postMap = new HashMap<>();

        // Copy basic post fields
        postMap.put("id", post.getId());
        postMap.put("content", post.getContent());
        postMap.put("categories", post.getCategories());
        postMap.put("userId", post.getUserId());
        postMap.put("userName", post.getUserName());
        postMap.put("userAvatar", post.getUserAvatar());
        postMap.put("latitude", post.getLatitude());
        postMap.put("longitude", post.getLongitude());
        postMap.put("address", post.getAddress());
        postMap.put("city", post.getCity());
        postMap.put("country", post.getCountry());
        postMap.put("likes", post.getLikes());
        postMap.put("likeCount", post.getLikeCount());
        postMap.put("createdAt", post.getCreatedAt());
        postMap.put("updatedAt", post.getUpdatedAt());
        postMap.put("active", post.isActive());

        List<String> processedMediaFiles = new ArrayList<>();

        System.out.println("🔍 Processing post: " + post.getId());
        System.out.println("📄 MediaFiles from database: " + (post.getMediaFiles() != null ? post.getMediaFiles().size() + " items" : "null"));

        if (post.getMediaFiles() != null && !post.getMediaFiles().isEmpty()) {
            for (int i = 0; i < post.getMediaFiles().size(); i++) {
                String mediaData = post.getMediaFiles().get(i);
                try {
                    System.out.println("🖼️ Processing media " + (i + 1) + ":");
                    System.out.println("   Length: " + (mediaData != null ? mediaData.length() : 0));
                    System.out.println("   Starts with 'data:': " + (mediaData != null && mediaData.startsWith("data:")));
                    System.out.println("   Preview: " + (mediaData != null ? mediaData.substring(0, Math.min(50, mediaData.length())) : "null"));

                    if (mediaData != null && mediaData.startsWith("data:")) {
                        System.out.println("✅ Media " + (i + 1) + " is already a data URI");
                        processedMediaFiles.add(mediaData);
                    } else if (mediaData != null && isBase64(mediaData)) {
                        System.out.println("🔄 Converting raw Base64 to data URI for media " + (i + 1));

                        byte[] decodedBytes = Base64.getDecoder().decode(mediaData);
                        String mimeType = detectMimeTypeFromBytes(decodedBytes);

                        String dataUri = "data:" + mimeType + ";base64," + mediaData;
                        processedMediaFiles.add(dataUri);

                        System.out.println("✅ Converted to data URI: " + mimeType + " (" + decodedBytes.length + " bytes)");
                    } else {
                        System.out.println("⚠️ Media " + (i + 1) + " is NOT a valid Base64 string or data URI; returning raw value");
                        processedMediaFiles.add(mediaData);
                    }
                } catch (IllegalArgumentException e) {
                    System.err.println("❌ Illegal base64 string at media " + (i + 1) + ": " + e.getMessage());
                    processedMediaFiles.add(mediaData); // fallback without decoding
                } catch (Exception e) {
                    System.err.println("❌ Error processing media " + (i + 1) + ": " + e.getMessage());
                    e.printStackTrace();
                }
            }
        } else {
            System.out.println("📋 No media files found in database for post: " + post.getId());
        }

        System.out.println("📊 Final processed media files: " + processedMediaFiles.size());
        postMap.put("mediaFiles", processedMediaFiles);
        return postMap;
    }

    // Helper method to validate base64 string
    private boolean isBase64(String value) {
        if (value == null || value.isEmpty()) return false;
        // Basic base64 regex validation (no spaces, only A-Z,a-z,0-9,+,/ and optional equals padding)
        return value.matches("^[A-Za-z0-9+/]+={0,2}$");
    }

    // Add this helper method
    private String detectMimeTypeFromBytes(byte[] fileData) {
        if (fileData.length < 4) return "application/octet-stream";

        // JPEG
        if (fileData[0] == (byte) 0xFF && fileData[1] == (byte) 0xD8) {
            return "image/jpeg";
        }
        // PNG
        if (fileData[0] == (byte) 0x89 && fileData[1] == 0x50 &&
                fileData[2] == 0x4E && fileData[3] == 0x47) {
            return "image/png";
        }
        // GIF
        if (fileData[0] == 0x47 && fileData[1] == 0x49 && fileData[2] == 0x46) {
            return "image/gif";
        }
        // MP4
        if (fileData.length >= 8) {
            String header = new String(fileData, 4, 4);
            if (header.equals("ftyp")) {
                return "video/mp4";
            }
        }

        return "image/jpeg"; // default fallback
    }


    private String getMimeType(String filename) {
        if (filename == null) return "application/octet-stream";

        String extension = "";
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            extension = filename.substring(lastDotIndex + 1).toLowerCase();
        }

        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
            case "mp4":
                return "video/mp4";
            case "mov":
                return "video/quicktime";
            case "avi":
                return "video/x-msvideo";
            case "webm":
                return "video/webm";
            case "mkv":
                return "video/x-matroska";
            default:
                return "application/octet-stream";
        }
    }

    @PostMapping("/like/{postId}")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable String postId,
            @RequestParam String userId) {

        boolean isLiked = postService.toggleLike(postId, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        return ResponseEntity.ok(response);
    }

    // Add these methods to your PostController class

    @PutMapping("/edit/{postId}")
    public ResponseEntity<?> editPost(
            @PathVariable String postId,
            @RequestParam("content") String content,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam("userId") String userId,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "country", required = false) String country,
            @RequestParam(value = "keepExistingMedia", defaultValue = "true") boolean keepExistingMedia) {

        try {
            System.out.println("✏️ Editing post: " + postId + " by user: " + userId);

            // File size validations (same as create)
            if (files != null && !files.isEmpty()) {
                long totalSize = files.stream().mapToLong(MultipartFile::getSize).sum();
                long maxSize = 200 * 1024 * 1024; // 200MB

                if (totalSize > maxSize) {
                    return ResponseEntity.badRequest().body("Total file size exceeds 200MB limit");
                }

                for (MultipartFile file : files) {
                    long fileSize = file.getSize();
                    if (fileSize > 50 * 1024 * 1024) { // 50MB per file
                        return ResponseEntity.badRequest().body("Individual file size exceeds 50MB limit: " + file.getOriginalFilename());
                    }
                }
            }

            // Convert new files to Base64 encoded strings
            List<String> base64Files = null;
            if (files != null && !files.isEmpty()) {
                base64Files = files.stream().map(file -> {
                    try {
                        byte[] bytes = file.getBytes();
                        return Base64.getEncoder().encodeToString(bytes);
                    } catch (IOException e) {
                        throw new RuntimeException("Error encoding file " + file.getOriginalFilename());
                    }
                }).collect(Collectors.toList());
            }

            // Call service to edit post
            Post editedPost = postService.editPost(postId, content, tags, base64Files, userId,
                    latitude, longitude, address, city, country, keepExistingMedia);

            return ResponseEntity.ok(editedPost);

        } catch (RuntimeException e) {
            System.err.println("❌ Error editing post: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error editing post: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Unexpected error editing post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Internal server error");
        }
    }

    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        System.out.println("🗑️ ===== DELETE ENDPOINT CALLED =====");
        System.out.println("📄 Post ID: " + postId);
        System.out.println("⏰ Timestamp: " + java.time.LocalDateTime.now());

        try {
            System.out.println("🔍 Calling postService.deletePost...");
            boolean deleted = postService.deletePost(postId, null);

            System.out.println("📊 Delete operation result: " + deleted);

            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Post deleted successfully");
                response.put("postId", postId);

                System.out.println("✅ Returning successful response: " + response);
                return ResponseEntity.ok(response);
            } else {
                System.out.println("❌ Delete operation returned false");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Failed to delete post");
                errorResponse.put("postId", postId);

                return ResponseEntity.badRequest().body(errorResponse);
            }
        } catch(Exception e) {
            System.err.println("❌ Exception in controller delete method:");
            System.err.println("Exception type: " + e.getClass().getName());
            System.err.println("Exception message: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error: " + e.getMessage());
            errorResponse.put("postId", postId);

            return ResponseEntity.status(500).body(errorResponse);
        } finally {
            System.out.println("🗑️ ===== DELETE ENDPOINT FINISHED =====");
        }
    }



    @DeleteMapping("/soft-delete/{postId}")
    public ResponseEntity<?> softDeletePost(
            @PathVariable String postId,
            @RequestParam String userId) {

        try {
            System.out.println("🗃️ Soft deleting post: " + postId + " by user: " + userId);

            boolean deleted = postService.softDeletePost(postId, userId);

            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Post archived successfully");
                response.put("postId", postId);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Failed to archive post");
            }

        } catch (RuntimeException e) {
            System.err.println("❌ Error archiving post: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error archiving post: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Unexpected error archiving post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Internal server error");
        }
    }

    // Get single post by ID
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getPost(@PathVariable String postId) {
        try {
            Optional<Post> postOpt = postService.getPostById(postId);

            if (!postOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Post post = postOpt.get();

            // Transform post with media files
            Map<String, Object> transformedPost = transformPostWithDecodedMedia(post);

            return ResponseEntity.ok(transformedPost);

        } catch (Exception e) {
            System.err.println("❌ Error fetching post: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error fetching post: " + e.getMessage());
        }
    }

}
