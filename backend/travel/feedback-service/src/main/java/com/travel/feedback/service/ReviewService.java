package com.travel.feedback.service;

import com.travel.feedback.entity.Review;
import com.travel.feedback.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository repository;

    public Review createReview(Review review) {
        // Validation could go here (e.g., check if rating is between 1 and 5)
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        return repository.save(review);
    }

    public List<Review> getReviewsByPackageId(Long packageId) {
        return repository.findByPackageId(packageId);
    }

    public List<Review> getReviewsByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    public void deleteReview(Long id) {
        repository.deleteById(id);
    }

    public List<Review> getAllReviews() {
        return repository.findAll();
    }
}