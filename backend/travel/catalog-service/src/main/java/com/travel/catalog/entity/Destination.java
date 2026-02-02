package com.travel.catalog.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "destinations")
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;      // e.g., "Paris"
    private String country;   // e.g., "France"
    private String location;  // e.g., "Europe"

    @Column(length = 2000)    // Allows longer text
    private String description;

    /**
     * One Destination has Many Tour Packages.
     * mappedBy = "destination" refers to the field in TourPackage.java.
     * @JsonIgnore prevents infinite loops when converting to JSON.
     */
    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL)
    @JsonIgnore 
    private List<TourPackage> packages;
}