package com.travel.feedback.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Logical Links to other services (we store just the IDs)
    private Long userId;     // Who wrote the review (from Auth Service)
    private Long packageId;  // Which package is being reviewed (from Catalog Service)

    private Integer rating;  // e.g., 1 to 5
    
    @Column(length = 1000)
    private String comment;

    private LocalDateTime reviewDate;

    @PrePersist
    public void prePersist() {
        // Automatically set the date when the review is created
        this.reviewDate = LocalDateTime.now();
    }
}