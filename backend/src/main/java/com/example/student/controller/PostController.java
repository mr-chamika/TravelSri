package com.example.student.controller;

import com.example.student.model.Post;
import com.example.student.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("create")
    public ResponseEntity<?> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam("userId") String userId,
            @RequestParam("userName") String userName,
            @RequestParam(value = "userAvatar", required = false) String userAvatar,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "country", required = false) String country) {

        try {
            Post post = postService.createPost(title, content, tags, files, userId, userName, userAvatar,
                    latitude, longitude, address, city, country);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating post: " + e.getMessage());
        }
    }


    @GetMapping("/getPosts")
    public ResponseEntity<Page<Post>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Post> posts = postService.getAllPosts(page, size);
        return ResponseEntity.ok(posts);
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
}
