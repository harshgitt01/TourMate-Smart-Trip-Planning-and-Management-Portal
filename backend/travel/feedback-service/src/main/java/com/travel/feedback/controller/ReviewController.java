package com.travel.feedback.controller;

import com.travel.feedback.entity.Review;
import com.travel.feedback.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService service;

    /**
     * Create a new review.
     * URL: POST http://localhost:8084/api/reviews
     * Body: { "userId": 1, "packageId": 5, "rating": 5, "comment": "Amazing trip!" }
     */
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        return ResponseEntity.ok(service.createReview(review));
    }

    /**
     * Get all reviews for a specific Tour Package.
     * URL: GET http://localhost:8084/api/reviews/package/5
     */
    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<Review>> getReviewsByPackage(@PathVariable Long packageId) {
        return ResponseEntity.ok(service.getReviewsByPackageId(packageId));
    }

    /**
     * Get all reviews written by a specific User.
     * URL: GET http://localhost:8084/api/reviews/user/1
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getReviewsByUserId(userId));
    }

    /**
     * Delete a review.
     * URL: DELETE http://localhost:8084/api/reviews/10
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        service.deleteReview(id);
        // Corrected return statement for HTTP 204 No Content
        return ResponseEntity.noContent().build();
    }

    /**
     * Get ALL reviews in the system.
     * URL: GET http://localhost:8084/api/reviews
     */
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(service.getAllReviews());
    }
}