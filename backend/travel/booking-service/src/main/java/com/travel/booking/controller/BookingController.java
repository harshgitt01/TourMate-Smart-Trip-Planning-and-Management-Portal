package com.travel.booking.controller;

import com.travel.booking.entity.Booking;
import com.travel.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService service;

    /**
     * Create a new booking.
     * URL: POST http://localhost:8083/api/bookings
     * Body: { "userId": 1, "packageId": 5, "status": "PENDING" }
     */
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(service.createBooking(booking));
    }

    /**
     * Get a specific booking by ID.
     * URL: GET http://localhost:8083/api/bookings/10
     */
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getBookingById(id));
    }

    /**
     * Get all bookings made by a specific User.
     * URL: GET http://localhost:8083/api/bookings/user/1
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getBookingsByUserId(userId));
    }

    /**
     * Update the status of a booking (e.g., CONFIRMED, CANCELLED).
     * URL: PUT http://localhost:8083/api/bookings/10/status?status=CONFIRMED
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(service.updateBookingStatus(id, status));
    }

    
}