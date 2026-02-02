package com.travel.catalog.controller;

import com.travel.catalog.entity.TourPackage;
import com.travel.catalog.service.TourPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class TourPackageController {

    private final TourPackageService service;

    /**
     * Get all tour packages available in the system.
     * URL: GET http://localhost:8082/api/packages
     */
    @GetMapping
    public ResponseEntity<List<TourPackage>> getAllPackages() {
        return ResponseEntity.ok(service.getAllPackages());
    }

    /**
     * Get all packages for a specific Destination.
     * URL: GET http://localhost:8082/api/packages/destination/1
     */
    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<List<TourPackage>> getPackagesByDestination(@PathVariable Long destinationId) {
        return ResponseEntity.ok(service.getPackagesByDestinationId(destinationId));
    }

    /**
     * Get a specific package by ID.
     * URL: GET http://localhost:8082/api/packages/5
     */
    @GetMapping("/{id}")
    public ResponseEntity<TourPackage> getPackageById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPackageById(id));
    }

    /**
     * Create a new tour package.
     * URL: POST http://localhost:8082/api/packages
     * Body: { "name": "Summer Special", "price": 500, "destination": { "id": 1 } }
     */
    @PostMapping
    public ResponseEntity<TourPackage> createPackage(@RequestBody TourPackage tourPackage) {
        return ResponseEntity.ok(service.createPackage(tourPackage));
    }

    /**
     * Delete a package.
     * URL: DELETE http://localhost:8082/api/packages/5
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        service.deletePackage(id);
        return ResponseEntity.noContent().build();
    }

    
}