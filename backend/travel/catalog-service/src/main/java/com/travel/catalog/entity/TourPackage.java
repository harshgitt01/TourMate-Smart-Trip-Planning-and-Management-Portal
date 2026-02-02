package com.travel.catalog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tour_packages")
public class TourPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String packageName;     // e.g., "Romantic Paris Getaway"
    private String duration;        // e.g., "3 Days 2 Nights"
    
    private BigDecimal price;       // e.g., 1200.50
    private Integer availableSlots; // e.g., 20

    /**
     * Many Packages belong to One Destination.
     * JoinColumn creates a foreign key column 'destination_id' in the database.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;
}