package com.travel.booking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Logical Links to other services (we store just the IDs)
    private Long userId;     
    private Long packageId;  

    private LocalDateTime bookingDate;
    private String status; // PENDING, CONFIRMED, CANCELLED

    /**
     * One Booking has One Payment.
     * 'mappedBy' tells Hibernate that the 'booking' field in Payment.java owns the relationship.
     */
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    @JsonIgnore // Prevents infinite recursion in JSON
    private Payment payment;

    // specific method to set date before saving
    @PrePersist
    public void prePersist() {
        if (this.bookingDate == null) {
            this.bookingDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}