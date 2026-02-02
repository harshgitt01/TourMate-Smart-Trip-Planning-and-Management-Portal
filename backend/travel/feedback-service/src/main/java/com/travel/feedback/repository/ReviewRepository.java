package com.travel.feedback.repository;

import com.travel.feedback.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Fetch all reviews for a specific tour package
    List<Review> findByPackageId(Long packageId);

    // Fetch all reviews written by a specific user
    List<Review> findByUserId(Long userId);
}