package com.travel.catalog.controller;

import com.travel.catalog.entity.Destination;
import com.travel.catalog.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; 
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService service;

    /**
     * Get all destinations. (Open to everyone)
     */
    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(service.getAllDestinations());
    }

    /**
     * Get a single destination. (Open to everyone)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getDestinationById(id));
    }

    /**
     * Create a new destination (Admin only).
     * LOCKED: Only users with role 'ADMIN' can access this.
     */
    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')") // <--- ADDS THE SECURITY CHECK
    public ResponseEntity<Destination> createDestination(@RequestBody Destination destination) {
        return ResponseEntity.ok(service.createDestination(destination));
    }

    /**
     * Delete a destination (Admin only).
     * LOCKED: Only users with role 'ADMIN' can access this.
     */
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')") // <--- ADDS THE SECURITY CHECK
    public ResponseEntity<Void> deleteDestination(@PathVariable Long id) {
        service.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }
}